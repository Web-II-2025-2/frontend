import { useFormAction } from "../../hooks/formAction";
import { Field, Tag, inputStyle } from "../../components/layout/ControlPlaneUI";
import "../styles/Management.css";

interface EventoFormState {
  name: string;
  description: string;
  date: string; 
  time: string;
  capacity: number;
  location: string;
}

const initialState: EventoFormState = {
  name: "",
  description: "",
  date: "",
  time: "",
  capacity: 0,
  location: ""
};

export function EventManagement() {
  const { form, setField, saved, loading, submit } = useFormAction<EventoFormState>(
    initialState, 
    "/events"
  );

  const handleEventSubmit = () => {
    if (!form.name || !form.date || !form.location) {
      alert("Por favor, preencha os campos essenciais: Nome, Data e Local.");
      return;
    }
    
    submit();
  };

  return (
    <div className="event-form-container">
      <div className="event-form-header">
        <Tag color="#5a3d8a">Eventos</Tag>
        <h2 className="event-form-title">Novo evento</h2>
        <p className="event-form-subtitle">Agende um evento no espaço do hotel.</p>
      </div>

      <div className="event-form-grid">
        <div className="event-form-full-width">
          <Field label="Nome do evento">
            <input 
              style={inputStyle} 
              placeholder="Ex: Conferência de Tecnologia" 
              value={form.name} 
              onChange={e => setField("name", e.target.value)} 
            />
          </Field>
        </div>

        <Field label="Data">
          <input 
            className="event-form-light-input" 
            style={inputStyle} 
            type="date" 
            value={form.date} 
            onChange={e => setField("date", e.target.value)} 
          />
        </Field>

        <Field label="Horário">
          <input 
            className="event-form-light-input" 
            style={inputStyle} 
            type="time" 
            value={form.time} 
            onChange={e => setField("time", e.target.value)} 
          />
        </Field>

        <Field label="Local / Salão">
          <input 
            style={inputStyle} 
            placeholder="Ex: Salão Nobre" 
            value={form.location} 
            onChange={e => setField("location", e.target.value)} 
          />
        </Field>

        <Field label="Capacidade (pessoas)">
          <input 
            style={inputStyle} 
            type="number" 
            min="1" 
            placeholder="Ex: 120" 
            value={form.capacity} 
            onChange={e => setField("capacity", e.target.value ? Number(e.target.value) : 0)} 
          />
        </Field>

        <div className="event-form-full-width">
          <Field label="Descrição">
            <textarea 
              className="event-form-textarea" 
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} 
              placeholder="Detalhes do evento..." 
              value={form.description} 
              onChange={e => setField("description", e.target.value)} 
            />
          </Field>
        </div>
      </div>

      <div className="event-form-actions">
        <button 
          onClick={handleEventSubmit} 
          className={`event-form-submit ${loading ? 'loading' : ''}`}
          disabled={loading}
          style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? "Agendando..." : "Agendar Evento"}
        </button>
        {saved && (
          <span className="event-form-success" style={{ marginLeft: '16px', color: '#4a9060', fontWeight: 500 }}>
            ✓ Evento agendado com sucesso!
          </span>
        )}
      </div>
    </div>
  );
}