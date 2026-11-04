from sqlalchemy import Column, Integer, String
from app.core.database import Base

class EmergencyContact(Base):
    __tablename__ = "contactos_sos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    usuario = Column(String(100), nullable=False, default="Amigo", index=True)
    nombre_contacto = Column(String(150), nullable=False)
    telefono = Column(String(50), nullable=False)
    parentesco = Column(String(100), nullable=False, default="Familiar")

