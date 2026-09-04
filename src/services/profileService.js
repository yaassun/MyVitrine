import { authFetch } from "../auth/authClient.js";

async function readError(response, fallbackMessage) {
  const errorData = await response.json().catch(() => ({}));
  throw new Error(errorData.message || fallbackMessage);
}

export function getProfileUserId(user) {
  return user?.id ?? user?.userId ?? user?.userID ?? user?.uuid ?? null;
}

export async function fetchStoreProfile(userId) {
  const response = await authFetch(`/api/store-profiles/${userId}`);
  if (!response.ok) {
    await readError(response, "Não foi possível carregar o perfil da loja.");
  }
  return response.json();
}

export async function updateStoreProfile(userId, profileData) {
  const response = await authFetch(`/api/store-profiles/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
  });
  if (!response.ok) {
    await readError(response, "Não foi possível atualizar o perfil da loja.");
  }
  return response.json();
}

export async function fetchAffiliateProfile(userId) {
  const response = await authFetch(`/api/affiliate-profiles/${userId}`);
  if (!response.ok) {
    await readError(response, "Não foi possível carregar o perfil de afiliado.");
  }
  return response.json();
}

export async function updateAffiliateProfile(userId, profileData) {
  const response = await authFetch(`/api/affiliate-profiles/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
  });
  if (!response.ok) {
    await readError(response, "Não foi possível atualizar o perfil de afiliado.");
  }
  return response.json();
}
