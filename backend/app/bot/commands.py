import asyncio
import logging
from asyncio import Task
from typing import Any

import websockets
from pyrogram import Client, filters
from pyrogram.types import Message
from websockets import WebSocketClientProtocol  # type: ignore

from app.bot.exceptions import InvalidInput
from app.bot.utils import (
    close_support_thread,
    create_volunteer,
    delete_volunteer,
    fetch_questions,
    fetch_threads,
    for_volunteer,
    open_support_thread,
)
from app.config import settings

logger = logging.getLogger(__name__)

app = Client(
    'SCS_BOT',
    api_id=settings.api_id.get_secret_value(),
    api_hash=settings.api_hash.get_secret_value(),
    bot_token=settings.bot_token.get_secret_value(),
)

chat_ws: dict[int, WebSocketClientProtocol] = {}  # storing ws for specific chat
chat_task: dict[int, Task[Any]] = {}  # storing task(ws listening) for specific chat


@app.on_message(filters=filters.command('start'))  # type: ignore
async def start(_: Any, message: Message) -> None:
    username = message.from_user.username
    response = 'Hi, I am a support bot, type /help to get commands'

    await message.reply(text=response)

    logger.info('%s sent the start message', username)


@app.on_message(filters=filters.command('register'))  # type: ignore
async def register_volunteer(_: Any, message: Message) -> None:
    user_id = message.from_user.id
    username = message.from_user.username
    response = 'You are volunteer now'

    await create_volunteer(user_id)
    await message.reply(text=response)

    logger.info('%s registered as volunteer', username)


@app.on_message(filters=filters.command('quit'))  # type: ignore
async def quit_volunteer(_: Any, message: Message) -> None:
    user_id = message.from_user.id
    username = message.from_user.username
    response = 'You are not volunteer now'

    await delete_volunteer(user_id)
    await message.reply(text=response)

    logger.info('%s quit volunteer role', username)


@app.on_message(filters=filters.command('help'))  # type: ignore
async def get_help(_: Any, message: Message) -> None:
    username = message.from_user.username
    response = '\n'.join(
        (
            '/register - to become a volunteer',
            '/quit - to quit a volunteer role',
            '/questions to get question',
            '/resolve - to close thread',
            '/give_up - to close thread without resolving',
        )
    )

    await message.reply(text=response)

    logger.info('%s asked for help list', username)


@app.on_message(filters=filters.command('questions'))  # type: ignore
@for_volunteer
async def get_questions(_: Any, message: Message) -> None:
    username = message.from_user.username
    questions = await fetch_questions(as_num_list=True)

    if not questions:
        questions = ['No questions']

    await message.reply(text='\n'.join(questions))  # type: ignore

    logger.info('%s requested the questions list', username)


async def listen_to_ws(client: Client, thread_id: int, chat_id: int) -> None:
    async with websockets.connect(  # type: ignore  #pylint: disable=no-member
        f'ws://{settings.host}:{settings.port}/ws/{thread_id}'
    ) as ws:
        chat_ws[chat_id] = ws

        while True:
            data = await ws.recv()
            await client.send_message(chat_id=chat_id, text=data)


@app.on_message(filters=filters.regex(r'pick -?\d+'))  # type: ignore
@for_volunteer
async def assign_support_thread(client: Client, message: Message) -> None:
    chat_id = message.chat.id
    user_id = message.from_user.id
    username = message.from_user.username
    response = 'You are connected to a client, just type ...'

    try:
        threads = await fetch_threads(flt='free')
        thread_number = int(message.text.split()[1])
        thread_id = threads[thread_number]['id']

        await open_support_thread(user_id, thread_id)

        chat_task[chat_id] = asyncio.create_task(
            listen_to_ws(client, thread_id, chat_id)
        )
    except InvalidInput as err:
        response = err.args[0]
    except IndexError:
        response = 'Choose correct number'

    await message.reply(text=response)

    logger.info('%s chose a question', username)


@app.on_message(filters=filters.command('resolve'))  # type: ignore
@for_volunteer
async def resolve_support_thread(_: Any, message: Message) -> None:
    chat_id = message.chat.id
    user_id = message.from_user.id
    username = message.from_user.username
    response = 'You are disconnected from a client, feel free ...'

    try:
        await close_support_thread(user_id)

        task = chat_task[chat_id]
        task.cancel()
        del task

    except InvalidInput as err:
        response = err.args[0]

    await message.reply(text=response)

    logger.info('%s resolved support thread', username)


@app.on_message(filters=filters.command('give_up'))  # type: ignore
@for_volunteer
async def disconnect_support_thread(_: Any, message: Message) -> None:
    chat_id = message.chat.id
    user_id = message.from_user.id
    username = message.from_user.username
    response = 'You are disconnected from a client'

    try:
        await close_support_thread(user_id, solved=False)
        task = chat_task[chat_id]
        task.cancel()
        del task

    except InvalidInput as err:
        response = err.args[0]

    await message.reply(text=response)

    logger.info('%s could not answer question', username)


@app.on_message(filters=filters.text)  # type: ignore
@for_volunteer
async def support(_: Any, message: Message) -> None:
    chat_id = message.chat.id

    ws = chat_ws[chat_id]

    await ws.send(message.text)
