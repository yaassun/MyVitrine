import { useState } from "react";
import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import SelecaoPerfil from "./pages/SelecaoPerfil.jsx";
import DashboardPlaceholder from "./pages/DashboardPlaceholder.jsx";

// Navegação simples baseada em estado, sem biblioteca de rotas por enquanto.
// Quando os dashboards completos forem criados, este é o lugar para
// introduzir um roteador de verdade (ex.: react-router-dom).
function App() {
  const [screen, setScreen] = useState("login");
  const [selectedProfile, setSelectedProfile] = useState(null);

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
