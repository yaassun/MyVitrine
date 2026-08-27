import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandPanel from "../components/BrandPanel.jsx";
import FormAlert from "../components/FormAlert.jsx";
import Logo from "../components/Logo.jsx";
import TextField from "../components/TextField.jsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RecuperarSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [alert, setAlert] = useState({ message: "", variant: "error" });

  function handleChange(event) {
    setEmail(event.target.value);
    if (error) setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (trimmedEmail === "") {
      setError("Informe seu e-mail.");
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError("Informe um e-mail válido.");
      return;
    }

    // Envio real ainda não implementado nesta etapa.
    // Quando existir POST /api/v1/auth/recuperar-senha de verdade, troque
    // isto pela chamada real (que deve enviar um e-mail com um link para
    // /redefinir-senha?token=... gerado pelo backend).
    setAlert({
      message: "Se esse e-mail existir na nossa base, enviaremos um link de recuperação.",
      variant: "success",
    });
  }

  return (
    <div className="page">
      <BrandPanel />

      <main className="login-panel">
        <div className="login-card">
          <div className="login-card__header">
            <Logo />
            <h2 className="login-card__title">Recuperar senha</h2>
            <p className="login-card__subtitle">
              Informe o e-mail da sua conta e enviaremos um link para você
              criar uma nova senha.
            </p>
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
              onChange={handleChange}
              error={error}
            />

            <button type="submit" className="btn-primary">
              Enviar link de recuperação
            </button>
          </form>

          <p className="login-card__footer">
            Lembrou a senha?{" "}
            <Link to="/login" className="link-strong">
              Voltar para o login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default RecuperarSenha;
