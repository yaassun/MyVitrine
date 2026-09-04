import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { authFetch } from "../auth/authClient.js";
import { fetchCreatorHirings, formatDate, formatMoney, formatStatus } from "../services/creatorService.js";

const TIMELINE = [
  { key: "REQUESTED", label: "Proposta recebida" },
  { key: "ACCEPTED", label: "Proposta aceita" },
  { key: "IN_PRODUCTION", label: "Produto recebido / produção iniciada" },
  { key: "DELIVERED", label: "Conteúdo entregue" },
  { key: "APPROVED", label: "Conteúdo aprovado" },
  { key: "PAID", label: "Cachê" },
];

function DetalheTrabalhoCriador() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        setError("");

        const list = await fetchCreatorHirings();
        const found = list.find((item) => String(item.id) === String(id));

        if (!found) {
          const response = await authFetch(`/api/hirings/${id}`);
          if (!response.ok) throw new Error("Trabalho não encontrado.");
          const data = await response.json();
          setJob(data);
        } else {
          setJob(found);
        }
      } catch (err) {
        setError(err.message || "Não foi possível carregar o detalhe do trabalho.");
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  const timeline = useMemo(() => {
    if (!job) return [];

    const currentIndex = TIMELINE.findIndex((step) => step.key === job.status);

    return TIMELINE.map((step, index) => ({
      ...step,
      isDone: currentIndex >= 0 ? index <= currentIndex : false,
      isCurrent: step.key === job.status,
    }));
  }, [job]);

  return (
    <div className="dashboard">
      <div className="dashboard__inner">
        <header className="dashboard__header">
          <div>
            <p className="dashboard__eyebrow">Creator</p>
            <h1 className="dashboard__title">Detalhes do trabalho</h1>
          </div>

          <Link to="/creator/trabalhos" className="link-strong">Voltar para lista</Link>
        </header>

        {error && <div className="dashboard-error">{error}</div>}

        {loading ? (
          <p className="dashboard-empty">Carregando detalhes...</p>
        ) : !job ? (
          <p className="dashboard-empty">Trabalho não encontrado.</p>
        ) : (
          <>
            <section className="dashboard-section">
              <div className="job-header-card">
                <div>
                  <p className="dashboard-card__label">Produto</p>
                  <h2 className="job-title">{job.productName || "Produto"}</h2>
                </div>
                <span className={`status-badge status-badge--${job.status?.toLowerCase() || "requested"}`}>
                  {formatStatus(job.status)}
                </span>
              </div>

              <div className="detail-grid">
                <div className="detail-box">
                  <p className="dashboard-card__label">Loja</p>
                  <strong>{job.storeName || "Loja"}</strong>
                </div>
                <div className="detail-box">
                  <p className="dashboard-card__label">Valor do cachê</p>
                  <strong>{formatMoney(job.totalFee ?? job.creatorFee ?? 0)}</strong>
                </div>
                <div className="detail-box">
                  <p className="dashboard-card__label">Data</p>
                  <strong>{formatDate(job.createdAt)}</strong>
                </div>
                <div className="detail-box">
                  <p className="dashboard-card__label">Status atual</p>
                  <strong>{formatStatus(job.status)}</strong>
                </div>
              </div>
            </section>

            <section className="dashboard-section">
              <h3 className="dashboard-section__title">Fluxo do trabalho</h3>
              <div className="timeline">
                {timeline.map((step) => (
                  <div key={step.key} className={`timeline-step ${step.isDone ? "timeline-step--done" : ""} ${step.isCurrent ? "timeline-step--current" : ""}`}>
                    <span className="timeline-dot" />
                    <div>
                      <strong>{step.label}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default DetalheTrabalhoCriador;
