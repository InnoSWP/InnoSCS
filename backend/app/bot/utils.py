import http
import json
from functools import wraps
from typing import Any, Callable, Coroutine, Optional, Union

import aiohttp
from pyrogram.types import Message

from app.bot.exceptions import InvalidInput
from app.config import settings

VOLUNTEERS_URL = f'http://{settings.host}:{settings.port}/volunteers'
THREADS_URL = f'http://{settings.host}:{settings.port}/threads'


def for_volunteer(
    func: Callable[[Any, Any], Coroutine[Any, Any, None]]
) -> Callable[[Any], Any]:
    @wraps(func)
    async def wrapper(
        *args: Any, **kwargs: Any
    ) -> Union[Coroutine[Any, Any, None], Any]:
        message: Message = args[1]  # gets message to extract user tg id

        if not message:
            raise Exception('Function does not accept message object')

        volunteer = await fetch_volunteer(message.from_user.id)

        if not volunteer:
            return await message.reply(text='You are not a volunteer')

        return await func(*args, **kwargs)

    return wrapper


async def create_volunteer(tg_id: int) -> None:
    async with aiohttp.ClientSession() as session:
        volunteer = {'tg_id': tg_id}
        await session.post(
            url=VOLUNTEERS_URL,
            data=json.dumps(volunteer),
            headers={'content-type': 'application/json'},
        )


async def delete_volunteer(tg_id: int) -> None:
    async with aiohttp.ClientSession() as session:
        await session.delete(f'{VOLUNTEERS_URL}/{tg_id}')


async def fetch_questions(
    as_num_list: bool = False,
) -> Union[list[str], dict[int, str]]:
    questions: dict[int, str] = {}
    threads = await fetch_threads(flt='free')

    if threads:
        questions = dict(enumerate([t.get('question') for t in threads]))

    if as_num_list:
        return [f'{k}) {v}' for k, v in questions.items()]

    return questions


async def fetch_threads(flt: Optional[str] = None) -> list[Any]:
    url = f'{THREADS_URL}?flt={flt}' if flt else THREADS_URL

    async with aiohttp.ClientSession() as session:
        async with session.get(url) as res:
            threads = await res.json()

    return threads


async def fetch_thread(thread_id: int) -> Optional[dict[Any, Any]]:
    thread = None
    async with aiohttp.ClientSession() as session:
        async with session.get(f'{THREADS_URL}/{thread_id}') as res:
            if res.status == http.HTTPStatus.OK:
                thread = await res.json()

    return thread


async def fetch_volunteer(volunteer_tg_id: int) -> Optional[dict[Any, Any]]:
    volunteer = None
    async with aiohttp.ClientSession() as session:
        async with session.get(f'{VOLUNTEERS_URL}/{volunteer_tg_id}') as res:
            if res.status == http.HTTPStatus.OK:
                volunteer = await res.json()

    return volunteer


async def open_support_thread(volunteer_tg_id: int, thread_id: int) -> None:
    async with aiohttp.ClientSession() as session:
        volunteer = await fetch_volunteer(volunteer_tg_id)
        thread = await fetch_thread(thread_id)

        # check if both volunteer and thread exist
        if not volunteer or not thread:
            raise InvalidInput(
                f'No such volunteer: {volunteer_tg_id}, No such thread: {thread_id}'
            )

        # check if the volunteer has a support thread
        if volunteer.get('thread_id'):
            raise InvalidInput('Already assigned to a question')

        # check if the support thread is already assigned
        if thread.get('volunteer_id'):
            raise InvalidInput('The question is already assigned')

        volunteer['thread_id'] = thread_id
        thread['volunteer_id'] = volunteer_tg_id

        # updating the volunteer
        await session.put(
            f'{VOLUNTEERS_URL}/{volunteer_tg_id}',
            data=json.dumps(volunteer),
            headers={'content-type': 'application/json'},
        )

        # updating the support thread
        await session.put(
            f'{THREADS_URL}/{thread_id}',
            data=json.dumps(thread),
            headers={'content-type': 'application/json'},
        )


async def close_support_thread(volunteer_tg_id: int, solved: bool = True) -> None:
    async with aiohttp.ClientSession() as session:
        volunteer = await fetch_volunteer(volunteer_tg_id)

        # check if volunteer exists
        if not volunteer:
            raise InvalidInput(f'No such volunteer: {volunteer_tg_id}')

        # check if volunteer has a support thread
        if not volunteer.get('thread_id'):
            raise InvalidInput('No an assigned question')

        thread_id = volunteer['thread_id']
        volunteer['thread_id'] = None

        # updating the volunteer
        await session.put(
            f'{VOLUNTEERS_URL}/{volunteer_tg_id}',
            data=json.dumps(volunteer),
            headers={'content-type': 'application/json'},
        )

        # if the volunteer did not fail, delete support thread
        if solved:
            await session.delete(
                f'{THREADS_URL}/{thread_id}',
            )
        else:
            thread = await fetch_thread(thread_id)

            if not thread:
                raise InvalidInput(f'No such thread: {thread_id}')

            thread['volunteer_id'] = None

            await session.put(
                f'{THREADS_URL}/{thread_id}',
                data=json.dumps(thread),
                headers={'content-type': 'application/json'},
            )
