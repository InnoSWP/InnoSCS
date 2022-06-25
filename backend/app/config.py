from pydantic import BaseSettings, SecretStr


class Settings(BaseSettings):
    api_token: SecretStr


settings = Settings()
