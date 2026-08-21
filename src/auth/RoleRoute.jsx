import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function RoleRoute({ allowedRoles }) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  const hasPermission = allowedRoles.some((role) =>
    usuario.tipos.includes(role)
  );

  if (!hasPermission) {
    return <Navigate to="/sem-permissao" replace />;
  }

  return <Outlet />;
}