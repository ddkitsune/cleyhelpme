import { useState, useEffect } from 'react';
import { SpeechService } from '../services/speech';
import { Volume2, Pause } from 'lucide-react';

interface Props {
  text: string;
  autoSpeak?: boolean;
}

export const SpeechBubble = ({ text, autoSpeak = false }: Props) => {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (autoSpeak) {
      SpeechService.speak(text, () => setSpeaking(false));
      setSpeaking(true);
    }
    return () => {
      SpeechService.stop();
    };
  }, [text]);

  const toggleSpeak = () => {
    if (speaking) {
      SpeechService.stop();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      SpeechService.speak(text, () => setSpeaking(false));
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        border: '2px solid #CBD5E1',
        padding: '18px 20px',
        margin: '12px 0',
        boxShadow: '0 3px 10px rgba(0,0,0,0.06)',
      }}
    >
      <p
        style={{
          fontSize: 'calc(20px * var(--font-scale, 1))',
          lineHeight: 1.55,
          color: '#0F172A',
          margin: '0 0 14px 0',
          fontWeight: 600,
          whiteSpace: 'pre-line', // Para que los saltos de línea de los pasos de Gemini se lean ordenados
        }}
      >
        {text}
      </p>

      <button
        onClick={toggleSpeak}
        style={{
          backgroundColor: speaking ? '#DCFCE7' : '#FFE8CC',
          color: speaking ? '#15803D' : '#B83A09',
          border: '1.5px solid #FDBA74',
          padding: '10px 18px',
          borderRadius: 20,
          fontSize: 'calc(16px * var(--font-scale, 1))',
          fontWeight: 800,
          minHeight: 'calc(48px * var(--font-scale, 1))',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
        }}
      >
        {speaking ? <Pause size={22} /> : <Volume2 size={22} />}
        <span>{speaking ? 'Pausar lectura' : 'Escuchar en voz alta'}</span>
      </button>
    </div>
  );
};
