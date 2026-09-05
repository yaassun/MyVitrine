import { authFetch } from "./authClient.js";

export async function criarProduto(produtoData) {
  const response = await authFetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(produtoData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Erro ao cadastrar produto.");
  }

  // Retorna os dados do produto salvo (com o ID gerado pelo banco)
  return response.json();
}

export async function listarProdutosDaLoja(storeId) {
  const response = await authFetch(
    `/api/products?storeId=${encodeURIComponent(storeId)}&size=100&sort=createdAt,desc`,
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Erro ao carregar os produtos da loja.");
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data.content || [];
}

export async function listarProdutosAtivos() {
  const response = await authFetch("/api/products?size=100&sort=createdAt,desc");

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Erro ao carregar os produtos disponíveis.");
  }

  const data = await response.json();
  const products = Array.isArray(data) ? data : data.content || [];
  return products.filter((product) => product.active !== false);
}
