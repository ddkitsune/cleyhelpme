import { StorageService } from './storage';

export interface UserProfile {
  nombre: string;
  edad: number;
  dificultad_tecnologica: boolean;
}

export interface MedicationItem {
  id: number;
  medicamento: string;
  hora: string;
  instruccion: string;
  activo: boolean;
}

export interface EmergencyContact {
  id: number;
  nombre_contacto: string;
  telefono: string;
  parentesco: string;
}

const STORAGE_KEYS = {
  USER: 'cley_user_profile',
  MEDS: 'cley_medications',
  SOS: 'cley_emergency_contact',
  EVALS: 'cley_evaluations',
};

// La API Key se inyecta de forma segura mediante variables de entorno en tiempo de compilacion
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Modelos ordenados por disponibilidad y estabilidad garantizada con esta clave
const CANDIDATE_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite',
  'gemini-flash-latest',
];

export class ApiService {
  private static cachedUser: UserProfile = {
    nombre: 'Amigo',
    edad: 70,
    dificultad_tecnologica: true,
  };

  /**
   * Carga el perfil del usuario desde el almacenamiento interno de Android.
   */
  static async initialize(): Promise<void> {
    const user = await StorageService.get<UserProfile>(STORAGE_KEYS.USER, {
      nombre: 'Amigo',
      edad: 70,
      dificultad_tecnologica: true,
    });
    this.cachedUser = user;
  }

  // ==========================================
  // PERFIL DE USUARIO (PERSISTENCIA TOTAL EN ANDROID)
  // ==========================================

  static getStoredProfileSync(): UserProfile {
    return this.cachedUser;
  }

  static async getStoredProfile(): Promise<UserProfile> {
    const user = await StorageService.get<UserProfile>(STORAGE_KEYS.USER, this.cachedUser);
    this.cachedUser = user;
    return user;
  }

  static async saveProfile(profile: UserProfile): Promise<boolean> {
    this.cachedUser = profile;
    await StorageService.set(STORAGE_KEYS.USER, profile);
    await StorageService.set('cley_onboarding_completed', true);
    return true;
  }

  // ==========================================
  // CONSULTA INTELIGENTE A GOOGLE GEMINI AI
  // ==========================================

