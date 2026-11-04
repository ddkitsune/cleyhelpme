from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=100, example="Carmen")
    edad: int = Field(..., ge=1, le=120, example=74)
    dificultad_tecnologica: bool = Field(True, description="Indica si presenta dificultades con smartphones")

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    fecha_registro: datetime

    class Config:
        from_attributes = True

