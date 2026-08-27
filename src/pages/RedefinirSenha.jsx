import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import BrandPanel from "../components/BrandPanel.jsx";
import FormAlert from "../components/FormAlert.jsx";
import Logo from "../components/Logo.jsx";
import PasswordField from "../components/PasswordField.jsx";

function RedefinirSenha() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // O backend deve gerar esse token e colocá-lo no link enviado por e-mail
  // na tela de recuperação (ex.: /redefinir-senha?token=abc123).
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [alert, setAlert] = useState({ message: "", variant: "error" });

  function clearFieldError(field) {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = { password: "", confirmPassword: "" };

    if (password === "") {
      nextErrors.password = "Crie uma nova senha.";
    }

    if (confirmPassword === "") {
      nextErrors.confirmPassword = "Confirme a nova senha.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "As senhas não coincidem.";
    }

    setErrors(nextErrors);

    if (nextErrors.password || nextErrors.confirmPassword) {
      setAlert({ message: "Verifique os campos destacados abaixo.", variant: "error" });
      return;
    }

    // Envio real ainda não implementado nesta etapa.
    // Quando existir POST /api/v1/auth/redefinir-senha de verdade, troque
    // isto pela chamada real, enviando { token, password }.
    setAlert({
      message: "Senha redefinida com sucesso! Redirecionando para o login...",
      variant: "success",
    });

    setTimeout(() => navigate("/login", { replace: true }), 900);
  }

  return (
    <div className="page">
      <BrandPanel />

      <main className="login-panel">
        <div className="login-card">
          <div className="login-card__header">
            <Logo />
            <h2 className="login-card__title">Crie uma nova senha</h2>
            <p className="login-card__subtitle">
              Escolha uma nova senha para acessar sua conta.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <FormAlert message={alert.message} variant={alert.variant} />

            {!token && (
              <FormAlert
                message="Este link parece inválido ou expirado. Solicite um novo na tela de recuperação de senha."
                variant="error"
              />
            )}

            <PasswordField
              id="password"
              label="Nova senha"
              placeholder="Crie uma nova senha"
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError("password");
                clearFieldError("confirmPassword");
              }}
              error={errors.password}
            />

            <PasswordField
              id="confirmPassword"
              label="Confirmar nova senha"
              placeholder="Repita a nova senha"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearFieldError("confirmPassword");
              }}
              error={errors.confirmPassword}
            />

            <button type="submit" className="btn-primary">
              Redefinir senha
            </button>
          </form>

          <p className="login-card__footer">
            <Link to="/login" className="link-strong">
              Voltar para o login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default RedefinirSenha;
