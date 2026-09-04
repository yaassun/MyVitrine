import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import FormAlert from "../components/FormAlert.jsx";
import { fetchCreatorProfile, getUserIdentifier } from "../services/creatorService.js";

function getInitials(name) {
  const parts = String(name || "Criador").trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function displayValue(value) {
  return value || "Não informado";
}

function PerfilCriadorView() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const userId = getUserIdentifier(user);
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
        const data = await fetchCreatorProfile(userId);
        if (active) setProfile(data);
      } catch (err) {
        if (active) {
          setError(err.message || "Não foi possível carregar seu perfil.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [reloadKey, userId]);

  const profileName = user?.creatorName || user?.name || user?.fullName || "Criador de conteúdo";
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
            <p>Estamos buscando suas informações de criador.</p>
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
            <p className="creator-profile-view__eyebrow">Meu perfil</p>
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
          <FormAlert message="Perfil atualizado com sucesso." variant="success" />
        )}

        <header className="creator-profile-view__topbar">
          <div>
            <p className="creator-profile-view__eyebrow">Meu perfil</p>
            <h1>Seu espaço como criador</h1>
            <p>Estas são as informações que representam você na MyVitrine.</p>
          </div>
          <div className="creator-profile-view__actions">
            <Link className="creator-profile-action creator-profile-action--secondary" to="/dashboard">
              Voltar ao dashboard
            </Link>
            <Link className="creator-profile-action" to="/creator/perfil/editar">
              Editar perfil
            </Link>
          </div>
        </header>

        <section className="creator-profile-hero">
          <div className="creator-profile-hero__avatar" aria-label={`Foto de ${profileName}`}>
            {profile?.profilePhotoUrl && !imageFailed ? (
              <img
                src={profile.profilePhotoUrl}
                alt={`Foto de perfil de ${profileName}`}
                onError={() => setImageFailed(true)}
              />
            ) : (
              <span>{getInitials(profileName)}</span>
            )}
          </div>

          <div className="creator-profile-hero__content">
            <span className="creator-profile-hero__type">Criador de conteúdo</span>
            <h2>{profileName}</h2>
            <p>{displayValue(profile?.niche)}</p>
          </div>
        </section>

        <div className="creator-profile-view__grid">
          <section className="creator-profile-section">
            <div className="creator-profile-section__heading">
              <span className="creator-profile-section__number">01</span>
              <div>
                <h2>Informações da conta</h2>
                <p>Dados associados ao seu acesso à plataforma.</p>
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
                <dd>Criador de conteúdo</dd>
              </div>
              <div>
                <dt>Categoria de conteúdo</dt>
                <dd>{displayValue(profile?.niche)}</dd>
              </div>
            </dl>
          </section>

          <section className="creator-profile-section">
            <div className="creator-profile-section__heading">
              <span className="creator-profile-section__number">02</span>
              <div>
                <h2>Sobre seu conteúdo</h2>
                <p>Sua apresentação para marcas e lojistas.</p>
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
              <h2>Redes e canais</h2>
              <p>Onde marcas e lojistas podem conhecer seu trabalho.</p>
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
                    <strong>{network.name || network.platform || "Rede social"}</strong>
                    <p>{network.url || network.link || "Não informado"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="creator-profile-empty">Nenhuma rede ou canal informado.</p>
          )}
        </section>
      </div>
    </main>
  );
}

export default PerfilCriadorView;
