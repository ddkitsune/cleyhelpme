# Cley's HelpMe (Clara) — Asistente Integral para Adultos Mayores

**Proyecto Especial de Grado / Tesis de Ingeniería**  
**Institución Beneficiaria:** Casa De Los Abuelos de Miranda, Venezuela  
**Tecnologías:** React 19, TypeScript, Capacitor 8 (Android Nativo), Python (FastAPI), Google Gemini AI, WCAG 2.1 AAA.

---

## 🏛️ Estructura del Repositorio

```
cley/
├── cley-app/                    # Aplicación Móvil Android Nativa (React 19 + Capacitor 8)
├── cley-backend/                # API REST de Soporte y Métricas (FastAPI + SQLAlchemy + SQLite)
├── DELIMITACIONES_TECNICAS.md   # Delimitaciones y alcance técnico del proyecto de grado
├── DIAGRAMA_ENTIDAD_RELACION.md # Modelo Entidad-Relación y Diccionario de Datos
├── cley-mobile/                 # Prototipo inicial en Expo (referencia histórica)
└── CleyHelpMe/                  # Prototipo web preliminar
```

---

## 📄 Documentación Técnica para la Tesis

* 📐 **[Delimitaciones Técnicas del Proyecto](./DELIMITACIONES_TECNICAS.md):** Requisitos de hardware, sistemas operativos compatibles, alcance funcional y límites éticos.
* 🗄️ **[Diagrama Entidad-Relación y Diccionario de Datos](./DIAGRAMA_ENTIDAD_RELACION.md):** Modelo relacional completo con diagrama Mermaid, entidades, cardinalidades y escalas psicométricas SUS.

---

## 📱 1. cley-app (Aplicación Móvil Android Nativa)

Desarrollada con **React 19**, **TypeScript** y **Capacitor 8**, especialmente diseñada para adultos mayores:

* **Accesibilidad Gerontológica (WCAG 2.1 AAA):** Botones con altura táctil superior a 58px, alto contraste y tipografía *Atkinson Hyperlegible*.
* **Selector Dinámico de Tamaño de Letra:** Permite elegir entre tamaño *Normal (1.0x)*, *Grande (1.25x)* y *Gigante (1.5x)* para personas con presbicia o cataratas.
* **Inteligencia Artificial con Google Gemini:** Asistente interactivo conectado a `gemini-flash-lite-latest` con *system prompt* pedagógico y cariñoso que explica paso por paso sin tecnicismos.
* **Interacción por Voz:**
  * **Speech-to-Text (STT):** Reconocimiento de voz nativo de Android en español para hablarle directamente al asistente.
  * **Text-to-Speech (TTS):** Síntesis de voz a velocidad moderada (0.85x) para escuchar cualquier respuesta o lección en voz alta.
* **Pastillero Persistente:** Control de medicinas del día con lectura auditiva de dosis.
* **Botón de Ayuda SOS:** Marcado telefónico de emergencia con un solo toque hacia el familiar o cuidador designado.
* **Persistencia Offline:** Almacenamiento directo en `Android SharedPreferences`, garantizando que la información nunca se borre sin depender de internet.

---

## ⚙️ 2. cley-backend (API REST y Métricas)

Desarrollado en **Python 3.11+** con **FastAPI** y **SQLAlchemy 2.0**:

* Arquitectura limpia por capas (`app/api/v1/`, `app/core/`, `app/models/`, `app/schemas/`, `app/services/`).
* Base de datos relacional SQLite (`cley_helpme_v2.db`).
* Módulo formal para recolección de encuestas de usabilidad **SUS (System Usability Scale)** para la tesis.
