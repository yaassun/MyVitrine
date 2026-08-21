import { useState } from "react";
import BrandPanel from "../components/BrandPanel.jsx";
import FormAlert from "../components/FormAlert.jsx";
import Logo from "../components/Logo.jsx";
import ProfileImageUpload from "../components/ProfileImageUpload.jsx";
import SelectField from "../components/SelectField.jsx";
import TextareaField from "../components/TextareaField.jsx";
import TextField from "../components/TextField.jsx";

// Categorias de produtos que o afiliado costuma divulgar. Mantidas
// alinhadas às categorias de loja para facilitar o cruzamento entre
// afiliados e lojistas no futuro (ex.: sugestão de parcerias).
const CATEGORIES = [
  "Moda",
  "Beleza",
  "Alimentação",
  "Casa e decoração",
  "Eletrônicos",
  "Saúde e bem-estar",
  "Artesanato",
  "Outros",
];

function PerfilAfiliado({ onNavigateBack, onProfileComplete }) {
  const [displayName, setDisplayName] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [photoFile, setPhotoFile] = useState(null);

  const [errors, setErrors] = useState({
    displayName: "",
    fullName: "",
    bio: "",
    category: "",
  });
  const [alert, setAlert] = useState({ message: "", variant: "error" });

  function clearFieldError(field) {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
  }

  function handleDisplayNameChange(event) {
    setDisplayName(event.target.value);
    clearFieldError("displayName");
  }

  function handleFullNameChange(event) {
    setFullName(event.target.value);
    clearFieldError("fullName");
  }

  function handleBioChange(event) {
    setBio(event.target.value);
    clearFieldError("bio");
  }

  function handleCategoryChange(event) {
    setCategory(event.target.value);
    clearFieldError("category");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {
      displayName:
        displayName.trim() === "" ? "Digite seu nome de divulgação." : "",
      fullName: fullName.trim() === "" ? "Digite seu nome completo." : "",
      bio: bio.trim() === "" ? "Conte um pouco sobre você." : "",
      category: category === "" ? "Selecione uma categoria." : "",
    };

    setErrors(nextErrors);

    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) {
      setAlert({ message: "Verifique os campos destacados abaixo.", variant: "error" });
      return;
    }

    // Persistência real ainda não implementada nesta etapa.
    // Os dados ficam apenas em estado React enquanto a página estiver aberta.
    setAlert({
      message: "Perfil de afiliado salvo! Redirecionando para o seu painel...",
      variant: "success",
    });

    setTimeout(() => {
      onProfileComplete?.({
        displayName: displayName.trim(),
        fullName: fullName.trim(),
        bio: bio.trim(),
        category,
        instagram: instagram.trim(),
        website: website.trim(),
        photoFile,
      });
    }, 900);
  }

  function handleBack(event) {
    event.preventDefault();
    onNavigateBack?.();
  }

  return (
    <div className="page">
      <BrandPanel />

      <main className="login-panel">
        <div className="login-card login-card--wide">
          <div className="login-card__header">
            <Logo />
            <h2 className="login-card__title">Vamos criar seu perfil de afiliado</h2>
            <p className="login-card__subtitle">
              Conte um pouco sobre você para que lojistas conheçam seu
              trabalho de divulgação.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <FormAlert message={alert.message} variant={alert.variant} />

            <div className="profile-form__top">
              <ProfileImageUpload
                id="affiliatePhoto"
                label="Nenhuma foto selecionada."
                altText="Prévia da foto de perfil selecionada"
                placeholderText="Adicionar foto"
                onFileSelected={setPhotoFile}
              />

              <div className="profile-form__top-field">
                <TextField
                  id="displayName"
                  label="Nome de divulgação"
                  autoComplete="nickname"
                  placeholder="Como você quer ser encontrado(a) na plataforma"
                  value={displayName}
                  onChange={handleDisplayNameChange}
                  error={errors.displayName}
                />
              </div>
            </div>

            <TextField
              id="fullName"
              label="Nome completo"
              autoComplete="name"
              placeholder="Digite seu nome completo"
              value={fullName}
              onChange={handleFullNameChange}
              error={errors.fullName}
            />

            <SelectField
              id="category"
              label="Categoria de atuação"
              value={category}
              onChange={handleCategoryChange}
              error={errors.category}
              placeholder="Selecione uma categoria"
            >
              {CATEGORIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectField>

            <TextareaField
              id="bio"
              label="Sobre você"
              placeholder="Conte brevemente sobre você, seu conteúdo e como costuma divulgar produtos..."
              value={bio}
              onChange={handleBioChange}
              error={errors.bio}
            />

            <div className="field-row">
              <TextField
                id="instagram"
                label="Instagram"
                placeholder="@seuperfil"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />

              <TextField
                id="website"
                label="Site ou outro canal"
                placeholder="https://..."
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <a href="#" className="link-inline" onClick={handleBack}>
                Voltar
              </a>

              <button type="submit" className="btn-primary">
                Continuar →
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default PerfilAfiliado;
