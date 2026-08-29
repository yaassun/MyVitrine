import { useAuth } from "../auth/AuthContext.jsx";
import Button from "../components/Button.jsx";

const STATS = [
  { label: "Parcerias ativas", value: "0" },
  { label: "Propostas recebidas", value: "0" },
  { label: "Lojistas conectados", value: "0" },
  { label: "Comissão do mês", value: "R$ 0,00" },
];

const PROPOSTAS = [];

function DashboardCriador() {
  const { user } = useAuth();
  const nome = user?.nome || "Criador";

  return (
    <div className="dashboard">
      <div className="dashboard__inner">
        <header className="dashboard__header">
          <div>
            <p className="dashboard__eyebrow">Área do criador</p>
            <h1 className="dashboard__title">Olá, {nome}</h1>
            <p className="dashboard__subtitle">
              Acompanhe suas parcerias e propostas de lojistas por aqui.
            </p>
          </div>
          <Button to="/lojistas">Ver lojistas</Button>
        </header>

        <section className="dashboard__grid">
          {STATS.map((stat) => (
            <div className="dashboard-card" key={stat.label}>
              <p className="dashboard-card__label">{stat.label}</p>
              <p className="dashboard-card__value">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section__header">
            <h2 className="dashboard-section__title">Propostas recentes</h2>
          </div>

          {PROPOSTAS.length === 0 ? (
            <p className="dashboard-empty">
              Nenhuma proposta recebida ainda. Conecte-se com lojistas para começar.
            </p>
          ) : (
            <ul className="dashboard-list">
              {PROPOSTAS.map((proposta) => (
                <li className="dashboard-list__item" key={proposta.id}>
                  <span>{proposta.loja}</span>
                  <span className="dashboard-list__meta">{proposta.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default DashboardCriador;
