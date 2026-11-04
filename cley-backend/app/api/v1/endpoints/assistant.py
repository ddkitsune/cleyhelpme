from fastapi import APIRouter
from app.schemas.assistant import AssistantQuestionRequest, AssistantResponse
from app.services.gemini_service import GeminiAssistantService

router = APIRouter()

@router.post("/ask", response_model=AssistantResponse, summary="Hacer una pregunta gerontológica al asistente")
def ask_assistant(req: AssistantQuestionRequest):
    """
    Recibe la duda del adulto mayor y devuelve una explicación paciente,
    estructurada en pasos sencillos, limpia de caracteres extraños para lectura TTS.
    """
    modo, respuesta_texto, pasos = GeminiAssistantService.answer_question(
        nombre=req.nombre,
        edad=req.edad,
        dificultad=req.dificultad,
        pregunta=req.pregunta
    )
    
    return AssistantResponse(
        ok=True,
        modo=modo,
        respuesta=respuesta_texto,
        pasos=pasos
    )

