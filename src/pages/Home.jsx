import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const HOME_BY_PROFILE = {
  STORE: {
    label: "Área do lojista",
    title: "Transforme sua loja em uma vitrine de novas parcerias.",
    description:
      "Apresente sua marca, encontre pessoas para divulgar seus produtos e acompanhe o crescimento do seu negócio em um só lugar.",
    profilePath: "/store/perfil",
    profileLabel: "Ver perfil da loja",
  },
  AFFILIATE: {
    label: "Área do afiliado",
    title: "Encontre produtos que combinam com o seu público.",
    description:
      "Conecte-se a lojas, escolha oportunidades de divulgação e acompanhe seus links, vendas e comissões.",
    profilePath: "/affiliate/perfil",
    profileLabel: "Ver meu perfil",
  },
  CREATOR: {
    label: "Área do criador",
    title: "Seu conteúdo pode aproximar marcas e novas audiências.",
    description:
      "Apresente seu trabalho, receba propostas de lojistas e acompanhe cada produção e cachê pela MyVitrine.",
    profilePath: "/creator/perfil",
    profileLabel: "Ver meu perfil",
  },
};

const DEFAULT_HOME = {
  label: "Bem-vindo à MyVitrine",
  title: "Onde marcas, afiliados e criadores se encontram.",
  description:
    "Acesse seu dashboard para acompanhar as oportunidades e informações disponíveis para sua conta.",
  profilePath: null,
  profileLabel: "Ver meu perfil",
};

function Home() {
  const { user } = useAuth();
  const content = HOME_BY_PROFILE[user?.profileType] || DEFAULT_HOME;
  const name = user?.name || user?.fullName || user?.nome || "por aqui";

  return (
    <main className="home">
      <div className="home__inner">
        <section className="home-hero">
          <div className="home-hero__content">
            <p className="home__eyebrow">{content.label}</p>
            <p className="home__welcome">Olá, {name}.</p>
            <h1 className="home__title">{content.title}</h1>
            <p className="home__description">{content.description}</p>

            <div className="home__actions">
              <Link className="home__button home__button--primary" to="/dashboard">
                Acessar dashboard
              </Link>
              {content.profilePath && (
                <Link className="home__button home__button--secondary" to={content.profilePath}>
                  {content.profileLabel}
                </Link>
              )}
            </div>
          </div>

          <div className="home-hero__visual" aria-hidden="true">
            <div className="home-vitrine">
              <span className="home-vitrine__square home-vitrine__square--one" />
              <span className="home-vitrine__square home-vitrine__square--two" />
              <span className="home-vitrine__square home-vitrine__square--three" />
              <span className="home-vitrine__square home-vitrine__square--four" />
            </div>
            <p>Conexões que viram oportunidades.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Home;
