import { useFormAction } from "../../hooks/formAction";
import { Field, Tag, inputStyle } from "../../components/layout/ControlPlaneUI";

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

export default function EventoForm() {
  const { form, setField, saved, submit } = useFormAction<EventoFormState>(initialState);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <Tag color="#5a3d8a">Eventos</Tag>
        <h2 style={{ marginTop: 12, fontSize: 26, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: "#1a1a14", letterSpacing: "-0.02em" }}>
          Novo evento
        </h2>
        <p style={{ fontSize: 14, color: "#8a8a7a", marginTop: 6 }}>Agende um evento no espaço do hotel.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Nome do evento">
            <input style={inputStyle} placeholder="Ex: Conferência de Tecnologia" value={form.name} onChange={e => setField("name", e.target.value)} />
          </Field>
        </div>

        <Field label="Data">
          <input style={{ ...inputStyle, colorScheme: "light" }} type="date" value={form.date} onChange={e => setField("date", e.target.value)} />
        </Field>

        <Field label="Horário">
          <input style={{ ...inputStyle, colorScheme: "light" }} type="time" value={form.time} onChange={e => setField("time", e.target.value)} />
        </Field>

        <Field label="Local / Salão">
          <input style={inputStyle} placeholder="Ex: Salão Nobre" value={form.location} onChange={e => setField("location", e.target.value)} />
        </Field>

        <Field label="Capacidade (pessoas)">
          <input style={inputStyle} type="number" min="1" placeholder="Ex: 120" value={form.capacity} onChange={e => setField("capacity", e.target.value ? Number(e.target.value) : 0)} />
        </Field>

        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Descrição">
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} placeholder="Detalhes do evento..." value={form.description} onChange={e => setField("description", e.target.value)} />
          </Field>
        </div>
      </div>

      <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={submit} style={{
          padding: "11px 28px", fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.06em", textTransform: "uppercase", background: "#1a1a14", color: "#f5f4ef",
          border: "none", borderRadius: 8, cursor: "pointer", transition: "opacity 0.15s"
        }}>
          Agendar
        </button>
        {saved && <span style={{ fontSize: 13, color: "#4a9060", fontWeight: 500 }}>✓ Evento agendado!</span>}
      </div>
    </div>
  );
}