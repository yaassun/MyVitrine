//TODO: corrigir método de aceitar proposta, pois está dando erro 500 no backend

import { authFetch } from "../auth/authClient.js";

export const HIRING_STATUS_LABELS = {
  REQUESTED: "Proposta recebida",
  ACCEPTED: "Aceita",
  IN_PRODUCTION: "Em produção",
  DELIVERED: "Entregue",
  APPROVED: "Aprovado",
  REJECTED: "Recusada",
};

export const HIRING_STATUS_ORDER = [
  "REQUESTED",
  "ACCEPTED",
  "IN_PRODUCTION",
  "DELIVERED",
  "APPROVED",
  "REJECTED",
];

export function getUserIdentifier(user) {
  return (
    user?.id ??
    user?.userId ??
    user?.userID ??
    user?.uuid ??
    null
  );
}

export function getNumericValue(value, fallback = 0) {
  const number = Number(value ?? fallback);
  return Number.isFinite(number) ? number : fallback;
}

/**
 * Normaliza respostas que podem vir:
 * - como array
 * - como { content: [] }
 * - como { items: [] }
 * - como { data: [] }
 */
function normalizeList(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.content)) {
    return value.content;
  }

  if (Array.isArray(value?.items)) {
    return value.items;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  return [];
}

function normalizeHiring(hiring = {}) {
  return {
    ...hiring,

    id:
      hiring.id ??
      hiring.hiringId ??
      hiring._id,

    status:
      hiring.status ??
      "REQUESTED",

    productName:
      hiring.productName ??
      hiring.product?.name ??
      hiring.product?.title ??
      "Produto",

    storeName:
      hiring.storeName ??
      hiring.store?.name ??
      hiring.lojista?.name ??
      "Loja",

    creatorFee:
      hiring.creatorFee ??
      hiring.fee ??
      hiring.amount ??
      hiring.totalFee ??
      null,

    totalFee:
      hiring.totalFee ??
      hiring.creatorFee ??
      hiring.amount ??
      hiring.fee ??
      null,

    createdAt:
      hiring.createdAt ??
      hiring.created_at ??
      hiring.date,

    updatedAt:
      hiring.updatedAt ??
      hiring.updated_at,
  };
}

export function normalizeDashboardPayload(payload = {}) {
  const metrics = payload.metrics ?? payload;

  const recentJobs = normalizeList(
    payload.recentJobs ??
    payload.recentHirings ??
    payload.jobs
  ).map(normalizeHiring);

  const proposals = normalizeList(
    payload.proposals ??
    payload.pendingProposals ??
    payload.hirings
  ).map(normalizeHiring);

  return {
    metrics: {
      totalJobs: getNumericValue(
        metrics.totalJobs ?? payload.totalJobs
      ),

      pendingProposals: getNumericValue(
        metrics.pendingProposals ?? payload.pendingProposals
      ),

      activeJobs: getNumericValue(
        metrics.activeJobs ?? payload.activeJobs
      ),

      completedJobs: getNumericValue(
        metrics.completedJobs ?? payload.completedJobs
      ),

      totalFees: getNumericValue(
        metrics.totalFees ?? payload.totalFees
      ),

      pendingFees: getNumericValue(
        metrics.pendingFees ?? payload.pendingFees
      ),

      approvedFees: getNumericValue(
        metrics.approvedFees ?? payload.approvedFees
      ),
    },

    recentJobs,
    proposals,
  };
}

export async function fetchCreatorDashboard() {
  const response = await authFetch("/api/hirings/me/dashboard");

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message ||
      "Não foi possível carregar o dashboard do criador."
    );
  }

  const payload = await response.json();

  return normalizeDashboardPayload(payload);
}

export async function fetchCreatorHirings(params = {}) {
  const query = new URLSearchParams();

  if (params.status) {
    query.set("status", params.status);
  }

  if (params.page) {
    query.set("page", String(params.page));
  }

  if (params.size) {
    query.set("size", String(params.size));
  }

  const url = `/api/hirings/me${
    query.toString() ? `?${query.toString()}` : ""
  }`;

  const response = await authFetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message ||
      "Não foi possível carregar os trabalhos do criador."
    );
  }

  const payload = await response.json();

  return normalizeList(payload).map(normalizeHiring);
}

export async function fetchCreatorFees() {
  const response = await authFetch("/api/creator-fees");

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message ||
      "Não foi possível carregar os cachês do criador."
    );
  }

  const payload = await response.json();

  return normalizeList(payload);
}

export async function fetchCreatorProfile(userId) {
  const response = await authFetch(
    `/api/creator-profiles/${userId}`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message ||
      "Não foi possível carregar o perfil do criador."
    );
  }

  return await response.json();
}

export async function updateHiringStatus(hiringId, status) {
  if (!hiringId) {
    throw new Error("Identificador do trabalho não informado.");
  }

  const response = await authFetch(
    `/api/hirings/${hiringId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message ||
      "Não foi possível atualizar o status da proposta."
    );
  }

  return await response.json().catch(() => null);
}

export async function upsertCreatorProfile(userId, profileData) {
  const response = await authFetch(
    `/api/creator-profiles/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    }
  );

  if (!response.ok) {
    const fallback = await authFetch(
      `/api/creator-profiles`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...profileData,
        }),
      }
    );

    if (!fallback.ok) {
      const errorData = await fallback.json().catch(() => ({}));

      throw new Error(
        errorData.message ||
        "Não foi possível salvar o perfil do criador."
      );
    }

    return await fallback.json();
  }

  return await response.json();
}

export function formatMoney(value) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

export function formatStatus(status) {
  return HIRING_STATUS_LABELS[status] ?? status ?? "Sem status";
}

export function formatDate(date) {
  if (!date) {
    return "-";
  }

  try {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "-";
  }
}

