import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BrandPanel from "../components/BrandPanel.jsx";
import FormAlert from "../components/FormAlert.jsx";
import Logo from "../components/Logo.jsx";
import PasswordField from "../components/PasswordField.jsx";
import TextField from "../components/TextField.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Usuário fictício apenas para simular o login nesta etapa do MVP.
// Nenhuma autenticação real ou banco de dados está implementado ainda.
const MOCK_USER = {
  email: "usuario@myvitrine.com",
  password: "123456",
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [errors, setErrors] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState({ message: "", variant: "error" });

  function handleEmailChange(event) {
    setEmail(event.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = { email: "", password: "" };
    const trimmedEmail = email.trim();

    if (trimmedEmail === "") {
      nextErrors.email = "Informe seu e-mail.";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      nextErrors.email = "Informe um e-mail válido.";
    }

    if (password === "") {
      nextErrors.password = "Informe sua senha.";
    }

    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) {
      setAlert({ message: "Verifique os campos destacados abaixo.", variant: "error" });
      return;
    }

    if (trimmedEmail === MOCK_USER.email && password === MOCK_USER.password) {
      setAlert({
        message: "Login realizado! Redirecionando...",
        variant: "success",
      });

      // ⚠️ Simulação apenas: enquanto não existe backend real, autenticamos
      // localmente para permitir testar o fluxo de rotas protegidas.
      // Assim que /api/v1/auth/login existir de verdade, troque isto por
      // uma chamada à API (que deve setar o cookie HttpOnly de refresh e
      // devolver o access token + dados do usuário).
      setUser({ tipo: null });

      const redirectTo = location.state?.from || "/selecionar-perfil";
      setTimeout(() => navigate(redirectTo, { replace: true }), 600);
    } else {
      setAlert({ message: "E-mail ou senha inválidos.", variant: "error" });
    }
  }

  return (
    <div className="page">
      <BrandPanel />

      <main className="login-panel">
        <div className="login-card">
          <div className="login-card__header">
            <Logo />
            <h2 className="login-card__title">Bem-vindo de volta</h2>
            <p className="login-card__subtitle">Entre com sua conta para continuar.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <FormAlert message={alert.message} variant={alert.variant} />

            <TextField
              id="email"
              label="E-mail"
              type="email"
              autoComplete="username"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={handleEmailChange}
              error={errors.email}
            />

            <PasswordField
              id="password"
              label="Senha"
              value={password}
              onChange={handlePasswordChange}
              error={errors.password}
              forgotPasswordSlot={
                <Link to="/recuperar-senha" className="link-inline">
                  Esqueceu a senha?
                </Link>
              }
            />

            <div className="field field--inline">
              <label className="checkbox">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="checkbox__box" aria-hidden="true"></span>
                Manter conectado
              </label>
            </div>

            <button type="submit" className="btn-primary">
              Entrar
            </button>
          </form>

          <p className="login-card__footer">
            Ainda não tem uma conta?{" "}
            <Link to="/cadastro" className="link-strong">
              Cadastre-se
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
