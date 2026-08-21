const PROFILE_LABELS = {
  lojista: "Lojista",
  afiliado: "Afiliado",
  criador: "Criador de conteúdo",
};

function DashboardPlaceholder({ profile, onNavigateToLogin }) {
  const label = PROFILE_LABELS[profile] || "usuário";

  function handleBackToLogin(event) {
    event.preventDefault();
    onNavigateToLogin?.();
  }

  return (
    <div className="page-placeholder">
      <div className="page-placeholder__card">
        <p className="page-placeholder__eyebrow">Área do {label}</p>
        <h1>Dashboard do {label} em desenvolvimento.</h1>
        <p>Essa área ainda será construída nas próximas etapas do projeto.</p>
        <button className="btn-primary" onClick={handleBackToLogin}>
          Voltar para o início
        </button>
      </div>
    </div>
  );
}

export default DashboardPlaceholder;
