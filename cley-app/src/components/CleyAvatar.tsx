interface Props {
  size?: number;
  mood?: 'happy' | 'listening' | 'speaking';
}

export const CleyAvatar = ({ size = 120, mood = 'happy' }: Props) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#FFE8CC',
        border: '3px solid #D9480F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        margin: '12px auto',
        boxShadow: '0 4px 12px rgba(217, 72, 15, 0.2)',
      }}
    >
      <svg viewBox="0 0 100 100" width={size * 0.75} height={size * 0.75}>
        {/* Cabello castaño */}
        <circle cx="50" cy="46" r="34" fill="#4A2C1D" />
        {/* Rostro cálido */}
        <circle cx="50" cy="50" r="30" fill="#FAD4B8" />
        {/* Mejillas sonrosadas */}
        <ellipse cx="36" cy="58" rx="5" ry="3" fill="#F4978E" opacity="0.6" />
        <ellipse cx="64" cy="58" rx="5" ry="3" fill="#F4978E" opacity="0.6" />
        {/* Ojos */}
        <circle cx="40" cy="48" r="5" fill="#3B2214" />
        <circle cx="60" cy="48" r="5" fill="#3B2214" />
        <circle cx="38" cy="46" r="1.5" fill="#FFFFFF" />
        <circle cx="58" cy="46" r="1.5" fill="#FFFFFF" />
        {/* Lentes amigables */}
        <rect x="29" y="41" width="22" height="15" rx="5" fill="none" stroke="#2D1B12" strokeWidth="3" />
        <rect x="49" y="41" width="22" height="15" rx="5" fill="none" stroke="#2D1B12" strokeWidth="3" />
        <line x1="46" y1="48" x2="52" y2="48" stroke="#2D1B12" strokeWidth="3" />
        {/* Sonrisa */}
        <path d="M43 64 Q50 72 57 64" fill="none" stroke="#D9480F" strokeWidth="3" strokeLinecap="round" />
      </svg>

      {mood === 'speaking' && (
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: '#15803D',
            color: '#FFFFFF',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            border: '2px solid #FFFFFF',
          }}
        >
          🔊
        </span>
      )}
    </div>
  );
};
