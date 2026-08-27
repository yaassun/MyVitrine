import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandPanel from "../components/BrandPanel.jsx";
import Logo from "../components/Logo.jsx";
import ProfileCard from "../components/ProfileCard.jsx";

const PROFILES = [
  {
    id: "lojista",
    title: "Lojista",
    description: "Cadastre seus produtos, encontre parceiros e acompanhe suas vendas.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10V20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V10" />
        <path d="M2.5 6.5 4 3h16l1.5 3.5A2.5 2.5 0 0 1 19 10a2.5 2.5 0 0 1-2.5-2.5A2.5 2.5 0 0 1 14 10a2.5 2.5 0 0 1-2.5-2.5A2.5 2.5 0 0 1 9 10a2.5 2.5 0 0 1-2.5-2.5A2.5 2.5 0 0 1 4 10a2.5 2.5 0 0 1-1.5-3.5Z" />
        <path d="M9 21v-5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5" />
      </svg>
    ),
  },
  {
    id: "afiliado",
    title: "Afiliado",
    description: "Encontre produtos para divulgar e acompanhe suas vendas e comissões.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.07 0l2.5-2.5a5 5 0 0 0-7.07-7.07L11 4.9" />
        <path d="M14 11a5 5 0 0 0-7.07 0l-2.5 2.5a5 5 0 0 0 7.07 7.07L13 19.1" />
      </svg>
    ),
  },
  {
    id: "criador",
    title: "Criador de conteúdo",
    description: "Encontre oportunidades, produza conteúdos para marcas e acompanhe seus cachês.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="6" width="14" height="12" rx="2.5" />
        <path d="M16.5 10.5 21 8v8l-4.5-2.5" />
      </svg>
    ),
  },
];

const PROFILE_ROUTES = {
  lojista: "/perfil-lojista",
  afiliado: "/perfil-afiliado",
  criador: "/perfil-criador",
};

function SelecaoPerfil() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  function handleContinue() {
    if (!selected) return;
    navigate(PROFILE_ROUTES[selected] || "/dashboard");
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
            <h2 className="login-card__title">Como você quer usar a MyVitrine?</h2>
            <p className="login-card__subtitle">
              Escolha o perfil que melhor representa você para personalizarmos sua experiência.
            </p>
          </div>

          <div
            className="profile-grid"
            role="radiogroup"
            aria-label="Tipo de conta"
          >
            {PROFILES.map((profile) => (
              <ProfileCard
                key={profile.id}
                icon={profile.icon}
                title={profile.title}
                description={profile.description}
                selected={selected === profile.id}
                onSelect={() => setSelected(profile.id)}
              />
            ))}
          </div>

          <button
            type="button"
            className="btn-primary"
            disabled={!selected}
            onClick={handleContinue}
          >
            Continuar
          </button>

          <p className="login-card__footer">
            <a href="#" className="link-inline" onClick={handleBack}>
              Voltar
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

export default SelecaoPerfil;
