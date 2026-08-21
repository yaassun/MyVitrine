import { useState } from "react";
import BrandPanel from "../components/BrandPanel.jsx";
import FormAlert from "../components/FormAlert.jsx";
import Logo from "../components/Logo.jsx";
import ProfileImageUpload from "../components/ProfileImageUpload.jsx";
import SelectField from "../components/SelectField.jsx";
import TextareaField from "../components/TextareaField.jsx";
import TextField from "../components/TextField.jsx";

// Mesmas categorias usadas por lojistas e afiliados, para permitir
// cruzar criadores de conteúdo com marcas e produtos do mesmo nicho.
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

function PerfilCriador({ onNavigateBack, onProfileComplete }) {
  const [creatorName, setCreatorName] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [site, setSite] = useState("");
  const [photoFile, setPhotoFile] = useState(null);

  const [errors, setErrors] = useState({
    creatorName: "",
    fullName: "",
    bio: "",
    category: "",
  });
  const [alert, setAlert] = useState({ message: "", variant: "error" });

  function clearFieldError(field) {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
  }

  function handleCreatorNameChange(event) {
    setCreatorName(event.target.value);
    clearFieldError("creatorName");
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
      creatorName:
        creatorName.trim() === "" ? "Digite seu nome de criador." : "",
      fullName: fullName.trim() === "" ? "Digite seu nome completo." : "",
      bio:
        bio.trim() === ""
          ? "Conte um pouco sobre você e seu conteúdo."
          : "",
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
      message: "Perfil de criador salvo! Redirecionando para o seu painel...",
      variant: "success",
    });

    setTimeout(() => {
      onProfileComplete?.({
        creatorName: creatorName.trim(),
        fullName: fullName.trim(),
        bio: bio.trim(),
        category,
        instagram: instagram.trim(),
        tiktok: tiktok.trim(),
        site: site.trim(),
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
            <h2 className="login-card__title">Vamos criar seu perfil de criador de conteúdo</h2>
            <p className="login-card__subtitle">
              Conte um pouco sobre você para que marcas e lojistas conheçam
              seu conteúdo e seu estilo.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <FormAlert message={alert.message} variant={alert.variant} />

            <div className="profile-form__top">
              <ProfileImageUpload
                id="creatorPhoto"
                label="Nenhuma foto selecionada."
                altText="Prévia da foto de perfil selecionada"
                placeholderText="Adicionar foto"
                onFileSelected={setPhotoFile}
              />

              <div className="profile-form__top-field">
                <TextField
                  id="creatorName"
                  label="Nome de criador"
                  autoComplete="nickname"
                  placeholder="Como você quer ser encontrado(a) na plataforma"
                  value={creatorName}
                  onChange={handleCreatorNameChange}
                  error={errors.creatorName}
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
              label="Categoria de conteúdo"
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
              placeholder="Conte brevemente sobre você, o tipo de conteúdo que produz e seu estilo..."
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
                id="tiktok"
                label="TikTok"
                placeholder="@seuperfil"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
              />
            </div>

            <TextField
              id="site"
              label="Site, portfólio ou YouTube"
              placeholder="https://..."
              value={site}
              onChange={(e) => setSite(e.target.value)}
            />

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

export default PerfilCriador;
