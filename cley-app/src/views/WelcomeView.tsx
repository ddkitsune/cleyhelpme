import { CleyAvatar } from '../components/CleyAvatar';
import { MessageSquare, Mic, Heart, ArrowRight } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export const WelcomeView = ({ onStart }: Props) => {
  return (
    <div style={{ padding: '16px 4px', display: 'flex', flexDirection: 'column', minHeight: '100%', justifyContent: 'space-between' }}>
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <CleyAvatar size={130} />
        <h1 className="text-scaled-title" style={{ color: '#D9480F', margin: '16px 0 8px 0' }}>
          ¡Bienvenido a<br />Cley's HelpMe!
        </h1>
        <p className="text-scaled-body" style={{ color: '#334155', lineHeight: 1.5, margin: '8px 0 0 0' }}>
          Tu asistente personal y cariñoso para aprender a usar tu teléfono inteligente sin complicaciones.
        </p>
      </div>

      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 22,
          padding: 20,
          border: '2px solid #CBD5E1',
          margin: '20px 0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '14px 0' }}>
          <div style={{ backgroundColor: '#FFE8CC', padding: 8, borderRadius: 12 }}>
            <MessageSquare size={26} color="#D9480F" />
          </div>
          <span style={{ fontSize: 'calc(17px * var(--font-scale, 1))', fontWeight: 700, color: '#0F172A' }}>
            Aprende a tu propio ritmo
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '14px 0' }}>
          <div style={{ backgroundColor: '#FFE8CC', padding: 8, borderRadius: 12 }}>
            <Mic size={26} color="#D9480F" />
          </div>
          <span style={{ fontSize: 'calc(17px * var(--font-scale, 1))', fontWeight: 700, color: '#0F172A' }}>
            Háblale o escúchalo en voz alta
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '14px 0' }}>
          <div style={{ backgroundColor: '#FFE8CC', padding: 8, borderRadius: 12 }}>
            <Heart size={26} color="#D9480F" />
          </div>
          <span style={{ fontSize: 'calc(17px * var(--font-scale, 1))', fontWeight: 700, color: '#0F172A' }}>
            Tus pastillas y botón de ayuda SOS
          </span>
        </div>
      </div>

      <div>
        <button
          className="btn-primary"
          onClick={onStart}
          style={{
            width: '100%',
            fontSize: 'calc(22px * var(--font-scale, 1))',
            minHeight: 'calc(68px * var(--font-scale, 1))',
            borderRadius: 22,
          }}
        >
          <span>Empezar</span>
          <ArrowRight size={26} />
        </button>
      </div>
    </div>
  );
};
