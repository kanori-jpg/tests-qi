// Maquette « Rose pastel » : remplace seulement le haut de l'accueil par une mise en page en cartes,
// sans toucher au fonctionnement du site.
(function () {
  const total = Object.values(TESTS).reduce((s, t) => s + t.questions.length, 0);
  const cats = Object.keys(TESTS).length;
  const fmt = n => n.toLocaleString('fr-FR');

  // Petite mascotte originale : un cerveau tout rond qui sourit
  const MASCOT = `
  <svg viewBox="0 0 220 200" class="mascot" aria-hidden="true">
    <defs>
      <linearGradient id="brainG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc2d4"/><stop offset="1" stop-color="#f797b5"/></linearGradient>
    </defs>
    <ellipse cx="110" cy="182" rx="62" ry="8" fill="#f3b8cb" opacity=".45"/>
    <path d="M60 120 C30 118 26 80 52 72 C46 44 78 30 98 44 C108 22 146 24 152 48 C180 42 198 70 182 92 C202 108 188 142 160 138 C150 160 112 164 100 146 C82 158 56 146 60 120 Z" fill="url(#brainG)" stroke="#e8749a" stroke-width="3"/>
    <path d="M98 44 C96 62 110 66 112 80 M152 48 C142 58 146 72 136 82 M52 72 C66 74 72 86 70 96 M182 92 C168 92 162 104 166 116 M100 146 C104 132 96 122 86 120" fill="none" stroke="#e8749a" stroke-width="3" stroke-linecap="round" opacity=".55"/>
    <circle cx="96" cy="104" r="7" fill="#4b3a42"/><circle cx="138" cy="104" r="7" fill="#4b3a42"/>
    <circle cx="98.5" cy="101.5" r="2.4" fill="#fff"/><circle cx="140.5" cy="101.5" r="2.4" fill="#fff"/>
    <ellipse cx="84" cy="120" rx="9" ry="5" fill="#ff8fb0" opacity=".7"/><ellipse cx="150" cy="120" rx="9" ry="5" fill="#ff8fb0" opacity=".7"/>
    <path d="M108 118 Q117 127 126 118" fill="none" stroke="#4b3a42" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M40 40 v14 M33 47 h14" stroke="#ef6f98" stroke-width="4" stroke-linecap="round"/>
    <path d="M196 28 v10 M191 33 h10" stroke="#ef6f98" stroke-width="3" stroke-linecap="round"/>
    <path d="M200 150 v12 M194 156 h12" stroke="#f6a6c0" stroke-width="3.5" stroke-linecap="round"/>
  </svg>`;

  const HERO = `
  <section class="bento">
    <div class="b-card b-stats">
      <div class="big-num">${fmt(total)}</div>
      <div class="b-label">questions</div>
      <div class="b-tags"><span class="tag">${cats} catégories</span><span class="tag">Sans chrono</span><span class="tag">Corrigé détaillé</span></div>
      <div class="b-bar"><span style="width:62%"></span></div>
    </div>
    <div class="b-card b-title">
      <span class="spark s1">+</span><span class="spark s2">+</span>
      <h1>teste ton<br><span class="hl">intelligence</span></h1>
      <p>10 questions tirées au hasard à chaque partie, à ton rythme. À la fin : ton score et la correction de chaque question <span class="heart">♡</span></p>
      <button class="btn primary" data-start="complet">Lancer le test complet</button>
    </div>
    <div class="b-card b-mascot">${MASCOT}<span class="dots"></span></div>
  </section>`;

  const baseHome = renderHome;
  renderHome = function () {
    baseHome();
    const hero = document.querySelector('.hero');
    if (hero) hero.outerHTML = HERO;
    document.querySelectorAll('.section-title')[0]?.setAttribute('id', 'complets');
    document.querySelectorAll('.section-title')[1]?.setAttribute('id', 'categories');
    app.querySelectorAll('[data-start]').forEach(b => b.onclick = () => startTest(b.dataset.start));
  };

  // navigation en pilule
  document.querySelectorAll('.pill-nav a').forEach(a => a.onclick = e => {
    e.preventDefault();
    document.querySelectorAll('.pill-nav a').forEach(x => x.classList.toggle('active', x === a));
    if (!document.querySelector('.bento')) renderHome();
    if (a.dataset.go === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
    else document.getElementById(a.dataset.go)?.scrollIntoView({ behavior: 'smooth' });
  });

  renderHome();
})();
