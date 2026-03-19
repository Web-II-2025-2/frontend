import { useFormAction } from "../../hooks/formAction";
import { Field, Tag, inputStyle } from "../../components/layout/ControlPlaneUI";
import { useAuth } from "../../services/AuthContext";
import "../styles/Management.css";

interface EmployeeFormState {
  name: string;
  email: string;
  role: string;
  phone: string;
  password?: string;
}

const initialState: EmployeeFormState = {
  name: "",
  email: "",
  role: "",
  phone: "",
  password: "Hotel@Default2026"
};

export function EmployeeManagement() {
  const { user } = useAuth();
  
  const { form, setField, saved, submit } = useFormAction<EmployeeFormState>(initialState);

  const ALL_OPTIONS = [
    { label: "Gerente", value: "MANAGER" },
    { label: "Funcionário", value: "EMPLOYEE" }
  ];

  const getAvailableRoles = () => {
    if (!user) return [];
    if (user.role === 'EMPLOYEE') {
      return ALL_OPTIONS.filter(opt => opt.value === 'EMPLOYEE');
    }
    return ALL_OPTIONS;
  };

  const getRouteApi = (role: string) => {
    if (role === 'MANAGER') {
      return "/auth/register-manager";
    }
    return "/auth/register-employee";
  };

  const handleCustomSubmit = () => {
    if (!form.role) {
      alert("Por favor, selecione um cargo antes de cadastrar.");
      return;
    }

    const targetRoute = getRouteApi(form.role);
    
    submit(targetRoute); 
  };

  const availableRoles = getAvailableRoles();

  return (
    <div className="event-form-container">
      <div className="event-form-header">
        <Tag color="#3d5a9e">Gestão de Pessoas</Tag>
        <h2 className="event-form-title">Novo funcionário</h2>
        <p className="event-form-subtitle">
          Cadastrando como: <strong>{user?.role}</strong>
        </p>
      </div>

      <div className="event-form-grid">
        <div className="event-form-full-width">
          <Field label="Nome completo">
            <input 
              style={inputStyle} 
              placeholder="Ex: Hildon Neto" 
              value={form.name} 
              onChange={e => setField("name", e.target.value)} 
            />
          </Field>
        </div>

        <Field label="E-mail Corporativo">
          <input 
            style={inputStyle} 
            type="email"
            placeholder="colaborador@hotel.com" 
            value={form.email} 
            onChange={e => setField("email", e.target.value)} 
          />
        </Field>

        <Field label="Cargo / Permissão">
          <select 
            style={{ 
              ...inputStyle, 
              cursor: "pointer",
              appearance: "none",
            }} 
            value={form.role} 
            onChange={e => setField("role", e.target.value)}
          >
            <option value="">Selecionar cargo</option>
            {availableRoles.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Telefone de Contato">
          <input 
            style={inputStyle} 
            placeholder="(83) 9 0000-0000" 
            value={form.phone} 
            onChange={e => setField("phone", e.target.value)} 
          />
        </Field>

        <Field label="Senha Provisória">
          <input 
            style={inputStyle} 
            type="text"
            value={form.password} 
            onChange={e => setField("password", e.target.value)} 
          />
        </Field>
      </div>

      <div className="event-form-actions">
        <button 
          onClick={handleCustomSubmit} 
          className="event-form-submit"
          style={{ cursor: 'pointer' }}
        >
          Confirmar Cadastro
        </button>
        {saved && (
          <span className="event-form-success" style={{ marginLeft: '16px', color: '#4a9060' }}>
            ✓ Funcionário cadastrado com sucesso!
          </span>
        )}
      </div>
    </div>
  );
}