import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import FormAlert from "../components/FormAlert.jsx";
import { fetchAffiliateProfile, getProfileUserId } from "../services/profileService.js";

function getInitials(name) {
  const parts = String(name || "Afiliado").trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function displayValue(value) {
  return value || "Não informado";
}

function PerfilAfiliadoView() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const userId = getProfileUserId(user);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [showUpdatedMessage] = useState(Boolean(location.state?.profileUpdated));
  const [imageFailed, setImageFailed] = useState(false);

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
        const data = await fetchAffiliateProfile(userId);
        if (active) setProfile(data);
      } catch (err) {
        if (active) setError(err.message || "Não foi possível carregar o perfil de afiliado.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [reloadKey, userId]);

  const affiliateName = user?.displayName || user?.name || user?.fullName || "Afiliado";
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
            <h1>Carregando seu perfil...</h1>
            <p>Estamos buscando suas informações de divulgação.</p>
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
            <p className="creator-profile-view__eyebrow">Perfil de afiliado</p>
            <h1>Não foi possível abrir seu perfil</h1>
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
          <FormAlert message="Perfil de afiliado atualizado com sucesso." variant="success" />
        )}

        <header className="creator-profile-view__topbar">
          <div>
            <p className="creator-profile-view__eyebrow">Perfil de afiliado</p>
            <h1>Seu espaço de divulgação</h1>
            <p>Confira como lojistas encontram sua atuação e seus canais.</p>
          </div>
          <div className="creator-profile-view__actions">
            <Link className="creator-profile-action creator-profile-action--secondary" to="/dashboard">
              Voltar ao dashboard
            </Link>
            <Link className="creator-profile-action" to="/affiliate/perfil/editar">
              Editar perfil
            </Link>
          </div>
        </header>

        <section className="creator-profile-hero">
          <div className="creator-profile-hero__avatar" aria-label={`Foto de ${affiliateName}`}>
            {profile?.profilePhotoUrl && !imageFailed ? (
              <img
                src={profile.profilePhotoUrl}
                alt={`Foto de perfil de ${affiliateName}`}
                onError={() => setImageFailed(true)}
              />
            ) : (
              <span>{getInitials(affiliateName)}</span>
            )}
          </div>
          <div className="creator-profile-hero__content">
            <span className="creator-profile-hero__type">Afiliado</span>
            <h2>{affiliateName}</h2>
            <p>{displayValue(profile?.niche)}</p>
          </div>
        </section>

        <div className="creator-profile-view__grid">
          <section className="creator-profile-section">
            <div className="creator-profile-section__heading">
              <span className="creator-profile-section__number">01</span>
              <div>
                <h2>Informações da conta</h2>
                <p>Dados que identificam você na plataforma.</p>
              </div>
            </div>

            <dl className="creator-profile-details">
              <div>
                <dt>Nome</dt>
                <dd>{displayValue(user?.name || user?.fullName)}</dd>
              </div>
              <div>
                <dt>E-mail</dt>
                <dd>{displayValue(user?.email)}</dd>
              </div>
              <div>
                <dt>Tipo de perfil</dt>
                <dd>Afiliado</dd>
              </div>
              <div>
                <dt>Categoria de atuação</dt>
                <dd>{displayValue(profile?.niche)}</dd>
              </div>
            </dl>
          </section>

          <section className="creator-profile-section">
            <div className="creator-profile-section__heading">
              <span className="creator-profile-section__number">02</span>
              <div>
                <h2>Sobre sua atuação</h2>
                <p>Sua apresentação para lojas e possíveis parceiros.</p>
              </div>
            </div>
            <p className={`creator-profile-bio${profile?.bio ? "" : " creator-profile-bio--empty"}`}>
              {displayValue(profile?.bio)}
            </p>
          </section>
        </div>

        <section className="creator-profile-section creator-profile-section--social">
          <div className="creator-profile-section__heading">
            <span className="creator-profile-section__number">03</span>
            <div>
              <h2>Canais de divulgação</h2>
              <p>Onde lojistas podem acompanhar seu trabalho e alcance.</p>
            </div>
          </div>

          {socialNetworks.length ? (
            <div className="creator-profile-socials">
              {socialNetworks.map((network, index) => (
                <div className="creator-profile-social" key={network.id || `${network.name}-${index}`}>
                  <span className="creator-profile-social__mark" aria-hidden="true">
                    {(network.name || network.platform || "C").slice(0, 1).toUpperCase()}
                  </span>
                  <div>
                    <strong>{network.name || network.platform || "Canal de divulgação"}</strong>
                    <p>{network.url || network.link || "Não informado"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="creator-profile-empty">Nenhum canal de divulgação informado.</p>
          )}
        </section>
      </div>
    </main>
  );
}

export default PerfilAfiliadoView;
