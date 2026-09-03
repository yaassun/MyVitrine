import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const PROFILE_LABELS = {
  STORE: "Lojista",
  AFFILIATE: "Afiliado",
  CREATOR: "Criador de conteúdo",
};

function DashboardPlaceholder() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const label = PROFILE_LABELS[user?.profileType] || "usuário";

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="page-placeholder">
      <div className="page-placeholder__card">
        <p className="page-placeholder__eyebrow">Área do {label}</p>
        <h1>Dashboard do {label} em desenvolvimento.</h1>
        <p>Essa área ainda será construída nas próximas etapas do projeto.</p>
      </div>
    </div>
  );
}

export default DashboardPlaceholder;
