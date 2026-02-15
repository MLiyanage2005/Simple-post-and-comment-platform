import os
from functools import lru_cache
from pydantic_settings import BaseSettings

class BaseConfig(BaseSettings):
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str

    DB_FORCE_ROLLBACK: bool = False

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"mysql+pymysql://{self.DB_USER}:"
            f"{self.DB_PASSWORD}@"
            f"{self.DB_HOST}:"
            f"{self.DB_PORT}/"
            f"{self.DB_NAME}"
        )

    class Config:
        case_sensitive = True

class DevConfig(BaseConfig):
    class Config(BaseConfig.Config):
        env_file = ".env.dev"

class ProdConfig(BaseConfig):
    class Config(BaseConfig.Config):
        env_file = ".env.prod"

class TestConfig(BaseConfig):
    DB_FORCE_ROLLBACK: bool = True

    class Config(BaseConfig.Config):
        env_file = ".env.test"

@lru_cache
def get_config():
    env_state = os.getenv("ENV_STATE", "dev")

    config_map = {
        "dev": DevConfig,
        "prod": ProdConfig,
        "test": TestConfig,
    }

    return config_map[env_state]()

config = get_config()
print(config.DATABASE_URL)