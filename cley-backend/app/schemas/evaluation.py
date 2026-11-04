from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class LessonEvaluationCreate(BaseModel):
    usuario: str = Field("Amigo", example="Carmen")
    leccion: str = Field(..., example="Enviar Audio en WhatsApp")
    fue_de_ayuda: bool = Field(..., description="SÍ o NO")

class LessonEvaluationResponse(LessonEvaluationCreate):
    id: int
    fecha: datetime

    class Config:
        from_attributes = True

class SUSSurveyCreate(BaseModel):
    usuario: str = Field("Amigo", example="Carmen")
    q1: int = Field(..., ge=1, le=5)
    q2: int = Field(..., ge=1, le=5)
    q3: int = Field(..., ge=1, le=5)
    q4: int = Field(..., ge=1, le=5)
    q5: int = Field(..., ge=1, le=5)
    q6: int = Field(..., ge=1, le=5)
    q7: int = Field(..., ge=1, le=5)
    q8: int = Field(..., ge=1, le=5)
    q9: int = Field(..., ge=1, le=5)
    q10: int = Field(..., ge=1, le=5)

class SUSSurveyResponse(SUSSurveyCreate):
    id: int
    score_sus: float
    fecha: datetime

    class Config:
        from_attributes = True

