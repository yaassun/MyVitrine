import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import Logo from "./Logo.jsx";
import Button from "./Button.jsx";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Lista de rotas públicas onde o Navbar NÃO deve aparecer
  const rotasPublicas = ["/login", "/cadastro", "/recuperar-senha", "/redefinir-senha"];

  // Se estivermos em uma rota pública, não renderiza o menu
  if (rotasPublicas.includes(location.pathname)) {
    return null;
  }

  async function handleLogout() {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  }

  const renderMenuLinks = () => {
    if (!user) return null;
    const tipo = user.tipo;

    return (
      <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--background)', padding: '0.25rem', borderRadius: '12px' }}>
        <Button to="/home">Home</Button>
        <Button to="/dashboard">Dashboard</Button>
        
        {tipo === 'lojista' && (
          <>
            <Button to="/criadores">Criadores</Button>
            <Button to="/afiliados">Afiliados</Button>
          </>
        )}

        {tipo === 'criador' && (
          <>
            <Button to="/lojistas">Lojistas</Button>
            <Button to="/afiliados">Afiliados</Button>
          </>
        )}

        {tipo === 'afiliado' && (
          <>
            <Button to="/lojistas">Lojistas</Button>
          </>
        )}
      </div>
    );
  };

  return (
    <header className="navbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)', alignItems: 'center' }}>
      
      <div className="navbar__brand">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold', fontSize: '1.2rem' }}>
          <Logo />
        </Link>
      </div>

      <nav className="navbar__nav" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {renderMenuLinks()}
        
        <Button onClick={handleLogout}>
          Sair
        </Button>
      </nav>

    </header>
  );
}

export default Navbar;
