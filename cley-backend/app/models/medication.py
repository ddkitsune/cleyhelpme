from sqlalchemy import Column, Integer, String, Boolean
from app.core.database import Base

class Medication(Base):
    __tablename__ = "pastillas"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    usuario = Column(String(100), nullable=False, default="Amigo", index=True)
    medicamento = Column(String(200), nullable=False)
    hora = Column(String(20), nullable=False) # e.g. "08:00 AM" o "14:30"
    instruccion = Column(String(500), nullable=True, default="")
    activo = Column(Boolean, default=True, nullable=False)

