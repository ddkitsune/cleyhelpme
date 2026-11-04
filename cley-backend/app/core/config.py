from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE = BASE_DIR / ".env"

class Settings(BaseSettings):
    PROJECT_NAME: str = "Cley's HelpMe API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Backend profesional para la asistencia integral y alfabetización digital de adultos mayores"
    API_V1_STR: str = "/api/v1"
    
    # Base de datos
    DATABASE_URL: str = "sqlite:///./cley_helpme_v2.db"
    
    # Inteligencia Artificial
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-3.8-flash"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()

