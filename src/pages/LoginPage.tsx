import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import type { MyJwtPayload } from "../services/AuthContext";
import api from "../services/api";
import { LeftPanel } from "../components/layout/LeftPanel";
import { InputField } from "../components/common/InputField";
import { Logo } from "../components/common/Logo";
import "./styles/loginPage.css";
import { jwtDecode } from "jwt-decode";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      const token = response.data;
      await login(token);

      const decoded = jwtDecode<MyJwtPayload>(token);

      console.log("Token decodificado:", decoded);
      if (decoded.role === 'GUEST') {
        console.log("Redirecionando para dashboard de hóspede...");
        navigate("/home");
      } else {
        navigate("/event");
      }
            
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      alert(error.response?.data?.message || "Falha na autenticação. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  }

  function onGoRegister() {
    navigate("/register");
  }

  return (
    <div className="login-page-container">
      <LeftPanel
        badge="Reservas disponíveis"
        title="Sua estadia começa"
        italic="aqui."
        subtitle="Acesse sua conta para gerenciar reservas, solicitar serviços e viver a experiência Hotel UFCG com exclusividade."
        perks={[
          { icon: "🛎", text: "Check-in e check-out online" },
          { icon: "🍽", text: "Serviço de quarto a qualquer hora" },
          { icon: "✨", text: "Eventos Especiais" },
        ]}
      />
      <div className="login-page-right-panel">
        <div className="login-page-decoration-top" />
        <div className="login-page-decoration-bottom" />

        <div className="login-page-content">
          <Logo />
          <h2 className="login-page-title">Bem-vindo de volta</h2>
          <p className="login-page-subtitle">Acesse sua reserva ou conta de hóspede</p>

          <form onSubmit={handleLogin}>
            <InputField 
              label="E-mail" 
              icon="✉️" 
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
            <InputField
              label="Senha"
              icon="🔒"
              type={showPwd ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              rightBtn={
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="login-page-pwd-toggle"
                >
                  👁
                </button>
              }
            />

            <div className="login-page-forgot-password">
              <a href="#" className="login-page-forgot-password-link">Esqueceu a senha?</a>
            </div>

            <div className="login-page-remember" onClick={() => setRemember(v => !v)}>
              <div className={`login-page-checkbox ${remember ? "checked" : ""}`}>
                {remember && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="login-page-remember-text">Lembrar de mim</span>
            </div>

            <button 
              type="submit" 
              className={`login-page-submit-btn ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? <div className="login-page-spinner" /> : "Acessar Conta"}
            </button>
          </form>

          <div className="login-page-register">
            Não tem conta?{" "}
            <button onClick={onGoRegister} className="login-page-register-btn">
              Criar conta
            </button>
          </div>

          <div className="login-page-footer">
            {["Política de Privacidade", "Termos de Uso", "Contato"].map(l => (
              <a key={l} href="#" className="login-page-footer-link">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}