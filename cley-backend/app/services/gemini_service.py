import os
import re
import requests
from typing import Tuple, List
from app.core.config import settings
from app.schemas.assistant import StepExplanation

def build_gerontological_prompt(nombre: str, edad: int, dificultad: bool) -> str:
    nivel = (
        "explicando con extrema calma paso a paso, mencionando colores ('el botón verde'), "
        "formas ('el círculo', 'la flecha') y ubicaciones ('abajo a la derecha')"
        if dificultad
        else "de forma clara, concisa y sin tecnicismos"
    )

    return f"""
    Eres 'Cley', el asistente y compañero digital para los adultos mayores de la Casa De Los Abuelos.
    Estás conversando con {nombre}, de {edad} años. Tu misión es enseñarle {nivel}.

    NORMAS ESTRICTAS DE COMUNICACIÓN (WCAG Y GERONTOLOGÍA):
    1. Máximo 3 pasos concretos y numerados.
    2. NUNCA uses anglicismos ni tecnicismos (no digas 'tap', 'scroll', 'app drawer', 'swipe'). Di 'toca suavemente', 'desliza tu dedo', 'busca el dibujo'.
    3. Tono: Respetuoso, sumamente paciente, cariñoso y estimulante.
    4. El texto será leído en voz alta por síntesis de voz (Text-to-Speech): NO uses asteriscos (*), almohadillas (#), ni caracteres especiales.
    5. Finaliza siempre con una frase corta de aliento.
    """


def get_local_fallback_response(nombre: str, pregunta: str) -> Tuple[str, List[StepExplanation]]:
    q = pregunta.lower()
    
    if any(k in q for k in ["voz", "audio", "whatsapp", "mensaje de voz"]):
        texto = (
            f"¡Claro que sí, {nombre}! Para enviar una nota de voz en WhatsApp: "
            f"Primero, abre la conversación con tu familiar. "
            f"Segundo, mantén tu dedo presionado sobre el botón redondo verde con el micrófono abajo a la derecha. "
            f"Tercero, habla con tranquilidad y suelta el botón para enviarlo. ¡Lo harás excelente!"
        )
        pasos = [
            StepExplanation(paso=1, texto="Abre la conversación con tu familiar.", elemento_visual="Icono verde de WhatsApp"),
            StepExplanation(paso=2, texto="Mantén presionado el botón verde con el dibujo del micrófono abajo a la derecha.", elemento_visual="Botón redondo verde con micrófono"),
            StepExplanation(paso=3, texto="Habla con calma y suelta el botón cuando termines.", elemento_visual="Micrófono en pantalla")
        ]
        return texto, pasos

    elif any(k in q for k in ["foto", "cámara", "fotografía", "instagram"]):
        texto = (
            f"¡Con mucho gusto, {nombre}! Para tomar una foto: "
            f"Primero, busca y toca el dibujo de la cámara en tu pantalla. "
            f"Segundo, apunta hacia lo que deseas fotografiar sin moverte. "
            f"Tercero, presiona el círculo blanco grande que ves en el centro abajo. ¡Quedará hermosa!"
        )
        pasos = [
            StepExplanation(paso=1, texto="Toca el dibujo de la cámara en tu pantalla.", elemento_visual="Icono de cámara"),
            StepExplanation(paso=2, texto="Apunta hacia lo que deseas fotografiar.", elemento_visual="Pantalla de cámara"),
            StepExplanation(paso=3, texto="Presiona el círculo blanco grande abajo.", elemento_visual="Botón circular blanco")
        ]
        return texto, pasos

    elif any(k in q for k in ["llamada", "llamar", "teléfono"]):
        texto = (
            f"¡Muy fácil, {nombre}! Para llamar a alguien: "
            f"Primero, toca el icono del teléfono verde. "
            f"Segundo, busca el nombre de tu contacto o toca el teclado de números. "
            f"Tercero, pulsa el botón verde para iniciar la llamada."
        )
        pasos = [
            StepExplanation(paso=1, texto="Toca el icono verde del teléfono.", elemento_visual="Icono de auricular verde"),
            StepExplanation(paso=2, texto="Busca el nombre de tu ser querido.", elemento_visual="Lista de contactos"),
            StepExplanation(paso=3, texto="Toca el botón verde para llamar.", elemento_visual="Botón verde de llamada")
        ]
        return texto, pasos

    else:
        texto = (
            f"¡Hola {nombre}! Con calma aprenderemos juntos. "
            f"Primero, busca el icono que deseas abrir en la pantalla principal. "
            f"Segundo, tócalo suavemente una sola vez con la yema de tu dedo. "
            f"Tercero, espera un momento a que se abra la aplicación. ¡Poco a poco te volverás un experto!"
        )
        pasos = [
            StepExplanation(paso=1, texto="Ubica el icono en la pantalla.", elemento_visual="Icono en pantalla"),
            StepExplanation(paso=2, texto="Tócalo una sola vez con tu dedo.", elemento_visual="Toque suave"),
            StepExplanation(paso=3, texto="Espera unos segundos a que cargue.", elemento_visual="Carga de aplicación")
        ]
        return texto, pasos


class GeminiAssistantService:
    @staticmethod
    def answer_question(nombre: str, edad: int, dificultad: bool, pregunta: str) -> Tuple[str, str, List[StepExplanation]]:
        api_key = os.environ.get("GEMINI_API_KEY") or settings.GEMINI_API_KEY

        if api_key and api_key.strip():
            try:
                system_instruction = build_gerontological_prompt(nombre, edad, dificultad)
                model = settings.GEMINI_MODEL or "gemini-3.8-flash"
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

                payload = {
                    "system_instruction": {
                        "parts": [{"text": system_instruction}]
                    },
                    "contents": [
                        {"parts": [{"text": pregunta}]}
                    ],
                    "generationConfig": {
                        "temperature": 0.3,
                        "maxOutputTokens": 300
                    }
                }

                resp = requests.post(url, json=payload, timeout=35)
                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        raw_text = candidates[0]["content"]["parts"][0]["text"]
                        texto_limpio = raw_text.replace("*", "").replace("#", "").strip()

                        # Descomponer pasos
                        lineas = [l.strip() for l in texto_limpio.split("\n") if l.strip()]
                        pasos = []
                        idx = 1
                        for linea in lineas:
                            if re.match(r"^(\d+[\.\)]|Paso\s*\d+|Primero|Segundo|Tercero)", linea, re.IGNORECASE):
                                pasos.append(StepExplanation(paso=idx, texto=linea))
                                idx += 1

                        if not pasos:
                            pasos = [StepExplanation(paso=1, texto=texto_limpio)]

                        return "gemini_ai", texto_limpio, pasos
            except Exception as e:
                # Log interno de depuración y caída limpia al motor local
                print(f"[Gemini Service Error]: {e}")

        # Fallback local offline
        texto_fb, pasos_fb = get_local_fallback_response(nombre, pregunta)
        return "local_fallback", texto_fb, pasos_fb
