import asyncio
import http
from asyncio import Task
from functools import wraps
from typing import Any, Callable, Coroutine, Optional, Union

import aiohttp
import websockets
from pyrogram import Client
from pyrogram.types import Message
from websockets import WebSocketClientProtocol  # type: ignore

from app.api.schemas import (
    SupportThread,
    SupportThreadPatch,
    Volunteer,
    VolunteerCreate,
)
from app.bot.exceptions import InvalidInput
from app.config import settings

VOLUNTEERS_URL = f'http://{settings.host}:{settings.port}/volunteers'
THREADS_URL = f'http://{settings.host}:{settings.port}/threads'

chat_ws: dict[int, WebSocketClientProtocol] = {}  # storing ws for specific chat
chat_task: dict[int, Task[Any]] = {}  # storing task(ws listening) for specific chat
chat_thread: dict[int, SupportThread] = {}  # storing thread for specific chat


def for_volunteer(
    func: Callable[[Any, Any], Coroutine[Any, Any, None]]
) -> Callable[[Any], Any]:
    """
    Make function available only for volunteers
    """

    @wraps(func)
    async def wrapper(
        *args: Any, **kwargs: Any
    ) -> Optional[Union[Coroutine[Any, Any, None], Any]]:
        message: Message = args[1]  # pyrogram.types.Message

        if not message:
            raise Exception('Function does not accept message object')

        try:
            await fetch_volunteer(message.from_user.id)
        except InvalidInput:
            await message.reply(text='You are not a volunteer, please /register')

            return None

        return await func(*args, **kwargs)

    return wrapper


async def create_volunteer(tg_id: int) -> None:
    async with aiohttp.ClientSession() as session:
        volunteer = VolunteerCreate(tg_id=tg_id)
        async with session.post(
            url=VOLUNTEERS_URL,
            data=volunteer.json(),
            headers={'content-type': 'application/json'},
        ) as res:
            if res.status == http.HTTPStatus.CONFLICT:
                raise InvalidInput('Volunteer already exists')


async def delete_volunteer(chat_id: int, tg_id: int) -> None:
    # close unsolved thread
    if chat_thread.get(chat_id) is not None:
        await close_support_thread(chat_id, solved=False)

    async with aiohttp.ClientSession() as session:
        async with session.delete(f'{VOLUNTEERS_URL}/{tg_id}') as res:
            if res.status != http.HTTPStatus.OK:
                raise InvalidInput('Volunteer not found')


async def fetch_threads(flt: Optional[str] = None) -> list[SupportThread]:
    url = f'{THREADS_URL}?flt={flt}' if flt else THREADS_URL

    async with aiohttp.ClientSession() as session:
        async with session.get(url) as res:
            threads = await res.json()
            threads = [SupportThread.parse_obj(t) for t in threads]

    return threads


async def fetch_thread(thread_id: int) -> SupportThread:
    async with aiohttp.ClientSession() as session:
        async with session.get(f'{THREADS_URL}/{thread_id}') as res:
            if res.status == http.HTTPStatus.OK:
                thread = await res.json()
                thread = SupportThread.parse_obj(thread)
            else:
                raise InvalidInput('Thread not found')

    return thread


async def fetch_volunteer(volunteer_tg_id: int) -> Volunteer:
    async with aiohttp.ClientSession() as session:
        async with session.get(f'{VOLUNTEERS_URL}/{volunteer_tg_id}') as res:
            if res.status == http.HTTPStatus.OK:
                volunteer = await res.json()
                volunteer = Volunteer.parse_obj(volunteer)
            else:
                raise InvalidInput('Volunteer not found')

    return volunteer


async def open_support_thread(
    client: Client,
    chat_id: int,
    thread_id: int,
    volunteer_tg_id: int,
) -> None:
    """
    Connect chat to the thread via websocket

    :param client: pyrogram client instance
    :param chat_id: id of the chat
    :param thread_id: id of the thread to connect to
    :param volunteer_tg_id: telegram id of the volunteer to be assigned to the thread
    :return:
    """
    async with aiohttp.ClientSession() as session:
        if chat_thread.get(chat_id) is not None:
            raise InvalidInput('Question is already assigned')

        thread_to_ptc = await fetch_thread(thread_id)
        thread_ptc = SupportThreadPatch(volunteer_id=volunteer_tg_id)

        # check thread is not assigned
        if thread_to_ptc.volunteer_id is not None:
            raise InvalidInput('Question is already assigned')

        # update the support thread
        async with session.patch(
            f'{THREADS_URL}/{thread_id}',
            data=thread_ptc.json(),
            headers={'content-type': 'application/json'},
        ) as res:
            thread = await res.json()

            # set thread for the chat
            chat_thread[chat_id] = SupportThread.parse_obj(thread)

            # set task for the chat, task - ws listening
            chat_task[chat_id] = asyncio.create_task(
                listen_to_ws(client, thread_id, chat_id)
            )


async def close_support_thread(
    chat_id: int,
    solved: bool = True,
) -> None:
    """
    Terminate thread websocket connection for the chat

    :param chat_id: id of the chat
    :param solved: true to remove thread, by default true
    :return:
    """
    async with aiohttp.ClientSession() as session:
        # check if there is a thread for the chat
        thread = chat_thread.get(chat_id)
        if thread is None:
            raise InvalidInput('Question is not assigned')

        # update the thread
        thread = await fetch_thread(thread.id)

        # check if the thread is assigned
        if thread.volunteer_id is None:
            raise InvalidInput('Question is not assigned')

        if solved:
            # remove the thread
            await session.delete(f'{THREADS_URL}/{thread.id}')
        else:
            thread_ptc = SupportThreadPatch(volunteer_id=None)

            # update the thread
            await session.patch(
                f'{THREADS_URL}/{thread.id}',
                data=thread_ptc.json(),
                headers={'content-type': 'application/json'},
            )

        # delete ws task
        if chat_task.get(chat_id) is not None:
            chat_task[chat_id].cancel()
            del chat_task[chat_id]

        # delete thread for chat
        if chat_thread.get(chat_id) is not None:
            del chat_thread[chat_id]

        # delete ws object
        if chat_ws.get(chat_id) is not None:
            del chat_ws[chat_id]


async def listen_to_ws(client: Client, thread_id: int, chat_id: int) -> None:
    """
    Listen to ws for new messages

    :param client: pyrogram client instance
    :param thread_id: id of the thread to listen it on messages
    :param chat_id: id of the chat where to send listening messages
    """
    async with websockets.connect(  # type: ignore  #pylint: disable=no-member
        f'ws://{settings.host}:{settings.port}/ws/{thread_id}'
    ) as ws:
        chat_ws[chat_id] = ws

        while True:
            data = await ws.recv()

            await client.send_message(chat_id=chat_id, text=data)


def get_ws(chat_id: int) -> WebSocketClientProtocol:
    """
    Return ws for the chat

    :param chat_id: id of the chat
    :return: websocket
    """
    ws = chat_ws.get(chat_id)

    if ws is None:
        raise InvalidInput('Websocket for chat not found')

    return ws
