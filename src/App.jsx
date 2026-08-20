import { useState } from "react";
import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";

// Navegação simples baseada em estado, sem biblioteca de rotas por enquanto.
// Quando mais telas forem criadas (seleção de perfil, dashboards etc.),
// este é o lugar para introduzir um roteador (ex.: react-router-dom).
function App() {
  const [screen, setScreen] = useState("login");

  if (screen === "signup") {
    return (
      <Cadastro
        onNavigateToLogin={() => setScreen("login")}
        onSignupSuccess={() => setScreen("select-type-placeholder")}
      />
    );
  }

  if (screen === "select-type-placeholder") {
    return (
      <div className="page-placeholder">
        <div className="page-placeholder__card">
          <p className="page-placeholder__eyebrow">Próxima etapa</p>
          <h1>Seleção do tipo de usuário</h1>
          <p>
            Esta tela ainda será desenvolvida (lojista, afiliado ou criador
            de conteúdo). O cadastro foi validado com sucesso.
          </p>
          <button className="btn-primary" onClick={() => setScreen("login")}>
            Voltar para o Login
          </button>
        </div>
      </div>
    );
  }

  return <Login onNavigateToSignup={() => setScreen("signup")} />;
}

export default App;
