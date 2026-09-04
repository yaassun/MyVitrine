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
  return await response.json();
}