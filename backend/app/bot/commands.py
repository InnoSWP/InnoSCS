import asyncio
import logging
from asyncio import Task
from http import HTTPStatus

import aiohttp
import websockets
from websockets import WebSocketClientProtocol
from telegram import Update
from telegram.ext import CallbackContext

from app.api.schemas import VolunteerCreate

logger = logging.getLogger(__name__)

VOLUNTEER_URL = 'http://0.0.0.0:8000/volunteers'
THREADS_URL = 'http://0.0.0.0:8000/threads'
WS_URL = 'ws://0.0.0.0:8000/ws'

chat_ws: dict[int, WebSocketClientProtocol] = {}  # storing ws for specific chat
chat_task: dict[int, Task] = {}  # storing task(ws listening) for specific chat


async def start(update: Update, context: CallbackContext.DEFAULT_TYPE) -> None:
    logger.info('%s sent the start message', update.effective_user.username)

    message = 'Hi, I am a support bot, type /help to get commands'
    chat_id = update.effective_chat.id
    await context.bot.send_message(chat_id=chat_id, text=message)


async def get_help(update: Update, context: CallbackContext.DEFAULT_TYPE) -> None:
    logger.info('%s asked for help list', update.effective_user.username)

    message = '\n'.join(
        (
            '/register - to become a volunteer',
            '/current - to get current question',
            '/questions to get question',
            '/quit - to quit a volunteer role',
            '/volunteers - to get free volunteers',
            '/resolve - to close thread',
        )
    )
    chat_id = update.effective_chat.id

    await context.bot.send_message(chat_id=chat_id, text=message)


async def register_volunteer(
    update: Update, context: CallbackContext.DEFAULT_TYPE
) -> None:
    logger.info('%s registered as volunteer', update.effective_user.username)

    success_message = 'You are a volunteer now'
    fail_message = 'Sorry, error happened'
    volunteer_username = update.effective_user.username
    volunteer_tg_id = update.effective_user.id
    chat_id = update.effective_chat.id

    volunteer = VolunteerCreate(tg_id=volunteer_tg_id, username=volunteer_username)

    async with aiohttp.ClientSession() as session:
        async with session.post(
            url=VOLUNTEER_URL,
            data=volunteer.json(),
            headers={'content-type': 'application/json'},
        ) as res:
            if res.status == HTTPStatus.CREATED:
                await context.bot.send_message(chat_id=chat_id, text=success_message)
            else:
                await context.bot.send_message(chat_id=chat_id, text=fail_message)


async def get_questions(update: Update, context: CallbackContext.DEFAULT_TYPE) -> None:
    logger.info('%s requested the questions list', update.effective_user.username)

    chat_id = update.effective_chat.id

    async with aiohttp.ClientSession() as session:
        async with session.get(THREADS_URL) as res:
            threads = await res.json()

    if threads:
        questions = [f'{i}) {v["questions"][0]}' for i, v in enumerate(threads)]
        await context.bot.send_message(chat_id=chat_id, text='\n'.join(questions))
    else:
        await context.bot.send_message(chat_id=chat_id, text='No questions')


async def listen_to_ws(
    update: Update, context: CallbackContext.DEFAULT_TYPE, ws_id: int
) -> None:
    async with websockets.connect(f'{WS_URL}/{ws_id}') as ws:
        chat_id = update.effective_chat.id
        chat_ws[chat_id] = ws
        while True:
            data = await ws.recv()
            await context.bot.send_message(chat_id=chat_id, text=data)


async def assign_question_to_volunteer(
    update: Update, context: CallbackContext.DEFAULT_TYPE
) -> None:
    logger.info('%s chose a question', update.effective_user.username)

    success_message = 'You are connected to the user, just type'
    volunteer_tg_id = update.effective_user.id
    chat_id = update.effective_chat.id

    async with aiohttp.ClientSession() as session:
        async with session.get(THREADS_URL) as res:
            threads = await res.json()

    questions_number = int(update.message.text.split(' ')[1])

    ws_id = threads[questions_number]['ws_id']
    chat_task[chat_id] = asyncio.create_task(
        listen_to_ws(update, context, ws_id)
    )

    async with aiohttp.ClientSession() as session:
        async with session.get(f'{VOLUNTEER_URL}/{volunteer_tg_id}') as res:
            volunteer = VolunteerCreate.parse_obj(await res.json())
            volunteer.thread_ws_id = ws_id

            await session.put(
                url=f'{VOLUNTEER_URL}/{volunteer_tg_id}',
                data=volunteer.json(),
                headers={'content-type': 'application/json'},
            )

    await context.bot.send_message(chat_id=chat_id, text=success_message)


async def support(
    update: Update, context: CallbackContext.DEFAULT_TYPE
) -> None:  # pylint: disable=unused-argument
    chat_id = update.effective_chat.id
    ws = chat_ws[chat_id]

    await ws.send(update.message.text)


async def resolve(update: Update, context: CallbackContext.DEFAULT_TYPE) -> None:

    success_message = 'You are free'
    volunteer_tg_id = update.effective_user.id
    chat_id = update.effective_chat.id

    task = chat_task[chat_id]
    task.cancel()
    del chat_task[chat_id]

    async with aiohttp.ClientSession() as session:
        async with session.get(f'{VOLUNTEER_URL}/{volunteer_tg_id}') as res:
            volunteer = VolunteerCreate.parse_obj(await res.json())
            thread_ws_id = volunteer.thread_ws_id
            volunteer.thread_ws_id = None

            await session.put(
                url=f'{VOLUNTEER_URL}/{volunteer_tg_id}',
                data=volunteer.json(),
                headers={'content-type': 'application/json'},
            )

            await session.delete(f'{THREADS_URL}/{thread_ws_id}')

    await context.bot.send_message(chat_id=chat_id, text=success_message)
