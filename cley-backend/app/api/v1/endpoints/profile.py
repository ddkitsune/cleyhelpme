from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse

router = APIRouter()

@router.post("/", response_model=UserResponse, summary="Registrar perfil inicial o diagnóstico")
def create_profile(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Registra el perfil del adulto mayor con su nivel de dificultad tecnológica
    (evaluación diagnóstica inicial del participante de la tesis).
    """
    db_user = User(
        nombre=user_in.nombre.strip(),
        edad=user_in.edad,
        dificultad_tecnologica=user_in.dificultad_tecnologica
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/latest", response_model=UserResponse, summary="Obtener el último usuario registrado")
def get_latest_profile(db: Session = Depends(get_db)):
    user = db.query(User).order_by(User.id.desc()).first()
    if not user:
        # Perfil por defecto
        user = User(id=1, nombre="Amigo", edad=70, dificultad_tecnologica=True)
    return user

