import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { listarProdutosDaLoja } from "../auth/ProdutoClient.js";
import Button from "../components/Button.jsx";

const MONEY_FORMATTER = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function ProductImage({ product }) {
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

function DashboardLojista() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const nome = user?.name || user?.nome || "Lojista";

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      if (!user?.id) {
        setProductsError("Não foi possível identificar a loja conectada.");
        setIsLoadingProducts(false);
        return;
      }

      setIsLoadingProducts(true);
      setProductsError("");

      try {
        const data = await listarProdutosDaLoja(user.id);
        if (active) setProducts(data);
      } catch (error) {
        if (active) {
          setProductsError(error.message || "Não foi possível carregar os produtos.");
        }
      } finally {
        if (active) setIsLoadingProducts(false);
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [reloadKey, user?.id]);

  const stats = useMemo(() => {
    const activeProducts = products.filter((product) => product.active !== false).length;

    return [
      { label: "Produtos cadastrados", value: String(products.length) },
      { label: "Produtos ativos", value: String(activeProducts) },
      { label: "Criadores parceiros", value: "0" },
      { label: "Vendas do mês", value: "R$ 0,00" },
    ];
  }, [products]);

  return (
    <div className="dashboard">
      <div className="dashboard__inner">
        <header className="dashboard__header">
          <div>
            <p className="dashboard__eyebrow">Área do lojista</p>
            <h1 className="dashboard__title">Olá, {nome}</h1>
            <p className="dashboard__subtitle">
              Gerencie os produtos e encontre criadores para divulgar sua marca.
            </p>
          </div>
          <div className="dashboard__actions">
            <Button to="/store/produtos/novo" variant="primary">Cadastrar produto</Button>
            <Button to="/criadores">Buscar criadores</Button>
            <Button to="/store/perfil" variant="secondary">Meu perfil</Button>
          </div>
        </header>

        <section className="dashboard__grid">
          {stats.map((stat) => (
            <div className="dashboard-card" key={stat.label}>
              <p className="dashboard-card__label">{stat.label}</p>
              <p className="dashboard-card__value">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="dashboard-section commerce-section">
          <div className="dashboard-section__header commerce-section__header">
            <div>
              <p className="dashboard__eyebrow">Catálogo da loja</p>
              <h2 className="dashboard-section__title">Meus produtos</h2>
            </div>
            <Button to="/store/produtos/novo" variant="secondary">Adicionar produto</Button>
          </div>

          {isLoadingProducts ? (
            <div className="commerce-state" aria-live="polite">
              <span className="commerce-state__loader" aria-hidden="true" />
              <p>Carregando os produtos da sua loja...</p>
            </div>
          ) : productsError ? (
            <div className="commerce-state" role="alert">
              <strong>Não foi possível carregar seus produtos.</strong>
              <p>{productsError}</p>
              <button type="button" className="commerce-action" onClick={() => setReloadKey((value) => value + 1)}>
                Tentar novamente
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="commerce-state">
              <strong>Sua vitrine ainda está vazia.</strong>
              <p>Cadastre o primeiro produto para ele aparecer aqui e ficar disponível aos afiliados.</p>
              <Button to="/store/produtos/novo">Cadastrar primeiro produto</Button>
            </div>
          ) : (
            <div className="commerce-products">
              {products.map((product) => (
                <article className="commerce-product" key={product.id}>
                  <ProductImage product={product} />
                  <div className="commerce-product__content">
                    <div className="commerce-product__heading">
                      <div>
                        <span className={`commerce-badge${product.active === false ? " commerce-badge--inactive" : ""}`}>
                          {product.active === false ? "Inativo" : "Ativo"}
                        </span>
                        <h3>{product.name}</h3>
                      </div>
                      <strong>{MONEY_FORMATTER.format(Number(product.price) || 0)}</strong>
                    </div>
                    <p>
                      Comissão para afiliados:{" "}
                      <strong>{Number(product.commissionPercentage) || 0}%</strong>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section__header">
            <h2 className="dashboard-section__title">Atividade recente</h2>
          </div>
          <p className="dashboard-empty">
            As próximas vendas, parcerias e contratações da loja aparecerão aqui.
          </p>
        </section>
      </div>
    </div>
  );
}

export default DashboardLojista;
