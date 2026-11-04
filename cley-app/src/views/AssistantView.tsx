import { useState, useEffect } from 'react';
import { CleyAvatar } from '../components/CleyAvatar';
import { SpeechBubble } from '../components/SpeechBubble';
import { ApiService } from '../services/api';
import { VoiceInputService } from '../services/voiceInput';
import { SpeechService } from '../services/speech';
import { AppHeader } from '../components/AppHeader';
import { Send, CheckCircle, RotateCcw, Mic, MicOff, Sparkles } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const SUGGESTIONS = [
  '¿Cómo envío un audio por WhatsApp?',
  '¿Cómo tomo una buena foto con la cámara?',
  '¿Cómo hago una llamada telefónica?',
  '¿Cómo pongo música en YouTube?',
];

export default function AssistantView({ onBack }: Props) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [modoRespuesta, setModoRespuesta] = useState<string>('gemini_ai');
  const [voiceError, setVoiceError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      VoiceInputService.stopListening();
      SpeechService.stop();
    };
  }, []);

  const handleAsk = async (textToAsk?: string) => {
    const question = (textToAsk || query).trim();
    if (!question) return;

    setVoiceError(null);
    setLoading(true);
    setResponse(null);

    const res = await ApiService.askAssistant(question);
    setLoading(false);
    setResponse(res.respuesta);
    setModoRespuesta(res.modo);
    setQuery('');
  };

  const toggleVoiceInput = async () => {
    setVoiceError(null);

    if (isListening) {
      await VoiceInputService.stopListening();
      setIsListening(false);
      return;
    }

    // Detener cualquier audio previo
    await SpeechService.stop();
    setIsListening(true);

    await VoiceInputService.startListening(
      (recognizedText) => {
        setIsListening(false);
        setQuery(recognizedText);
        // Enviar automáticamente la pregunta hablada al asistente
        handleAsk(recognizedText);
      },
      (errorMsg) => {
        setIsListening(false);
        setVoiceError(errorMsg);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const handleBack = () => {
    SpeechService.stop();
    VoiceInputService.stopListening();
    onBack();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', paddingBottom: 24 }}>
      {/* CABECERA BAJADA Y SÚPER ACCESIBLE */}
      <AppHeader onBack={handleBack} title="🤖 Habla con Cley" />

      {/* Cabecera con Cley */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <CleyAvatar
          size={90}
          mood={isListening ? 'listening' : loading ? 'listening' : response ? 'speaking' : 'happy'}
        />
        <div style={{ flex: 1, backgroundColor: '#FFFFFF', padding: '14px 16px', borderRadius: 18, border: '2px solid #CBD5E1' }}>
          <p className="text-scaled-body" style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>
            {loading
              ? 'Pensando tu respuesta con mucho cariño...'
              : isListening
              ? 'Te estoy escuchando... Habla con tranquilidad.'
              : response
              ? 'Aquí tienes la explicación paso a paso:'
              : '¡Hola! Presiona el botón del micrófono y habla con confianza.'}
          </p>
        </div>
      </div>

      {/* ESTADO DE CARGA: PENSANDO CON GEMINI */}
      {loading && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 22,
            padding: 24,
            border: '2px solid #FDBA74',
            textAlign: 'center',
            boxShadow: '0 4px 14px rgba(217, 72, 15, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            margin: '12px 0',
          }}
        >
          <div style={{ fontSize: 40 }}>⏳</div>
          <span
            style={{
              fontSize: 'calc(20px * var(--font-scale, 1))',
              fontWeight: 800,
              color: '#D9480F',
            }}
          >
            Cley está pensando tu respuesta...
          </span>
          <span
            style={{
              fontSize: 'calc(16px * var(--font-scale, 1))',
              color: '#64748B',
              fontWeight: 600,
            }}
          >
            Un momento por favor, ya te lo explico.
          </span>
        </div>
      )}

      {/* CASO 1: SE MOSTRÓ LA RESPUESTA */}
      {!loading && response && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {modoRespuesta === 'gemini_ai' && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                padding: '6px 14px',
                borderRadius: 14,
                fontSize: 'calc(14px * var(--font-scale, 1))',
                fontWeight: 800,
                alignSelf: 'flex-start',
              }}
            >
              <Sparkles size={18} />
              <span>Respuesta Inteligente de Gemini</span>
            </div>
          )}

          <SpeechBubble text={response} autoSpeak={true} />

          <button
            className="btn-outline"
            onClick={() => {
              setResponse(null);
              setQuery('');
              SpeechService.stop();
            }}
            style={{ minHeight: 'calc(62px * var(--font-scale, 1))', borderRadius: 20 }}
          >
            <RotateCcw size={22} />
            <span>Hacer otra pregunta</span>
          </button>
        </div>
      )}

      {/* CASO 2: BOTÓN DE VOZ Y FORMULARIO */}
      {!loading && !response && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* BOTÓN GIGANTE DE HABLAR POR VOZ */}
          <button
            onClick={toggleVoiceInput}
            disabled={loading}
            style={{
              backgroundColor: isListening ? '#DC2626' : '#D9480F',
              color: '#FFFFFF',
              minHeight: 'calc(80px * var(--font-scale, 1))',
              borderRadius: 22,
              padding: '16px 20px',
              fontSize: 'calc(20px * var(--font-scale, 1))',
              fontWeight: 800,
              boxShadow: isListening
                ? '0 0 25px rgba(220, 38, 38, 0.6)'
                : '0 6px 20px rgba(217, 72, 15, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              border: isListening ? '3px solid #FEE2E2' : 'none',
            }}
          >
            {isListening ? (
              <>
                <MicOff size={34} />
                <span>Escuchando... Toca para detener</span>
              </>
            ) : (
              <>
                <Mic size={34} />
                <span>Toca aquí para hablar con Cley</span>
              </>
            )}
          </button>

          {voiceError && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                borderRadius: 14,
                padding: '12px 14px',
                border: '1.5px solid #FCA5A5',
                color: '#B91C1C',
                fontSize: 'calc(15px * var(--font-scale, 1))',
                fontWeight: 600,
              }}
            >
              ⚠️ {voiceError}
            </div>
          )}

          {/* O TAMBIÉN ESCRIBIR */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: 16,
              border: '2px solid #CBD5E1',
            }}
          >
            <label
              style={{
                display: 'block',
                fontSize: 'calc(15px * var(--font-scale, 1))',
                fontWeight: 700,
                color: '#475569',
                marginBottom: 8,
              }}
            >
              O escribe tu pregunta si prefieres teclear:
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                placeholder="Ejemplo: ¿Cómo tomar una foto?"
                disabled={loading || isListening}
                style={{ flex: 1, minHeight: 52 }}
              />
              <button
                className="btn-primary"
                onClick={() => handleAsk()}
                disabled={loading || !query.trim() || isListening}
                style={{ minHeight: 52, padding: '0 16px', borderRadius: 16 }}
              >
                <Send size={22} />
              </button>
            </div>
          </div>

          {/* PREGUNTAS FRECUENTES SUGERIDAS */}
          <div>
            <span
              style={{
                display: 'block',
                fontSize: 'calc(15px * var(--font-scale, 1))',
                fontWeight: 800,
                color: '#475569',
                marginBottom: 8,
              }}
            >
              💡 O toca una de estas preguntas de ejemplo:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(s)}
                  disabled={loading}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: 16,
                    padding: '12px 16px',
                    textAlign: 'left',
                    color: '#0F172A',
                    fontSize: 'calc(16px * var(--font-scale, 1))',
                    fontWeight: 700,
                    minHeight: 'calc(54px * var(--font-scale, 1))',
                    justifyContent: 'flex-start',
                    gap: 10,
                  }}
                >
                  <CheckCircle size={20} color="#D9480F" style={{ flexShrink: 0 }} />
                  <span>{s}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
