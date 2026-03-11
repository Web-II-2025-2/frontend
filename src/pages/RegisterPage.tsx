import { useState } from "react";
import { COLORS } from "../styles/theme";
import { Logo } from "../components/common/Logo";
import { InputField } from "../components/common/InputField";
import { LeftPanel } from "../components/layout/LeftPanel";
import { useNavigate } from "react-router-dom";
import { maskCPF, maskPhone, maskDate } from "../utils/masks.tsx";
import "./styles/registerPage.css";

function StepDot({ n, current }: any) {
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

function PasswordStrength({ value }: any) {
  if (!value) return null;
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  const colors = { 0: "transparent", 1: "#e05555", 2: "#f0a500", 3: "#3aad6e", 4: "#3aad6e" };
  const label = ["", "Fraca", "Média", "Forte", "Muito forte"][score] || "";

  return (
    <div className="register-page-password-strength">
      <div className="register-page-password-bars">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`register-page-password-bar ${i <= score ? 'filled' : ''}`}
            style={{ color: colors[score as keyof typeof colors] }}
          />
        ))}
      </div>
      <span className="register-page-password-label">{label}</span>
    </div>
  );
}

export function RegisterPage() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [terms, setTerms] = useState(false);
  const [news, setNews] = useState(false);
  const [pwd, setPwd] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");

  const navigate = useNavigate();

  function onGoLogin() {
    navigate("/login");
  }

  function handleSubmit() {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 2000);
  }

  return (
    <div className="register-page-container">
      <LeftPanel
        badge="Reversas disponíveis"
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
                    <InputField label="Nome" icon="👤" placeholder="João" />
                    <InputField label="Sobrenome" icon="👤" placeholder="Silva" />
                  </div>
                  <InputField
                    label="CPF"
                    icon="🪪"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e: any) => setCpf(maskCPF(e.target.value))}
                    maxLength={14}
                  />
                  <div>
                    <InputField
                      label="Telefone"
                      icon="📱"
                      placeholder="(11) 9 0000-0000"
                      value={phone}
                      onChange={(e: any) => setPhone(maskPhone(e.target.value))}
                      maxLength={17}
                    />
                  </div>
                  <div className="register-page-button-group">
                    <button
                      className="register-page-button primary"
                      onClick={() => setStep(2)}
                      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                    >
                      Continuar →
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="register-page-form-section">
                  <InputField label="E-mail" icon="✉️" placeholder="joao@email.com" />
                  <InputField label="Confirmar E-mail" icon="✉️" placeholder="joao@email.com" />
                  <div className="register-page-form-group">
                    <label className="register-page-form-label">Senha</label>
                    <div className="register-page-password-input">
                      <span className="register-page-toggle-top">🔒</span>
                      <input
                        type={showPwd ? "text" : "password"}
                        placeholder="Mínimo 8 caracteres"
                        value={pwd}
                        onChange={e => setPwd(e.target.value)}
                      />
                      <button
                        type="button"
                        className="register-page-password-toggle"
                        onClick={() => setShowPwd(v => !v)}
                      >
                        👁
                      </button>
                    </div>
                    <PasswordStrength value={pwd} />
                  </div>
                  <div className="register-page-form-group">
                    <label className="register-page-form-label">Confirmar Senha</label>
                    <div className="register-page-password-input">
                      <span className="register-page-toggle-absolute">🔒</span>
                      <input
                        type={showPwd2 ? "text" : "password"}
                        placeholder="Repita a senha"
                        style={{ paddingLeft: "42px" }}
                      />
                      <button
                        type="button"
                        className="register-page-password-toggle"
                        style={{ right: 14 }}
                        onClick={() => setShowPwd2(v => !v)}
                      >
                        👁
                      </button>
                    </div>
                  </div>

                  {[
                    {
                      id: "terms", state: terms, set: setTerms,
                      text: <>Li e aceito os <a href="#" style={{ color: COLORS.gold, textDecoration: "none", fontWeight: 500 }}>Termos de Uso</a> e a <a href="#" style={{ color: COLORS.gold, textDecoration: "none", fontWeight: 500 }}>Política de Privacidade</a> do Hotel UFCG.</>
                    },
                    {
                      id: "news", state: news, set: setNews,
                      text: "Quero receber ofertas exclusivas e novidades do Hotel UFCG por e-mail."
                    }
                  ].map(({ id, state, set, text }) => (
                    <div key={id} className="register-page-checkbox" onClick={() => set(v => !v)}>
                      <div className={`register-page-checkbox-input ${state ? 'checked' : ''}`}>
                        {state && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="register-page-checkbox-text">{text}</span>
                    </div>
                  ))}

                  <div className="register-page-button-group">
                    <button
                      className="register-page-button secondary"
                      onClick={() => setStep(1)}
                    >
                      ← Voltar
                    </button>
                    <button
                      className="register-page-button primary"
                      onClick={handleSubmit}
                      disabled={loading}
                      onMouseEnter={e => !loading && (e.currentTarget.style.transform = "translateY(-2px)")}
                      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                    >
                      {loading ? <div className="register-page-spinner" /> : "Criar Conta"}
                    </button>
                  </div>
                </div>
              )}

              <div className="register-page-footer">
                Já tem uma conta?{" "}
                <button onClick={onGoLogin} className="register-page-login-link">
                  Entrar
                </button>
              </div>
            </>
          ) : (
            <div className="register-page-success">
              <div className="register-page-success-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4L19.5 11.5H27L21 15.5L23.5 23L16 18.5L8.5 23L11 15.5L5 11.5H12.5L16 4Z" fill="#c9a84c" />
                </svg>
              </div>
              <h3 className="register-page-success-title">Conta criada com sucesso!</h3>
              <p className="register-page-success-text">
                Bem-vindo ao programa Hotel UFCG. Aprecie sua estádia.  
              </p>
              <button
                className="register-page-success-button"
                onClick={onGoLogin}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                Acessar Minha Conta
              </button>
            </div>
          )}

          <div className="register-page-links">
            {["Política de Privacidade", "Termos de Uso", "Contato"].map(l => (
              <a key={l} href="#">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};