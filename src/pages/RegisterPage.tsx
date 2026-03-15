import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../styles/theme";
import { Logo } from "../components/common/Logo";
import { InputField } from "../components/common/InputField";
import { LeftPanel } from "../components/layout/LeftPanel";
import { maskCPF, maskPhone } from "../utils/masks.tsx";
import api from "../services/api"; 
import "./styles/registerPage.css";

function StepDot({ n, current }: { n: number; current: number }) {
  const done = n < current;
  const active = n === current;
  return (
    <div className="register-page-step-container">
      {n < 2 && (
        <div className={`register-page-step-progress-line ${done ? 'active' : 'inactive'}`} />
      )}
      <div className={`register-page-step-dot ${active ? 'active' : done ? 'done' : 'inactive'}`}>
        {done ? "✓" : n}
      </div>
      <span className={`register-page-step-label ${active ? 'active' : done ? 'done' : ''}`}>
        {["Dados Pessoais", "Acesso"][n - 1]}
      </span>
    </div>
  );
}

function PasswordStrength({ value }: { value: string }) {
  if (!value) return null;
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  const colors = ["transparent", "#e05555", "#f0a500", "#3aad6e", "#3aad6e"];
  const label = ["", "Fraca", "Média", "Forte", "Muito forte"][score];

  return (
    <div className="register-page-password-strength">
      <div className="register-page-password-bars">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`register-page-password-bar ${i <= score ? 'filled' : ''}`}
            style={{ backgroundColor: i <= score ? colors[score] : undefined }}
          />
        ))}
      </div>
      <span className="register-page-password-label">{label}</span>
    </div>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [terms, setTerms] = useState(false);
  const [news, setNews] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    cpf: "",
    phone: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const onGoLogin = () => navigate("/login");

  async function handleSubmit() {
    if (formData.password !== formData.confirmPassword) {
      return alert("As senhas não coincidem.");
    }
    if (formData.email !== formData.confirmEmail) {
      return alert("Os e-mails não coincidem.");
    }
    if (!terms) {
      return alert("Você precisa aceitar os termos de uso.");
    }

    setLoading(true);

    try {
      await api.post("/auth/register-guest", {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        cpf: formData.cpf.replace(/\D/g, ""),
        phoneNumber: formData.phone.replace(/\D/g, ""),
        password: formData.password
      });

      setDone(true);
    } catch (error: any) {
      console.error("Erro no registro:", error);
      alert(error.response?.data?.message || "Erro ao criar conta. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page-container">
      <LeftPanel
        badge="Reservas disponíveis"
        title="Junte-se à nossa família de hóspedes"
        italic="Aqui."
        subtitle="Crie sua conta e tenha acesso a reservas exclusivas, benefícios do programa de fidelidade e serviços personalizados."
        perks={[
          { icon: "🛎", text: "Check-in e check-out online" },
          { icon: "🍽", text: "Serviço de quarto a qualquer hora" },
          { icon: "✨", text: "Eventos Especiais" },
        ]}
      />

      <div className="register-page-panel">
        <div className="register-page-decoration-top" />
        <div className="register-page-decoration-bottom" />

        <div className="register-page-content">
          <Logo />

          {!done ? (
            <>
              <h2 className="register-page-title">Criar conta de hóspede</h2>
              <p className="register-page-subtitle">Preencha os dados abaixo para se registrar</p>

              <div className="register-page-steps">
                {[1, 2].map(n => <StepDot key={n} n={n} current={step} />)}
              </div>

              {step === 1 && (
                <div className="register-page-form-section">
                  <div className="register-page-form-grid">
                    <InputField 
                      label="Nome" icon="👤" placeholder="João" 
                      value={formData.firstName}
                      onChange={(e: any) => handleChange("firstName", e.target.value)}
                    />
                    <InputField 
                      label="Sobrenome" icon="👤" placeholder="Silva" 
                      value={formData.lastName}
                      onChange={(e: any) => handleChange("lastName", e.target.value)}
                    />
                  </div>
                  <InputField
                    label="CPF" icon="🪪" placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e: any) => handleChange("cpf", maskCPF(e.target.value))}
                    maxLength={14}
                  />
                  <InputField
                    label="Telefone" icon="📱" placeholder="(11) 9 0000-0000"
                    value={formData.phone}
                    onChange={(e: any) => handleChange("phone", maskPhone(e.target.value))}
                    maxLength={17}
                  />
                  <div className="register-page-button-group">
                    <button className="register-page-button primary" onClick={() => setStep(2)}>
                      Continuar →
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="register-page-form-section">
                  <InputField 
                    label="E-mail" icon="✉️" placeholder="joao@email.com" 
                    value={formData.email}
                    onChange={(e: any) => handleChange("email", e.target.value)}
                  />
                  <InputField 
                    label="Confirmar E-mail" icon="✉️" placeholder="joao@email.com" 
                    value={formData.confirmEmail}
                    onChange={(e: any) => handleChange("confirmEmail", e.target.value)}
                  />
                  
                  <div className="register-page-form-group">
                    <label className="register-page-form-label">Senha</label>
                    <div className="register-page-password-input">
                      <span className="register-page-toggle-top">🔒</span>
                      <input
                        type={showPwd ? "text" : "password"}
                        placeholder="Mínimo 8 caracteres"
                        value={formData.password}
                        onChange={e => handleChange("password", e.target.value)}
                      />
                      <button type="button" className="register-page-password-toggle" onClick={() => setShowPwd(v => !v)}>👁</button>
                    </div>
                    <PasswordStrength value={formData.password} />
                  </div>

                  <InputField 
                    label="Confirmar Senha" icon="🔒" type={showPwd2 ? "text" : "password"}
                    placeholder="Repita a senha"
                    value={formData.confirmPassword}
                    onChange={(e: any) => handleChange("confirmPassword", e.target.value)}
                    rightBtn={<button type="button" onClick={() => setShowPwd2(v => !v)} className="register-page-password-toggle">👁</button>}
                  />

                  <div className="register-page-checkbox" onClick={() => setTerms(v => !v)}>
                    <div className={`register-page-checkbox-input ${terms ? 'checked' : ''}`}>
                      {terms && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="register-page-checkbox-text">
                      Li e aceito os <a href="#" style={{ color: COLORS.gold }}>Termos de Uso</a> do Hotel UFCG.
                    </span>
                  </div>

                  <div className="register-page-button-group">
                    <button className="register-page-button secondary" onClick={() => setStep(1)}>← Voltar</button>
                    <button className="register-page-button primary" onClick={handleSubmit} disabled={loading}>
                      {loading ? <div className="register-page-spinner" /> : "Criar Conta"}
                    </button>
                  </div>
                </div>
              )}

              <div className="register-page-footer">
                Já tem uma conta? <button onClick={onGoLogin} className="register-page-login-link">Entrar</button>
              </div>
            </>
          ) : (
            <div className="register-page-success">
              <div className="register-page-success-icon">✓</div>
              <h3 className="register-page-success-title">Conta criada com sucesso!</h3>
              <p className="register-page-success-text">Bem-vindo ao programa Hotel UFCG.</p>
              <button className="register-page-success-button" onClick={onGoLogin}>
                Acessar Minha Conta
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}