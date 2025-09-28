import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    app_name: str = "Report Agent AI Service"
    debug: bool = True
    
    class Config:
        env_file = ".env"

settings = Settings()