from pydantic import BaseSettings, SecretStr


class Settings(BaseSettings):
    api_hash: SecretStr
    api_id: SecretStr
    bot_token: SecretStr

    port: int = 8000
    host: str = '0.0.0.0'


settings = Settings()
