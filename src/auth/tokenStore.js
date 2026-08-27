/**
 * Guarda o access token apenas em memória — uma variável comum de módulo,
 * não em localStorage/sessionStorage.
 *
 * Por quê: localStorage e sessionStorage podem ser lidos por qualquer
 * script que rode na página (inclusive um script malicioso injetado via
 * XSS). Uma variável em memória só existe enquanto o JavaScript da aba
 * está rodando — some ao recarregar a página (F5) ou fechar a aba.
 *
 * Isso É esperado e intencional: é por isso que existe o endpoint
 * /api/v1/auth/refresh, chamado uma vez quando o app inicializa (veja
 * AuthContext.jsx). O refresh token de verdade fica num cookie HttpOnly
 * setado pelo backend — inacessível ao JavaScript do front, e é ele quem
 * garante que o usuário continua logado entre uma visita e outra.
 */

let accessToken = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}
