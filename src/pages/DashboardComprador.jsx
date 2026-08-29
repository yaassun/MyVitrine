import { useAuth } from "../auth/AuthContext.jsx";
import Button from "../components/Button.jsx";

const STATS = [
  { label: "Pedidos realizados", value: "0" },
  { label: "Lojas favoritas", value: "0" },
  { label: "Cupons disponíveis", value: "0" },
  { label: "Pontos de fidelidade", value: "0" },
];

const PEDIDOS = [];

function DashboardComprador() {
  const { user } = useAuth();
  const nome = user?.nome || "Comprador";

  return (
    <div className="dashboard">
      <div className="dashboard__inner">
        <header className="dashboard__header">
          <div>
            <p className="dashboard__eyebrow">Área do comprador</p>
            <h1 className="dashboard__title">Olá, {nome}</h1>
            <p className="dashboard__subtitle">
              Acompanhe seus pedidos e descubra novas lojas por aqui.
            </p>
          </div>
          <Button to="/lojistas">Explorar lojas</Button>
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
            <h2 className="dashboard-section__title">Últimos pedidos</h2>
          </div>

          {PEDIDOS.length === 0 ? (
            <p className="dashboard-empty">
              Você ainda não fez nenhum pedido. Explore as lojas para começar a comprar.
            </p>
          ) : (
            <ul className="dashboard-list">
              {PEDIDOS.map((pedido) => (
                <li className="dashboard-list__item" key={pedido.id}>
                  <span>{pedido.loja}</span>
                  <span className="dashboard-list__meta">{pedido.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default DashboardComprador;
