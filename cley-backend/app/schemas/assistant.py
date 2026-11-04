from pydantic import BaseModel, Field
from typing import List, Optional

class AssistantQuestionRequest(BaseModel):
    nombre: str = Field("Amigo", example="Carmen")
    edad: int = Field(70, example=74)
    dificultad: bool = Field(True, description="Requiere explicación paso a paso con colores y formas")
    pregunta: str = Field(..., min_length=2, example="¿Cómo envío un audio por WhatsApp?")

class StepExplanation(BaseModel):
    paso: int
    texto: str
    elemento_visual: Optional[str] = None # e.g. "botón verde redondo", "icono de cámara"

class AssistantResponse(BaseModel):
    ok: bool = True
    modo: str = Field(..., example="gemini_ai") # gemini_ai o local_fallback
    respuesta: str = Field(..., description="Explicación limpia y empática para lectura y voz")
    pasos: Optional[List[StepExplanation]] = None

