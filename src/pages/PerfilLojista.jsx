import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BrandPanel from "../components/BrandPanel.jsx";
import FormAlert from "../components/FormAlert.jsx";
import Logo from "../components/Logo.jsx";
import ProfileImageUpload from "../components/ProfileImageUpload.jsx";
import SelectField from "../components/SelectField.jsx";
import TextareaField from "../components/TextareaField.jsx";
import TextField from "../components/TextField.jsx";

const NICHES = [
  "Moda",
  "Beleza",
  "Alimentação",
  "Casa e decoração",
  "Eletrônicos",
  "Saúde e bem-estar",
  "Artesanato",
  "Outros",
];

function PerfilLojista() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  useEffect(() => {
    if (!userId) {
      navigate("/cadastro", { replace: true });
    }
  }, [userId, navigate]);

  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [niche, setNiche] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [logoFile, setLogoFile] = useState(null);

  const [errors, setErrors] = useState({
    storeName: "",
    description: "",
    niche: "",
    cnpj: "",
  });
  const [alert, setAlert] = useState({ message: "", variant: "error" });

  function clearFieldError(field) {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
  }

  function handleStoreNameChange(event) {
    setStoreName(event.target.value);
    clearFieldError("storeName");
  }

  function handleDescriptionChange(event) {
    setDescription(event.target.value);
    clearFieldError("description");
  }

  function handleNicheChange(event) {
    setNiche(event.target.value);
    clearFieldError("niche");
  }

  function handleCnpjChange(event) {
    setCnpj(event.target.value);
    clearFieldError("cnpj");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {
      storeName: storeName.trim() === "" ? "Digite o nome da sua loja." : "",
      description: description.trim() === "" ? "Escreva uma breve descrição da sua loja." : "",
      niche: niche === "" ? "Selecione um nicho." : "",
      cnpj: cnpj.trim() === "" ? "Informe o CNPJ." : "",
    };

    setErrors(nextErrors);

    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) {
      setAlert({ message: "Verifique os campos destacados abaixo.", variant: "error" });
      return;
    }

    const socialNetworks = [];
    if (instagram.trim()) socialNetworks.push({ name: "Instagram", url: instagram.trim() });
    if (website.trim()) socialNetworks.push({ name: "Site", url: website.trim() });

    try {
      const response = await fetch("http://localhost:8080/api/creator-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          storeName: storeName.trim(),
          description: description.trim(),
          niche: niche,
          cnpj: cnpj.trim(),
          socialNetworks: socialNetworks,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao criar o perfil da loja.");
      }

      setAlert({
        message: "Perfil da loja criado com sucesso! Redirecionando para o login...",
        variant: "success",
      });

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);

    } catch (err) {
      setAlert({ message: err.message || "Erro ao conectar com o servidor.", variant: "error" });
    }
  }

  function handleBack(event) {
    event.preventDefault();
    navigate("/cadastro");
  }

  return (
    <div className="page">
      <BrandPanel />

      <main className="login-panel">
        <div className="login-card login-card--wide">
          <div className="login-card__header">
            <Logo />
            <h2 className="login-card__title">Vamos criar o perfil da sua loja</h2>
            <p className="login-card__subtitle">
              Conte um pouco sobre sua marca para que afiliados e criadores
              possam conhecer seu negócio.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <FormAlert message={alert.message} variant={alert.variant} />

            <div className="profile-form__top">
              <ProfileImageUpload
                id="storeLogo"
                label="Nenhuma logo selecionada."
                altText="Prévia da logo selecionada"
                placeholderText="Adicionar logo"
                onFileSelected={setLogoFile}
              />

              <div className="profile-form__top-field">
                <TextField
                  id="storeName"
                  label="Nome da loja"
                  autoComplete="organization"
                  placeholder="Como sua loja aparecerá na plataforma"
                  value={storeName}
                  onChange={handleStoreNameChange}
                  error={errors.storeName}
                />
              </div>
            </div>

            <TextField
              id="cnpj"
              label="CNPJ"
              placeholder="00.000.000/0000-00"
              value={cnpj}
              onChange={handleCnpjChange}
              error={errors.cnpj}
            />

            <SelectField
              id="niche"
              label="Nicho da loja"
              value={niche}
              onChange={handleNicheChange}
              error={errors.niche}
              placeholder="Selecione um nicho"
            >
              {NICHES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectField>

            <TextareaField
              id="description"
              label="Descrição da loja"
              placeholder="Conte brevemente sobre sua loja, seus produtos e sua marca..."
              value={description}
              onChange={handleDescriptionChange}
              error={errors.description}
            />

            <div className="field-row">
              <TextField
                id="instagram"
                label="Instagram"
                placeholder="@suamarca"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />

              <TextField
                id="website"
                label="Site"
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

export default PerfilLojista;