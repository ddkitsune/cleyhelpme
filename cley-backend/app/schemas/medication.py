from pydantic import BaseModel, Field
from typing import Optional, List

class MedicationBase(BaseModel):
    medicamento: str = Field(..., min_length=1, example="Pastilla de la Tensión (Losartán)")
    hora: str = Field(..., example="08:00 AM")
    instruccion: Optional[str] = Field("", example="Tomar con un vaso de agua después del desayuno")
    activo: bool = Field(True)

class MedicationCreate(MedicationBase):
    usuario: str = Field("Amigo", example="Carmen")

class MedicationResponse(MedicationBase):
    id: int
    usuario: str

    class Config:
        from_attributes = True

class MedicationListResponse(BaseModel):
    ok: bool = True
    pastillas: List[MedicationResponse]

