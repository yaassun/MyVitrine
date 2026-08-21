import { useState } from "react";
import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import SelecaoPerfil from "./pages/SelecaoPerfil.jsx";
import PerfilLojista from "./pages/PerfilLojista.jsx";
import PerfilAfiliado from "./pages/PerfilAfiliado.jsx";
import DashboardPlaceholder from "./pages/DashboardPlaceholder.jsx";

// Navegação simples baseada em estado, sem biblioteca de rotas por enquanto.
// Quando os dashboards completos forem criados, este é o lugar para
// introduzir um roteador de verdade (ex.: react-router-dom).
function App() {
  const [screen, setScreen] = useState("login");
  const [selectedProfile, setSelectedProfile] = useState(null);
  // Guarda os dados de perfil preenchidos em cada etapa. Ainda não há
  // persistência real (backend/API); serve apenas para demonstrar o fluxo.
  const [storeProfile, setStoreProfile] = useState(null);
  const [affiliateProfile, setAffiliateProfile] = useState(null);

  if (screen === "signup") {
    return (
      <Cadastro
        onNavigateToLogin={() => setScreen("login")}
        onSignupSuccess={() => setScreen("select-profile")}
      />
    );
  }

  if (screen === "select-profile") {
    return (
      <SelecaoPerfil
        onNavigateToCadastro={() => setScreen("signup")}
        onProfileSelected={(profile) => {
          setSelectedProfile(profile);
          // Lojista e afiliado já possuem a etapa de perfil implementada.
          // Criador segue direto ao placeholder até sua tela ser construída.
          if (profile === "lojista") {
            setScreen("lojista-profile");
          } else if (profile === "afiliado") {
            setScreen("afiliado-profile");
          } else {
            setScreen("dashboard");
          }
        }}
      />
    );
  }

  if (screen === "lojista-profile") {
    return (
      <PerfilLojista
        onNavigateBack={() => setScreen("select-profile")}
        onProfileComplete={(data) => {
          setStoreProfile(data);
          setScreen("dashboard");
        }}
      />
    );
  }

  if (screen === "afiliado-profile") {
    return (
      <PerfilAfiliado
        onNavigateBack={() => setScreen("select-profile")}
        onProfileComplete={(data) => {
          setAffiliateProfile(data);
          setScreen("dashboard");
        }}
      />
    );
  }

  if (screen === "dashboard") {
    return (
      <DashboardPlaceholder
        profile={selectedProfile}
        onNavigateToLogin={() => setScreen("login")}
      />
    );
  }

  return <Login onNavigateToSignup={() => setScreen("signup")} />;
}

export default App;
