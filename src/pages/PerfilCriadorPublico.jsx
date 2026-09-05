import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { fetchCreatorDirectoryEntry } from "../services/creatorDirectoryService.js";

function getInitials(name) {
  return String(name || "Criador")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function normalizeExternalUrl(url) {
  const value = String(url || "").trim();
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function PerfilCriadorPublico() {
  const { user } = useAuth();
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setIsLoading(true);
      setError("");
      setImageFailed(false);

      try {
        const data = await fetchCreatorDirectoryEntry(userId);
        if (active) setProfile(data);
      } catch (requestError) {
        if (active) {
          setError(requestError.message || "Não foi possível carregar o perfil do criador.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    if (user?.profileType === "STORE" && userId) {
      loadProfile();
    } else {
      setIsLoading(false);
    }

    return () => {
      active = false;
    };
  }, [reloadKey, user?.profileType, userId]);

  const socialNetworks = useMemo(
    () => (Array.isArray(profile?.socialNetworks) ? profile.socialNetworks : []),
    [profile],
  );

  if (user?.profileType !== "STORE") {
    return (
      <main className="creator-profile-view">
        <div className="creator-profile-view__container">
          <section className="creator-profile-state">
            <p className="creator-profile-view__eyebrow">Perfil profissional</p>
            <h1>Esta página é exclusiva para lojistas.</h1>
            <p>Entre com uma conta de loja para conhecer os criadores disponíveis.</p>
            <div className="creator-profile-view__actions">
              <Link className="creator-profile-action" to="/dashboard">Voltar ao dashboard</Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="creator-profile-view">
        <div className="creator-profile-view__container">
          <section className="creator-profile-state" aria-live="polite">
            <span className="creator-profile-state__loader" aria-hidden="true" />
            <h1>Carregando perfil...</h1>
            <p>Estamos buscando as informações deste criador.</p>
          </section>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="creator-profile-view">
        <div className="creator-profile-view__container">
          <section className="creator-profile-state" role="alert">
            <p className="creator-profile-view__eyebrow">Perfil do criador</p>
            <h1>Não foi possível abrir este perfil.</h1>
            <p>{error}</p>
            <div className="creator-profile-view__actions">
              <Link className="creator-profile-action creator-profile-action--secondary" to="/criadores">
                Voltar aos criadores
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

  const profileName = profile?.name || "Criador de conteúdo";

  return (
    <main className="creator-profile-view">
      <div className="creator-profile-view__container">
        <header className="creator-profile-view__topbar">
          <div>
            <p className="creator-profile-view__eyebrow">Perfil profissional</p>
            <h1>Conheça este criador</h1>
            <p>Confira as informações e os canais apresentados para possíveis parcerias.</p>
          </div>
          <div className="creator-profile-view__actions">
            <Link className="creator-profile-action creator-profile-action--secondary" to="/criadores">
              Voltar aos criadores
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
            <p>{profile?.niche || "Nicho não informado"}</p>
          </div>
        </section>

        <div className="creator-profile-view__grid creator-public-profile__grid">
          <section className="creator-profile-section">
            <div className="creator-profile-section__heading">
              <span className="creator-profile-section__number">01</span>
              <div>
                <h2>Sobre o criador</h2>
                <p>Apresentação profissional para marcas e lojistas.</p>
              </div>
            </div>
            <p className={`creator-profile-bio${profile?.bio ? "" : " creator-profile-bio--empty"}`}>
              {profile?.bio || "Este criador ainda não adicionou uma apresentação ao perfil."}
            </p>
          </section>

          <section className="creator-profile-section">
            <div className="creator-profile-section__heading">
              <span className="creator-profile-section__number">02</span>
              <div>
                <h2>Área de atuação</h2>
                <p>Principal categoria informada pelo criador.</p>
              </div>
            </div>
            <dl className="creator-profile-details creator-public-profile__details">
              <div>
                <dt>Nicho</dt>
                <dd>{profile?.niche || "Não informado"}</dd>
              </div>
            </dl>
          </section>
        </div>

        <section className="creator-profile-section creator-profile-section--social">
          <div className="creator-profile-section__heading">
            <span className="creator-profile-section__number">03</span>
            <div>
              <h2>Redes e canais</h2>
              <p>Acesse os canais informados para conhecer o trabalho deste criador.</p>
            </div>
          </div>

          {socialNetworks.length ? (
            <div className="creator-profile-socials">
              {socialNetworks.map((network, index) => (
                <a
                  className="creator-profile-social creator-public-profile__social"
                  key={network.id || `${network.name}-${index}`}
                  href={normalizeExternalUrl(network.url)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="creator-profile-social__mark" aria-hidden="true">
                    {(network.name || "R").slice(0, 1).toUpperCase()}
                  </span>
                  <div>
                    <strong>{network.name || "Rede social"}</strong>
                    <p>{network.url || "Abrir canal"}</p>
                  </div>
                </a>
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

export default PerfilCriadorPublico;
