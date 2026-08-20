function BrandPanel() {
  return (
    <section className="brand-panel" aria-hidden="true">
      <div className="brand-panel__content">
        <div className="brand-panel__mark">
          <svg className="brand-panel__grid" viewBox="0 0 220 220" role="presentation">
            <rect x="10" y="10" width="90" height="90" rx="14" />
            <rect x="120" y="10" width="90" height="60" rx="14" />
            <rect x="120" y="90" width="90" height="30" rx="10" />
            <rect x="10" y="120" width="55" height="90" rx="14" />
            <rect x="75" y="120" width="55" height="55" rx="12" />
            <rect x="75" y="185" width="55" height="25" rx="8" />
            <rect x="140" y="140" width="70" height="70" rx="14" />
          </svg>
        </div>
        <p className="brand-panel__eyebrow">A vitrine do seu negócio</p>
        <h1 className="brand-panel__title">
          Onde marcas,
          <br />
          afiliados e criadores
          <br />
          se encontram.
        </h1>
        <p className="brand-panel__text">
          Cadastre produtos, encontre parceiros de divulgação e acompanhe
          comissões e cachês em um só lugar.
        </p>
      </div>
    </section>
  );
}

export default BrandPanel;
