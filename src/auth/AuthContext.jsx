import { createContext, useContext, useEffect, useState } from "react";
import { refreshSession, logoutSession } from "./authClient.js";

const AuthContext = createContext(null);

/**
 * Envolve toda a aplicação e resolve, uma única vez ao carregar,
 * se existe uma sessão válida — antes de qualquer rota protegida
 * ser exibida.
 *
 * Fluxo:
 *   1. app inicia → isLoading = true (nada é decidido ainda)
 *   2. chama POST /api/v1/auth/refresh (envia o cookie HttpOnly)
 *   3a. deu certo  → guarda o access token em memória, isAuthenticated = true
 *   3b. deu errado → isAuthenticated = false
 *   4. isLoading = false → agora sim as rotas decidem para onde ir
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    refreshSession().then((refreshedUser) => {
      if (!active) return;
      setUser(refreshedUser);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  async function logout() {
    await logoutSession();
    setUser(null);
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    setUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de <AuthProvider>");
  }
  return context;
}
