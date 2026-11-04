import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface AppHeaderProps {
  title?: string;
  onBack: () => void;
  accentColor?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  onBack,
  accentColor = '#D9480F',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        marginBottom: 18,
        marginTop: 6, // Margen extra para estar bien separado del notch/cámara de Android
      }}
    >
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          backgroundColor: '#FFFFFF',
          border: '2px solid #CBD5E1',
          borderRadius: 20,
          padding: '12px 18px',
          minHeight: 'calc(58px * var(--font-scale, 1))',
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.07)',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
          transition: 'transform 0.1s ease, background-color 0.1s ease',
        }}
        aria-label="Volver al Menú Principal"
      >
        <div
          style={{
            backgroundColor: `${accentColor}18`,
            borderRadius: 14,
            padding: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={26} color={accentColor} strokeWidth={2.6} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 'calc(19px * var(--font-scale, 1))',
              fontWeight: 800,
              color: '#0F172A',
              lineHeight: 1.2,
            }}
          >
            Volver al Menú Principal
          </span>
          <span
            style={{
              fontSize: 'calc(14px * var(--font-scale, 1))',
              color: '#64748B',
              fontWeight: 600,
            }}
          >
            Toca aquí para retroceder
          </span>
        </div>
      </button>

      {title && (
        <h1
          style={{
            fontSize: 'calc(25px * var(--font-scale, 1))',
            margin: '6px 0 0 0',
            color: '#0F172A',
            fontWeight: 800,
            lineHeight: 1.25,
          }}
        >
          {title}
        </h1>
      )}
    </div>
  );
};

