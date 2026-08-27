import { getAccessToken, setAccessToken, clearAccessToken } from "./tokenStore.js";

// Ajuste para a URL real do seu backend (ex.: via variável de ambiente
// VITE_API_URL no arquivo .env). Sem isso definido, assume localhost.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

/**
 * Tenta renovar a sessão do usuário chamando /api/v1/auth/refresh.
 *
 * `credentials: "include"` é o que faz o navegador enviar o cookie
 * HttpOnly de refresh token junto da requisição — sem isso, o backend
 * não teria como saber quem é o usuário.
 *
 * Se o backend confirmar a sessão, ele deve responder com um novo
 * access token (e, idealmente, os dados básicos do usuário, incluindo
 * o tipo de perfil: lojista / afiliado / criador).
 *
 * Retorna os dados do usuário em caso de sucesso, ou `null` se a sessão
 * não pôde ser renovada (usuário deslogado / cookie expirado / inválido).
 */
export async function refreshSession() {
  try {
    const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      clearAccessToken();
      return null;
    }

    const data = await response.json();
    // Formato esperado do backend: { accessToken: "...", user: { tipo, ... } }
    setAccessToken(data.accessToken);
    return data.user ?? null;
  } catch {
    // Backend fora do ar, sem rede, CORS mal configurado etc.
    clearAccessToken();
    return null;
  }
}

/**
 * Wrapper simples de fetch que já inclui o access token atual (guardado
 * em memória) no header Authorization. Use para chamar endpoints
 * protegidos da API depois que a sessão estiver autenticada.
 */
export async function authFetch(path, options = {}) {
  const token = getAccessToken();

  return fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

/**
 * Encerra a sessão: avisa o backend (que deve invalidar/limpar o cookie
 * de refresh) e limpa o access token guardado em memória no front.
 */
export async function logoutSession() {
  try {
    await fetch(`${API_URL}/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } finally {
    clearAccessToken();
  }
}
