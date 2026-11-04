import { useState, type ReactNode } from 'react';
import { SpeechBubble } from '../components/SpeechBubble';
import { ApiService } from '../services/api';
import { AppHeader } from '../components/AppHeader';
import { ArrowRight, CheckCircle, Lightbulb, MessageCircle, Camera, Phone, Play } from 'lucide-react';

interface Props {
  onBack: () => void;
}

interface Lesson {
  id: string;
  title: string;
  icon: ReactNode;
  color: string;
  steps: { instruction: string; visualTip: string }[];
}

const LESSONS: Lesson[] = [
  {
    id: 'whatsapp',
    title: 'Enviar Audio en WhatsApp',
    icon: <MessageCircle size={32} color="#FFFFFF" />,
    color: '#25D366',
    steps: [
      {
        instruction: 'Abre la conversación con tu hijo o familiar tocando sobre su nombre.',
        visualTip: 'Toca sobre la persona en la lista verde de chats.'
      },
      {
        instruction: 'Mantén presionado con tu dedo el botón redondo verde con el dibujo de un micrófono abajo a la derecha.',
        visualTip: 'No lo sueltes mientras estés hablando.'
      },
      {
        instruction: 'Habla con calma y suelta el botón cuando termines para que el audio se envíe.',
        visualTip: '¡Listo! Verás el mensaje de voz en la pantalla.'
      }
    ]
  },
  {
    id: 'camera',
    title: 'Tomar una Buena Foto',
    icon: <Camera size={32} color="#FFFFFF" />,
    color: '#3B82F6',
    steps: [
      {
        instruction: 'Busca y toca el icono de la Cámara en tu teléfono.',
        visualTip: 'Tiene el dibujo de una cámara fotográfica.'
      },
      {
        instruction: 'Sostén el teléfono firme con ambas manos y apunta hacia lo que deseas retratar.',
        visualTip: 'Intenta no moverte para que la foto no salga borrosa.'
      },
      {
        instruction: 'Toca suavemente el círculo blanco grande que está abajo en el centro.',
        visualTip: 'Escucharás el sonido del obturador y la foto se guardará.'
      }
    ]
  },
  {
    id: 'call',
    title: 'Hacer una Llamada Telefónica',
    icon: <Phone size={32} color="#FFFFFF" />,
    color: '#10B981',
    steps: [
      {
        instruction: 'Toca el icono verde del auricular del teléfono en la parte inferior.',
        visualTip: 'Suele estar abajo en la fila principal.'
      },
      {
        instruction: 'Toca la pestaña que dice "Contactos" arriba o abajo y busca a tu ser querido.',
        visualTip: 'Están ordenados por orden alfabético.'
      },
      {
        instruction: 'Toca sobre su nombre y luego pulsa el botón verde para llamar.',
        visualTip: 'Lleva el teléfono a tu oreja para escuchar el timbre.'
      }
    ]
  },
  {
    id: 'youtube',
    title: 'Escuchar Música en YouTube',
    icon: <Play size={32} color="#FFFFFF" />,
    color: '#EF4444',
    steps: [
      {
        instruction: 'Abre la aplicación roja de YouTube.',
        visualTip: 'Tiene un triángulo blanco adentro de un rectángulo rojo.'
      },
      {
        instruction: 'Toca el dibujo de la lupa arriba a la derecha y escribe tu canción favorita.',
        visualTip: 'Por ejemplo: "Boleros del recuerdo".'
      },
      {
        instruction: 'Toca el primer video de la lista para que empiece a sonar la música.',
        visualTip: 'Puedes ajustar el volumen con los botones en el costado del teléfono.'
      }
    ]
  }
];

export const LessonsView: React.FC<Props> = ({ onBack }) => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const startLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (!activeLesson) return;
    if (currentStep < activeLesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      ApiService.saveEvaluation(activeLesson.title, true);
      setActiveLesson(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', paddingBottom: 24 }}>
      {/* CABECERA BAJADA Y SÚPER ACCESIBLE */}
      <AppHeader
        onBack={activeLesson ? () => setActiveLesson(null) : onBack}
        title={activeLesson ? activeLesson.title : "📖 Lecciones Prácticas"}
      />

      {!activeLesson ? (
        <>
          <p className="text-scaled-body" style={{ margin: '0 0 16px 0', color: '#475569' }}>
            Selecciona la actividad que deseas aprender a realizar paso a paso:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {LESSONS.map((l) => (
              <button
                key={l.id}
                onClick={() => startLesson(l)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 22,
                  padding: 16,
                  border: '2px solid #CBD5E1',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  textAlign: 'left',
                  minHeight: 'calc(76px * var(--font-scale, 1))',
                }}
              >
                <div
                  style={{
                    backgroundColor: l.color,
                    borderRadius: 16,
                    padding: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {l.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h2
                    style={{
                      fontSize: 'calc(19px * var(--font-scale, 1))',
                      margin: '0 0 4px 0',
                      color: '#0F172A',
                      fontWeight: 800,
                    }}
                  >
                    {l.title}
                  </h2>
                  <span
                    style={{
                      fontSize: 'calc(14px * var(--font-scale, 1))',
                      color: '#64748B',
                      fontWeight: 600,
                    }}
                  >
                    {l.steps.length} pasos sencillos con voz
                  </span>
                </div>
                <ArrowRight size={24} color="#CBD5E1" />
              </button>
            ))}
          </div>
        </>
      ) : (
        /* PANTALLA DE PASO A PASO */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Indicador de progreso */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              padding: '10px 16px',
              borderRadius: 14,
              border: '1.5px solid #E2E8F0',
            }}
          >
            <span style={{ fontSize: 'calc(16px * var(--font-scale, 1))', fontWeight: 800, color: '#D9480F' }}>
              Paso {currentStep + 1} de {activeLesson.steps.length}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {activeLesson.steps.map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: idx === currentStep ? '#D9480F' : idx < currentStep ? '#15803D' : '#E2E8F0',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Globo parlante de Cley con voz automática */}
          <SpeechBubble
            text={activeLesson.steps[currentStep].instruction}
            autoSpeak={true}
          />

          {/* Tarjeta de Consejo Visual */}
          <div
            style={{
              backgroundColor: '#FFFBEB',
              borderRadius: 20,
              padding: 16,
              border: '2px solid #FDE68A',
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}
          >
            <Lightbulb size={28} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <span
                style={{
                  display: 'block',
                  fontSize: 'calc(14px * var(--font-scale, 1))',
                  fontWeight: 800,
                  color: '#92400E',
                  textTransform: 'uppercase',
                  marginBottom: 2,
                }}
              >
                Pista en pantalla:
              </span>
              <p
                style={{
                  fontSize: 'calc(17px * var(--font-scale, 1))',
                  color: '#78350F',
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                {activeLesson.steps[currentStep].visualTip}
              </p>
            </div>
          </div>

          {/* Botón Siguiente / Terminar */}
          <button
            className={currentStep < activeLesson.steps.length - 1 ? 'btn-primary' : 'btn-success'}
            onClick={handleNextStep}
            style={{
              minHeight: 'calc(68px * var(--font-scale, 1))',
              borderRadius: 20,
              marginTop: 10,
              fontSize: 'calc(20px * var(--font-scale, 1))',
            }}
          >
            {currentStep < activeLesson.steps.length - 1 ? (
              <>
                <span>Siguiente Paso</span>
                <ArrowRight size={24} />
              </>
            ) : (
              <>
                <CheckCircle size={26} />
                <span>¡Entendido! Completar</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
