import { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';

const FONT_SIZE_KEY = 'cley_font_scale';

export type FontSizeLevel = 'normal' | 'grande' | 'gigante';

export const FontSizeSelector = () => {
  const [currentSize, setCurrentSize] = useState<FontSizeLevel>('normal');

  useEffect(() => {
    loadSavedSize();
  }, []);

  const loadSavedSize = async () => {
    const saved = await StorageService.get<FontSizeLevel>(FONT_SIZE_KEY, 'normal');
    applySize(saved);
  };

  const applySize = (size: FontSizeLevel) => {
    setCurrentSize(size);
    document.body.classList.remove('font-normal', 'font-grande', 'font-gigante');
    document.body.classList.add(`font-${size}`);

    const scale = size === 'gigante' ? '1.5' : size === 'grande' ? '1.25' : '1';
    document.documentElement.style.setProperty('--font-scale', scale);
    StorageService.set(FONT_SIZE_KEY, size);
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        border: '2px solid #CBD5E1',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        margin: '6px 0 16px 0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 'calc(17px * var(--font-scale, 1))', fontWeight: 800, color: '#0F172A' }}>
          👓 Tamaño de la Letra:
        </span>
        <span style={{ fontSize: 'calc(14px * var(--font-scale, 1))', color: '#64748B', fontWeight: 600 }}>
          {currentSize === 'normal' ? 'Normal' : currentSize === 'grande' ? 'Grande' : 'Gigante'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => applySize('normal')}
          style={{
            flex: 1,
            minHeight: 50,
            padding: '6px 8px',
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 800,
            backgroundColor: currentSize === 'normal' ? '#D9480F' : '#F8FAFC',
            color: currentSize === 'normal' ? '#FFFFFF' : '#334155',
            border: currentSize === 'normal' ? '2.5px solid #B83A09' : '1.5px solid #CBD5E1',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
          title="Tamaño Normal"
        >
          <span style={{ fontSize: 18, fontWeight: 900 }}>A</span>
          <span style={{ fontSize: 12, fontWeight: 700 }}>Normal</span>
        </button>

        <button
          onClick={() => applySize('grande')}
          style={{
            flex: 1,
            minHeight: 50,
            padding: '6px 8px',
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 800,
            backgroundColor: currentSize === 'grande' ? '#D9480F' : '#F8FAFC',
            color: currentSize === 'grande' ? '#FFFFFF' : '#334155',
            border: currentSize === 'grande' ? '2.5px solid #B83A09' : '1.5px solid #CBD5E1',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
          title="Tamaño Grande"
        >
          <span style={{ fontSize: 21, fontWeight: 900 }}>A+</span>
          <span style={{ fontSize: 12, fontWeight: 700 }}>Grande</span>
        </button>

        <button
          onClick={() => applySize('gigante')}
          style={{
            flex: 1,
            minHeight: 50,
            padding: '6px 8px',
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 800,
            backgroundColor: currentSize === 'gigante' ? '#D9480F' : '#F8FAFC',
            color: currentSize === 'gigante' ? '#FFFFFF' : '#334155',
            border: currentSize === 'gigante' ? '2.5px solid #B83A09' : '1.5px solid #CBD5E1',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
          title="Tamaño Gigante"
        >
          <span style={{ fontSize: 24, fontWeight: 900 }}>A++</span>
          <span style={{ fontSize: 12, fontWeight: 700 }}>Gigante</span>
        </button>
      </div>
    </div>
  );
};
