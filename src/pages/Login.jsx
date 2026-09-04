import { loginUser } from "../auth/authClient.js";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BrandPanel from "../components/BrandPanel.jsx";
import FormAlert from "../components/FormAlert.jsx";
import Logo from "../components/Logo.jsx";
import PasswordField from "../components/PasswordField.jsx";
import TextField from "../components/TextField.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  async function handleSubmit(event) {
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

    try {
      const data = await loginUser(trimmedEmail, password);

      setAlert({
        message: "Login realizado! Redirecionando...",
        variant: "success",
      });

      setUser(data.user);

      let redirectTo = location.state?.from;
      
      if (!redirectTo) {
        const profileType = data.user?.profileType;
        if (profileType === "STORE") {
          redirectTo = "/dashboard/store";
        } else if (profileType === "AFFILIATE") {
          redirectTo = "/dashboard/affiliate";
        } else if (profileType === "CREATOR") {
          redirectTo = "/dashboard/creator";
        } else {
          redirectTo = "/dashboard";
        }
      }

      setTimeout(() => navigate(redirectTo, { replace: true }), 600);
    } catch (err) {
      if (err.code === "INCOMPLETE_REGISTRATION") {
        navigate("/concluir-cadastro", { state: { email: trimmedEmail } });
        return;
      }

      setAlert({ message: err.message || "E-mail ou senha inválidos.", variant: "error" });
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