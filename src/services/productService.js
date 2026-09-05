import { authFetch } from "../auth/authClient.js";

async function request(path, options = {}) {
  const response = await authFetch(path, options);
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const error = new Error(
      data.message ||
        (response.status === 403
          ? "Você não tem permissão para esta operação."
          : "Não foi possível concluir a operação com o produto."),
    );
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? null : response.json();
}

export function getStoreDashboard() {
  return request("/api/products/me/dashboard");
}

export function getMyProducts({ page = 0, size = 20, sort = "createdAt,desc" } = {}) {
  const query = new URLSearchParams({ page: String(page), size: String(size), sort });
  return request(`/api/products/me?${query.toString()}`);
}

export function updateProduct(id, payload) {
  return request(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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
