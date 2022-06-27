import logging
from typing import Any

from pyrogram import Client, emoji, filters
from pyrogram.types import Message

from app.bot.exceptions import InvalidInput
from app.bot.utils import (
    close_support_thread,
    create_volunteer,
    delete_volunteer,
    fetch_threads,
    for_volunteer,
    get_ws,
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


@app.on_message(filters=filters.command('start'))  # type: ignore
async def start(_: Any, message: Message) -> None:
    username = message.from_user.username
    response = f'Hi, I am a support bot, type /help to get commands {emoji.MAGNIFYING_GLASS_TILTED_LEFT}'

    await message.reply(text=response)

    logger.info('%s sent the start message', username)


@app.on_message(filters=filters.command('help'))  # type: ignore
async def get_help(_: Any, message: Message) -> None:
    username = message.from_user.username
    response = '\n'.join(
        (
            emoji.OPEN_BOOK,
            '/register - to become a volunteer',
            '/quit - to quit a volunteer role',
            '/questions to get question',
            '/resolve - to close thread',
            '/give_up - to close thread without resolving',
        )
    )

    await message.reply(text=response)

    logger.info('%s asked for help list', username)


@app.on_message(filters=filters.command('register'))  # type: ignore
async def register_volunteer(_: Any, message: Message) -> None:
    user_id = message.from_user.id
    username = message.from_user.username
    response = f'You are a volunteer now {emoji.PARTYING_FACE}'

    try:
        await create_volunteer(user_id)

    except InvalidInput:
        response = f'You are already a volunteer {emoji.GRINNING_FACE_WITH_SWEAT}'

    await message.reply(text=response)

    logger.info('%s registered as volunteer', username)


@app.on_message(filters=filters.command('quit'))  # type: ignore
@for_volunteer
async def quit_volunteer(_: Any, message: Message) -> None:
    chat_id = message.chat.id
    user_id = message.from_user.id
    username = message.from_user.username
    response = f'You are not a volunteer now {emoji.CRYING_FACE}'

    try:
        await delete_volunteer(chat_id, user_id)

    except InvalidInput as e:
        response = e.args[0]

    await message.reply(text=response)

    logger.info('%s quit volunteer role', username)


@app.on_message(filters=filters.command('questions'))  # type: ignore
@for_volunteer
async def get_questions(_: Any, message: Message) -> None:
    username = message.from_user.username
    threads = await fetch_threads(flt='free')

    if not threads:
        questions = ['No questions']
    else:
        questions = [f'{i}) {t.question}' for i, t in enumerate(threads)]

    await message.reply(text='\n'.join(questions))

    logger.info('%s requested the questions list', username)


@app.on_message(filters=filters.regex(r'pick -?\d+'))  # type: ignore
@for_volunteer
async def assign_support_thread(client: Client, message: Message) -> None:
    chat_id = message.chat.id
    user_id = message.from_user.id
    username = message.from_user.username
    response = (
        'You are connected to the question: "{}" \n just type %s ...' % emoji.KEYBOARD
    )

    try:
        # get the thread corresponding to position number
        thread_number = int(message.text.split()[1])
        threads = await fetch_threads(flt='free')
        thread = threads[thread_number]

        await open_support_thread(
            client=client, chat_id=chat_id, thread_id=thread.id, volunteer_tg_id=user_id
        )
        response = response.format(thread.question)

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
    username = message.from_user.username
    response = f'You are disconnected from a client, thank you {emoji.SMILING_FACE} !'

    try:
        await close_support_thread(chat_id=chat_id, solved=True)

    except InvalidInput as err:
        response = err.args[0]

    await message.reply(text=response)

    logger.info('%s resolved support thread', username)


@app.on_message(filters=filters.command('give_up'))  # type: ignore
@for_volunteer
async def disconnect_support_thread(_: Any, message: Message) -> None:
    chat_id = message.chat.id
    username = message.from_user.username
    response = f'You are disconnected from a client, {emoji.SAD_BUT_RELIEVED_FACE}'

    try:
        await close_support_thread(chat_id=chat_id, solved=False)

    except InvalidInput as err:
        response = err.args[0]

    await message.reply(text=response)

    logger.info('%s could not answer question', username)


@app.on_message(filters=filters.text)  # type: ignore
@for_volunteer
async def support(_: Any, message: Message) -> None:
    chat_id = message.chat.id

    ws = get_ws(chat_id)

    await ws.send(message.text)
