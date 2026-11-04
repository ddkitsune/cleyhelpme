import { useState, useEffect } from 'react';
import { CleyAvatar } from '../components/CleyAvatar';
import { SpeechBubble } from '../components/SpeechBubble';
import { ApiService } from '../services/api';
import { StorageService } from '../services/storage';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const OnboardingView = ({ onComplete }: Props) => {
  const [step, setStep] = useState<'nombre' | 'edad' | 'dificultad'>('nombre');
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');

  useEffect(() => {
    const loadExisting = async () => {
      const p = await ApiService.getStoredProfile();
      if (p.nombre && p.nombre !== 'Amigo') {
        setNombre(p.nombre);
      }
      if (p.edad) {
        setEdad(p.edad.toString());
      }
    };
    loadExisting();
  }, []);

  const handleNextNombre = () => {
    if (!nombre.trim()) {
      alert("Por favor, escribe tu nombre para saber cómo llamarte con cariño.");
      return;
    }
    setStep('edad');
  };

  const handleNextEdad = () => {
    const edadNum = parseInt(edad);
    if (!edad || isNaN(edadNum) || edadNum < 1 || edadNum > 120) {
      alert("Por favor, indica tu edad en números (por ejemplo: 72).");
      return;
    }
    setStep('dificultad');
  };

  const handleFinish = async (tieneDificultad: boolean) => {
    await ApiService.saveProfile({
      nombre: nombre.trim(),
      edad: parseInt(edad) || 70,
      dificultad_tecnologica: tieneDificultad,
    });
    await StorageService.set('cley_onboarding_completed', true);
    onComplete();
  };

  return (
    <div style={{ padding: '16px 4px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ textAlign: 'center', margin: '8px 0 16px 0' }}>
        <CleyAvatar size={105} />
      </div>

      {step === 'nombre' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 22, border: '2px solid #CBD5E1', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
          <SpeechBubble text="¡Hola! Soy Cley y estoy aquí para facilitarte el uso de tu teléfono. Primero dime, ¿cómo te llamas?" autoSpeak={true} />
          
          <h2 className="text-scaled-heading" style={{ margin: '16px 0 8px 0' }}>
            1. Escribe tu nombre aquí:
          </h2>
          <input
            type="text"
            placeholder="Ejemplo: Carmen"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoFocus
            style={{ margin: '14px 0 20px 0' }}
          />
          <button className="btn-primary" onClick={handleNextNombre} style={{ width: '100%', minHeight: 64 }}>
            <span>Siguiente</span>
            <ArrowRight size={24} />
          </button>
        </div>
      )}

      {step === 'edad' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 22, border: '2px solid #CBD5E1', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
          <SpeechBubble text={`¡Mucho gusto, ${nombre}! Ahora cuéntame, ¿cuántos años tienes?`} autoSpeak={true} />
          
          <h2 className="text-scaled-heading" style={{ margin: '16px 0 8px 0' }}>
            2. Tu edad:
          </h2>
          <input
            type="number"
            placeholder="Ejemplo: 72"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            autoFocus
            style={{ margin: '14px 0 20px 0' }}
          />
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-outline" onClick={() => setStep('nombre')} style={{ flex: 1, minHeight: 60 }}>
              <ArrowLeft size={22} />
              <span>Atrás</span>
            </button>
            <button className="btn-primary" onClick={handleNextEdad} style={{ flex: 1, minHeight: 60 }}>
              <span>Siguiente</span>
              <ArrowRight size={22} />
            </button>
          </div>
        </div>
      )}

      {step === 'dificultad' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 22, border: '2px solid #CBD5E1', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
          <SpeechBubble text="Una última pregunta para ayudarte mejor: ¿Sientes que se te hace difícil o complicado usar este teléfono?" autoSpeak={true} />
          
          <h2 className="text-scaled-heading" style={{ margin: '16px 0 8px 0' }}>
            3. ¿Se te dificulta usar tu teléfono?
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '20px 0' }}>
            <button className="btn-primary" onClick={() => handleFinish(true)} style={{ minHeight: 68 }}>
              <span>SÍ, se me hace difícil</span>
            </button>
            <button className="btn-success" onClick={() => handleFinish(false)} style={{ minHeight: 68 }}>
              <span>NO, me defiendo bien</span>
            </button>
          </div>
          
          <button className="btn-outline" onClick={() => setStep('edad')} style={{ width: '100%', minHeight: 56 }}>
            <ArrowLeft size={22} />
            <span>Retroceder</span>
          </button>
        </div>
      )}
    </div>
  );
};
