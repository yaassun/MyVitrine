import { getAccessToken, setAccessToken, clearAccessToken } from "./tokenStore.js";

// Ajuste para a URL real do seu backend na porta 8080
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Tenta renovar a sessão do usuário chamando /api/v1/auth/refresh.
 */
export async function refreshSession() {
  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      clearAccessToken();
      return null;
    }

    const data = await response.json();
    setAccessToken(data.accessToken);
    return data.user ?? null;
  } catch {
    clearAccessToken();
    return null;
  }
}

/**
 * Wrapper simples de fetch que já inclui o access token atual.
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
 * Encerra a sessão.
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

/**
 * Realiza a autenticação enviando e-mail e senha para o backend.
 */
export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const incompleteRegistration =
      response.status === 409 &&
      /cadastro incompleto/i.test(errorData.message || "");

    if (
      incompleteRegistration ||
      errorData.status === "INCOMPLETE" ||
      errorData.registrationStatus === "INCOMPLETE" ||
      errorData.code === "INCOMPLETE_REGISTRATION"
    ) {
      const error = new Error("Seu cadastro ainda não foi concluído.");
      error.code = "INCOMPLETE_REGISTRATION";
      throw error;
    }

    throw new Error(errorData.message || "E-mail ou senha inválidos.");
  }

  const data = await response.json();

  if (
    data.user?.status === "INCOMPLETE" ||
    data.user?.registrationStatus === "INCOMPLETE"
  ) {
    const error = new Error("Seu cadastro ainda não foi concluído.");
    error.code = "INCOMPLETE_REGISTRATION";
    throw error;
  }
  
  if (data.accessToken) {
    setAccessToken(data.accessToken);
  }

  return data;
}

/** Recupera os dados básicos de um cadastro incompleto pelo e-mail. */
export async function findUserByEmail(email) {
  const response = await fetch(
    `${API_URL}/api/users/email/${encodeURIComponent(email)}`,
    { credentials: "include" },
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Não foi possível localizar esse cadastro.");
  }

  return data.user ?? data;
}