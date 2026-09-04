import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BrandPanel from "../components/BrandPanel.jsx";
import FormAlert from "../components/FormAlert.jsx";
import Logo from "../components/Logo.jsx";
import ProfileImageUpload from "../components/ProfileImageUpload.jsx";
import SelectField from "../components/SelectField.jsx";
import TextareaField from "../components/TextareaField.jsx";
import TextField from "../components/TextField.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import { authFetch } from "../auth/authClient.js";
import { getUserIdentifier, upsertCreatorProfile } from "../services/creatorService.js";

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

function PerfilCriador() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();
  const registrationUserId = location.state?.userId;
  const currentUserId = getUserIdentifier(user) ?? registrationUserId;

  const [creatorName, setCreatorName] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [site, setSite] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [errors, setErrors] = useState({
    creatorName: "",
    bio: "",
    category: "",
  });
  const [alert, setAlert] = useState({ message: "", variant: "error" });

  useEffect(() => {
    if (!currentUserId && !registrationUserId) {
      navigate("/cadastro", { replace: true });
      return;
    }

    const loadProfile = async () => {
      if (!currentUserId) return;

      try {
        const response = await authFetch(`/api/creator-profiles/${currentUserId}`);
        if (!response.ok) return;

        const profile = await response.json();
        if (!profile) return;

        setIsEditing(true);
        setCreatorName(profile.creatorName || profile.name || "");
        setBio(profile.bio || "");
        setCategory(profile.niche || profile.category || "");

        const socials = profile.socialNetworks || [];
        const instagramProfile = socials.find((item) => /instagram/i.test(item.name || item.platform || ""));
        const tiktokProfile = socials.find((item) => /tiktok/i.test(item.name || item.platform || ""));
        const siteProfile = socials.find((item) => /site|youtube|portfolio/i.test(item.name || item.platform || ""));

        setInstagram(instagramProfile?.url || instagramProfile?.link || "");
        setTiktok(tiktokProfile?.url || tiktokProfile?.link || "");
        setSite(siteProfile?.url || siteProfile?.link || "");
      } catch (err) {
        console.warn("Perfil de criador ainda não foi criado.", err);
      }
    };

    loadProfile();
  }, [currentUserId, registrationUserId, navigate]);

  function clearFieldError(field) {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
  }

  function handleCreatorNameChange(event) {
    setCreatorName(event.target.value);
    clearFieldError("creatorName");
  }

  function handleBioChange(event) {
    setBio(event.target.value);
    clearFieldError("bio");
  }

  function handleCategoryChange(event) {
    setCategory(event.target.value);
    clearFieldError("category");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!currentUserId) {
      setAlert({ message: "Usuário autenticado não encontrado.", variant: "error" });
      return;
    }

    const nextErrors = {
      creatorName: creatorName.trim() === "" ? "Digite seu nome de criador." : "",
      bio: bio.trim() === "" ? "Conte um pouco sobre você e seu conteúdo." : "",
      category: category === "" ? "Selecione uma categoria." : "",
    };

    setErrors(nextErrors);

    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) {
      setAlert({ message: "Verifique os campos destacados abaixo.", variant: "error" });
      return;
    }

    const socialNetworks = [];
    if (instagram.trim()) socialNetworks.push({ name: "Instagram", url: instagram.trim() });
    if (tiktok.trim()) socialNetworks.push({ name: "TikTok", url: tiktok.trim() });
    if (site.trim()) socialNetworks.push({ name: "Site", url: site.trim() });

    try {
      const profilePayload = {
        userId: currentUserId,
        creatorName: creatorName.trim(),
        bio: bio.trim(),
        niche: category,
        socialNetworks,
        profilePhotoUrl: null,
      };

      await upsertCreatorProfile(currentUserId, profilePayload);

      setUser((prev) => ({ ...prev, profileType: "CREATOR", creatorName: creatorName.trim() }));
      if (isEditing) {
        navigate("/creator/perfil", {
          replace: true,
          state: { profileUpdated: true },
        });
      } else {
        setAlert({
          message: "Perfil criado com sucesso!",
          variant: "success",
        });
        setTimeout(() => navigate("/dashboard", { replace: true }), 900);
      }
    } catch (err) {
      setAlert({ message: err.message || "Erro ao conectar com o servidor.", variant: "error" });
    }
  }

  function handleBack(event) {
    event.preventDefault();
    navigate(isEditing ? "/creator/perfil" : "/cadastro");
  }

  return (
    <div className="page">
      <BrandPanel />

      <main className="login-panel">
        <div className="login-card login-card--wide">
          <div className="login-card__header">
            <Logo />
            <h2 className="login-card__title">{isEditing ? "Editar seu perfil de criador" : "Vamos criar seu perfil de criador de conteúdo"}</h2>
            <p className="login-card__subtitle">
              {isEditing
                ? "Atualize suas informações profissionais e redes sociais para manter seu perfil alinhado com o backend."
                : "Conte um pouco sobre você para que marcas e lojistas conheçam seu conteúdo e seu estilo."}
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
                {isEditing ? "Salvar perfil" : "Continuar →"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default PerfilCriador;
