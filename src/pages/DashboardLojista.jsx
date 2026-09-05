import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import Button from "../components/Button.jsx";
import { getStoreDashboard, formatProductMoney } from "../services/productService.js";

function DashboardLojista() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const nome = user?.nome || "Lojista";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getStoreDashboard()
      .then(setData)
      .catch((err) => {
        if (err.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        setError(err.message || "Não foi possível carregar o dashboard.");
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Produtos cadastrados", value: data?.totalProducts ?? 0 },
    { label: "Produtos ativos", value: data?.activeProducts ?? 0 },
    { label: "Produtos inativos", value: data?.inactiveProducts ?? 0 },
    { label: "Vendas realizadas", value: data?.totalSales ?? 0 },
    { label: "Valor total das vendas", value: formatProductMoney(data?.totalSalesAmount) },
    { label: "Contratações", value: data?.totalHirings ?? 0 },
    { label: "Contratações pendentes", value: data?.pendingHirings ?? 0 },
    { label: "Contratações ativas", value: data?.activeHirings ?? 0 },
    { label: "Contratações concluídas", value: data?.completedHirings ?? 0 },
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
            <Button to="/store/produtos">Meus produtos</Button>
            <Button to="/criadores" variant="secondary">Buscar criadores</Button>
          </div>
        </header>

        {error && <div className="dashboard-error">{error}</div>}
        <section className="dashboard__grid">
          {stats.map((stat) => (
            <div className="dashboard-card" key={stat.label}>
              <p className="dashboard-card__label">{stat.label}</p>
              <p className="dashboard-card__value">{loading ? "..." : stat.value}</p>
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
