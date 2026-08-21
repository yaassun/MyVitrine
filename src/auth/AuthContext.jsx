// src/auth/AuthContext.jsx

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  /**
   * Recupera a sessão existente quando a aplicação inicia.
   *
   * O backend deve verificar o cookie de sessão e retornar
   * os dados do usuário autenticado.
   */
  useEffect(() => {
    async function hydrateSession() {
      try {
        const perfil = await authService.getMeuPerfil();

        setUsuario(perfil);
      } catch {
        setUsuario(null);
      } finally {
        setIsLoading(false);
      }
    }

    hydrateSession();
  }, []);

  /**
   * Realiza login e recupera o perfil do usuário.
   */
  const login = useCallback(
    async (credentials) => {
      await authService.login(credentials);

      const perfil = await authService.getMeuPerfil();

      setUsuario(perfil);

      navigate(getHomeByRole(perfil.tipos), {
        replace: true,
      });

      return perfil;
    },
    [navigate]
  );

  /**
   * Encerra a sessão.
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUsuario(null);

      navigate('/login', {
        replace: true,
      });
    }
  }, [navigate]);

  /**
   * Verifica se o usuário possui pelo menos um
   * dos perfis informados.
   *
   * Exemplo:
   *
   * hasRole('ADMIN')
   * hasRole('ADMIN', 'EMPRESA')
   */
  const hasRole = useCallback(
    (...roles) => {
      if (!usuario) {
        return false;
      }

      return roles.some((role) =>
        usuario.tipos?.includes(role)
      );
    },
    [usuario]
  );

  const value = {
    usuario,
    isAuthenticated: !!usuario,
    isLoading,
    login,
    logout,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para acessar o contexto de autenticação.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth deve ser usado dentro de <AuthProvider>'
    );
  }

  return context;
}

/**
 * Define para onde o usuário será direcionado
 * depois do login.
 */
function getHomeByRole(tipos = []) {
  if (tipos.includes('ADMIN')) {
    return '/admin/dashboard';
  }

  if (tipos.includes('EMPRESA')) {
    return '/empresa/dashboard';
  }

  return '/usuario/dashboard';
}