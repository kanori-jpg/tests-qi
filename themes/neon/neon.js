// Maquette « Néon rose » : présentation façon affiche néon (enseigne, tableau, packs), décor dessiné en SVG.
(function () {
  const fmt = n => n.toLocaleString('fr-FR');
  const total = Object.values(TESTS).reduce((s, t) => s + t.questions.length, 0);
  const FAM = [
    { nom: 'Pack Logique', ic: '🔢', cats: ['logique', 'suites', 'lettresnombres', 'enigmes', 'deduction', 'propositions'] },
    { nom: 'Pack Visuel', ic: '🔷', cats: ['matrices', 'figures', 'pentagones', 'grille2', 'rotation', 'cubesx', 'formes'] },
    { nom: 'Pack Mots & mémoire', ic: '💬', cats: ['verbal', 'verbalmix', 'alpha', 'memoire', 'labyrinthes', 'trace', 'melodies'] },
  ];
  const IDEAL = [['🧩', 'Logique', 'logique'], ['🔷', 'Formes', 'matrices'], ['💬', 'Mots', 'verbal'], ['🧠', 'Mémoire', 'memoire'], ['🎵', 'Musique', 'melodies']];

  // Décor dessiné : branche de cerisier, tasse, lanterne
  const blossom = (x, y, r, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="${-r}" rx="${r * .62}" ry="${r}" fill="#f7b6d2" stroke="#e98bb5" stroke-width="1" transform="rotate(${a})"/>`).join('')}<circle r="${r * .38}" fill="#fff0f6"/><circle r="${r * .15}" fill="#e2558f"/></g>`;
  const BRANCH = `<svg viewBox="0 0 260 300" class="branch" aria-hidden="true">
    <path d="M250 290 C200 230 190 170 120 130 C80 108 60 70 30 40 M150 150 C170 110 200 100 230 70 M110 120 C90 150 60 160 30 170" fill="none" stroke="#5b3a4e" stroke-width="5" stroke-linecap="round"/>
    ${blossom(40, 48, 13, 10)}${blossom(70, 82, 16, -20)}${blossom(120, 128, 14, 30)}${blossom(160, 140, 12)}${blossom(228, 72, 15, 15)}${blossom(198, 100, 11, -10)}${blossom(36, 168, 13, 40)}${blossom(80, 152, 10)}${blossom(205, 225, 14, -30)}
    <circle cx="95" cy="60" r="4" fill="#f7b6d2"/><circle cx="180" cy="80" r="3.5" fill="#f7b6d2"/><circle cx="140" cy="100" r="3" fill="#fbd3e4"/>
  </svg>`;
  const MUG = `<svg viewBox="0 0 120 120" class="mug" aria-hidden="true">
    <path d="M42 18 q-6 -10 2 -16 M60 16 q-6 -10 2 -16 M78 18 q-6 -10 2 -16" fill="none" stroke="#f7b6d2" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>
    <path d="M24 28 H96 V92 Q96 112 76 112 H44 Q24 112 24 92 Z" fill="#f6eef3" stroke="#d9c3cf" stroke-width="2"/>
    <path d="M96 44 Q116 44 116 62 Q116 80 96 80" fill="none" stroke="#f6eef3" stroke-width="9"/>
    <text x="60" y="58" text-anchor="middle" font-family="Sacramento" font-size="17" fill="#8a4d6b">Penser</text>
    <text x="60" y="76" text-anchor="middle" font-family="Sacramento" font-size="17" fill="#8a4d6b">Chercher</text>
    <text x="60" y="94" text-anchor="middle" font-family="Sacramento" font-size="17" fill="#8a4d6b">Trouver</text>
  </svg>`;
  const LANTERN = `<svg viewBox="0 0 90 130" class="lantern" aria-hidden="true">
    <circle cx="45" cy="78" r="44" fill="url(#lg)"/>
    <defs><radialGradient id="lg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffcf8a" stop-opacity=".7"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/></radialGradient></defs>
    <path d="M30 18 Q45 4 60 18" fill="none" stroke="#c9b08a" stroke-width="3"/>
    <rect x="22" y="22" width="46" height="10" rx="4" fill="#3a2a35"/>
    <path d="M24 32 H66 L62 112 H28 Z" fill="rgba(255,220,170,.18)" stroke="#c9b08a" stroke-width="2"/>
    <path d="M45 58 q-8 12 0 22 q8 -10 0 -22 Z" fill="#ffb347"/><rect x="40" y="80" width="10" height="22" rx="2" fill="#fff3e0"/>
    <rect x="20" y="110" width="50" height="10" rx="4" fill="#3a2a35"/>
  </svg>`;

  function home() {
    clearTimeout(memoTimer);
    if (typeof melodyStop === 'function' && melodyStop) melodyStop();
    app.innerHTML = `
    <section class="top">
      <div class="title-block">
        <span class="spark sp1">✦</span>
        <h1><span class="t1">Tests de</span><span class="t2">Logique</span><span class="t3">& d’esprit</span></h1>
        <p class="claim">${fmt(total)} questions. <b>Ton rythme.</b><br>Joliment <b>corrigées.</b></p>
      </div>
      <div class="art">
        <div class="made neon-box">Fait avec<br>curiosité<br>& patience<span>♥</span></div>
        <div class="sign neon-box"><span class="neon">Prête à faire<br>chauffer tes<br>neurones ?</span><span class="heart">♡</span></div>
        ${BRANCH}${MUG}${LANTERN}
      </div>
    </section>

    <section class="grid-a">
      <div class="neon-box intro">
        <h3>Muscle ton esprit</h3>
        <p>Des tests de logique, de formes, de mots et de mémoire, pour les curieux, les étudiants, les joueurs… et tous ceux qui aiment réfléchir.</p>
      </div>
      <div class="deals neon-box" id="complets">
        <h3 class="pink-head">Les tests complets</h3>
        ${Object.entries(SPECIAL).map(([k, s]) => `
          <div class="deal" data-start="${k}"><span>${s.title.replace(' (format ICAR 16)', '')}</span><b>${s.size()} q.</b><em>▶</em></div>`).join('')}
      </div>
      <div class="neon-box ideal">
        <h3 class="label">Idéal pour</h3>
        <div class="ideal-row">${IDEAL.map(([ic, n, k]) => `<button data-start="${k}"><span>${ic}</span>${n}</button>`).join('')}</div>
      </div>
      <div class="neon-box feats">
        <p>⚡ Sans chrono</p><p>♥ Correction détaillée</p><p>✦ 10 questions au hasard</p>
      </div>
      <div class="neon-box request" id="liste">
        <h3 class="label">Ce que tu peux tester</h3>
        <p class="bullets">${Object.entries(TESTS).map(([k, t]) => `<a href="#" data-start="${k}">${t.title}</a>`).join(' <i>•</i> ')}</p>
      </div>
      <div class="neon-box note">Chaque partie tire 10 questions au hasard, puis t’explique chaque réponse, pas à pas. <span>♥</span></div>
    </section>

    <h2 class="bundles-title">— Les packs —</h2>
    <section class="bundles">${FAM.map(f => `
      <div class="neon-box bundle">
        <h3 class="pink-text">${f.nom}</h3>
        ${f.cats.filter(c => TESTS[c]).map(c => `<div class="b-row" data-start="${c}"><span>${TESTS[c].icon} ${TESTS[c].title}</span><b>▶</b></div>`).join('')}
        <div class="b-ic">${f.ic}</div>
      </div>`).join('')}
      <div class="neon-box cta" data-start="complet">
        <p>Prête à relever<br>le défi ?</p><span class="moon">☾</span><small>Lancer le test complet</small>
      </div>
    </section>
    <p class="bottom-line">☾ Bonne réflexion ! Reviens quand tu veux ✦</p>`;
    app.querySelectorAll('[data-start]').forEach(el => el.onclick = e => { e.preventDefault(); startTest(el.dataset.start); window.scrollTo(0, 0); });
    window.scrollTo(0, 0);
  }

  renderHome = home;
  document.getElementById('logo').onclick = e => { e.preventDefault(); home(); };
  home();
})();
