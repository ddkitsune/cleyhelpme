from pydantic import BaseModel
from typing import List, Dict, Any

class LessonMetric(BaseModel):
    leccion: str
    total: int

class UserSummary(BaseModel):
    nombre: str
    edad: int
    dificultad: bool
    fecha: str

class GerontologicalMetrics(BaseModel):
    total_usuarios: int
    edad_promedio: float
    con_dificultad: int
    total_evaluaciones: int
    satisfaccion_pct: float
    promedio_sus: float
    lecciones_populares: List[LessonMetric]
    ultimos_usuarios: List[UserSummary]

class StatisticsResponse(BaseModel):
    ok: bool = True
    metricas: GerontologicalMetrics

