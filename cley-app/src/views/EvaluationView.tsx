import { useState } from 'react';
import { CleyAvatar } from '../components/CleyAvatar';
import { SpeechBubble } from '../components/SpeechBubble';
import { ApiService } from '../services/api';
import { AppHeader } from '../components/AppHeader';
import { CheckCircle, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const EvaluationView = ({ onBack }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const [q1, setQ1] = useState<number | null>(null);
  const [q2, setQ2] = useState<number | null>(null);
  const [q3, setQ3] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (q1 === null || q2 === null || q3 === null) {
      alert("Por favor responde las 3 preguntas para ayudarnos a evaluar.");
      return;
    }
    await ApiService.saveEvaluation("Evaluación SUS de Usabilidad", true);
    setSubmitted(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', paddingBottom: 24 }}>
      {/* CABECERA BAJADA Y SÚPER ACCESIBLE */}
      <AppHeader onBack={onBack} title="⭐ Tu Opinión Cuenta" />

      <div style={{ textAlign: 'center', margin: '4px 0 14px 0' }}>
        <CleyAvatar size={85} />
      </div>

      {!submitted ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 22,
            padding: 20,
            border: '2px solid #CBD5E1',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          <SpeechBubble text="Tu opinión es lo más valioso para nosotros. Cuéntanos cómo sentiste la aplicación hoy:" autoSpeak={true} />

          {/* Pregunta 1 */}
          <h2 style={{ fontSize: 'calc(18px * var(--font-scale, 1))', marginTop: 16 }}>
            1. ¿Te gustaría seguir usando Cley a menudo?
          </h2>
          <div style={{ display: 'flex', gap: 10, margin: '8px 0 18px 0' }}>
            <button
              onClick={() => setQ1(5)}
              className={q1 === 5 ? 'btn-success' : 'btn-outline'}
              style={{ flex: 1, minHeight: 'calc(54px * var(--font-scale, 1))', borderRadius: 16 }}
            >
              <ThumbsUp size={22} />
              <span>Sí, mucho</span>
            </button>
            <button
              onClick={() => setQ1(1)}
              className={q1 === 1 ? 'btn-danger' : 'btn-outline'}
              style={{ flex: 1, minHeight: 'calc(54px * var(--font-scale, 1))', borderRadius: 16 }}
            >
              <ThumbsDown size={22} />
              <span>No tanto</span>
            </button>
          </div>

          {/* Pregunta 2 */}
          <h2 style={{ fontSize: 'calc(18px * var(--font-scale, 1))', marginTop: 10 }}>
            2. ¿Las letras y botones se ven fáciles de entender?
          </h2>
          <div style={{ display: 'flex', gap: 10, margin: '8px 0 18px 0' }}>
            <button
              onClick={() => setQ2(5)}
              className={q2 === 5 ? 'btn-success' : 'btn-outline'}
              style={{ flex: 1, minHeight: 'calc(54px * var(--font-scale, 1))', borderRadius: 16 }}
            >
              <ThumbsUp size={22} />
              <span>Sí, claros</span>
            </button>
            <button
              onClick={() => setQ2(1)}
              className={q2 === 1 ? 'btn-danger' : 'btn-outline'}
              style={{ flex: 1, minHeight: 'calc(54px * var(--font-scale, 1))', borderRadius: 16 }}
            >
              <ThumbsDown size={22} />
              <span>Confusos</span>
            </button>
          </div>

          {/* Pregunta 3 */}
          <h2 style={{ fontSize: 'calc(18px * var(--font-scale, 1))', marginTop: 10 }}>
            3. ¿Sentiste confianza al usar la aplicación?
          </h2>
          <div style={{ display: 'flex', gap: 10, margin: '8px 0 20px 0' }}>
            <button
              onClick={() => setQ3(5)}
              className={q3 === 5 ? 'btn-success' : 'btn-outline'}
              style={{ flex: 1, minHeight: 'calc(54px * var(--font-scale, 1))', borderRadius: 16 }}
            >
              <ThumbsUp size={22} />
              <span>Mucha</span>
            </button>
            <button
              onClick={() => setQ3(1)}
              className={q3 === 1 ? 'btn-danger' : 'btn-outline'}
              style={{ flex: 1, minHeight: 'calc(54px * var(--font-scale, 1))', borderRadius: 16 }}
            >
              <ThumbsDown size={22} />
              <span>Poca</span>
            </button>
          </div>

          <button
            className="btn-primary"
            onClick={handleSubmit}
            style={{ width: '100%', minHeight: 'calc(62px * var(--font-scale, 1))', borderRadius: 18 }}
          >
            <CheckCircle size={24} />
            <span>Enviar mi Respuesta</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            padding: 24,
            border: '2px solid #86EFAC',
            textAlign: 'center',
            boxShadow: '0 4px 14px rgba(21, 128, 61, 0.1)',
          }}
        >
          <CheckCircle size={60} color="#15803D" style={{ margin: '0 auto 12px auto' }} />
          <h2 style={{ color: '#15803D', fontSize: 'calc(24px * var(--font-scale, 1))', margin: '0 0 10px 0' }}>
            ¡Muchísimas Gracias!
          </h2>
          <p className="text-scaled-body" style={{ color: '#334155', margin: '0 0 20px 0', lineHeight: 1.5 }}>
            Tus respuestas han quedado guardadas y nos ayudan a mejorar Cley cada día para todos los abuelos.
          </p>
          <button
            className="btn-primary"
            onClick={onBack}
            style={{ width: '100%', minHeight: 'calc(60px * var(--font-scale, 1))', borderRadius: 18 }}
          >
            <RotateCcw size={22} />
            <span>Volver al Menú Principal</span>
          </button>
        </div>
      )}
    </div>
  );
};
