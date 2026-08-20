import { useState } from "react";
import BrandPanel from "../components/BrandPanel.jsx";
import FormAlert from "../components/FormAlert.jsx";
import PasswordField from "../components/PasswordField.jsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Usuário fictício apenas para simular o login nesta etapa do MVP.
// Nenhuma autenticação real ou banco de dados está implementado ainda.
const MOCK_USER = {
  email: "usuario@myvitrine.com",
  password: "123456",
};

function Login() {
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
        message: "Login simulado com sucesso! (fluxo real ainda não implementado)",
        variant: "success",
      });
    } else {
      setAlert({ message: "E-mail ou senha inválidos.", variant: "error" });
    }
  }

  function handleForgotPassword(event) {
    event.preventDefault();
    setAlert({ message: "Recuperação de senha em breve.", variant: "error" });
  }

  return (
    <div className="page">
      <BrandPanel />

      <main className="login-panel">
        <div className="login-card">
          <div className="login-card__header">
            <span className="logo">
              <span className="logo__dot" aria-hidden="true"></span>
              MyVitrine
            </span>
            <h2 className="login-card__title">Bem-vindo de volta</h2>
            <p className="login-card__subtitle">Entre com sua conta para continuar.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <FormAlert message={alert.message} variant={alert.variant} />

            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="username"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={handleEmailChange}
                aria-describedby="email-error"
                aria-invalid={Boolean(errors.email)}
              />
              <p className="field__error" id="email-error" hidden={!errors.email}>
                {errors.email}
              </p>
            </div>

            <PasswordField
              id="password"
              label="Senha"
              value={password}
              onChange={handlePasswordChange}
              error={errors.password}
              forgotPasswordSlot={
                <a href="#" className="link-inline" onClick={handleForgotPassword}>
                  Esqueceu a senha?
                </a>
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
            Ainda não tem uma conta? <a href="#" className="link-strong">Cadastre-se</a>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
