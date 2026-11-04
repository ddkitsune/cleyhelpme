from pydantic import BaseModel, Field

class EmergencyContactBase(BaseModel):
    nombre_contacto: str = Field(..., min_length=2, example="Hija María")
    telefono: str = Field(..., min_length=7, example="+58 414 123 4567")
    parentesco: str = Field("Familiar", example="Hija Mayor")

class EmergencyContactCreate(EmergencyContactBase):
    usuario: str = Field("Amigo", example="Carmen")

class EmergencyContactResponse(EmergencyContactBase):
    id: int
    usuario: str

    class Config:
        from_attributes = True

class EmergencyContactView(BaseModel):
    ok: bool = True
    contacto: EmergencyContactResponse

