from telegram.ext import ApplicationBuilder

from app.config import settings


if __name__ == '__main__':
    app = ApplicationBuilder().token(settings.api_token.get_secret_value()).build()

    app.run_polling()
