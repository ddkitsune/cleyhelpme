import os
import sqlite3
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

# Intentamos importar el SDK de Google Gemini
try:
    from google import genai
    from google.genai import types
    GEMINI_DISPONIBLE = True
except ImportError:
    GEMINI_DISPONIBLE = False

app = FastAPI(
    title="Clara - Servidor Directo Python",
    description="Backend directo (sin n8n) para adultos mayores en Casa De Los Abuelos de Miranda"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = "cley_helpme.db"

# =====================================================================
# 1. BASE DE DATOS SQLITE (USUARIOS Y EVALUACIONES SÍ/NO)
# =====================================================================
def inicializar_bd():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            edad INTEGER NOT NULL,
            dificultad_tecnologica BOOLEAN NOT NULL,
            fecha_registro TEXT NOT NULL
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS evaluaciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT NOT NULL,
            leccion TEXT NOT NULL,
            fue_de_ayuda BOOLEAN NOT NULL,
            fecha TEXT NOT NULL
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pastillas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT NOT NULL,
            medicamento TEXT NOT NULL,
            hora TEXT NOT NULL,
            instruccion TEXT,
            activo BOOLEAN NOT NULL DEFAULT 1
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS contactos_sos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT NOT NULL,
            nombre_contacto TEXT NOT NULL,
            telefono TEXT NOT NULL,
            parentesco TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

inicializar_bd()

# =====================================================================
# 2. MODELOS DE DATOS
# =====================================================================
class PerfilModel(BaseModel):
    nombre: str
    edad: int
    dificultad_tecnologica: bool

class PreguntaModel(BaseModel):
    nombre: str = "Amigo"
    edad: int = 70
    dificultad: bool = True
    pregunta: str

class EvaluacionModel(BaseModel):
    usuario: str
    leccion: str
    fue_de_ayuda: bool

class PastillaModel(BaseModel):
    usuario: str
    medicamento: str
    hora: str
    instruccion: str = ""

class ContactoSOSModel(BaseModel):
    usuario: str
    nombre_contacto: str
    telefono: str
    parentesco: str = "Familiar"

# =====================================================================
# 3. CEREBRO DE CLEY (PROMPT GERONTOLÓGICO + RESPUESTAS DE RESPALDO)
# =====================================================================
def obtener_prompt_cley(nombre: str, edad: int, dificultad: bool) -> str:
    nivel = "explicando paso a paso con mucha calma y mencionando colores y formas" if dificultad else "de forma clara y sencilla"
    return f"""
    Eres 'Clara', la asistente virtual de la aplicación móvil 'Clara' para los adultos mayores
    de la Casa De Los Abuelos de Miranda.
    Estás hablando con {nombre}, de {edad} años. Enséñale {nivel}.

    Reglas:
    1. Responde en máximo 3 pasos cortos.
    2. Nunca uses palabras técnicas en inglés. Di 'botón redondo verde', 'dibujo de cámara' o 'flecha'.
    3. Sé muy cariñosa, paciente y respetuosa.
    4. Escribe texto limpio sin asteriscos ni símbolos raros porque será leído en voz alta.
    """

def respuesta_inteligente_local(nombre: str, pregunta: str) -> str:
    """Respuestas inmediatas por si se prueba el sistema sin conexión a Internet o sin API Key."""
    q = pregunta.lower()
    if "voz" in q or "audio" in q or "whatsapp" in q:
        return (
            f"¡Claro que sí, {nombre}! Para enviar una nota de voz en WhatsApp: "
            f"Primero, abre la conversación con tu familiar. "
            f"Segundo, mantén tu dedo presionado sobre el botón redondo verde con el micrófono abajo a la derecha. "
            f"Tercero, habla tranquilo y suelta el botón para que se envíe."
        )
    elif "foto" in q or "cámara" in q or "instagram" in q:
        return (
            f"¡Con mucho gusto, {nombre}! Para ver o subir una foto: "
            f"Primero, toca el dibujo de la cámara en tu pantalla. "
            f"Segundo, apunta hacia lo que deseas fotografiar y toca el círculo grande del centro."
        )
    elif "telegram" in q or "mensaje" in q:
        return (
            f"¡Es muy fácil, {nombre}! En Telegram toca el cuadro blanco de abajo para que aparezcan las letras, "
            f"escribe tu saludo y luego toca la flechita azul de la esquina para enviarlo."
        )
    else:
        return (
            f"¡Hola {nombre}! Para hacer eso en tu teléfono: "
            f"Primero, busca el icono de la aplicación en tu pantalla principal. "
            f"Segundo, tócalo suavemente una sola vez con tu dedo y sigue las letras grandes en pantalla."
        )

# =====================================================================
# 4. RUTAS DEL SERVIDOR PYTHON
# =====================================================================
@app.get("/")
async def inicio():
    """Entrega la interfaz gráfica HTML directamente en el navegador."""
    return FileResponse("cley_app.html")

@app.get("/cley_estilos.css")
async def estilos_css():
    """Entrega la hoja de estilos CSS."""
    return FileResponse("cley_estilos.css", media_type="text/css")

@app.post("/api/perfil")
async def guardar_perfil(datos: PerfilModel):
    """Guarda los datos del Módulo 1 (Nombre, Edad y Diagnóstico)."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO usuarios (nombre, edad, dificultad_tecnologica, fecha_registro) VALUES (?, ?, ?, ?)",
        (datos.nombre, datos.edad, datos.dificultad_tecnologica, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    )
    conn.commit()
    conn.close()
    return {"ok": True, "mensaje": "Perfil guardado en base de datos."}

@app.post("/api/preguntar")
async def preguntar_a_cley(datos: PreguntaModel):
    """Recibe la duda desde la Pantalla 4 y devuelve la explicación de Cley a la Pantalla 5."""
    api_key = os.environ.get("GEMINI_API_KEY")

    if GEMINI_DISPONIBLE and api_key:
        try:
            client = genai.Client(api_key=api_key)
            respuesta = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=datos.pregunta,
                config=types.GenerateContentConfig(
                    system_instruction=obtener_prompt_cley(datos.nombre, datos.edad, datos.dificultad),
                    temperature=0.3,
                    max_output_tokens=220,
                ),
            )
            return {"ok": True, "modo": "gemini_ai", "respuesta": respuesta.text}
        except Exception:
            pass

    # Si no hay API Key configurada, usa el motor local para que siempre funcione en tus pruebas
    texto_respuesta = respuesta_inteligente_local(datos.nombre, datos.pregunta)
    return {"ok": True, "modo": "local_inteligente", "respuesta": texto_respuesta}

@app.post("/api/evaluacion")
async def guardar_evaluacion(datos: EvaluacionModel):
    """Guarda si la sesión fue de ayuda (SÍ / NO) desde la Pantalla 8."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO evaluaciones (usuario, leccion, fue_de_ayuda, fecha) VALUES (?, ?, ?, ?)",
        (datos.usuario, datos.leccion, datos.fue_de_ayuda, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    )
    conn.commit()
    conn.close()
    return {"ok": True}

# =====================================================================
# 5. MÓDULO DE SALUD (PASTILLAS) Y ASISTENCIA SOS
# =====================================================================
@app.get("/api/pastillas")
async def listar_pastillas(usuario: str = "Amigo"):
    """Lista las pastillas programadas para el abuelo."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, medicamento, hora, instruccion, activo FROM pastillas WHERE usuario = ? ORDER BY hora ASC",
        (usuario,)
    )
    filas = cursor.fetchall()
    conn.close()
    
    # Si aún no tiene pastillas registradas, cargamos unas predeterminadas saludables
    if not filas:
        predeterminadas = [
            (usuario, "Pastilla de la Tensión (Losartán)", "08:00 AM", "Tomar con un vaso de agua después del desayuno", 1),
            (usuario, "Complejo Vitamínico B", "01:00 PM", "Tomar junto con el almuerzo", 1),
            (usuario, "Calcio / Vitamina D", "08:00 PM", "Tomar antes de dormir", 1),
        ]
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.executemany(
            "INSERT INTO pastillas (usuario, medicamento, hora, instruccion, activo) VALUES (?, ?, ?, ?, ?)",
            predeterminadas
        )
        conn.commit()
        cursor.execute(
            "SELECT id, medicamento, hora, instruccion, activo FROM pastillas WHERE usuario = ? ORDER BY hora ASC",
            (usuario,)
        )
        filas = cursor.fetchall()
        conn.close()

    resultado = [
        {"id": f[0], "medicamento": f[1], "hora": f[2], "instruccion": f[3], "activo": bool(f[4])}
        for f in filas
    ]
    return {"ok": True, "pastillas": resultado}

@app.post("/api/pastillas")
async def agregar_pastilla(datos: PastillaModel):
    """Permite registrar un nuevo recordatorio de pastilla."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO pastillas (usuario, medicamento, hora, instruccion, activo) VALUES (?, ?, ?, ?, 1)",
        (datos.usuario, datos.medicamento, datos.hora, datos.instruccion)
    )
    conn.commit()
    conn.close()
    return {"ok": True, "mensaje": "Recordatorio guardado"}

