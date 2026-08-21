import { useState } from "react";
import BrandPanel from "../components/BrandPanel.jsx";
import FormAlert from "../components/FormAlert.jsx";
import Logo from "../components/Logo.jsx";
import PasswordField from "../components/PasswordField.jsx";
import TextField from "../components/TextField.jsx";
import { Link } from "react-router-dom";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Cadastro({onSignupSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [alert, setAlert] = useState({ message: "", variant: "error" });

  function clearFieldError(field) {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
  }

  function handleNameChange(event) {
    setName(event.target.value);
    clearFieldError("name");
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
    clearFieldError("email");
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
    clearFieldError("password");
    // Se o usuário já tinha digitado a confirmação, revalida ao editar a senha.
    clearFieldError("confirmPassword");
  }

  function handleConfirmPasswordChange(event) {
    setConfirmPassword(event.target.value);
    clearFieldError("confirmPassword");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    const nextErrors = { name: "", email: "", password: "", confirmPassword: "" };

    if (trimmedName === "") {
      nextErrors.name = "Informe seu nome.";
    }

    if (trimmedEmail === "") {
      nextErrors.email = "Informe seu e-mail.";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      nextErrors.email = "Informe um e-mail válido.";
    }

    if (password === "") {
      nextErrors.password = "Crie uma senha.";
    }

    if (confirmPassword === "") {
      nextErrors.confirmPassword = "Confirme sua senha.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "As senhas não coincidem.";
    }

    setErrors(nextErrors);

    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) {
      setAlert({ message: "Verifique os campos destacados abaixo.", variant: "error" });
      return;
    }

    // Cadastro real ainda não implementado nesta etapa.
    // Simulação apenas para exercitar a interface e a navegação.
    setAlert({
      message: "Conta criada com sucesso! Redirecionando para a próxima etapa...",
      variant: "success",
    });

    setTimeout(() => {
      onSignupSuccess?.();
    }, 900);
  }

  return (
    <div className="page">
      <BrandPanel />

      <main className="login-panel">
        <div className="login-card">
          <div className="login-card__header">
            <Logo />
            <h2 className="login-card__title">Crie sua conta</h2>
            <p className="login-card__subtitle">
              Cadastre-se para começar. Na próxima etapa você escolhe se é
              lojista, afiliado ou criador de conteúdo.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <FormAlert message={alert.message} variant={alert.variant} />

            <TextField
              id="name"
              label="Nome"
              autoComplete="name"
              placeholder="Seu nome completo"
              value={name}
              onChange={handleNameChange}
              error={errors.name}
            />

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
              placeholder="Crie uma senha"
              autoComplete="new-password"
              value={password}
              onChange={handlePasswordChange}
              error={errors.password}
            />

            <PasswordField
              id="confirmPassword"
              label="Confirmar senha"
              placeholder="Repita a senha"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={errors.confirmPassword}
            />

            <button type="submit" className="btn-primary">
              Criar conta
            </button>
          </form>

          <p className="login-card__footer">
            Já possui uma conta?{" "}
            <Link to="/login" className="link-strong">
              Entrar
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Cadastro;
