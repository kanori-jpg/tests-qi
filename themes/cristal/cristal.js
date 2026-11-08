// Maquette « Cristal de lune » : ciel lavande, cristal suspendu (dessiné en SVG), liste numérotée des épreuves.
(function () {
  const fmt = n => n.toLocaleString('fr-FR');
  const total = Object.values(TESTS).reduce((s, t) => s + t.questions.length, 0);

  // Cristal à facettes suspendu à une chaîne, avec un croissant de lune à l'intérieur
  const GEM = `
  <svg viewBox="0 0 320 380" class="gem" aria-hidden="true">
    <defs>
      <linearGradient id="gA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#efe2ff"/><stop offset=".45" stop-color="#b48cf2"/><stop offset="1" stop-color="#6a3fc4"/></linearGradient>
      <linearGradient id="gB" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9c2ff"/><stop offset="1" stop-color="#7f55d8"/></linearGradient>
      <radialGradient id="gGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#e8d9ff" stop-opacity=".9"/><stop offset="1" stop-color="#e8d9ff" stop-opacity="0"/></radialGradient>
    </defs>
    ${Array.from({ length: 13 }, (_, i) => `<ellipse cx="160" cy="${6 + i * 10}" rx="${i % 2 ? 2.4 : 4}" ry="${i % 2 ? 4.5 : 3}" fill="none" stroke="#e9e2f7" stroke-width="1.6"/>`).join('')}
    <circle cx="160" cy="250" r="150" fill="url(#gGlow)" opacity=".55"/>
    <g transform="translate(160 250)">
      <polygon points="-120,-40 -70,-110 70,-110 120,-40 0,110" fill="url(#gA)" stroke="#f4ecff" stroke-width="2"/>
      <polygon points="-70,-110 -30,-40 30,-40 70,-110" fill="#e6d6ff" opacity=".85"/>
      <polygon points="-120,-40 -30,-40 0,110" fill="url(#gB)" opacity=".85"/>
      <polygon points="120,-40 30,-40 0,110" fill="#8a5fe0" opacity=".8"/>
      <polygon points="-30,-40 30,-40 0,110" fill="#c8a8ff" opacity=".7"/>
      <polygon points="-120,-40 -70,-110 -30,-40" fill="#f3eaff" opacity=".7"/>
      <polygon points="120,-40 70,-110 30,-40" fill="#a37ef0" opacity=".85"/>
      <path d="M-14 -20 a30 30 0 1 0 34 38 a24 24 0 1 1 -34 -38 Z" fill="#fff8e6" opacity=".95"/>
      <path d="M-86 -96 l6 -14 l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 Z" fill="#fff" opacity=".9"/>
      <path d="M52 -20 l3 -8 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 Z" fill="#fff" opacity=".85"/>
    </g>
  </svg>`;
  const MOON = (cls) => `<svg viewBox="0 0 100 100" class="${cls}" aria-hidden="true"><defs><radialGradient id="mg${cls}" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9ccf5"/></radialGradient></defs><path d="M60 8 a44 44 0 1 0 32 66 a36 36 0 1 1 -32 -66 Z" fill="url(#mg${cls})"/></svg>`;
  const LANTERN = (cls) => `<svg viewBox="0 0 60 100" class="${cls}" aria-hidden="true"><path d="M30 0 V14" stroke="#e9e2f7" stroke-width="1.5"/><path d="M20 22 Q30 10 40 22" fill="none" stroke="#e9e2f7" stroke-width="2"/><circle cx="30" cy="56" r="40" fill="#ffe2b0" opacity=".35"/><path d="M14 26 H46 L50 82 Q50 90 42 90 H18 Q10 90 10 82 Z" fill="rgba(255,236,205,.8)" stroke="#fff" stroke-width="2"/><circle cx="30" cy="58" r="13" fill="#ffc96b"/><circle cx="30" cy="58" r="7" fill="#fff6dc"/></svg>`;
  const CONSTEL = `<svg viewBox="0 0 200 120" class="constel" aria-hidden="true"><path d="M10 20 L50 40 L90 30 L130 60 L170 50 M90 30 L100 80 L150 100" fill="none" stroke="#e9e2f7" stroke-width="1" opacity=".6"/>${[[10, 20], [50, 40], [90, 30], [130, 60], [170, 50], [100, 80], [150, 100]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#fff"/>`).join('')}</svg>`;

  function home() {
    clearTimeout(memoTimer);
    if (typeof melodyStop === 'function' && melodyStop) melodyStop();
    const keys = Object.keys(TESTS);
    app.innerHTML = `
    <section class="hero">
      ${CONSTEL}${MOON('moon-l')}${MOON('moon-r')}${LANTERN('lan-l')}${LANTERN('lan-r')}
      <span class="tw t1">✦</span><span class="tw t2">✧</span><span class="tw t3">✦</span><span class="tw t4">✧</span>
      <h1 class="deco">Tests de QI</h1>
      <p class="sub">${fmt(total)} questions suspendues entre les étoiles</p>
      <button class="gem-btn" data-start="complet" title="Lancer le test complet">${GEM}<span class="gem-label">Toucher le cristal<br><small>test complet</small></span></button>
    </section>

    <section class="tracklist">
      <h2 class="track-title"><span></span>Liste des épreuves<span></span></h2>
      <div class="tracks">${keys.map((k, i) => { const t = TESTS[k]; return `
        <button class="track" data-start="${k}">
          <span class="orb"><span>${t.icon}</span></span>
          <span class="t-name">${String(i + 1).padStart(2, '0')} ${t.title}</span>
        </button>`; }).join('')}
      </div>
    </section>

    <section class="tracklist bonus">
      <h2 class="track-title"><span></span>Pistes bonus<span></span></h2>
      <div class="tracks three">${Object.entries(SPECIAL).map(([k, s], i) => `
        <button class="track" data-start="${k}">
          <span class="orb big"><span>${s.icon}</span></span>
          <span class="t-name">${String(keys.length + i + 1).padStart(2, '0')} ${s.title.replace(' (format ICAR 16)', '')}</span>
          <small>${s.size()} questions</small>
        </button>`).join('')}
      </div>
    </section>
    <div class="cloud-floor" aria-hidden="true"></div>`;
    app.querySelectorAll('[data-start]').forEach(el => el.onclick = () => { startTest(el.dataset.start); window.scrollTo(0, 0); });
    window.scrollTo(0, 0);
  }

  renderHome = home;
  document.getElementById('logo').onclick = e => { e.preventDefault(); home(); };
  home();
})();
