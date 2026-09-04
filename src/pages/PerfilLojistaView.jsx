import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import FormAlert from "../components/FormAlert.jsx";
import { fetchStoreProfile, getProfileUserId } from "../services/profileService.js";

function getInitials(name) {
  const parts = String(name || "Loja").trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function displayValue(value) {
  return value || "Não informado";
}

function PerfilLojistaView() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const userId = getProfileUserId(user);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [showUpdatedMessage] = useState(Boolean(location.state?.profileUpdated));

  useEffect(() => {
    if (location.state?.profileUpdated) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!userId) {
        setError("Não foi possível identificar o usuário conectado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await fetchStoreProfile(userId);
        if (active) setProfile(data);
      } catch (err) {
        if (active) setError(err.message || "Não foi possível carregar o perfil da loja.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [reloadKey, userId]);

  const storeName = profile?.storeName || "Minha loja";
  const socialNetworks = useMemo(
    () => Array.isArray(profile?.socialNetworks) ? profile.socialNetworks : [],
    [profile]
  );

  if (loading) {
    return (
      <main className="creator-profile-view">
        <div className="creator-profile-view__container">
          <section className="creator-profile-state" aria-live="polite">
            <span className="creator-profile-state__loader" aria-hidden="true" />
            <h1>Carregando sua loja...</h1>
            <p>Estamos buscando as informações comerciais do seu perfil.</p>
          </section>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="creator-profile-view">
        <div className="creator-profile-view__container">
          <section className="creator-profile-state">
            <p className="creator-profile-view__eyebrow">Perfil da loja</p>
            <h1>Não foi possível abrir sua loja</h1>
            <p>{error}</p>
            <div className="creator-profile-view__actions">
              <Link className="creator-profile-action creator-profile-action--secondary" to="/dashboard">
                Voltar ao dashboard
              </Link>
              <button className="creator-profile-action" type="button" onClick={() => setReloadKey((value) => value + 1)}>
                Tentar novamente
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="creator-profile-view">
      <div className="creator-profile-view__container">
        {showUpdatedMessage && (
          <FormAlert message="Perfil da loja atualizado com sucesso." variant="success" />
        )}

        <header className="creator-profile-view__topbar">
          <div>
            <p className="creator-profile-view__eyebrow">Perfil da loja</p>
            <h1>A vitrine da sua marca</h1>
            <p>Confira como sua loja se apresenta para criadores e afiliados.</p>
          </div>
          <div className="creator-profile-view__actions">
            <Link className="creator-profile-action creator-profile-action--secondary" to="/dashboard">
              Voltar ao dashboard
            </Link>
            <Link className="creator-profile-action" to="/store/perfil/editar">
              Editar perfil
            </Link>
          </div>
        </header>

        <section className="creator-profile-hero">
          <div className="creator-profile-hero__avatar" aria-label={`Identificação visual de ${storeName}`}>
            <span>{getInitials(storeName)}</span>
          </div>
          <div className="creator-profile-hero__content">
            <span className="creator-profile-hero__type">Lojista</span>
            <h2>{storeName}</h2>
            <p>{displayValue(profile?.niche)}</p>
          </div>
        </section>

        <div className="creator-profile-view__grid">
          <section className="creator-profile-section">
            <div className="creator-profile-section__heading">
              <span className="creator-profile-section__number">01</span>
              <div>
                <h2>Dados comerciais</h2>
                <p>As principais informações de identificação da loja.</p>
              </div>
            </div>

            <dl className="creator-profile-details">
              <div>
                <dt>Nome da loja</dt>
                <dd>{displayValue(profile?.storeName)}</dd>
              </div>
              <div>
                <dt>CNPJ</dt>
                <dd>{displayValue(profile?.cnpj)}</dd>
              </div>
              <div>
                <dt>Nicho da loja</dt>
                <dd>{displayValue(profile?.niche)}</dd>
              </div>
              <div>
                <dt>Responsável</dt>
                <dd>{displayValue(user?.name || user?.fullName)}</dd>
              </div>
              <div>
                <dt>E-mail da conta</dt>
                <dd>{displayValue(user?.email)}</dd>
              </div>
              <div>
                <dt>Tipo de perfil</dt>
                <dd>Lojista</dd>
              </div>
            </dl>
          </section>

          <section className="creator-profile-section">
            <div className="creator-profile-section__heading">
              <span className="creator-profile-section__number">02</span>
              <div>
                <h2>Sobre a loja</h2>
                <p>A apresentação da marca para possíveis parceiros.</p>
              </div>
            </div>
            <p className={`creator-profile-bio${profile?.description ? "" : " creator-profile-bio--empty"}`}>
              {displayValue(profile?.description)}
            </p>
          </section>
        </div>

        <section className="creator-profile-section creator-profile-section--social">
          <div className="creator-profile-section__heading">
            <span className="creator-profile-section__number">03</span>
            <div>
              <h2>Presença digital</h2>
              <p>Os canais oficiais usados para apresentar sua marca.</p>
            </div>
          </div>

          {socialNetworks.length ? (
            <div className="creator-profile-socials">
              {socialNetworks.map((network, index) => (
                <div className="creator-profile-social" key={network.id || `${network.name}-${index}`}>
                  <span className="creator-profile-social__mark" aria-hidden="true">
                    {(network.name || network.platform || "R").slice(0, 1).toUpperCase()}
                  </span>
                  <div>
                    <strong>{network.name || network.platform || "Canal digital"}</strong>
                    <p>{network.url || network.link || "Não informado"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="creator-profile-empty">Nenhum canal digital informado.</p>
          )}
        </section>
      </div>
    </main>
  );
}

export default PerfilLojistaView;
