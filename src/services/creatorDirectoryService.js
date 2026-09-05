import { authFetch } from "../auth/authClient.js";

async function readResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
}

async function fetchCreatorName(userId) {
  try {
    const response = await authFetch(`/api/users/${userId}`);
    const user = await readResponse(response, "Não foi possível carregar o usuário.");
    return user.name || user.fullName || "Criador de conteúdo";
  } catch {
    return "Criador de conteúdo";
  }
}

export async function fetchCreatorDirectory() {
  const response = await authFetch("/api/creator-profiles");
  const profiles = await readResponse(response, "Não foi possível carregar os criadores.");

  if (!Array.isArray(profiles)) {
    return [];
  }

  return Promise.all(
    profiles.map(async (profile) => ({
      ...profile,
      name: await fetchCreatorName(profile.userId),
    })),
  );
}

export async function fetchCreatorDirectoryEntry(userId) {
  const response = await authFetch(`/api/creator-profiles/${userId}`);
  const profile = await readResponse(response, "Não foi possível carregar o perfil do criador.");

  return {
    ...profile,
    name: await fetchCreatorName(userId),
  };
}
