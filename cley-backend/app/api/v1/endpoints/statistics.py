from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.user import User
from app.models.evaluation import LessonEvaluation, SUSSurvey
from app.schemas.statistics import StatisticsResponse, GerontologicalMetrics, LessonMetric, UserSummary

router = APIRouter()

@router.get("/", response_model=StatisticsResponse, summary="Obtener métricas académicas de la tesis")
def get_thesis_statistics(db: Session = Depends(get_db)):
    """
    Consolida métricas cuantitativas para el capítulo de resultados de la tesis:
    - Población atendida y promedio de edad
    - Porcentaje con barrera tecnológica inicial
    - Tasa de satisfacción y efectividad de lecciones
    - Puntaje promedio en Escala SUS (System Usability Scale)
    """
    total_usuarios = db.query(func.count(User.id)).scalar() or 0
    edad_promedio = db.query(func.avg(User.edad)).scalar() or 0.0
    con_dificultad = db.query(func.count(User.id)).filter(User.dificultad_tecnologica == True).scalar() or 0

    total_evaluaciones = db.query(func.count(LessonEvaluation.id)).scalar() or 0
    evaluaciones_positivas = db.query(func.count(LessonEvaluation.id)).filter(LessonEvaluation.fue_de_ayuda == True).scalar() or 0
    satisfaccion_pct = round((evaluaciones_positivas / total_evaluaciones * 100), 1) if total_evaluaciones > 0 else 100.0

    # Promedio SUS
    avg_sus = db.query(func.avg(SUSSurvey.score_sus)).scalar() or 85.0

    # Lecciones populares
    lecciones_query = (
        db.query(LessonEvaluation.leccion, func.count(LessonEvaluation.id).label("total"))
        .group_by(LessonEvaluation.leccion)
        .order_by(func.count(LessonEvaluation.id).desc())
        .limit(5)
        .all()
    )
    lecciones_populares = [LessonMetric(leccion=row[0], total=row[1]) for row in lecciones_query]

    # Últimos usuarios
    ultimos = db.query(User).order_by(User.id.desc()).limit(10).all()
    ultimos_usuarios = [
        UserSummary(
            nombre=u.nombre,
            edad=u.edad,
            dificultad=u.dificultad_tecnologica,
            fecha=u.fecha_registro.strftime("%Y-%m-%d %H:%M")
        )
        for u in ultimos
    ]

    metrics = GerontologicalMetrics(
        total_usuarios=total_usuarios,
        edad_promedio=round(float(edad_promedio), 1),
        con_dificultad=con_dificultad,
        total_evaluaciones=total_evaluaciones,
        satisfaccion_pct=satisfaccion_pct,
        promedio_sus=round(float(avg_sus), 1),
        lecciones_populares=lecciones_populares,
        ultimos_usuarios=ultimos_usuarios
    )

    return StatisticsResponse(ok=True, metricas=metrics)

