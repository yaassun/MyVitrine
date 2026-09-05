import { authFetch } from "../auth/authClient.js";

async function request(path, options = {}) {
  const response = await authFetch(path, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(
      errorData.message ||
        (response.status === 403
          ? "Você não tem permissão para esta operação."
          : "Não foi possível concluir a operação com o produto."),
    );
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? null : response.json();
}

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  query.set("page", String(params.page ?? 0));
  query.set("size", String(params.size ?? 20));
  query.set("sort", params.sort ?? "createdAt,desc");
  return `?${query.toString()}`;
}

export function getMyProducts(params = {}) {
  return request(`/api/products/me${buildQuery(params)}`);
}

export function getStoreDashboard() {
  return request("/api/products/me/dashboard");
}

export function updateProduct(id, product) {
  return request(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
}

export function deactivateProduct(id) {
  return request(`/api/products/${id}/deactivate`, { method: "PATCH" });
}

export function deleteProduct(id) {
  return request(`/api/products/${id}`, { method: "DELETE" });
}

export function formatProductMoney(value) {
  return Number(value ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatProductDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("pt-BR");
}
