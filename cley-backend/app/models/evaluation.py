from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float
from datetime import datetime
from app.core.database import Base

class LessonEvaluation(Base):
    __tablename__ = "evaluaciones"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    usuario = Column(String(100), nullable=False, default="Amigo", index=True)
    leccion = Column(String(150), nullable=False)
    fue_de_ayuda = Column(Boolean, nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow, nullable=False)

class SUSSurvey(Base):
    """
    Evaluación formal de usabilidad bajo el estándar SUS (System Usability Scale)
    10 preguntas estándar en escala Likert 1-5 para medir la usabilidad en la tesis.
    """
    __tablename__ = "encuestas_sus"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    usuario = Column(String(100), nullable=False, default="Amigo")
    # Puntuaciones 1 a 5 para las 10 preguntas
    q1 = Column(Integer, nullable=False) # Me gustaría usar el sistema frecuentemente
    q2 = Column(Integer, nullable=False) # Encontré el sistema innecesariamente complejo
    q3 = Column(Integer, nullable=False) # Pensé que el sistema era fácil de usar
    q4 = Column(Integer, nullable=False) # Necesitaría ayuda de un técnico
    q5 = Column(Integer, nullable=False) # Las funciones estaban bien integradas
    q6 = Column(Integer, nullable=False) # Había mucha inconsistencia
    q7 = Column(Integer, nullable=False) # La mayoría aprendería a usarlo muy rápido
    q8 = Column(Integer, nullable=False) # Encontré el sistema muy engorroso de usar
    q9 = Column(Integer, nullable=False) # Me sentí muy seguro usándolo
    q10 = Column(Integer, nullable=False) # Necesité aprender muchas cosas antes de empezar
    score_sus = Column(Float, nullable=False) # Puntuación final calculada 0-100
    fecha = Column(DateTime, default=datetime.utcnow, nullable=False)

