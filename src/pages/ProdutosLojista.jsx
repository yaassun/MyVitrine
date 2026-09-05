import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import FormAlert from "../components/FormAlert.jsx";
import TextField from "../components/TextField.jsx";
import {
  deleteProduct,
  deactivateProduct,
  formatProductDate,
  formatProductMoney,
  getMyProducts,
  updateProduct,
} from "../services/productService.js";

const EMPTY_FORM = { id: null, storeId: "", name: "", price: "", commissionPercentage: "", imageUrl: "" };

function ProdutosLojista() {
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);
  const [page, setPage] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [formError, setFormError] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");
      setPageData(await getMyProducts({ page }));
    } catch (err) {
      if (err.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setError(err.status === 403 ? "Você não tem permissão para acessar estes produtos." : err.message || "Não foi possível carregar seus produtos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProducts(); }, [page]);

  function startEdit(product) {
    setFeedback("");
    setFormError("");
    setForm({
      id: product.id,
      storeId: product.storeId || "",
      name: product.name || "",
      price: product.price ?? "",
      commissionPercentage: product.commissionPercentage ?? "",
      imageUrl: product.imageUrl || "",
    });
  }

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    const price = Number(form.price);
    const commission = Number(form.commissionPercentage || 0);
    if (!form.name.trim() || !form.storeId || !Number.isFinite(price) || price <= 0) {
      setFormError("Informe nome, loja e um preço maior que zero.");
      return;
    }
    if (!Number.isFinite(commission) || commission < 0) {
      setFormError("A comissão deve ser zero ou maior.");
      return;
    }
    try {
      setBusyId(form.id);
      await updateProduct(form.id, { storeId: form.storeId, name: form.name.trim(), price, commissionPercentage: commission, imageUrl: form.imageUrl.trim() });
      setForm(EMPTY_FORM);
      setFeedback("Produto atualizado com sucesso.");
      await loadProducts();
    } catch (err) {
      if (err.status === 401) navigate("/login", { replace: true });
      else setFormError(err.message || "Não foi possível atualizar o produto.");
    } finally { setBusyId(null); }
  }

  async function handleDeactivate(product) {
    if (!window.confirm("Desativar este produto? Ele deixará de aceitar novos links e cupons.")) return;
    try {
      setBusyId(product.id);
      await deactivateProduct(product.id);
      setFeedback("Produto desativado com sucesso.");
      await loadProducts();
    } catch (err) {
      if (err.status === 401) navigate("/login", { replace: true });
      else setError(err.message || "Não foi possível desativar o produto.");
    } finally { setBusyId(null); }
  }

  async function handleDelete(product) {
    if (!window.confirm("Excluir este produto? Esta operação remove o produto permanentemente.")) return;
    try {
      setBusyId(product.id);
      await deleteProduct(product.id);
      setFeedback("Produto excluído com sucesso.");
      await loadProducts();
    } catch (err) {
      if (err.status === 401) navigate("/login", { replace: true });
      else setError(err.message || "Não foi possível excluir o produto.");
    } finally { setBusyId(null); }
  }

  const products = pageData?.content || [];
  return (
    <div className="dashboard"><div className="dashboard__inner">
      <header className="dashboard__header"><div><p className="dashboard__eyebrow">Área do lojista</p><h1 className="dashboard__title">Meus produtos</h1><p className="dashboard__subtitle">Gerencie o catálogo da sua loja.</p></div><Button to="/dashboard" variant="secondary">Voltar ao dashboard</Button></header>
      {error && <div className="dashboard-error">{error}</div>}
      {feedback && <FormAlert message={feedback} variant="success" />}
      {form.id && <section className="dashboard-section"><div className="dashboard-section__header"><h2 className="dashboard-section__title">Editar produto</h2><Button variant="secondary" onClick={() => setForm(EMPTY_FORM)}>Cancelar</Button></div><FormAlert message={formError} variant="error" /><form className="product-form" onSubmit={handleSave} noValidate>
        <TextField id="name" label="Nome" value={form.name} onChange={updateField} error={formError && !form.name ? formError : ""} />
        <TextField id="price" label="Preço" type="number" min="0.01" step="0.01" value={form.price} onChange={updateField} />
        <TextField id="commissionPercentage" label="Comissão (%)" type="number" min="0" step="0.01" value={form.commissionPercentage} onChange={updateField} />
        <TextField id="imageUrl" label="URL da imagem" value={form.imageUrl} onChange={updateField} />
        <Button type="submit" disabled={busyId === form.id}>{busyId === form.id ? "Salvando..." : "Salvar alterações"}</Button>
      </form></section>}
      <section className="dashboard-section">{loading ? <p className="dashboard-empty">Carregando produtos...</p> : products.length === 0 ? <p className="dashboard-empty">Você ainda não possui produtos cadastrados.</p> : <div className="product-table-wrap"><table className="product-table"><thead><tr><th>Produto</th><th>Preço</th><th>Comissão</th><th>Status</th><th>Criação</th><th>Ações</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><div className="product-table__name">{product.imageUrl && <img src={product.imageUrl} alt="" />}{product.name}</div></td><td>{formatProductMoney(product.price)}</td><td>{Number(product.commissionPercentage ?? 0).toLocaleString("pt-BR")} %</td><td>{product.active ? "Ativo" : "Inativo"}</td><td>{formatProductDate(product.createdAt)}</td><td><div className="product-table__actions"><Button variant="secondary" onClick={() => startEdit(product)}>Editar</Button>{product.active && <Button variant="secondary" disabled={busyId === product.id} onClick={() => handleDeactivate(product)}>Desativar</Button>}<Button variant="danger" disabled={busyId === product.id} onClick={() => handleDelete(product)}>Excluir</Button></div></td></tr>)}</tbody></table></div>}
      {pageData?.totalPages > 1 && <div className="product-pagination"><Button variant="secondary" disabled={pageData.first || loading} onClick={() => setPage(page - 1)}>Anterior</Button><span>Página {pageData.number + 1} de {pageData.totalPages}</span><Button variant="secondary" disabled={pageData.last || loading} onClick={() => setPage(page + 1)}>Próxima</Button></div>}</section>
    </div></div>
  );
}

export default ProdutosLojista;
