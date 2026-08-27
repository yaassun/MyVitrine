import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const PROFILE_LABELS = {
  lojista: "Lojista",
  afiliado: "Afiliado",
  criador: "Criador de conteúdo",
};

function DashboardPlaceholder() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const label = PROFILE_LABELS[user?.tipo] || "usuário";

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
        <button className="btn-primary" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </div>
  );
}

export default DashboardPlaceholder;
