import { useFormAction } from "../../hooks/formAction";
import { Field, Tag, inputStyle, selectStyle } from "../../components/layout/ControlPlaneUI";
import "../styles/roomManagement.css";

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

export function RoomManagement() {
  const { form, setField, saved, loading, submit } = useFormAction<QuartoFormState>(
    initialState, 
    "/rooms"
  );

  const handleRoomSubmit = () => {
    if (form.number === "" || !form.type || form.dailyRate === "") {
      alert("Por favor, preencha todos os campos do quarto.");
      return;
    }
    submit();
  };

  return (
    <div className="room-form-container">
      <div className="room-form-header">
        <Tag color="#7a4f2e">Hospedagem</Tag>
        <h2 className="room-form-title">Novo quarto</h2>
        <p className="room-form-subtitle">Cadastre um quarto com suas especificações.</p>
      </div>

      <div className="room-form-grid">
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
        
        <div className="room-form-full-width">
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

      <div className="room-form-actions">
        <button 
          onClick={handleRoomSubmit} 
          className={`room-form-submit ${loading ? 'loading' : ''}`}
          disabled={loading}
          style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? "Cadastrando..." : "Cadastrar Quarto"}
        </button>
        {saved && (
          <span className="room-form-success" style={{ marginLeft: '16px', color: '#4a9060', fontWeight: 500 }}>
            ✓ Quarto cadastrado com sucesso!
          </span>
        )}
      </div>
    </div>
  );
}