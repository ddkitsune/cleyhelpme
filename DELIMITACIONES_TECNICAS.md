# Delimitaciones Técnicas del Proyecto

## "Cley's HelpMe" (Clara) — Asistente Móvil Integral para Adultos Mayores
**Proyecto Especial de Grado / Tesis de Ingeniería**  
**Contexto de Aplicación:** Casa De Los Abuelos de Miranda, Venezuela  
**Año:** 2026  

---

## 1. Delimitación Espacial, Poblacional y Contextual

* **Contexto de Aplicación:** El proyecto está delimitado para su despliegue y evaluación en la **Casa De Los Abuelos de Miranda**, ubicada en el estado Miranda, Venezuela.
* **Población Objetivo:** Adultos mayores de 60 años en adelante que presentan brecha digital, baja familiaridad con teléfonos inteligentes (*smartphones*), tecnofobia o afecciones físicas leves asociadas a la edad (presbicia, pérdida gradual de agudeza auditiva o temblores motores leves).
* **Entorno de Uso:** Ambientes cotidianos residenciales o de estancia diurna, con disponibilidad variable de conectividad a internet (redes Wi-Fi comunitarias o datos móviles).

---

## 2. Delimitación de Plataforma y Hardware

* **Sistema Operativo Compatible:** **Android 8.0 (API nivel 26 - Oreo)** como versión mínima requerida, hasta **Android 15 (API nivel 35)**.
* **Exclusión de Plataformas:** No se incluye compatibilidad nativa con dispositivos Apple (iOS / iPadOS) en esta fase de la investigación, debido a que el 100% del parque de dispositivos evaluado en la institución corresponde al ecosistema Android.
* **Requerimientos de Hardware del Terminal:**
  * Procesador ARM de 64 bits (Quad-Core 1.5 GHz o superior).
  * Memoria RAM mínima: 2 GB (recomendado 3 GB o superior).
  * Pantalla táctil capacitiva con resolución mínima de 720 × 1280 píxeles.
  * Micrófono operativo (para entrada de comandos por voz).
  * Altavoz multimedia integrado o auricular (para salida y lectura por síntesis de voz).
  * Conectividad a red (Wi-Fi 802.11 b/g/n o red celular 3G/4G/5G) para consultas dinámicas a la Inteligencia Artificial.

---

## 3. Delimitación de la Arquitectura de Software

La solución tecnológica se diseñó bajo una **arquitectura híbrida desacoplada y orientada a eventos**, estructurada en dos capas principales:

```
┌────────────────────────────────────────────────────────┐
│                   CAPA CLIENTE MÓVIL                   │
│   React 19 + TypeScript + Vite + Capacitor 8 Nativo    │
│   (UI Accesible WCAG 2.1 AAA + Android Preferences)    │
└───────────────┬────────────────────────┬───────────────┘
                │                        │
       HTTPS Directo            HTTP REST Local (LAN)
                │                        │
┌───────────────▼──────────────┐ ┌───────▼───────────────┐
│       GOOGLE GEMINI API      │ │   BACKEND PYTHON      │
│  (Flash-Lite / Gemini 3.5)   │ │  FastAPI + SQLAlchemy │
│    IA Generativa en Nube     │ │  SQLite DB + SUS Test │
└──────────────────────────────┘ └───────────────────────┘
```

### 3.1. Frontend Móvil (Cley App)
* **Framework y Entorno:** React 19 compilado con **Vite 6** y empaquetado a través de **Capacitor 8**.
* **Lenguaje:** TypeScript 5.8 con tipado estricto en modo `strict`.
* **Motor de Vista y Renderizado:** Android WebView nativo con esquema de color forzado `light` (`meta name="color-scheme" content="light"`) para anular inversiones erróneas de contraste causadas por el modo oscuro de Android.

### 3.2. Procesamiento de Voz y Multimedia
* **Entrada de Voz (Speech-to-Text - STT):** Implementado mediante el plugin `@capacitor-community/speech-recognition`, delegando el procesamiento al motor nativo `android.speech.SpeechRecognizer` con reconocimiento en idioma español latinoamericano (`es-VE`, `es-ES`, `es-US`).
* **Salida de Voz (Text-to-Speech - TTS):** Implementado mediante `@capacitor-community/text-to-speech`, utilizando el sintetizador nativo de Android (`android.speech.tts.TextToSpeech`) calibrado a una velocidad de habla pedagógica de **0.85x** y tono estándar (1.0x) para garantizar la inteligibilidad en adultos mayores con presbiacusia leve.

### 3.3. Motor de Inteligencia Artificial (Google Gemini)
* **API y Endpoints:** Google Generative AI API v1beta a través de llamadas seguras HTTPS directas desde el dispositivo móvil.
* **Modelos Empleados:**
  1. `models/gemini-flash-lite-latest` (Modelo principal de latencia ultrabaja, < 1.0 s).
  2. `models/gemini-3.5-flash-lite` (Modelo de respaldo automático en caso de saturación).
