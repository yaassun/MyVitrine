import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandPanel from "../components/BrandPanel.jsx";
import FormAlert from "../components/FormAlert.jsx";
import Logo from "../components/Logo.jsx";
import PasswordField from "../components/PasswordField.jsx";
import TextField from "../components/TextField.jsx";
import SelectField from "../components/SelectField.jsx";


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PROFILE_OPTIONS = [
  { value: "STORE", label: "Lojista" },
  { value: "AFFILIATE", label: "Afiliado" },
  { value: "CREATOR", label: "Criador de conteúdo" },
];

function Cadastro() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileType, setProfileType] = useState("STORE");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileType: "",
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
    clearFieldError("confirmPassword");
  }

  function handleConfirmPasswordChange(event) {
    setConfirmPassword(event.target.value);
    clearFieldError("confirmPassword");
  }

  function handleProfileTypeChange(event) {
    setProfileType(event.target.value);
    clearFieldError("profileType");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    const nextErrors = { name: "", email: "", password: "", confirmPassword: "", profileType: "" };

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
    }else if (password.length < 8) {
      nextErrors.password = "A senha deve ter pelo menos 8 caracteres.";
    }

    if (confirmPassword === "") {
      nextErrors.confirmPassword = "Confirme sua senha.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "As senhas não coincidem.";
    }

    if (!profileType) {
      nextErrors.profileType = "Selecione um tipo de perfil.";
    }

    setErrors(nextErrors);

    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) {
      setAlert({ message: "Verifique os campos destacados abaixo.", variant: "error" });
      return;
    }

  try {
      const response = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao criar a conta ");
      }
      const userData = await response.json(); 
      setAlert({
        message: "Redirecionando...",
        variant: "success",
      });
      setTimeout(() => {
        if (profileType === "STORE") {
          navigate("/perfil-lojista", { state: { userId: userData.id } });
        } else if (profileType === "AFFILIATE") {
          navigate("/perfil-afiliado", { state: { userId: userData.id } });
        } else if (profileType === "CREATOR") {
          navigate("/perfil-criador", { state: { userId: userData.id } });
        }
      }, 1000);

    } catch (err) {
      setAlert({ message: err.message || "Erro ao conectar com o servidor.", variant: "error" });
    }
  
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
              Cadastre-se definindo seu perfil para começar na MyVitrine.
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

            <SelectField
              id="profileType"
              label="Tipo de conta"
              value={profileType}
              onChange={handleProfileTypeChange}
              error={errors.profileType}
            >
              {PROFILE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>

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