import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BrandPanel from "../components/BrandPanel.jsx";
import FormAlert from "../components/FormAlert.jsx";
import Logo from "../components/Logo.jsx";
import SelectField from "../components/SelectField.jsx";
import TextField from "../components/TextField.jsx";
import { findUserByEmail } from "../auth/authClient.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PROFILE_ROUTES = {
  STORE: "/perfil-lojista",
  AFFILIATE: "/perfil-afiliado",
  CREATOR: "/perfil-criador",
};

const PROFILE_OPTIONS = [
  { value: "STORE", label: "Lojista" },
  { value: "AFFILIATE", label: "Afiliado" },
  { value: "CREATOR", label: "Criador de conteúdo" },
];

function ConcluirCadastro() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [profileType, setProfileType] = useState("");
  const [errors, setErrors] = useState({ email: "", profileType: "" });
  const [alert, setAlert] = useState({ message: "", variant: "error" });

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const nextErrors = {
      email:
        trimmedEmail === ""
          ? "Informe seu e-mail."
          : !EMAIL_REGEX.test(trimmedEmail)
            ? "Informe um e-mail válido."
            : "",
      profileType: profileType ? "" : "Selecione um tipo de perfil.",
    };

    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.profileType) {
      setAlert({ message: "Verifique os campos destacados abaixo.", variant: "error" });
      return;
    }

    setAlert({ message: "Localizando seu cadastro...", variant: "success" });

    findUserByEmail(trimmedEmail)
      .then((user) => {
        const userId = user?.id ?? user?.userId;
        if (!userId) {
          throw new Error("O cadastro foi localizado, mas não possui um identificador válido.");
        }

        navigate(PROFILE_ROUTES[profileType], {
          state: { userId, email: trimmedEmail },
        });
      })
      .catch((error) => {
        setAlert({
          message: error.message || "Não foi possível localizar esse cadastro.",
          variant: "error",
        });
      });
  }

  return (
    <div className="page">
      <BrandPanel />

      <main className="login-panel">
        <div className="login-card">
          <div className="login-card__header">
            <Logo />
            <h2 className="login-card__title">Conclua seu cadastro</h2>
            <p className="login-card__subtitle">
              Encontramos um cadastro iniciado. Informe seus dados para continuar de onde parou.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <FormAlert message={alert.message} variant={alert.variant} />

            <TextField
              id="email"
              label="E-mail do cadastro"
              type="email"
              autoComplete="username"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrors((previous) => ({ ...previous, email: "" }));
              }}
              error={errors.email}
            />

            <SelectField
              id="profileType"
              label="Tipo de perfil"
              value={profileType}
              onChange={(event) => {
                setProfileType(event.target.value);
                setErrors((previous) => ({ ...previous, profileType: "" }));
              }}
              error={errors.profileType}
            >
              {PROFILE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>

            <button type="submit" className="btn-primary">
              Continuar cadastro
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

export default ConcluirCadastro;