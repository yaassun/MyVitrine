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
import { API_URL } from "../auth/authClient.js";
import {
  fetchAffiliateProfile,
  getProfileUserId,
  updateAffiliateProfile,
} from "../services/profileService.js";

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

function PerfilAfiliado() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const registrationUserId = location.state?.userId;
  const authenticatedUserId = getProfileUserId(user);
  const userId = authenticatedUserId ?? registrationUserId;
  const isEditing = location.pathname === "/affiliate/perfil/editar";
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);

  const [errors, setErrors] = useState({
    displayName: "",
    fullName: "",
    bio: "",
    category: "",
  });
  const [alert, setAlert] = useState({ message: "", variant: "error" });

  useEffect(() => {
    if (!userId) {
      navigate(isEditing ? "/dashboard" : "/cadastro", { replace: true });
      return;
    }

    if (!isEditing) return;

    let active = true;

    async function loadProfile() {
      try {
        const profile = await fetchAffiliateProfile(userId);
        if (!active) return;

        setDisplayName(user?.name || user?.fullName || "");
        setBio(profile.bio || "");
        setCategory(profile.niche || "");
        setProfilePhotoUrl(profile.profilePhotoUrl || null);

        const socials = Array.isArray(profile.socialNetworks) ? profile.socialNetworks : [];
        const instagramProfile = socials.find((item) => /instagram/i.test(item.name || item.platform || ""));
        const siteProfile = socials.find((item) => /site|website|canal/i.test(item.name || item.platform || ""));
        setInstagram(instagramProfile?.url || instagramProfile?.link || "");
        setWebsite(siteProfile?.url || siteProfile?.link || "");
      } catch (err) {
        if (active) {
          setAlert({ message: err.message || "Não foi possível carregar o perfil de afiliado.", variant: "error" });
        }
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [isEditing, navigate, user, userId]);

  function clearFieldError(field) {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
  }

  function handleDisplayNameChange(event) {
    setDisplayName(event.target.value);
    clearFieldError("displayName");
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

    const nextErrors = {
      displayName: displayName.trim() === "" ? "Digite seu nome de divulgação." : "",
      bio: bio.trim() === "" ? "Conte um pouco sobre você." : "",
      category: category === "" ? "Selecione uma categoria." : "",
    };

    setErrors(nextErrors);

    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) {
      setAlert({ message: "Verifique os campos destacados abaixo.", variant: "error" });
      return;
    }

    try {
      if (isEditing) {
        const socialNetworks = [];
        if (instagram.trim()) socialNetworks.push({ name: "Instagram", url: instagram.trim() });
        if (website.trim()) socialNetworks.push({ name: "Canal de divulgação", url: website.trim() });

        await updateAffiliateProfile(userId, {
          userId,
          bio: bio.trim(),
          niche: category,
          socialNetworks,
          profilePhotoUrl,
        });

        navigate("/affiliate/perfil", {
          replace: true,
          state: { profileUpdated: true },
        });
        return;
      }

      const response = await fetch(`${API_URL}/api/affiliate-profiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          bio: bio.trim(),
          niche: category, 
          socialNetworks: [
            ...(instagram.trim() ? [{ platform: "INSTAGRAM", url: instagram.trim() }] : []),
            ...(website.trim() ? [{ platform: "WEBSITE", url: website.trim() }] : []),
          ],
          profilePhotoUrl: null, 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao salvar o perfil de afiliado.");
      }

      setAlert({
        message: "Redirecionando para o login...",
        variant: "success",
      });

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);

    } catch (err) {
      setAlert({ message: err.message || "Erro ao conectar com o servidor.", variant: "error" });
    }
  }

  function handleBack(event) {
    event.preventDefault();
    navigate(isEditing ? "/affiliate/perfil" : "/selecionar-perfil");
  }

  return (
    <div className="page">
      <BrandPanel />

      <main className="login-panel">
        <div className="login-card login-card--wide">
          <div className="login-card__header">
            <Logo />
            <h2 className="login-card__title">
              {isEditing ? "Editar seu perfil de afiliado" : "Vamos criar seu perfil de afiliado"}
            </h2>
            <p className="login-card__subtitle">
              {isEditing
                ? "Atualize sua área de atuação, sua apresentação e os canais onde divulga produtos."
                : "Conte um pouco sobre você para que lojistas conheçam seu trabalho de divulgação."}
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
                {isEditing ? "Salvar perfil" : "Continuar →"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default PerfilAfiliado;
