import { useAuth } from "../auth/AuthContext.jsx";
import Button from "../components/Button.jsx";

const STATS = [
  { label: "Produtos cadastrados", value: "0" },
  { label: "Criadores parceiros", value: "0" },
  { label: "Afiliados ativos", value: "0" },
  { label: "Vendas do mês", value: "R$ 0,00" },
];

const ATIVIDADES = [];

function DashboardLojista() {
  const { user } = useAuth();
  const nome = user?.nome || "Lojista";

  return (
    <div className="dashboard">
      <div className="dashboard__inner">
        <header className="dashboard__header">
          <div>
            <p className="dashboard__eyebrow">Área do lojista</p>
            <h1 className="dashboard__title">Olá, {nome}</h1>
            <p className="dashboard__subtitle">
              Gerencie sua loja, criadores e afiliados por aqui.
            </p>
          </div>
          <div className="dashboard__actions">
            <Button to="/store/produtos/novo" variant="primary">Cadastrar Produto</Button>
            <Button to="/criadores">Buscar criadores</Button>
            <Button to="/store/perfil" variant="secondary">Meu perfil</Button>
          </div>
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
            <h2 className="dashboard-section__title">Atividade recente</h2>
          </div>

          {ATIVIDADES.length === 0 ? (
            <p className="dashboard-empty">
              Nenhuma atividade por aqui ainda. Convide criadores ou afiliados para começar.
            </p>
          ) : (
            <ul className="dashboard-list">
              {ATIVIDADES.map((atividade) => (
                <li className="dashboard-list__item" key={atividade.id}>
                  <span>{atividade.descricao}</span>
                  <span className="dashboard-list__meta">{atividade.data}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default DashboardLojista;