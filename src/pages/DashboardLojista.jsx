import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import Button from "../components/Button.jsx";
import { formatProductMoney, getStoreDashboard } from "../services/productService.js";

function DashboardLojista() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const nome = user?.name || user?.fullName || user?.nome || "Lojista";
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getStoreDashboard()
      .then(setDashboard)
      .catch((err) => {
        if (err.status === 401) {
          navigate("/login", { replace: true });
        } else {
          setError(err.message || "Não foi possível carregar o dashboard.");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const stats = [
    ["Produtos cadastrados", dashboard?.totalProducts ?? 0],
    ["Produtos ativos", dashboard?.activeProducts ?? 0],
    ["Produtos inativos", dashboard?.inactiveProducts ?? 0],
    ["Vendas realizadas", dashboard?.totalSales ?? 0],
    ["Valor total das vendas", formatProductMoney(dashboard?.totalSalesAmount)],
    ["Contratações", dashboard?.totalHirings ?? 0],
    ["Contratações pendentes", dashboard?.pendingHirings ?? 0],
    ["Contratações ativas", dashboard?.activeHirings ?? 0],
    ["Contratações concluídas", dashboard?.completedHirings ?? 0],
  ];

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
            <Button to="/store/produtos">Gerenciar produtos</Button>
            <Button to="/criadores">Buscar criadores</Button>
            <Button to="/store/perfil" variant="secondary">Meu perfil</Button>
          </div>
        </header>

        {error && <div className="dashboard-error">{error}</div>}
        <section className="dashboard__grid">
          {stats.map(([label, value]) => (
            <div className="dashboard-card" key={label}>
              <p className="dashboard-card__label">{label}</p>
              <p className="dashboard-card__value">{loading ? "..." : value}</p>
            </div>
          ))}
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section__header">
            <h2 className="dashboard-section__title">Atividade recente</h2>
          </div>

          <p className="dashboard-empty">Acompanhe aqui o desempenho dos seus produtos e contratações.</p>
        </section>
      </div>
    </div>
  );
}

export default DashboardLojista;