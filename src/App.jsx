import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import SelecaoPerfil from "./pages/SelecaoPerfil.jsx";
import PerfilLojista from "./pages/PerfilLojista.jsx";
import DashboardPlaceholder from "./pages/DashboardPlaceholder.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/cadastro"
          element={<Cadastro />}
        />

        <Route
          path="/selecionar-perfil"
          element={<SelecaoPerfil />}
        />

        <Route
          path="/perfil-lojista"
          element={<PerfilLojista />}
        />

        <Route
          path="/dashboard"
          element={<DashboardPlaceholder />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;