  static async askAssistant(pregunta: string): Promise<{ respuesta: string; modo: string }> {
    const user = await this.getStoredProfile();

    // Prompt pedagógico gerontológico especializado para adultos mayores
    const prompt = `Eres Cley, un asistente de inteligencia artificial sumamente cariñoso, paciente, respetuoso y pedagógico para personas mayores en Venezuela (especialmente para la Casa de los Abuelos de Miranda).
El usuario con el que estás hablando se llama "${user.nombre}", tiene ${user.edad} años ${user.dificultad_tecnologica ? 'y se le dificulta usar la tecnología' : ''}.

Instrucciones estrictas para tu respuesta:
1. Responde SIEMPRE en español con tono cálido, familiar y afectuoso (trátalo siempre por su nombre "${user.nombre}").
2. Si te pregunta cómo realizar una tarea en el teléfono (por ejemplo: enviar un audio en WhatsApp, tomar una foto, hacer una llamada, ver música en YouTube, cambiar el volumen, etc.), explica paso por paso de forma muy clara y sencilla:
   - Paso 1: ...
   - Paso 2: ...
   - Paso 3: ...
3. Prohibido usar palabras técnicas en inglés o conceptos complejos (nada de "settings", "download", "tap", "swipe"). Usa "toca con tu dedo", "busca el dibujo", "pulsa el botón".
4. Mantén la respuesta concisa (máximo 3 o 4 párrafos cortos o pasos) para que sea muy fácil de leer en pantalla y se escuche amigable cuando se narre en voz alta.
5. Si te pregunta algo de la vida, salud cotidiana o simplemente te saluda o quiere conversar, responde con mucha ternura, sabiduría y ánimo positivo.

Pregunta del adulto mayor: "${pregunta}"`;

    let lastError = '';

    // Intentamos con la lista de modelos candidatos de Google Gemini
    for (const modelName of CANDIDATE_MODELS) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 14000);

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ]
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (texto && texto.trim()) {
            return {
              respuesta: texto.trim(),
              modo: 'gemini_ai',
            };
          }
        } else {
          lastError = `Status ${res.status}`;
          console.warn(`[Gemini ${modelName} returned status ${res.status}, probando siguiente modelo]`);
        }
      } catch (e: any) {
        lastError = e?.message || 'Error de conexión';
        console.warn(`[Gemini ${modelName} excepción]:`, e);
      }
    }

    // Si fallaron los modelos de Google, verificamos si es por falta de internet
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return {
        respuesta: `Hola mi querido ${user.nombre}. Parece que tu teléfono no tiene conexión a internet en este momento. Revisa si tienes el Wi-Fi o tus datos encendidos para que podamos conversar. ¡Aquí te espero con mucho cariño!`,
        modo: 'offline_notice',
      };
    }

    // Si hay internet pero Google está temporalmente saturado:
    return {
      respuesta: `Hola mi querido ${user.nombre}. Cley está experimentando un momento de alta demanda en sus servidores (${lastError}). Por favor espera unos segundos y vuelve a preguntarme, ¡estoy para ayudarte!`,
      modo: 'busy_notice',
    };
  }

  // ==========================================
  // PASTILLERO (PERSISTENTE EN MEMORIA DEL TELÉFONO)
  // ==========================================

  static async getMedications(): Promise<MedicationItem[]> {
    const defaults: MedicationItem[] = [
      { id: 1, medicamento: 'Pastilla de la Tensión (Losartán)', hora: '08:00 AM', instruccion: 'Tomar con un vaso de agua después del desayuno', activo: true },
      { id: 2, medicamento: 'Complejo Vitamínico B', hora: '01:00 PM', instruccion: 'Tomar junto con el almuerzo', activo: true },
      { id: 3, medicamento: 'Calcio / Vitamina D', hora: '08:00 PM', instruccion: 'Tomar antes de dormir', activo: true },
    ];

    return await StorageService.get<MedicationItem[]>(STORAGE_KEYS.MEDS, defaults);
  }

  static async addMedication(med: { medicamento: string; hora: string; instruccion: string }): Promise<void> {
    const list = await this.getMedications();
    const newItem: MedicationItem = {
      id: Date.now(),
      medicamento: med.medicamento,
      hora: med.hora,
      instruccion: med.instruccion,
      activo: true,
    };
    list.push(newItem);
    await StorageService.set(STORAGE_KEYS.MEDS, list);
  }

  // ==========================================
  // CONTACTO SOS (PERSISTENTE EN MEMORIA DEL TELÉFONO)
  // ==========================================

  static async getEmergencyContact(): Promise<EmergencyContact> {
    const defaultContact: EmergencyContact = {
      id: 1,
      nombre_contacto: 'Hija María (Contacto de Emergencia)',
      telefono: '+58 414 123 4567',
      parentesco: 'Hija Mayor',
    };

    return await StorageService.get<EmergencyContact>(STORAGE_KEYS.SOS, defaultContact);
  }

  static async saveEmergencyContact(contact: { nombre_contacto: string; telefono: string; parentesco: string }): Promise<void> {
    const updated: EmergencyContact = { id: 1, ...contact };
    await StorageService.set(STORAGE_KEYS.SOS, updated);
  }

  // ==========================================
  // EVALUACIONES Y MÉTRICAS DE TESIS
  // ==========================================

  static async saveEvaluation(leccion: string, fueDeAyuda: boolean): Promise<void> {
    const user = await this.getStoredProfile();
    const current = await StorageService.get<Array<{ usuario: string; leccion: string; fueDeAyuda: boolean; fecha: string }>>(
      STORAGE_KEYS.EVALS,
      []
    );
    current.push({
      usuario: user.nombre,
      leccion: leccion,
      fueDeAyuda: fueDeAyuda,
      fecha: new Date().toISOString(),
    });
    await StorageService.set(STORAGE_KEYS.EVALS, current);
  }
}
