import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import { fetchCreatorHirings, formatDate, formatMoney, formatStatus } from "../services/creatorService.js";

const STATUS_OPTIONS = [
  "ALL",
  "REQUESTED",
  "ACCEPTED",
  "IN_PRODUCTION",
  "DELIVERED",
  "APPROVED",
  "REJECTED",
];

function MeusTrabalhos() {
  const [jobs, setJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchCreatorHirings();
        setJobs(data);
      } catch (err) {
        setError(err.message || "Não foi possível carregar seus trabalhos.");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const statusMatches = statusFilter === "ALL" || job.status === statusFilter;
      const searchTerm = search.trim().toLowerCase();
      const textMatch = !searchTerm ||
        (job.productName || "").toLowerCase().includes(searchTerm) ||
        (job.storeName || "").toLowerCase().includes(searchTerm);

      return statusMatches && textMatch;
    });
  }, [jobs, search, statusFilter]);

  return (
    <div className="dashboard">
      <div className="dashboard__inner">
        <header className="dashboard__header">
          <div>
            <p className="dashboard__eyebrow">Creator</p>
            <h1 className="dashboard__title">Meus trabalhos</h1>
          </div>

          <Button to="/dashboard">Voltar para dashboard</Button>
        </header>

        <section className="dashboard-section">
          <div className="filters-row">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="field-input"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status === "ALL" ? "Todos os status" : formatStatus(status)}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="field-input"
              placeholder="Buscar por produto ou loja"
            />
          </div>

          {error && <div className="dashboard-error">{error}</div>}

          {loading ? (
            <p className="dashboard-empty">Carregando trabalhos...</p>
          ) : filteredJobs.length === 0 ? (
            <p className="dashboard-empty">Nenhum trabalho encontrado para os filtros selecionados.</p>
          ) : (
            <div className="table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Loja</th>
                    <th>Status</th>
                    <th>Valor</th>
                    <th>Data</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id}>
                      <td>{job.productName}</td>
                      <td>{job.storeName}</td>
                      <td>{formatStatus(job.status)}</td>
                      <td>{formatMoney(job.totalFee ?? job.creatorFee ?? 0)}</td>
                      <td>{formatDate(job.createdAt)}</td>
                      <td>
                        <Link to={`/creator/trabalhos/${job.id}`} className="link-strong">
                          Ver detalhes
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default MeusTrabalhos;
