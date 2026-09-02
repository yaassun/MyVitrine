import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandPanel from "../components/BrandPanel.jsx";
import FormAlert from "../components/FormAlert.jsx";
import Logo from "../components/Logo.jsx";
import ProfileImageUpload from "../components/ProfileImageUpload.jsx";
import SelectField from "../components/SelectField.jsx";
import TextareaField from "../components/TextareaField.jsx";
import TextField from "../components/TextField.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import { authFetch } from "../auth/authClient.js";

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

function PerfilLojista() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [storeName, setStoreName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [logoFile, setLogoFile] = useState(null);

  const [errors, setErrors] = useState({
    storeName: "",
    ownerName: "",
    description: "",
    category: "",
  });
  const [alert, setAlert] = useState({ message: "", variant: "error" });

  function clearFieldError(field) {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
  }

  function handleStoreNameChange(event) {
    setStoreName(event.target.value);
    clearFieldError("storeName");
  }

  function handleOwnerNameChange(event) {
    setOwnerName(event.target.value);
    clearFieldError("ownerName");
  }

  function handleDescriptionChange(event) {
    setDescription(event.target.value);
    clearFieldError("description");
  }

  function handleCategoryChange(event) {
    setCategory(event.target.value);
    clearFieldError("category");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {
      storeName: storeName.trim() === "" ? "Digite o nome da sua loja." : "",
      ownerName: ownerName.trim() === "" ? "Digite o nome do responsável." : "",
      description:
        description.trim() === ""
          ? "Escreva uma breve descrição da sua loja."
          : "",
      category: category === "" ? "Selecione uma categoria." : "",
    };

    setErrors(nextErrors);

    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) {
      setAlert({ message: "Verifique os campos destacados abaixo.", variant: "error" });
      return;
    }

    try {
      const response = await authFetch("/api/store-profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          storeName,
          ownerName,
          description,
          category,
          instagram,
          website,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao salvar o perfil da loja.");
      }

      setAlert({
        message: "Perfil da loja salvo com sucesso no banco! Redirecionando...",
        variant: "success",
      });

      setUser((prev) => ({ ...prev, tipo: "lojista" }));
      setTimeout(() => navigate("/dashboard", { replace: true }), 900);
    } catch (err) {
      setAlert({ message: err.message || "Erro de conexão com o servidor.", variant: "error" });
    }
  }

  function handleBack(event) {
    event.preventDefault();
    navigate("/selecionar-perfil");
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
                onFileSelected={setLogoFile}
              />

              <div className="profile-form__top-field">
                <TextField
                  id="storeName"
                  label="Nome da loja"
                  autoComplete="organization"
                  placeholder="Digite o nome da sua loja"
                  value={storeName}
                  onChange={handleStoreNameChange}
                  error={errors.storeName}
                />
              </div>
            </div>

            <TextField
              id="ownerName"
              label="Nome do responsável"
              autoComplete="name"
              placeholder="Digite seu nome"
              value={ownerName}
              onChange={handleOwnerNameChange}
              error={errors.ownerName}
            />

            <SelectField
              id="category"
              label="Categoria da loja"
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