@app.delete("/api/pastillas/{pastilla_id}")
async def eliminar_pastilla(pastilla_id: int):
    """Elimina o desactiva un recordatorio de pastilla."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM pastillas WHERE id = ?", (pastilla_id,))
    conn.commit()
    conn.close()
    return {"ok": True}

@app.get("/api/sos")
async def obtener_contacto_sos(usuario: str = "Amigo"):
    """Obtiene el contacto de emergencia configurado."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT id, nombre_contacto, telefono, parentesco FROM contactos_sos WHERE usuario = ? LIMIT 1", (usuario,))
    fila = cursor.fetchone()
    conn.close()

    if fila:
        return {
            "ok": True,
            "contacto": {"id": fila[0], "nombre": fila[1], "telefono": fila[2], "parentesco": fila[3]}
        }
    return {
        "ok": True,
        "contacto": {
            "id": 0,
            "nombre": "Hija María (Contacto de Emergencia)",
            "telefono": "+58 414 123 4567",
            "parentesco": "Hija Mayor"
        }
    }

@app.post("/api/sos")
async def guardar_contacto_sos(datos: ContactoSOSModel):
    """Guarda o actualiza el contacto de emergencia."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM contactos_sos WHERE usuario = ?", (datos.usuario,))
    cursor.execute(
        "INSERT INTO contactos_sos (usuario, nombre_contacto, telefono, parentesco) VALUES (?, ?, ?, ?)",
        (datos.usuario, datos.nombre_contacto, datos.telefono, datos.parentesco)
    )
    conn.commit()
    conn.close()
    return {"ok": True, "mensaje": "Contacto SOS guardado con éxito"}

# =====================================================================
# 6. PANEL DE CONTROL Y ESTADÍSTICAS GERONTOLÓGICAS (ADMIN)
# =====================================================================
@app.get("/api/admin/estadisticas")
async def estadisticas_gerontologicas():
    """Entrega métricas de satisfacción, uso de lecciones y participantes registrados."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM usuarios")
    total_usuarios = cursor.fetchone()[0]

    cursor.execute("SELECT AVG(edad) FROM usuarios")
    edad_promedio = cursor.fetchone()[0] or 0

    cursor.execute("SELECT COUNT(*) FROM usuarios WHERE dificultad_tecnologica = 1")
    con_dificultad = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM evaluaciones")
    total_evaluaciones = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM evaluaciones WHERE fue_de_ayuda = 1")
    evaluaciones_positivas = cursor.fetchone()[0]

    cursor.execute("SELECT leccion, COUNT(*) as cant FROM evaluaciones GROUP BY leccion ORDER BY cant DESC LIMIT 5")
    lecciones_populares = [{"leccion": f[0], "total": f[1]} for f in cursor.fetchall()]

    cursor.execute("SELECT nombre, edad, dificultad_tecnologica, fecha_registro FROM usuarios ORDER BY id DESC LIMIT 10")
    ultimos_usuarios = [
        {"nombre": f[0], "edad": f[1], "dificultad": bool(f[2]), "fecha": f[3]}
        for f in cursor.fetchall()
    ]

    conn.close()

    tasa_satisfaccion = round((evaluaciones_positivas / total_evaluaciones * 100), 1) if total_evaluaciones > 0 else 100.0

    return {
        "ok": True,
        "metricas": {
            "total_usuarios": total_usuarios,
            "edad_promedio": round(edad_promedio, 1),
            "con_dificultad": con_dificultad,
            "total_evaluaciones": total_evaluaciones,
            "satisfaccion_pct": tasa_satisfaccion,
            "lecciones_populares": lecciones_populares,
            "ultimos_usuarios": ultimos_usuarios
        }
    }