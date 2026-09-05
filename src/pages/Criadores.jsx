import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { fetchCreatorDirectory } from "../services/creatorDirectoryService.js";

function normalizeExternalUrl(url) {
  const value = String(url || "").trim();
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function CreatorAvatar({ creator }) {
  const [imageFailed, setImageFailed] = useState(false);
  const initial = creator.name?.trim()?.charAt(0)?.toUpperCase() || "C";

  if (creator.profilePhotoUrl && !imageFailed) {
    return (
      <img
        className="creator-directory-card__photo"
        src={creator.profilePhotoUrl}
        alt={`Foto de ${creator.name}`}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div className="creator-directory-card__photo creator-directory-card__photo--fallback" aria-hidden="true">
      {initial}
    </div>
  );
}

function Criadores() {
  const { user } = useAuth();
  const [creators, setCreators] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadCreators() {
      setIsLoading(true);
      setError("");

      try {
        const data = await fetchCreatorDirectory();
        if (active) setCreators(data);
      } catch (requestError) {
        if (active) {
          setError(requestError.message || "Não foi possível carregar os criadores.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    if (user?.profileType === "STORE") {
      loadCreators();
    } else {
      setIsLoading(false);
    }

    return () => {
      active = false;
    };
  }, [reloadKey, user?.profileType]);

  const filteredCreators = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    if (!normalizedQuery) return creators;

    return creators.filter((creator) => {
      const searchableContent = [creator.name, creator.niche, creator.bio]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("pt-BR");

      return searchableContent.includes(normalizedQuery);
    });
  }, [creators, query]);

  if (user?.profileType !== "STORE") {
    return (
      <main className="creator-directory">
        <section className="creator-directory-state">
          <p className="creator-directory__eyebrow">Área de parcerias</p>
          <h1>Esta página é exclusiva para lojistas.</h1>
          <p>A busca de criadores está disponível para contas com perfil de loja.</p>
          <Link className="creator-directory__button" to="/dashboard">
            Voltar ao dashboard
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="creator-directory">
      <div className="creator-directory__inner">
        <header className="creator-directory__header">
          <div>
            <p className="creator-directory__eyebrow">Conexões para sua marca</p>
            <h1>Encontre criadores para sua próxima campanha.</h1>
            <p>
              Conheça perfis, nichos e canais de criadores antes de escolher quem combina com a sua loja.
            </p>
          </div>
          <Link className="creator-directory__button creator-directory__button--secondary" to="/dashboard">
            Voltar ao dashboard
          </Link>
        </header>

        <section className="creator-directory__search" aria-label="Busca de criadores">
          <label htmlFor="creator-search">Buscar por nome, nicho ou descrição</label>
          <div className="creator-directory__search-field">
            <span aria-hidden="true">⌕</span>
            <input
              id="creator-search"
              type="search"
              placeholder="Ex.: moda, tecnologia ou Maria"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </section>

        {isLoading ? (
          <section className="creator-directory-state" aria-live="polite">
            <span className="creator-directory-state__loader" aria-hidden="true" />
            <h2>Buscando criadores...</h2>
            <p>Estamos carregando os perfis disponíveis para novas parcerias.</p>
          </section>
        ) : error ? (
          <section className="creator-directory-state" role="alert">
            <p className="creator-directory__eyebrow">Não foi possível carregar</p>
            <h2>Os criadores não apareceram desta vez.</h2>
            <p>{error}</p>
            <button className="creator-directory__button" type="button" onClick={() => setReloadKey((value) => value + 1)}>
              Tentar novamente
            </button>
          </section>
        ) : creators.length === 0 ? (
          <section className="creator-directory-state">
            <p className="creator-directory__eyebrow">Novos talentos em breve</p>
            <h2>Ainda não existem criadores cadastrados.</h2>
            <p>Quando novos perfis forem criados, eles aparecerão automaticamente nesta página.</p>
          </section>
        ) : filteredCreators.length === 0 ? (
          <section className="creator-directory-state">
            <p className="creator-directory__eyebrow">Nenhum resultado</p>
            <h2>Não encontramos criadores para “{query.trim()}”.</h2>
            <p>Tente pesquisar outro nome, nicho ou palavra da descrição.</p>
            <button className="creator-directory__button creator-directory__button--secondary" type="button" onClick={() => setQuery("")}>
              Limpar busca
            </button>
          </section>
        ) : (
          <section aria-labelledby="creator-results-title">
            <div className="creator-directory__results-heading">
              <h2 id="creator-results-title">Criadores disponíveis</h2>
              <span>{filteredCreators.length} {filteredCreators.length === 1 ? "perfil" : "perfis"}</span>
            </div>

            <div className="creator-directory__grid">
              {filteredCreators.map((creator) => {
                const socialNetworks = Array.isArray(creator.socialNetworks) ? creator.socialNetworks : [];

                return (
                  <article className="creator-directory-card" key={creator.userId}>
                    <div className="creator-directory-card__top">
                      <CreatorAvatar creator={creator} />
                      <div>
                        <span className="creator-directory-card__type">Criador de conteúdo</span>
                        <h3>{creator.name}</h3>
                        <p className="creator-directory-card__niche">{creator.niche || "Nicho não informado"}</p>
                      </div>
                    </div>

                    <p className={`creator-directory-card__bio${creator.bio ? "" : " creator-directory-card__bio--empty"}`}>
                      {creator.bio || "Este criador ainda não adicionou uma apresentação ao perfil."}
                    </p>

                    <div className="creator-directory-card__socials">
                      {socialNetworks.length ? (
                        socialNetworks.map((network, index) => (
                          <a
                            key={network.id || `${network.name}-${index}`}
                            href={normalizeExternalUrl(network.url)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {network.name || "Canal"}
                          </a>
                        ))
                      ) : (
                        <span>Nenhuma rede social informada.</span>
                      )}
                    </div>

                    <Link className="creator-directory-card__profile-link" to={`/criadores/${creator.userId}`}>
                      Ver perfil completo
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default Criadores;
