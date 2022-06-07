from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters

from app.bot.commands import (
    assign_question_to_volunteer,
    get_help,
    get_questions,
    register_volunteer,
    resolve,
    start,
    support,
)
from app.config import settings

if __name__ == '__main__':
    app = ApplicationBuilder().token(settings.api_token.get_secret_value()).build()

    app.add_handler(CommandHandler('start', start))
    app.add_handler(CommandHandler('help', get_help))
    app.add_handler(CommandHandler('register', register_volunteer))
    app.add_handler(CommandHandler('questions', get_questions))
    app.add_handler(CommandHandler('resolve', resolve))

    app.add_handler(
        MessageHandler(
            ~filters.COMMAND & filters.Regex(r'pick \d+'), assign_question_to_volunteer
        )
    )
    app.add_handler(MessageHandler(~filters.COMMAND, support))

    app.run_polling()
