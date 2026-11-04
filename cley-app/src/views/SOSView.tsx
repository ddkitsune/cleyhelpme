import { useState, useEffect } from 'react';
import { ApiService, type EmergencyContact } from '../services/api';
import { AppHeader } from '../components/AppHeader';
import { PhoneCall, Settings, X, Check } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const SOSView: React.FC<Props> = ({ onBack }) => {
  const [contact, setContact] = useState<EmergencyContact | null>(null);
  const [editing, setEditing] = useState(false);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [parentesco, setParentesco] = useState('');

  useEffect(() => {
    loadContact();
  }, []);

  const loadContact = async () => {
    const c = await ApiService.getEmergencyContact();
    setContact(c);
    setNombre(c.nombre_contacto);
    setTelefono(c.telefono);
    setParentesco(c.parentesco);
  };

  const handleCall = () => {
    if (!contact) return;
    const clean = contact.telefono.replace(/\s+/g, '');
    window.location.href = `tel:${clean}`;
  };

  const handleSave = async () => {
    if (!nombre.trim() || !telefono.trim()) {
      alert("Por favor indica el nombre y teléfono del contacto.");
      return;
    }
    await ApiService.saveEmergencyContact({
      nombre_contacto: nombre.trim(),
      telefono: telefono.trim(),
      parentesco: parentesco.trim() || "Familiar",
    });
    setEditing(false);
    loadContact();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', paddingBottom: 24 }}>
      {/* CABECERA BAJADA Y SÚPER ACCESIBLE */}
      <AppHeader onBack={onBack} title="🚨 Botón de Ayuda SOS" accentColor="#DC2626" />

      <div style={{ textAlign: 'center', margin: '4px 0 16px 0' }}>
        <p className="text-scaled-body" style={{ color: '#475569', margin: 0, lineHeight: 1.4 }}>
          Al presionar el botón rojo llamarás de inmediato a tu familiar o cuidador de confianza:
        </p>
      </div>

      {/* TARJETA DEL CONTACTO ACTUAL */}
      {contact && !editing && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 22,
            padding: 20,
            border: '2px solid #FEE2E2',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.08)',
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 'calc(14px * var(--font-scale, 1))',
              fontWeight: 800,
              color: '#DC2626',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {contact.parentesco}
          </div>
          <h2
            style={{
              fontSize: 'calc(24px * var(--font-scale, 1))',
              margin: '8px 0',
              color: '#0F172A',
              fontWeight: 800,
            }}
          >
            {contact.nombre_contacto}
          </h2>
          <div
            style={{
              fontSize: 'calc(22px * var(--font-scale, 1))',
              color: '#1E293B',
              fontWeight: 700,
              backgroundColor: '#F8FAFC',
              padding: '8px 14px',
              borderRadius: 14,
              display: 'inline-block',
              margin: '4px 0 12px 0',
            }}
          >
            {contact.telefono}
          </div>

          <div>
            <button
              onClick={() => setEditing(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                fontSize: 'calc(14px * var(--font-scale, 1))',
                cursor: 'pointer',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                minHeight: 40,
              }}
            >
              <Settings size={18} />
              <span>Cambiar número de contacto</span>
            </button>
          </div>
        </div>
      )}

      {/* BOTÓN GIGANTE ROJO DE EMERGENCIA */}
      {!editing && (
        <button
          className="btn-danger"
          onClick={handleCall}
          style={{
            minHeight: 'calc(80px * var(--font-scale, 1))',
            borderRadius: 22,
            fontSize: 'calc(22px * var(--font-scale, 1))',
            boxShadow: '0 8px 24px rgba(220, 38, 38, 0.35)',
            gap: 16,
          }}
        >
          <PhoneCall size={34} />
          <span>LLAMAR AHORA</span>
        </button>
      )}

      {/* FORMULARIO DE EDICIÓN DEL CONTACTO */}
      {editing && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 22,
            padding: 20,
            border: '2px solid #DC2626',
            boxShadow: '0 6px 20px rgba(220, 38, 38, 0.15)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 'calc(20px * var(--font-scale, 1))', margin: 0, color: '#DC2626' }}>
              Modificar Contacto SOS
            </h2>
            <button
              onClick={() => setEditing(false)}
              style={{ minHeight: 36, padding: 4, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
          </div>

          <label style={{ fontSize: 'calc(16px * var(--font-scale, 1))', fontWeight: 700, color: '#0F172A' }}>
            Nombre de la Persona:
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ejemplo: Hija María"
            style={{ margin: '6px 0 12px 0' }}
          />

          <label style={{ fontSize: 'calc(16px * var(--font-scale, 1))', fontWeight: 700, color: '#0F172A' }}>
            Parentesco:
          </label>
          <input
            type="text"
            value={parentesco}
            onChange={(e) => setParentesco(e.target.value)}
            placeholder="Ejemplo: Hija, Hermano, Doctor"
            style={{ margin: '6px 0 12px 0' }}
          />

          <label style={{ fontSize: 'calc(16px * var(--font-scale, 1))', fontWeight: 700, color: '#0F172A' }}>
            Número de Teléfono:
          </label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ejemplo: 04141234567"
            style={{ margin: '6px 0 18px 0' }}
          />

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn-outline"
              onClick={() => setEditing(false)}
              style={{ flex: 1, minHeight: 56, borderColor: '#64748B', color: '#64748B' }}
            >
              <span>Cancelar</span>
            </button>
            <button
              className="btn-danger"
              onClick={handleSave}
              style={{ flex: 1, minHeight: 56 }}
            >
              <Check size={20} />
              <span>Guardar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
