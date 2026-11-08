// Maquette « Fantasy » : paysages dessinés en SVG (originaux), carrousel des catégories, arc rose en bas.
(function () {
  const keys = Object.keys(TESTS);
  const total = Object.values(TESTS).reduce((s, t) => s + t.questions.length, 0);

  // Palettes de crépuscule : [haut du ciel, horizon, montagnes lointaines, montagnes, forêt, rivière]
  const PAL = [
    ['#1d1f4f', '#f39bb5', '#8a6fb8', '#4f3f86', '#1d2a4a', '#c7a6e8'],
    ['#2a1748', '#ffb38a', '#b4709c', '#6a3f7d', '#2a2140', '#ffc6a6'],
    ['#10284a', '#9fd3f0', '#6b8fc4', '#3a5a94', '#163049', '#b9e3ff'],
    ['#2d1236', '#ff8fb1', '#a3568c', '#5c2d63', '#25142d', '#ffb4cb'],
    ['#14303a', '#f7d48a', '#7aa39b', '#3f6a6b', '#13302f', '#ffe6a8'],
    ['#23163d', '#c9a2ff', '#7c63b8', '#4a3a80', '#1c1836', '#e0c8ff'],
  ];
  // Paysage original : ciel, étoiles, soleil, montagnes en couches, sapins, rivière
  function landscape(i, uid) {
    const [sky, hor, far, mid, forest, river] = PAL[i % PAL.length];
    let s = i * 97 + 13; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const stars = Array.from({ length: 26 }, () => `<circle cx="${(rnd() * 300).toFixed(0)}" cy="${(rnd() * 150).toFixed(0)}" r="${(rnd() * 1.3 + .3).toFixed(1)}" fill="#fff" opacity="${(rnd() * .6 + .3).toFixed(2)}"/>`).join('');
    const peak = 110 + rnd() * 80;
    const pines = (y, h, n, col) => Array.from({ length: n }, (_, k) => { const x = (k / (n - 1)) * 320 - 10 + rnd() * 10, hh = h * (.7 + rnd() * .6); return `<path d="M${x} ${y - hh} L${x + hh * .28} ${y} L${x - hh * .28} ${y} Z" fill="${col}"/>`; }).join('');
    return `<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" class="land" aria-hidden="true">
      <defs>
        <linearGradient id="sk${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky}"/><stop offset=".62" stop-color="${hor}"/></linearGradient>
        <radialGradient id="sn${uid}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6e8"/><stop offset="1" stop-color="#fff6e8" stop-opacity="0"/></radialGradient>
        <linearGradient id="rv${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${river}"/><stop offset="1" stop-color="${mid}"/></linearGradient>
      </defs>
      <rect width="300" height="400" fill="url(#sk${uid})"/>${stars}
      <circle cx="${150 + (rnd() - .5) * 60}" cy="${peak + 20}" r="70" fill="url(#sn${uid})" opacity=".8"/>
      <path d="M0 250 L60 ${190 + rnd() * 20} L110 225 L170 ${180 + rnd() * 20} L230 230 L300 ${200 + rnd() * 20} L300 400 L0 400 Z" fill="${far}" opacity=".85"/>
      <path d="M40 270 L150 ${peak} L260 270 Z" fill="${mid}"/>
      <path d="M150 ${peak} L128 ${peak + 34} L140 ${peak + 28} L150 ${peak + 40} L162 ${peak + 28} L172 ${peak + 34} Z" fill="#f4eefe"/>
      <path d="M0 300 Q80 262 150 286 T300 280 L300 400 L0 400 Z" fill="${forest}" opacity=".9"/>
      ${pines(300, 46, 9, forest)}
      <path d="M140 300 Q120 330 158 350 Q196 372 150 400 L196 400 Q236 366 190 344 Q160 326 166 300 Z" fill="url(#rv${uid})" opacity=".9"/>
      <path d="M0 400 L0 340 Q50 330 90 352 L110 400 Z M300 400 L300 336 Q252 330 214 354 L196 400 Z" fill="#120b1c" opacity=".75"/>
      ${pines(392, 70, 5, '#120b1c')}
    </svg>`;
  }

  let current = 0;
  function carousel() {
    const n = keys.length, at = d => keys[(current + d + n) % n];
    const card = (d, cls) => { const k = at(d), t = TESTS[k], i = keys.indexOf(k);
      return `<div class="c-card ${cls}" data-shift="${d}" style="--tint:${t.color}">${landscape(i, 'c' + d)}
        ${d === 0 ? `<div class="c-over"><span class="c-icon">${t.icon}</span><strong>${t.title}</strong><small>${t.desc}</small>
          <button class="play-btn" data-start="${k}" title="Commencer">▶</button></div>` : `<span class="c-mini">${t.icon}</span>`}</div>`; };
    return `<div class="carousel" id="carousel">
      <button class="arrow left" data-shift="-1" title="Précédent">‹</button>
      ${card(-2, 'far left')}${card(-1, 'side left')}${card(0, 'center')}${card(1, 'side right')}${card(2, 'far right')}
      <button class="arrow right" data-shift="1" title="Suivant">›</button>
    </div>
    <div class="c-count">${current + 1} / ${n}</div>`;
  }

  function home() {
    clearTimeout(memoTimer);
    if (typeof melodyStop === 'function' && melodyStop) melodyStop();
    app.innerHTML = `
    <section class="hero">
      <div class="h-text">
        <h1>Explore ton<br><span class="pink">intelligence</span> <a class="arrow-badge" data-go="carousel" href="#">↘</a></h1>
        <p>${total.toLocaleString('fr-FR')} questions réparties en ${keys.length} catégories : logique, matrices, rotation 3D, mémoire, oreille musicale… À chaque partie, 10 questions au hasard, sans chrono, avec la correction détaillée.</p>
        <button class="glass-btn" data-start="complet">Commencer <span>›</span></button>
      </div>
      <div class="h-card">${landscape(3, 'hero')}</div>
    </section>

    <section class="stage" id="carousel-wrap">
      <div class="band"></div>
      <div id="car">${carousel()}</div>
      <button class="glass-btn small" data-go="all">Tout voir</button>
      <span class="chev">⌄</span>
    </section>

    <section class="arc-zone" id="complets">
      <div class="arc"></div>
      <div class="fan">${Object.entries(SPECIAL).map(([k, s], i) => `
        <div class="fan-card f${i}" data-start="${k}">${landscape(i + 1, 'f' + i)}
          <div class="fan-over"><span>${s.icon}</span><strong>${s.title}</strong><small>${s.size()} questions</small></div>
          ${i === 1 ? '<span class="corner">↗</span>' : ''}
        </div>`).join('')}
      </div>
      <div class="arc-badge">QI</div>
    </section>

    <section id="all" class="all-grid" hidden>
      <h2 class="section-title">Toutes les catégories</h2>
      <section class="cards">${keys.map((k, i) => { const t = TESTS[k]; return `
        <article class="test-card">
          <div class="mini-land">${landscape(i, 'g' + i)}<span>${t.icon}</span></div>
          <h2>${t.title}</h2><p>${t.desc}</p>
          <button class="btn primary" data-start="${k}">Commencer</button>
        </article>`; }).join('')}
      </section>
    </section>`;
    bind(app);
    window.scrollTo(0, 0);
  }

  function bindCarousel() {
    document.querySelectorAll('#car [data-shift]').forEach(el => el.onclick = e => {
      if (e.target.closest('[data-start]')) return;
      current = (current + +el.dataset.shift + keys.length) % keys.length;
      document.getElementById('car').innerHTML = carousel(); bindCarousel(); bind(document.getElementById('car'));
    });
  }
  function bind(root) {
    root.querySelectorAll('[data-start]').forEach(el => el.onclick = e => { e.stopPropagation(); e.preventDefault(); startTest(el.dataset.start); window.scrollTo(0, 0); });
    root.querySelectorAll('[data-go]').forEach(el => el.onclick = e => {
      e.preventDefault();
      if (!document.querySelector('.hero.h-only, .stage')) home();
      const g = el.dataset.go;
      if (g === 'home') return window.scrollTo({ top: 0, behavior: 'smooth' });
      if (g === 'all') { const a = document.getElementById('all'); a.hidden = false; return a.scrollIntoView({ behavior: 'smooth' }); }
      document.getElementById(g === 'carousel' ? 'carousel-wrap' : g)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    if (root === app) bindCarousel();
  }
  document.addEventListener('keydown', e => {
    if (!document.getElementById('car') || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    current = (current + (e.key === 'ArrowLeft' ? -1 : 1) + keys.length) % keys.length;
    document.getElementById('car').innerHTML = carousel(); bindCarousel(); bind(document.getElementById('car'));
  });

  renderHome = home;
  bind(document.querySelector('.glass-nav'));
  document.getElementById('logo').onclick = e => { e.preventDefault(); home(); };
  home();
})();
