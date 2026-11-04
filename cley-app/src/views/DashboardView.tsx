import { useState, useEffect } from 'react';
import { CleyAvatar } from '../components/CleyAvatar';
import { FontSizeSelector } from '../components/FontSizeSelector';
import { ApiService, type UserProfile } from '../services/api';
import { Mic, Smartphone, Pill, AlertTriangle, Star, UserCheck } from 'lucide-react';

interface Props {
  onNavigate: (view: string) => void;
}

export const DashboardView = ({ onNavigate }: Props) => {
  const [user, setUser] = useState<UserProfile>(() => ApiService.getStoredProfileSync());

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const loadedUser = await ApiService.getStoredProfile();
    setUser(loadedUser);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', paddingBottom: 28 }}>
      {/* 1. SELECTOR DE TAMAÑO DE LETRA (Visible, cómodo y bien bajado) */}
      <FontSizeSelector />

      {/* 2. AVATAR Y SALUDO PERSONALIZADO */}
      <div style={{ textAlign: 'center', margin: '8px 0 18px 0' }}>
        <CleyAvatar size={110} />
        <h1 className="text-scaled-title" style={{ color: '#0F172A', margin: '12px 0 4px 0' }}>
          ¡Hola, {user.nombre}!
        </h1>
        <p className="text-scaled-body" style={{ color: '#475569', margin: 0 }}>
          ¿Qué te gustaría hacer hoy?
        </p>
      </div>

      {/* 3. BOTONES PRINCIPALES DE ACCIÓN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Botón 1: Hablar con Cley (IA y Voz) */}
        <button
          className="btn-primary"
          onClick={() => onNavigate('assistant')}
          style={{ minHeight: 'calc(76px * var(--font-scale, 1))', borderRadius: 22 }}
        >
          <Mic size={32} />
          <span>Hablar con Cley (Voz e IA)</span>
        </button>

        {/* Botón 2: Lecciones Prácticas de Apps */}
        <button
          className="btn-primary"
          onClick={() => onNavigate('lessons')}
          style={{ minHeight: 'calc(76px * var(--font-scale, 1))', borderRadius: 22 }}
        >
          <Smartphone size={32} />
          <span>Aprender a usar mis Apps</span>
        </button>

        {/* Fila de Cuidados: Pastillas y SOS */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => onNavigate('medications')}
            style={{
              flex: 1,
              backgroundColor: '#0284C7',
              color: '#FFFFFF',
              minHeight: 'calc(70px * var(--font-scale, 1))',
              borderRadius: 20,
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
            }}
          >
            <Pill size={28} color="#FFFFFF" strokeWidth={2.5} />
            <span style={{ color: '#FFFFFF', fontWeight: 800 }}>Mis Pastillas</span>
          </button>

          <button
            className="btn-danger"
            onClick={() => onNavigate('sos')}
            style={{
              flex: 1,
              minHeight: 'calc(70px * var(--font-scale, 1))',
              borderRadius: 20,
            }}
          >
            <AlertTriangle size={26} />
            <span>Ayuda SOS</span>
          </button>
        </div>

        {/* Evaluación de Usabilidad */}
        <button
          className="btn-outline"
          onClick={() => onNavigate('evaluation')}
          style={{ marginTop: 6, minHeight: 'calc(60px * var(--font-scale, 1))', borderRadius: 20 }}
        >
          <Star size={24} />
          <span>¿Cómo te pareció la app? (Evaluar)</span>
        </button>

        {/* Cambiar nombre o datos personales si lo desean */}
        <button
          onClick={() => onNavigate('onboarding')}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748B',
            minHeight: 46,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 4,
          }}
        >
          <UserCheck size={20} />
          <span style={{ fontSize: 'calc(15px * var(--font-scale, 1))', textDecoration: 'underline' }}>
            Cambiar mi nombre o edad ({user.nombre}, {user.edad} años)
          </span>
        </button>
      </div>
    </div>
  );
};
