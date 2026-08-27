import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

/**
 * Envolve qualquer grupo de rotas que exija sessão ativa.
 *
 * Enquanto o AuthProvider ainda não terminou de tentar o refresh
 * (isLoading), não decide nada — evita mandar o usuário pro /login
 * por um instante e "piscar" a tela antes do refresh responder.
 */
function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="page-placeholder">
        <div className="page-placeholder__card">
          <p className="page-placeholder__eyebrow">MyVitrine</p>
          <h1>Carregando sua sessão...</h1>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
