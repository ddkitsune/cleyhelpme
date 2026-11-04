from fastapi import APIRouter
from app.api.v1.endpoints import (
    profile,
    assistant,
    medication,
    emergency,
    evaluations,
    statistics
)

api_router = APIRouter()

api_router.include_router(profile.router, prefix="/profile", tags=["Perfil"])
api_router.include_router(assistant.router, prefix="/assistant", tags=["Asistente IA"])
api_router.include_router(medication.router, prefix="/medications", tags=["Pastillero & Medicación"])
api_router.include_router(emergency.router, prefix="/emergency", tags=["Emergencia SOS"])
api_router.include_router(evaluations.router, prefix="/evaluations", tags=["Evaluaciones & Métricas"])
api_router.include_router(statistics.router, prefix="/statistics", tags=["Estadísticas de Tesis"])

