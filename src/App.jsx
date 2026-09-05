import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";

import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import RecuperarSenha from "./pages/RecuperarSenha.jsx";
import RedefinirSenha from "./pages/RedefinirSenha.jsx";
import ConcluirCadastro from "./pages/ConcluirCadastro.jsx";
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
import PerfilLojistaView from "./pages/PerfilLojistaView.jsx";
import PerfilAfiliadoView from "./pages/PerfilAfiliadoView.jsx";
import Criadores from "./pages/Criadores.jsx";
import PerfilCriadorPublico from "./pages/PerfilCriadorPublico.jsx";
import "./creatorDirectory.css";

// 1. Importe a nova tela de cadastro de produto aqui
import CadastroProduto from "./pages/CadastroProduto.jsx";
import ProdutosLojista from "./pages/ProdutosLojista.jsx";

function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="page-placeholder">
        <div className="page-placeholder__card">
          <p className="page-placeholder__eyebrow">MyVitrine</p>
          <h1>Carregando a plataforma...</h1>
          <p>O primeiro acesso pode levar alguns segundos.</p>
        </div>
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? "/home" : "/login"} replace />;
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
          <Route path="/concluir-cadastro" element={<ConcluirCadastro />} />
          <Route path="/selecionar-perfil" element={<SelecaoPerfil />} />
          <Route path="/perfil-lojista" element={<PerfilLojista />} />
          <Route path="/perfil-afiliado" element={<PerfilAfiliado />} />
          <Route path="/perfil-criador" element={<PerfilCriador />} />

          {/* O ProtectedRoute atua como um "guarda" para todas as rotas abaixo dele */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/dashboard/creator" element={<DashboardCriador />} />
            <Route path="/dashboard/store" element={<DashboardLojista />} />
            
            {/* 2. Adicione a nova rota protegida aqui! */}
            <Route path="/store/produtos/novo" element={<CadastroProduto />} />
            <Route path="/store/produtos" element={<ProdutosLojista />} />
            
            <Route path="/dashboard/affiliate" element={<DashboardAfiliado />} />
            <Route path="/criadores" element={<Criadores />} />
            <Route path="/criadores/:userId" element={<PerfilCriadorPublico />} />
            <Route path="/creator/perfil" element={<PerfilCriadorView />} />
            <Route path="/creator/perfil/editar" element={<PerfilCriador />} />
            <Route path="/store/perfil" element={<PerfilLojistaView />} />
            <Route path="/store/perfil/editar" element={<PerfilLojista />} />
            <Route path="/affiliate/perfil" element={<PerfilAfiliadoView />} />
            <Route path="/affiliate/perfil/editar" element={<PerfilAfiliado />} />
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