* **Ingeniería de Instrucciones (System Prompting):** Configuración gerontológica especializada que impone:
  * Trato familiar afectuoso y personalizado llamando al adulto mayor por su nombre de pila.
  * Respuestas estructuradas paso por paso (*Paso 1, Paso 2, Paso 3*).
  * Prohibición de anglicismos y tecnicismos computacionales.
  * Longitud concisa (máximo 3 párrafos breves) apta para sintetizarse en audio sin fatigar al usuario.

### 3.4. Persistencia y Almacenamiento de Datos (Offline-First)
* **En el Teléfono Móvil:** Utilización de **Android SharedPreferences** a través de `@capacitor/preferences`.
  * **Garantía:** Persistencia indestructible de datos críticos (perfil, pastillas y contacto SOS). No se borra al cerrar la app, al reiniciar el dispositivo ni al vaciar la caché web.
  * **Disponibilidad:** 100% operativo sin internet para funciones esenciales de salud y emergencia.
* **En el Servidor de Apoyo (Backend Python):**
  * **Framework:** FastAPI con arquitectura limpia modular.
  * **ORM:** SQLAlchemy 2.0.
  * **Base de Datos Central:** SQLite 3 (`cley_helpme_v2.db`) para el resguardo de las métricas de evaluación SUS.

---

## 4. Delimitación de Accesibilidad y Ergonomía Gerontológica

El diseño de interfaces se ajustó estrictamente a las pautas de accesibilidad **WCAG 2.1 nivel AAA** y principios de diseño gerontológico:

* **Objetivos Táctiles:** Todos los botones poseen una altura mínima de **58 píxeles a 76 píxeles** (superando el estándar recomendado de Android de 48dp), facilitando el toque a usuarios con artritis o temblores esenciales.
* **Zona de Seguridad Superior:** Margen superior de seguridad de mínimo **54px** (`padding-top: max(env(safe-area-inset-top), 54px)`), eliminando cualquier colisión con la barra de estado del sistema o cámaras frontales tipo *punch-hole* / *notch*.
* **Paleta Cromática de Alto Contraste:** Ratios de contraste superiores a **7:1** entre texto y fondo:
  * Fondos de superficie: Blanco puro (`#FFFFFF`) y Gris neutro claro (`#F8FAFC`).
  * Textos principales: Azul petróleo profundo (`#0F172A`) y Grafito oscuro (`#1E293B`).
  * Acentos de alta visibilidad: Naranja motivacional (`#D9480F`), Azul de salud (`#0284C7`), Verde de confirmación (`#15803D`) y Rojo de emergencia (`#DC2626`).
* **Selector Dinámico de Escala Tipográfica:**
  * Nivel Normal (1.0x - Base 18px).
  * Nivel Grande (1.25x - Base 22px).
  * Nivel Gigante (1.5x - Base 26px a 32px), orientado a personas con afecciones visuales o cataratas.
* **Tipografía:** *Atkinson Hyperlegible* (diseñada por el Instituto Braille para personas con baja visión), garantizando la distinción entre caracteres fácilmente confundibles como `I`, `l`, `1`, `0` y `O`.

---

## 5. Delimitaciones Funcionales y Alcance (Lo que hace y lo que NO hace el sistema)

### 5.1. Alcance Incluido:
1. Asistencia pedagógica interactiva por voz y texto guiada por IA para enseñar el uso de aplicaciones comunes (WhatsApp, Cámara, Llamadas, YouTube).
2. Módulo de pastillero diario con registro persistente, indicación médica y lectura auditiva de dosis.
3. Botón de alerta inmediata SOS con apertura directa del marcador telefónico hacia el familiar o cuidador designado.
4. Módulo de evaluación de usabilidad estandarizado basado en el instrumento **SUS (System Usability Scale)** para recopilar evidencia empírica para la tesis.

### 5.2. Alcance Excluido (Límites éticos y técnicos):
1. **No es un sistema de diagnóstico ni prescripción médica:** Cley no emite diagnósticos clínicos, no prescribe medicamentos ni modifica dosis prescritas por facultativos médicos. Su función es estrictamente de recordatorio y asistencia.
2. **No realiza llamadas telefónicas encubiertas en segundo plano:** Por regulaciones estrictas de seguridad de Google Android relativas al permiso `CALL_PHONE`, la aplicación inicia el marcado mediante `Intent.ACTION_DIAL`, requiriendo que el adulto mayor o su acompañante confirme la pulsación del botón verde de llamada en la interfaz nativa del teléfono.
3. **No expone interfaces de administración técnica al adulto mayor:** Se descarta deliberadamente cualquier opción que exija al abuelo ingresar direcciones IP, puertos de red, claves API o parámetros de bases de datos. Todo el backend y almacenamiento operan de forma transparente e invisible.

