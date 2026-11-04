from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.emergency import EmergencyContact
from app.schemas.emergency import EmergencyContactCreate, EmergencyContactResponse, EmergencyContactView

router = APIRouter()

DEFAULT_CONTACT = {
    "nombre_contacto": "Hija María (Contacto de Emergencia)",
    "telefono": "+58 414 123 4567",
    "parentesco": "Hija Mayor"
}

@router.get("/", response_model=EmergencyContactView, summary="Obtener contacto SOS de emergencia")
def get_emergency_contact(usuario: str = "Amigo", db: Session = Depends(get_db)):
    contacto = db.query(EmergencyContact).filter(EmergencyContact.usuario == usuario).first()
    if not contacto:
        contacto = EmergencyContact(
            id=1,
            usuario=usuario,
            nombre_contacto=DEFAULT_CONTACT["nombre_contacto"],
            telefono=DEFAULT_CONTACT["telefono"],
            parentesco=DEFAULT_CONTACT["parentesco"]
        )
    return EmergencyContactView(ok=True, contacto=EmergencyContactResponse.model_validate(contacto))

@router.post("/", response_model=EmergencyContactResponse, summary="Guardar o actualizar contacto SOS")
def set_emergency_contact(contact_in: EmergencyContactCreate, db: Session = Depends(get_db)):
    # Actualizar si existe o crear nuevo
    contacto = db.query(EmergencyContact).filter(EmergencyContact.usuario == contact_in.usuario).first()
    if contacto:
        contacto.nombre_contacto = contact_in.nombre_contacto
        contacto.telefono = contact_in.telefono
        contacto.parentesco = contact_in.parentesco
    else:
        contacto = EmergencyContact(
            usuario=contact_in.usuario,
            nombre_contacto=contact_in.nombre_contacto,
            telefono=contact_in.telefono,
            parentesco=contact_in.parentesco
        )
        db.add(contacto)
    db.commit()
    db.refresh(contacto)
    return contacto

