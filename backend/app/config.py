from pydantic import BaseSettings, SecretStr


class Settings(BaseSettings):
    api_token: SecretStr

    max_ws_connections: int = 2


settings = Settings()
