import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { listarProdutosAtivos } from "../auth/ProdutoClient.js";
import {
  createAffiliateLink,
  fetchAffiliateCommissions,
  fetchAffiliateLinks,
} from "../services/affiliateService.js";
import Button from "../components/Button.jsx";
import FormAlert from "../components/FormAlert.jsx";

const MONEY_FORMATTER = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function AffiliateProductImage({ product }) {
  const [failed, setFailed] = useState(false);

  if (product.imageUrl && !failed) {
    return (
      <img
        className="commerce-product__image"
        src={product.imageUrl}
        alt={`Imagem de ${product.name}`}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="commerce-product__image commerce-product__image--fallback" aria-hidden="true">
      MV
    </div>
  );
}

function DashboardAfiliado() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [links, setLinks] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState({ message: "", variant: "success" });
  const [generatingKey, setGeneratingKey] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const nome = user?.name || user?.nome || "Afiliado";

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      if (!user?.id) {
        setError("Não foi possível identificar o afiliado conectado.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const [availableProducts, affiliateLinks, affiliateCommissions] = await Promise.all([
          listarProdutosAtivos(),
          fetchAffiliateLinks(user.id),
          fetchAffiliateCommissions(user.id).catch(() => []),
        ]);

        if (active) {
          setProducts(availableProducts);
          setLinks(affiliateLinks);
          setCommissions(affiliateCommissions);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || "Não foi possível carregar sua área de afiliado.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [reloadKey, user?.id]);

  const stats = useMemo(() => {
    const linkCount = links.filter((link) => link.type === "LINK").length;
    const couponCount = links.filter((link) => link.type === "COUPON").length;
    const commissionTotal = commissions.reduce(
      (total, commission) => total + (Number(commission.commissionAmount) || 0),
      0,
    );

    return [
      { label: "Produtos disponíveis", value: String(products.length) },
      { label: "Links gerados", value: String(linkCount) },
      { label: "Cupons gerados", value: String(couponCount) },
      { label: "Comissões", value: MONEY_FORMATTER.format(commissionTotal) },
    ];
  }, [commissions, links, products.length]);

  async function handleGenerate(product, type) {
    const actionKey = `${product.id}-${type}`;
    setGeneratingKey(actionKey);
    setAlert({ message: "", variant: "success" });

    try {
      const created = await createAffiliateLink(user.id, product.id, type);
      setLinks((current) => [created, ...current]);
      setAlert({
        message: `${type === "COUPON" ? "Cupom" : "Link"} gerado com sucesso: ${created.code}`,
        variant: "success",
      });
    } catch (requestError) {
      setAlert({
        message: requestError.message || "Não foi possível gerar o código de divulgação.",
        variant: "error",
      });
    } finally {
      setGeneratingKey("");
    }
  }

  async function handleCopy(code) {
    try {
      await navigator.clipboard.writeText(code);
      setAlert({ message: `Código ${code} copiado.`, variant: "success" });
    } catch {
      setAlert({ message: `Código para copiar: ${code}`, variant: "success" });
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard__inner">
        <header className="dashboard__header">
          <div>
            <p className="dashboard__eyebrow">Área do afiliado</p>
            <h1 className="dashboard__title">Olá, {nome}</h1>
            <p className="dashboard__subtitle">
              Escolha produtos, gere links ou cupons e acompanhe suas comissões.
            </p>
          </div>
          <div className="dashboard__actions">
            <a className="commerce-header-link" href="#produtos-disponiveis">Explorar produtos</a>
            <Button to="/affiliate/perfil" variant="secondary">Meu perfil</Button>
          </div>
        </header>

        {alert.message && <FormAlert message={alert.message} variant={alert.variant} />}

        <section className="dashboard__grid">
          {stats.map((stat) => (
            <div className="dashboard-card" key={stat.label}>
              <p className="dashboard-card__label">{stat.label}</p>
              <p className="dashboard-card__value">{stat.value}</p>
            </div>
          ))}
        </section>

        {isLoading ? (
          <section className="dashboard-section commerce-state" aria-live="polite">
            <span className="commerce-state__loader" aria-hidden="true" />
            <p>Carregando produtos e divulgações...</p>
          </section>
        ) : error ? (
          <section className="dashboard-section commerce-state" role="alert">
            <strong>Não foi possível abrir sua área de afiliado.</strong>
            <p>{error}</p>
            <button className="commerce-action" type="button" onClick={() => setReloadKey((value) => value + 1)}>
              Tentar novamente
            </button>
          </section>
        ) : (
          <>
            <section className="dashboard-section commerce-section" id="produtos-disponiveis">
              <div className="dashboard-section__header commerce-section__header">
                <div>
                  <p className="dashboard__eyebrow">Oportunidades de divulgação</p>
                  <h2 className="dashboard-section__title">Produtos disponíveis</h2>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="commerce-state">
                  <strong>Nenhum produto disponível agora.</strong>
                  <p>Os produtos ativos cadastrados pelos lojistas aparecerão aqui.</p>
                </div>
              ) : (
                <div className="commerce-products">
                  {products.map((product) => (
                    <article className="commerce-product commerce-product--affiliate" key={product.id}>
                      <AffiliateProductImage product={product} />
                      <div className="commerce-product__content">
                        <span className="commerce-badge">{product.storeName || "Loja MyVitrine"}</span>
                        <div className="commerce-product__heading">
                          <div>
                            <h3>{product.name}</h3>
                            <p>{MONEY_FORMATTER.format(Number(product.price) || 0)}</p>
                          </div>
                          <strong>{Number(product.commissionPercentage) || 0}%</strong>
                        </div>
                        <p className="commerce-product__commission-label">Comissão oferecida</p>
                        <div className="commerce-product__actions">
                          <button
                            className="commerce-action"
                            type="button"
                            disabled={Boolean(generatingKey)}
                            onClick={() => handleGenerate(product, "LINK")}
                          >
                            {generatingKey === `${product.id}-LINK` ? "Gerando..." : "Gerar link"}
                          </button>
                          <button
                            className="commerce-action commerce-action--secondary"
                            type="button"
                            disabled={Boolean(generatingKey)}
                            onClick={() => handleGenerate(product, "COUPON")}
                          >
                            {generatingKey === `${product.id}-COUPON` ? "Gerando..." : "Gerar cupom"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="dashboard-section commerce-section">
              <div className="dashboard-section__header commerce-section__header">
                <div>
                  <p className="dashboard__eyebrow">Suas divulgações</p>
                  <h2 className="dashboard-section__title">Links e cupons gerados</h2>
                </div>
              </div>

              {links.length === 0 ? (
                <div className="commerce-state">
                  <strong>Você ainda não gerou nenhum código.</strong>
                  <p>Escolha um produto acima e gere seu primeiro link ou cupom.</p>
                </div>
              ) : (
                <div className="affiliate-codes">
                  {links.map((link) => (
                    <article className="affiliate-code" key={link.id}>
                      <div>
                        <span className="commerce-badge">
                          {link.type === "COUPON" ? "Cupom" : "Link"}
                        </span>
                        <h3>{link.productName || "Produto"}</h3>
                        <code>{link.code}</code>
                      </div>
                      <button
                        type="button"
                        className="commerce-action commerce-action--secondary"
                        onClick={() => handleCopy(link.code)}
                      >
                        Copiar código
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardAfiliado;
