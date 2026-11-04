import { useState, useEffect } from 'react';
import { ApiService, type MedicationItem } from '../services/api';
import { StorageService } from '../services/storage';
import { SpeechService } from '../services/speech';
import { AppHeader } from '../components/AppHeader';
import { Clock, Volume2, Plus, X, Trash2 } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const MedicationsView: React.FC<Props> = ({ onBack }) => {
  const [meds, setMeds] = useState<MedicationItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [nombre, setNombre] = useState('');
  const [hora, setHora] = useState('');
  const [instruccion, setInstruccion] = useState('');

  useEffect(() => {
    loadMeds();
  }, []);

  const loadMeds = async () => {
    const list = await ApiService.getMedications();
    setMeds(list);
  };

  const handleAdd = async () => {
    if (!nombre.trim() || !hora.trim()) {
      alert("Por favor indica el nombre de la medicina y la hora.");
      return;
    }
    await ApiService.addMedication({
      medicamento: nombre.trim(),
      hora: hora.trim(),
      instruccion: instruccion.trim() || "Tomar con abundante agua",
    });
    setNombre('');
    setHora('');
    setInstruccion('');
    setShowAdd(false);
    loadMeds();
  };

  const handleDelete = async (id: number) => {
    const filtered = meds.filter(m => m.id !== id);
    setMeds(filtered);
    await StorageService.set('cley_medications', filtered);
  };

  const speakMed = (item: MedicationItem) => {
    SpeechService.speak(
      `Es hora de tu medicina: ${item.medicamento}. Hora programada: ${item.hora}. Instrucción: ${item.instruccion || "Tomar con agua."}`
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', paddingBottom: 28 }}>
      {/* CABECERA BAJADA Y SÚPER ACCESIBLE */}
      <AppHeader onBack={onBack} title="💊 Mis Pastillas del Día" />

      <p
        style={{
          margin: '0 0 16px 0',
          color: '#0F172A',
          fontSize: 'calc(18px * var(--font-scale, 1))',
          fontWeight: 600,
          lineHeight: 1.45,
        }}
      >
        Aquí tienes tus medicinas anotadas. Toca el botón naranja para escuchar las indicaciones con voz clara:
      </p>

      {/* LISTA DE PASTILLAS CON MÁXIMO CONTRASTE Y LEGIBILIDAD */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
        {meds.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: 20,
              border: '2.5px solid #CBD5E1',
              boxShadow: '0 4px 12px rgba(0,0,0,0.07)',
            }}
          >
            {/* Fila superior: Hora y Botón Borrar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: '#FFEDD5',
                  border: '1.5px solid #FDBA74',
                  padding: '6px 16px',
                  borderRadius: 14,
                  color: '#7C2D12',
                  fontWeight: 900,
                  fontSize: 'calc(18px * var(--font-scale, 1))',
                }}
              >
                <Clock size={22} color="#7C2D12" strokeWidth={2.5} />
                <span style={{ color: '#7C2D12', fontWeight: 900 }}>{item.hora}</span>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  minHeight: 40,
                  padding: '6px 12px',
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  borderRadius: 12,
                  color: '#DC2626',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
                title="Eliminar pastilla"
              >
                <Trash2 size={18} color="#DC2626" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#DC2626' }}>Borrar</span>
              </button>
            </div>

            {/* Nombre del medicamento (Letras grandes y oscuras de máximo contraste) */}
            <h2
              style={{
                fontSize: 'calc(23px * var(--font-scale, 1))',
                margin: '6px 0 10px 0',
                color: '#0F172A',
                fontWeight: 900,
                lineHeight: 1.3,
              }}
            >
              {item.medicamento}
            </h2>

            {/* Instrucción médica */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                borderRadius: 14,
                padding: '10px 14px',
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontSize: 'calc(13px * var(--font-scale, 1))',
                  fontWeight: 800,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  marginBottom: 2,
                }}
              >
                Indicación:
              </span>
              <p
                style={{
                  fontSize: 'calc(18px * var(--font-scale, 1))',
                  color: '#0F172A',
                  margin: 0,
                  fontWeight: 700,
                  lineHeight: 1.45,
                }}
              >
                {item.instruccion}
              </p>
            </div>

            {/* Botón para escuchar con voz */}
            <button
              onClick={() => speakMed(item)}
              style={{
                width: '100%',
                backgroundColor: '#FFF7ED',
                border: '2.5px solid #EA580C',
                color: '#C2410C',
                minHeight: 'calc(58px * var(--font-scale, 1))',
                borderRadius: 18,
                fontWeight: 900,
                fontSize: 'calc(18px * var(--font-scale, 1))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              <Volume2 size={26} color="#C2410C" strokeWidth={2.5} />
              <span style={{ color: '#C2410C', fontWeight: 900 }}>Escuchar Instrucción</span>
            </button>
          </div>
        ))}

        {meds.length === 0 && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: 26,
              textAlign: 'center',
              border: '2px dashed #CBD5E1',
            }}
          >
            <p style={{ margin: 0, color: '#0F172A', fontSize: 'calc(18px * var(--font-scale, 1))', fontWeight: 700 }}>
              No tienes pastillas registradas en este momento.
            </p>
          </div>
        )}
      </div>

      {/* BOTÓN O FORMULARIO PARA AGREGAR NUEVA MEDICINA */}
      {!showAdd ? (
        <button
          className="btn-primary"
          onClick={() => setShowAdd(true)}
          style={{
            minHeight: 'calc(66px * var(--font-scale, 1))',
            borderRadius: 22,
            fontSize: 'calc(20px * var(--font-scale, 1))',
            fontWeight: 800,
            gap: 12,
          }}
        >
          <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
          <span style={{ color: '#FFFFFF', fontWeight: 800 }}>Agregar Otra Pastilla</span>
        </button>
      ) : (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 22,
            padding: 22,
            border: '2.5px solid #D9480F',
            boxShadow: '0 6px 20px rgba(217, 72, 15, 0.15)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 'calc(22px * var(--font-scale, 1))', margin: 0, color: '#D9480F', fontWeight: 900 }}>
              Nueva Pastilla
            </h2>
            <button
              onClick={() => setShowAdd(false)}
              style={{ minHeight: 38, padding: 6, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={26} color="#0F172A" />
            </button>
          </div>

          <label style={{ display: 'block', fontSize: 'calc(17px * var(--font-scale, 1))', fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            Nombre del Medicamento:
          </label>
          <input
            type="text"
            placeholder="Ejemplo: Acetaminofén o Losartán"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{ margin: '0 0 14px 0', border: '2px solid #94A3B8', color: '#0F172A', fontWeight: 700 }}
          />

          <label style={{ display: 'block', fontSize: 'calc(17px * var(--font-scale, 1))', fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            Hora de Tomarla:
          </label>
          <input
            type="text"
            placeholder="Ejemplo: 08:00 AM o con el desayuno"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            style={{ margin: '0 0 14px 0', border: '2px solid #94A3B8', color: '#0F172A', fontWeight: 700 }}
          />

          <label style={{ display: 'block', fontSize: 'calc(17px * var(--font-scale, 1))', fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            Indicación Especial:
          </label>
          <input
            type="text"
            placeholder="Ejemplo: Tomar con medio vaso de agua tibia"
            value={instruccion}
            onChange={(e) => setInstruccion(e.target.value)}
            style={{ margin: '0 0 20px 0', border: '2px solid #94A3B8', color: '#0F172A', fontWeight: 700 }}
          />

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              className="btn-outline"
              onClick={() => setShowAdd(false)}
              style={{ flex: 1, minHeight: 58 }}
            >
              <span>Cancelar</span>
            </button>
            <button
              className="btn-primary"
              onClick={handleAdd}
              style={{ flex: 1, minHeight: 58 }}
            >
              <span>Guardar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
