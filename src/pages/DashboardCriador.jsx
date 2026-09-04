import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import Button from "../components/Button.jsx";
import {
  fetchCreatorDashboard,
  fetchCreatorHirings,
  formatDate,
  formatMoney,
  formatStatus,
  updateHiringStatus,
} from "../services/creatorService.js";

const STATUS_ORDER = [
  "REQUESTED",
  "ACCEPTED",
  "IN_PRODUCTION",
  "DELIVERED",
  "APPROVED",
  "REJECTED",
];

function DashboardCriador() {
  const { user } = useAuth();
  const nome = user?.name || user?.fullName || "Criador";

  const [dashboardData, setDashboardData] = useState(null);
  const [propostas, setPropostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [dashboard, hirings] = await Promise.all([
          fetchCreatorDashboard(),
          fetchCreatorHirings(),
        ]);

        setDashboardData(dashboard);
        setPropostas(hirings);
      } catch (err) {
        console.error("Erro ao carregar dashboard do criador:", err);
        setError(err.message || "Não foi possível carregar os dados do dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    if (!dashboardData?.metrics) {
      return [
        { label: "Total de trabalhos", value: "0" },
        { label: "Propostas pendentes", value: "0" },
        { label: "Trabalhos ativos", value: "0" },
        { label: "Trabalhos concluídos", value: "0" },
      ];
    }

    return [
      { label: "Total de trabalhos", value: dashboardData.metrics.totalJobs ?? 0 },
      { label: "Propostas pendentes", value: dashboardData.metrics.pendingProposals ?? 0 },
      { label: "Trabalhos ativos", value: dashboardData.metrics.activeJobs ?? 0 },
      { label: "Trabalhos concluídos", value: dashboardData.metrics.completedJobs ?? 0 },
      { label: "Receita total", value: formatMoney(dashboardData.metrics.totalFees ?? 0) },
      { label: "Cachês pendentes", value: formatMoney(dashboardData.metrics.pendingFees ?? 0) },
      { label: "Cachês aprovados", value: formatMoney(dashboardData.metrics.approvedFees ?? 0) },
    ];
  }, [dashboardData]);

  const recentJobs = dashboardData?.recentJobs ?? [];

  const groupedProposals = useMemo(() => {
    const grouped = Object.fromEntries(STATUS_ORDER.map((status) => [status, []]));

    propostas.forEach((proposta) => {
      const key = grouped[proposta.status] ? proposta.status : "REQUESTED";
      grouped[key].push(proposta);
    });

    return grouped;
  }, [propostas]);

  async function handleStatusChange(hiringId, nextStatus) {
    if (!hiringId) return;

    try {
      setBusyId(hiringId);
      await updateHiringStatus(hiringId, nextStatus);

      const [dashboard, hirings] = await Promise.all([
        fetchCreatorDashboard(),
        fetchCreatorHirings(),
      ]);

      setDashboardData(dashboard);
      setPropostas(hirings);
    } catch (err) {
      console.error("Erro ao atualizar status da proposta:", err);
      setError(err.message || "Não foi possível atualizar a proposta.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard__inner">
        <header className="dashboard__header">
          <div>
            <p className="dashboard__eyebrow">Área do criador</p>
            <h1 className="dashboard__title">Olá, {nome}</h1>
            <p className="dashboard__subtitle">
              Acompanhe suas propostas, trabalhos em andamento e seus cachês reais.
            </p>
          </div>

          <div className="dashboard__actions">
            <Button to="/creator/trabalhos">Meus trabalhos</Button>
            <Button to="/creator/perfil" variant="secondary">Meu perfil</Button>
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
            <h2 className="dashboard-section__title">Trabalhos recentes</h2>
            <Button to="/creator/trabalhos" variant="secondary">Ver histórico</Button>
          </div>

          {loading ? (
            <p className="dashboard-empty">Carregando trabalhos recentes...</p>
          ) : recentJobs.length === 0 ? (
            <p className="dashboard-empty">Nenhum trabalho recente encontrado.</p>
          ) : (
            <ul className="dashboard-list">
              {recentJobs.map((job) => (
                <li className="dashboard-list__item" key={job.id ?? `${job.storeName}-${job.productName}`}>
                  <div>
                    <strong>{job.productName}</strong>
                    <p>{job.storeName}</p>
                  </div>
                  <div className="dashboard-list__meta">
                    <span>{formatStatus(job.status)}</span>
                    <small>{formatDate(job.createdAt)}</small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section__header">
            <h2 className="dashboard-section__title">Propostas</h2>
          </div>

          {loading ? (
            <p className="dashboard-empty">Carregando propostas...</p>
          ) : (
            <div className="proposal-groups">
              {STATUS_ORDER.filter((status) => groupedProposals[status]?.length).map((status) => (
                <div className="proposal-group" key={status}>
                  <h3 className="proposal-group__title">{formatStatus(status)}</h3>
                  <div className="proposal-group__list">
                    {groupedProposals[status].map((proposta) => (
                      <div className="proposal-card" key={proposta.id}>
                        <div className="proposal-card__header">
                          <div>
                            <strong>{proposta.productName}</strong>
                            <p>{proposta.storeName}</p>
                          </div>
                          <span className={`status-badge status-badge--${proposta.status.toLowerCase()}`}>
                            {formatStatus(proposta.status)}
                          </span>
                        </div>

                        <div className="proposal-card__meta">
                          <span>Data: {formatDate(proposta.createdAt)}</span>
                          <span>Valor: {formatMoney(proposta.totalFee ?? proposta.creatorFee ?? 0)}</span>
                        </div>

                        {proposta.status === "REQUESTED" && (
                          <div className="proposal-card__actions">
                            <Button
                              variant="secondary"
                              onClick={() => handleStatusChange(proposta.id, "REJECTED")}
                              disabled={busyId === proposta.id}
                            >
                              {busyId === proposta.id ? "Processando..." : "Recusar"}
                            </Button>
                            <Button
                              onClick={() => handleStatusChange(proposta.id, "ACCEPTED")}
                              disabled={busyId === proposta.id}
                            >
                              Aceitar proposta
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {!propostas.length && <p className="dashboard-empty">Nenhuma proposta recebida.</p>}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default DashboardCriador;
