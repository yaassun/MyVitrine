import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";

import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import RecuperarSenha from "./pages/RecuperarSenha.jsx";
import RedefinirSenha from "./pages/RedefinirSenha.jsx";
import SelecaoPerfil from "./pages/SelecaoPerfil.jsx";
import PerfilLojista from "./pages/PerfilLojista.jsx";
import PerfilAfiliado from "./pages/PerfilAfiliado.jsx";
import PerfilCriador from "./pages/PerfilCriador.jsx";
import DashboardPlaceholder from "./pages/DashboardPlaceholder.jsx";

// Decide para onde mandar o usuário quando ele acessa "/" — depende do
// resultado do refresh feito pelo AuthProvider ao iniciar o app.
function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas — as únicas acessíveis sem sessão válida */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />

          {/* Tudo abaixo exige sessão válida (ProtectedRoute cuida disso) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/selecionar-perfil" element={<SelecaoPerfil />} />
            <Route path="/perfil-lojista" element={<PerfilLojista />} />
            <Route path="/perfil-afiliado" element={<PerfilAfiliado />} />
            <Route path="/perfil-criador" element={<PerfilCriador />} />
            <Route path="/dashboard" element={<DashboardPlaceholder />} />
          </Route>

          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
