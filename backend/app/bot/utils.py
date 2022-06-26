import http
from functools import wraps
from typing import Any, Callable, Coroutine, Optional, Union

import aiohttp
from pyrogram.types import Message

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


def for_volunteer(
    func: Callable[[Any, Any], Coroutine[Any, Any, None]]
) -> Callable[[Any], Any]:
    @wraps(func)
    async def wrapper(
        *args: Any, **kwargs: Any
    ) -> Optional[Union[Coroutine[Any, Any, None], Any]]:
        message: Message = args[1]  # gets message to extract user tg id

        if not message:
            raise Exception('Function does not accept message object')

        try:
            await fetch_volunteer(message.from_user.id)

            return await func(*args, **kwargs)

        except InvalidInput:
            await message.reply(text='You are not a volunteer, please /register')

        return None

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


async def delete_volunteer(tg_id: int) -> None:
    async with aiohttp.ClientSession() as session:
        async with session.delete(f'{VOLUNTEERS_URL}/{tg_id}') as res:
            if res.status != http.HTTPStatus.OK:
                raise InvalidInput('Invalid tg_id')


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
                raise InvalidInput('Invalid thread id')

    return thread


async def fetch_volunteer(volunteer_tg_id: int) -> Volunteer:
    async with aiohttp.ClientSession() as session:
        async with session.get(f'{VOLUNTEERS_URL}/{volunteer_tg_id}') as res:
            if res.status == http.HTTPStatus.OK:
                volunteer = await res.json()
                volunteer = Volunteer.parse_obj(volunteer)
            else:
                raise InvalidInput('Invalid volunteer telegram id')

    return volunteer


async def open_support_thread(
    thread_id: int,
    volunteer_tg_id: int,
) -> None:
    async with aiohttp.ClientSession() as session:
        thread = await fetch_thread(thread_id)
        thread_ptc = SupportThreadPatch(volunteer_id=volunteer_tg_id)

        # check thread is not assigned
        if thread.volunteer_id is not None:
            raise InvalidInput('The question is already assigned')

        # updating the support thread
        await session.patch(
            f'{THREADS_URL}/{thread_id}',
            data=thread_ptc.json(),
            headers={'content-type': 'application/json'},
        )


async def close_support_thread(thread_id: int, solved: bool = True) -> None:
    async with aiohttp.ClientSession() as session:
        thread = await fetch_thread(thread_id)

        # check if thread is assigned
        if thread.volunteer_id is None:
            raise InvalidInput('A question is not assigned')

        if solved:
            # remove support thread
            await session.delete(f'{THREADS_URL}/{thread_id}')
            return

        thread_ptc = SupportThreadPatch(volunteer_id=None)
        # update support thread
        await session.patch(
            f'{THREADS_URL}/{thread_id}',
            data=thread_ptc.json(),
            headers={'content-type': 'application/json'},
        )
