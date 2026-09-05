import { authFetch } from "../auth/authClient.js";

async function readResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
}

export async function fetchAffiliateLinks(affiliateId) {
  const response = await authFetch(
    `/api/affiliate-links?affiliateId=${encodeURIComponent(affiliateId)}`,
  );
  const data = await readResponse(response, "Não foi possível carregar seus links e cupons.");
  return Array.isArray(data) ? data : [];
}

export async function createAffiliateLink(affiliateId, productId, type) {
  const response = await authFetch("/api/affiliate-links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ affiliateId, productId, type }),
  });

  return readResponse(response, "Não foi possível gerar o link ou cupom.");
}

export async function fetchAffiliateCommissions(affiliateId) {
  const response = await authFetch(
    `/api/commissions?affiliateId=${encodeURIComponent(affiliateId)}&size=100`,
  );
  const data = await readResponse(response, "Não foi possível carregar suas comissões.");
  return Array.isArray(data) ? data : data.content || [];
}
