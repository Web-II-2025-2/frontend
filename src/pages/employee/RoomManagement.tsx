import { useFormAction } from "../../hooks/formAction";
import { Field, Tag, inputStyle, selectStyle } from "../../components/layout/ControlPlaneUI";

const TIPO_OPTIONS = [
  { value: "Standard_CASAL", label: "Standard Casal" },
  { value: "SINGLE", label: "Solteiro" },
  { value: "SUITE", label: "Suíte" },
  { value: "DELUXE", label: "Deluxe" }
];

interface QuartoFormState {
  number: number | "";
  type: string;
  dailyRate: number | "";
}

const initialState: QuartoFormState = {
  number: "",
  type: "",
  dailyRate: ""
};

export default function QuartoForm() {
  const { form, setField, saved, submit } = useFormAction<QuartoFormState>(initialState);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <Tag color="#7a4f2e">Hospedagem</Tag>
        <h2 style={{ marginTop: 12, fontSize: 26, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: "#1a1a14", letterSpacing: "-0.02em" }}>
          Novo quarto
        </h2>
        <p style={{ fontSize: 14, color: "#8a8a7a", marginTop: 6 }}>Cadastre um quarto com suas especificações.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <Field label="Número do quarto">
          <input 
            style={inputStyle} 
            type="number"
            placeholder="Ex: 201" 
            value={form.number} 
            onChange={e => setField("number", e.target.value ? Number(e.target.value) : "")} 
          />
        </Field>
        
        <Field label="Tipo">
          <select 
            style={selectStyle} 
            value={form.type} 
            onChange={e => setField("type", e.target.value)}
          >
            <option value="">Selecionar tipo</option>
            {TIPO_OPTIONS.map(t => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Diária (R$)">
            <input 
              style={inputStyle} 
              type="number"
              step="0.01"
              placeholder="Ex: 350.00" 
              value={form.dailyRate} 
              onChange={e => setField("dailyRate", e.target.value ? Number(e.target.value) : "")} 
            />
          </Field>
        </div>
      </div>

      <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={submit} style={{
          padding: "11px 28px", fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.06em", textTransform: "uppercase", background: "#1a1a14", color: "#f5f4ef",
          border: "none", borderRadius: 8, cursor: "pointer", transition: "opacity 0.15s"
        }}>
          Cadastrar
        </button>
        {saved && <span style={{ fontSize: 13, color: "#4a9060", fontWeight: 500 }}>✓ Quarto cadastrado!</span>}
      </div>
    </div>
  );
}