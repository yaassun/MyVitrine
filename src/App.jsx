import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";

import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import RecuperarSenha from "./pages/RecuperarSenha.jsx";
import RedefinirSenha from "./pages/RedefinirSenha.jsx";
import SelecaoPerfil from "./pages/SelecaoPerfil.jsx";
import PerfilLojista from "./pages/PerfilLojista.jsx";
import PerfilAfiliado from "./pages/PerfilAfiliado.jsx";
import PerfilCriador from "./pages/PerfilCriador.jsx";
import DashboardPlaceholder from "./pages/DashboardPlaceholder.jsx";
import DashboardCriador from "./pages/DashboardCriador.jsx";
import DashboardLojista from "./pages/DashboardLojista.jsx";
import DashboardAfiliado from "./pages/DashboardAfiliado.jsx";
import MeusTrabalhos from "./pages/MeusTrabalhos.jsx";
import DetalheTrabalhoCriador from "./pages/DetalheTrabalhoCriador.jsx";
import PerfilCriadorView from "./pages/PerfilCriadorView.jsx";

function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

function DashboardRouter() {
  const { user } = useAuth();
  if (user?.profileType === "CREATOR") return <DashboardCriador />;
  if (user?.profileType === "STORE") return <DashboardLojista />;
  if (user?.profileType === "AFFILIATE") return <DashboardAfiliado />;
  return <DashboardPlaceholder />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />
          <Route path="/selecionar-perfil" element={<SelecaoPerfil />} />
          <Route path="/perfil-lojista" element={<PerfilLojista />} />
          <Route path="/perfil-afiliado" element={<PerfilAfiliado />} />
          <Route path="/perfil-criador" element={<PerfilCriador />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/dashboard/creator" element={<DashboardCriador />} />
            <Route path="/dashboard/store" element={<DashboardLojista />} />
            <Route path="/dashboard/affiliate" element={<DashboardAfiliado />} />
            <Route path="/creator/perfil" element={<PerfilCriadorView />} />
            <Route path="/creator/perfil/editar" element={<PerfilCriador />} />
            <Route path="/creator/trabalhos" element={<MeusTrabalhos />} />
            <Route path="/creator/trabalhos/:id" element={<DetalheTrabalhoCriador />} />
          </Route>

          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
