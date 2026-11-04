from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    edad = Column(Integer, nullable=False)
    dificultad_tecnologica = Column(Boolean, default=True, nullable=False)
    fecha_registro = Column(DateTime, default=datetime.utcnow, nullable=False)

