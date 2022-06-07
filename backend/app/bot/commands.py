import asyncio
import logging
from http import HTTPStatus

import aiohttp
import websockets
from telegram import Update
from telegram.ext import CallbackContext

from app.api.schemas import VolunteerCreate

logger = logging.getLogger('commands')
volunteer_task = {}
volunteer_ws = {}


async def start(update: Update, context: CallbackContext.DEFAULT_TYPE) -> None:
    logger.info('%s sent the start message', update.effective_user.username)

    await context.bot.send_message(
        chat_id=update.effective_chat.id,
        text='Hi, I am a support bot, type /help to get commands',
    )


async def get_help(update: Update, context: CallbackContext.DEFAULT_TYPE) -> None:
    logger.info('%s asked for help list', update.effective_user.username)

    await context.bot.send_message(
        chat_id=update.effective_chat.id,
        text='\n'.join(
            (
                '/register - to become a volunteer',
                '/current - to get current question',
                '/questions to get question',
                '/quit - to quit a volunteer role',
                '/volunteers - to get free volunteers',
                '/resolve - to close thread',
            )
        ),
    )


async def register_volunteer(
    update: Update, context: CallbackContext.DEFAULT_TYPE
) -> None:
    logger.info('%s registered as volunteer', update.effective_user.username)

    chat_id = update.effective_chat.id
    volunteer = VolunteerCreate(
        tg_id=update.effective_user.id, username=update.effective_user.username
    )

    async with aiohttp.ClientSession() as session:
        async with session.post(
            url='http://0.0.0.0:8000/volunteers',
            data=volunteer.json(),
            headers={'content-type': 'application/json'},
        ) as res:
            if res.status == HTTPStatus.CREATED:
                await context.bot.send_message(
                    chat_id=chat_id, text='You are a volunteer now'
                )
            else:
                await context.bot.send_message(
                    chat_id=chat_id, text='Sorry, error happened'
                )


async def get_questions(update: Update, context: CallbackContext.DEFAULT_TYPE) -> None:
    logger.info('%s requested the questions list', update.effective_user.username)

    async with aiohttp.ClientSession() as session:
        async with session.get('http://0.0.0.0:8000/threads') as res:
            threads = await res.json()

    if threads:
        questions = [f'{i}) {v["questions"][0]}' for i, v in enumerate(threads)]
        await context.bot.send_message(
            chat_id=update.effective_chat.id, text='\n'.join(questions)
        )
    else:
        await context.bot.send_message(
            chat_id=update.effective_chat.id, text='No questions'
        )


async def listen_to_ws(update: Update, context: CallbackContext.DEFAULT_TYPE, ws_id: int) -> None:
    async with websockets.connect(f'ws://0.0.0.0:8000/ws/{ws_id}') as ws:
        volunteer_ws[update.effective_user.id] = ws
        while True:
            data = await ws.recv()
            await context.bot.send_message(chat_id=update.effective_chat.id, text=data)


async def assign_question_to_volunteer(
    update: Update, context: CallbackContext.DEFAULT_TYPE
) -> None:
    logger.info(
        '%s chose a question',
        update.effective_user.username,
    )

    async with aiohttp.ClientSession() as session:
        async with session.get('http://0.0.0.0:8000/threads') as res:
            threads = await res.json()

    questions_number = int(update.message.text.split(' ')[1])
    ws_id = threads[questions_number]['ws_id']
    volunteer_task[update.effective_user.id] = asyncio.create_task(
        listen_to_ws(update, context, ws_id)
    )

    await context.bot.send_message(
        chat_id=update.effective_chat.id,
        text='You are connected to the user, just type',
    )


async def support(update: Update, context: CallbackContext.DEFAULT_TYPE) -> None:  # pylint: disable=unused-argument
    ws = volunteer_ws[update.effective_user.id]

    await ws.send(update.message.text)


async def resolve(update: Update, context: CallbackContext.DEFAULT_TYPE) -> None:
    task = volunteer_task[update.effective_user.id]
    task.cancel()

    await context.bot.send_message(
        chat_id=update.effective_chat.id, text='You are free'
    )
