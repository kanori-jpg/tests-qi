// Maquette « La ville qui rêve » : illustration de ville de nuit dessinée en SVG (originale),
// typographie de conte, catégories rangées en « quartiers ».
(function () {
  const fmt = n => n.toLocaleString('fr-FR');
  const total = Object.values(TESTS).reduce((s, t) => s + t.questions.length, 0);
  const C = { midnight: '#1b1f3b', lavender: '#8b7fae', cream: '#f2dcb8', amber: '#e3a565', mauve: '#7b506a', slate: '#4a4e5f' };

  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;

  // Visage endormi (lune, nuages)
  const sleepy = (cx, cy, s) => `
    <path d="M${cx - 22 * s} ${cy} q${9 * s} ${7 * s} ${18 * s} 0 M${cx + 4 * s} ${cy} q${9 * s} ${7 * s} ${18 * s} 0" fill="none" stroke="#7a5a52" stroke-width="${2.4 * s}" stroke-linecap="round"/>
    <ellipse cx="${cx - 26 * s}" cy="${cy + 12 * s}" rx="${8 * s}" ry="${5 * s}" fill="#e9a3a0" opacity=".55"/><ellipse cx="${cx + 26 * s}" cy="${cy + 12 * s}" rx="${8 * s}" ry="${5 * s}" fill="#e9a3a0" opacity=".55"/>
    <path d="M${cx - 6 * s} ${cy + 18 * s} q${6 * s} ${4 * s} ${12 * s} 0" fill="none" stroke="#7a5a52" stroke-width="${2 * s}" stroke-linecap="round"/>`;
  const cloud = (x, y, s, face) => `<g opacity=".92"><circle cx="${x}" cy="${y}" r="${26 * s}" fill="#a79bc8"/><circle cx="${x + 30 * s}" cy="${y - 10 * s}" r="${32 * s}" fill="#b3a8d2"/><circle cx="${x + 64 * s}" cy="${y}" r="${24 * s}" fill="#a79bc8"/><rect x="${x}" y="${y}" width="${64 * s}" height="${24 * s}" fill="#a79bc8"/>${face ? sleepy(x + 32 * s, y - 4 * s, s * .55) : ''}</g>`;

  // Un immeuble avec fenêtres allumées au hasard
  function building(x, y, w, h, col, roof) {
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}"/>`;
    if (roof === 'dome') s += `<path d="M${x - 4} ${y} Q${x + w / 2} ${y - w * .7} ${x + w + 4} ${y} Z" fill="${col}"/>`;
    if (roof === 'peak') s += `<path d="M${x - 4} ${y} L${x + w / 2} ${y - w * .6} L${x + w + 4} ${y} Z" fill="${col}"/>`;
    if (roof === 'spire') s += `<path d="M${x + w * .3} ${y} L${x + w / 2} ${y - w * 1.2} L${x + w * .7} ${y} Z" fill="${col}"/>`;
    const cols = Math.max(2, Math.floor(w / 18)), rows = Math.floor((h - 20) / 26);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const lit = rnd() < .55, wx = x + 8 + c * ((w - 16) / cols), wy = y + 14 + r * 26;
      s += `<rect x="${wx.toFixed(0)}" y="${wy}" width="${Math.min(9, (w - 16) / cols - 4).toFixed(0)}" height="13" rx="4" fill="${lit ? '#f4c37a' : '#2a2c4f'}" opacity="${lit ? (.75 + rnd() * .25).toFixed(2) : 1}"/>`;
    }
    return s;
  }
  const lamp = (x, y, h) => `
    <circle cx="${x}" cy="${y - h}" r="46" fill="url(#glow)"/>
    <rect x="${x - 3}" y="${y - h}" width="6" height="${h}" fill="#151831"/>
    <path d="M${x - 14} ${y - h} h28 l-6 -24 h-16 Z" fill="#151831"/><rect x="${x - 8}" y="${y - h - 20}" width="16" height="16" rx="3" fill="#ffd79a"/>`;

  function city() {
    seed = 7;
    const stars = Array.from({ length: 70 }, () => `<circle cx="${(rnd() * 1200).toFixed(0)}" cy="${(rnd() * 300).toFixed(0)}" r="${(rnd() * 1.4 + .3).toFixed(1)}" fill="#fff" opacity="${(rnd() * .7 + .2).toFixed(2)}"/>`).join('');
    let back = '', mid = '';
    for (let x = 0; x < 1200; x += 70 + rnd() * 40) back += building(x, 260 + rnd() * 120, 50 + rnd() * 40, 400, '#2b2f5a', pick3());
    for (let x = -20; x < 1200; x += 110 + rnd() * 60) if (x < 380 || x > 760) mid += building(x, 380 + rnd() * 80, 90 + rnd() * 50, 400, '#363a6a', pick3());
    function pick3() { const r = rnd(); return r < .3 ? 'dome' : r < .6 ? 'peak' : r < .75 ? 'spire' : ''; }
    return `<svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" class="city" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1029"/><stop offset=".55" stop-color="#262a55"/><stop offset="1" stop-color="#4a4777"/></linearGradient>
        <radialGradient id="moonG" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#fff4dc"/><stop offset="1" stop-color="#e2c79c"/></radialGradient>
        <radialGradient id="halo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#f2dcb8" stop-opacity=".45"/><stop offset="1" stop-color="#f2dcb8" stop-opacity="0"/></radialGradient>
        <radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffcf87" stop-opacity=".8"/><stop offset="1" stop-color="#ffcf87" stop-opacity="0"/></radialGradient>
        <linearGradient id="street" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2a4a"/><stop offset="1" stop-color="#14162c"/></linearGradient>
      </defs>
      <rect width="1200" height="700" fill="url(#sky)"/>${stars}
      <circle cx="300" cy="150" r="170" fill="url(#halo)"/>
      <circle cx="300" cy="150" r="92" fill="url(#moonG)"/>
      <circle cx="262" cy="118" r="12" fill="#d9bd92" opacity=".45"/><circle cx="340" cy="190" r="9" fill="#d9bd92" opacity=".4"/><circle cx="335" cy="112" r="6" fill="#d9bd92" opacity=".4"/>
      ${sleepy(300, 150, 1.6)}
      ${cloud(110, 110, 1, true)}${cloud(470, 250, .8, true)}${cloud(590, 70, .6, false)}${cloud(30, 300, .6, true)}
      ${back}
      <g>${building(520, 300, 120, 400, '#3d3f70', '')}<path d="M510 300 L580 210 L650 300 Z" fill="#3d3f70"/><circle cx="580" cy="262" r="22" fill="#f2dcb8"/><path d="M580 262 v-14 M580 262 l10 6" stroke="#4a3b3b" stroke-width="3" stroke-linecap="round"/></g>
      ${mid}
      <path d="M380 700 L520 520 L680 520 L820 700 Z" fill="url(#street)"/>
      ${Array.from({ length: 22 }, () => `<ellipse cx="${(450 + rnd() * 300).toFixed(0)}" cy="${(560 + rnd() * 130).toFixed(0)}" rx="${(6 + rnd() * 10).toFixed(0)}" ry="2" fill="#f4c37a" opacity="${(rnd() * .35 + .1).toFixed(2)}"/>`).join('')}
      ${lamp(410, 690, 230)}${lamp(790, 690, 230)}${lamp(500, 600, 140)}${lamp(700, 600, 140)}
      <path d="M0 700 L0 470 Q60 430 140 450 L200 700 Z" fill="#202444"/><path d="M1200 700 L1200 460 Q1140 420 1060 445 L1000 700 Z" fill="#202444"/>
      <rect x="1040" y="560" width="110" height="34" rx="8" fill="#151831"/><text x="1095" y="583" text-anchor="middle" font-family="Pinyon Script" font-size="22" fill="#ff9ec7">Bonne nuit</text>
    </svg>`;
  }

  // petites vignettes des quartiers
  const VIGN = {
    lamp: `<svg viewBox="0 0 120 150"><rect width="120" height="150" fill="#22264a"/><circle cx="60" cy="50" r="44" fill="url(#vglow)"/><rect x="57" y="50" width="6" height="100" fill="#151831"/><path d="M44 50 h32 l-7 -26 h-18 Z" fill="#151831"/><rect x="51" y="28" width="18" height="18" rx="3" fill="#ffd79a"/></svg>`,
    house: `<svg viewBox="0 0 120 150"><rect width="120" height="150" fill="#22264a"/><path d="M20 150 V70 Q60 20 100 70 V150 Z" fill="#3d3f70"/>${sleepy(60, 92, .7)}<rect x="48" y="118" width="24" height="32" rx="10" fill="#f4c37a" opacity=".85"/></svg>`,
    cloud: `<svg viewBox="0 0 120 150"><rect width="120" height="150" fill="#22264a"/>${cloud(18, 80, 1.05, true)}<circle cx="20" cy="30" r="1.5" fill="#fff"/><circle cx="96" cy="22" r="1.2" fill="#fff"/><circle cx="70" cy="40" r="1" fill="#fff"/></svg>`,
    window: `<svg viewBox="0 0 120 150"><rect width="120" height="150" fill="#22264a"/><path d="M25 150 V60 Q60 20 95 60 V150 Z" fill="#f4c37a" opacity=".85"/><path d="M60 32 V150 M25 95 H95" stroke="#22264a" stroke-width="5"/><path d="M70 150 q0 -22 10 -26 l3 -9 l4 8 l4 -8 l2 10 q8 6 6 25 Z" fill="#151831"/></svg>`,
  };
  const QUARTIERS = [
    { nom: 'Les lampadaires de la logique', court: 'Lumières logiques', txt: 'Ils éclairent les suites et les déductions.', v: 'lamp', cats: ['logique', 'suites', 'lettresnombres', 'enigmes', 'deduction', 'propositions'] },
    { nom: 'Les maisons des formes', court: 'Maisons rêveuses', txt: 'Chaque façade cache une figure.', v: 'house', cats: ['matrices', 'figures', 'pentagones', 'grille2', 'rotation', 'cubesx', 'formes'] },
    { nom: 'Les nuages des mots', court: 'Nuages de mots', txt: 'Ils flottent, chargés de sens.', v: 'cloud', cats: ['verbal', 'verbalmix', 'alpha'] },
    { nom: 'La fenêtre de la mémoire', court: 'Petits rêveurs', txt: 'On y regarde, on retient, on écoute.', v: 'window', cats: ['memoire', 'labyrinthes', 'trace', 'melodies'] },
  ];

  function home() {
    clearTimeout(memoTimer);
    if (typeof melodyStop === 'function' && melodyStop) melodyStop();
    app.innerHTML = `
    <section class="poster">
      ${city()}
      <div class="poster-title">
        <h1><span class="caps">La ville qui</span><span class="script">Réfléchit</span></h1>
        <p class="tag">Chaque fenêtre allumée est une question qui attend.</p>
        <button class="btn amber-btn" data-start="complet">Entrer dans la ville</button>
      </div>
    </section>

    <section class="realm">
      <div class="about">
        <h3 class="label">✦ À propos de la ville ✦</h3>
        <p>Quand la lune se lève, la ville se met à penser. Ses ${fmt(total)} fenêtres s’allument une à une : des suites, des matrices, des cubes qui tournent, des mélodies… Ici, rien ne presse : chaque énigme a tout son temps.</p>
        <div class="divider">— ✦ —</div>
        <blockquote>Toutes les villes ne sont pas bruyantes.<br>Certaines réfléchissent en silence. <span>☾</span></blockquote>
      </div>
      <div class="details" id="quartiers">
        <h3 class="label">✦ Les quartiers de la ville ✦</h3>
        <div class="vign-row">${QUARTIERS.map((q, i) => `
          <a href="#" class="vign" data-q="${i}">${VIGN[q.v]}<strong>${q.court}</strong><small>${q.txt}</small></a>`).join('')}
        </div>
      </div>
    </section>

    <section class="palette">
      <span class="label small">Palette<br>de la nuit</span>
      ${[['Bleu minuit', C.midnight], ['Lavande', C.lavender], ['Crème de lune', C.cream], ['Ambre', C.amber], ['Mauve', C.mauve], ['Ardoise', C.slate]].map(([n, c]) => `<div class="sw"><i style="background:${c}"></i><span>${n}</span></div>`).join('')}
      <em class="sign">Ferme les yeux…<br>la ville veille sur tes réponses.</em>
    </section>

    <div id="categories">${QUARTIERS.map((q, i) => `
      <h2 class="section-title" id="q${i}"><span class="caps-s">${q.nom}</span></h2>
      <section class="cards">${q.cats.filter(k => TESTS[k]).map(k => { const t = TESTS[k]; return `
        <article class="test-card">
          <div class="test-icon">${t.icon}</div>
          <h2>${t.title}</h2><p>${t.desc}</p>
          <div class="test-meta"><span>10 questions</span><span>${fmt(t.questions.length)} en réserve</span></div>
          <button class="btn amber-btn" data-start="${k}">Commencer</button>
        </article>`; }).join('')}
      </section>`).join('')}
      <h2 class="section-title"><span class="caps-s">Les grandes épreuves</span></h2>
      <section class="cards">${Object.entries(SPECIAL).map(([k, s]) => `
        <article class="test-card"><div class="test-icon">${s.icon}</div><h2>${s.title}</h2><p>${s.desc}</p>
          <div class="test-meta"><span>${s.size()} questions</span></div><button class="btn amber-btn" data-start="${k}">Commencer</button></article>`).join('')}
      </section>
    </div>
    <svg width="0" height="0" style="position:absolute"><defs><radialGradient id="vglow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffcf87" stop-opacity=".85"/><stop offset="1" stop-color="#ffcf87" stop-opacity="0"/></radialGradient></defs></svg>`;
    bind(app);
    app.querySelectorAll('[data-q]').forEach(a => a.onclick = e => { e.preventDefault(); document.getElementById('q' + a.dataset.q).scrollIntoView({ behavior: 'smooth' }); });
    window.scrollTo(0, 0);
  }

  function bind(root) {
    root.querySelectorAll('[data-start]').forEach(el => el.onclick = e => { e.preventDefault(); startTest(el.dataset.start); window.scrollTo(0, 0); });
    root.querySelectorAll('[data-go]').forEach(el => el.onclick = e => {
      e.preventDefault();
      if (!document.querySelector('.poster')) home();
      const g = el.dataset.go;
      if (g === 'home') return window.scrollTo({ top: 0, behavior: 'smooth' });
      document.getElementById(g)?.scrollIntoView({ behavior: 'smooth' });
    });
  }
  renderHome = home;
  bind(document.querySelector('.night-nav'));
  document.getElementById('logo').onclick = e => { e.preventDefault(); home(); };
  home();
})();
