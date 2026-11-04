from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.medication import Medication
from app.schemas.medication import MedicationCreate, MedicationResponse, MedicationListResponse

router = APIRouter()

PREDETERMINADAS = [
    ("Pastilla de la Tensión (Losartán)", "08:00 AM", "Tomar con un vaso de agua después del desayuno"),
    ("Complejo Vitamínico B", "01:00 PM", "Tomar junto con el almuerzo"),
    ("Calcio / Vitamina D", "08:00 PM", "Tomar antes de dormir")
]

@router.get("/", response_model=MedicationListResponse, summary="Listar recordatorios de pastillas")
def list_medications(usuario: str = "Amigo", db: Session = Depends(get_db)):
    pastillas = db.query(Medication).filter(Medication.usuario == usuario).order_by(Medication.hora.asc()).all()
    
    # Si es nuevo, sembrar las dosis saludables predeterminadas
    if not pastillas:
        for med, hora, inst in PREDETERMINADAS:
            db_item = Medication(usuario=usuario, medicamento=med, hora=hora, instruccion=inst, activo=True)
            db.add(db_item)
        db.commit()
        pastillas = db.query(Medication).filter(Medication.usuario == usuario).order_by(Medication.hora.asc()).all()

    return MedicationListResponse(
        ok=True,
        pastillas=[MedicationResponse.model_validate(p) for p in pastillas]
    )

@router.post("/", response_model=MedicationResponse, status_code=status.HTTP_201_CREATED, summary="Agregar nueva pastilla")
def add_medication(item: MedicationCreate, db: Session = Depends(get_db)):
    db_item = Medication(
        usuario=item.usuario,
        medicamento=item.medicamento,
        hora=item.hora,
        instruccion=item.instruccion or "",
        activo=item.activo
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{medication_id}", summary="Eliminar recordatorio de pastilla")
def delete_medication(medication_id: int, db: Session = Depends(get_db)):
    db_item = db.query(Medication).filter(Medication.id == medication_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Recordatorio no encontrado")
    db.delete(db_item)
    db.commit()
    return {"ok": True, "message": "Recordatorio eliminado"}

