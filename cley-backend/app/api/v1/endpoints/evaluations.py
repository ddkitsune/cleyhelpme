from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.evaluation import LessonEvaluation, SUSSurvey
from app.schemas.evaluation import (
    LessonEvaluationCreate,
    LessonEvaluationResponse,
    SUSSurveyCreate,
    SUSSurveyResponse
)

router = APIRouter()

def compute_sus_score(q: SUSSurveyCreate) -> float:
    """
    Algoritmo estándar de cálculo de System Usability Scale (SUS):
    - Para preguntas impares (1, 3, 5, 7, 9): puntuación - 1
    - Para preguntas pares (2, 4, 6, 8, 10): 5 - puntuación
    - Suma total multiplicada por 2.5 (rango 0 a 100)
    """
    odd_sum = (q.q1 - 1) + (q.q3 - 1) + (q.q5 - 1) + (q.q7 - 1) + (q.q9 - 1)
    even_sum = (5 - q.q2) + (5 - q.q4) + (5 - q.q6) + (5 - q.q8) + (5 - q.q10)
    return round((odd_sum + even_sum) * 2.5, 2)

@router.post("/lesson", response_model=LessonEvaluationResponse, status_code=status.HTTP_201_CREATED, summary="Guardar evaluación de lección (¿Fue de ayuda?)")
def save_lesson_evaluation(data: LessonEvaluationCreate, db: Session = Depends(get_db)):
    eval_item = LessonEvaluation(
        usuario=data.usuario,
        leccion=data.leccion,
        fue_de_ayuda=data.fue_de_ayuda
    )
    db.add(eval_item)
    db.commit()
    db.refresh(eval_item)
    return eval_item

@router.post("/sus", response_model=SUSSurveyResponse, status_code=status.HTTP_201_CREATED, summary="Guardar encuesta formal de usabilidad SUS")
def save_sus_survey(survey_in: SUSSurveyCreate, db: Session = Depends(get_db)):
    score = compute_sus_score(survey_in)
    db_survey = SUSSurvey(
        usuario=survey_in.usuario,
        q1=survey_in.q1,
        q2=survey_in.q2,
        q3=survey_in.q3,
        q4=survey_in.q4,
        q5=survey_in.q5,
        q6=survey_in.q6,
        q7=survey_in.q7,
        q8=survey_in.q8,
        q9=survey_in.q9,
        q10=survey_in.q10,
        score_sus=score
    )
    db.add(db_survey)
    db.commit()
    db.refresh(db_survey)
    return db_survey

