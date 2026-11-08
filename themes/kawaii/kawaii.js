// Maquette « Stream kawaii » : fenêtres rétro roses à contour épais, liste d'épreuves façon objectifs, bubble tea dessiné.
(function () {
  const fmt = n => n.toLocaleString('fr-FR');
  const total = Object.values(TESTS).reduce((s, t) => s + t.questions.length, 0);
  const O = '#4f2030';

  // Barre latérale : les familles en puces rondes
  const FAM = [['Logique & suites', 'logique'], ['Matrices & formes', 'matrices'], ['Rotation 3D', 'rotation'], ['Mots & culture', 'verbal'], ['Mémoire', 'memoire'], ['Oreille musicale', 'melodies']];
  document.getElementById('radios').innerHTML = FAM.map(([n, k]) => `<li><a href="#" data-start="${k}"><i></i>${n}</a></li>`).join('');

  // Bubble tea au lait fraise (dessin original)
  const TEA = `
  <svg viewBox="0 0 260 300" class="tea" aria-hidden="true">
    <path d="M150 10 L120 150" stroke="${O}" stroke-width="22" stroke-linecap="round"/><path d="M150 10 L120 150" stroke="#e8607f" stroke-width="15" stroke-linecap="round"/>
    <path d="M146 22 L138 60" stroke="#ff9db5" stroke-width="4" stroke-linecap="round"/>
    <path d="M34 110 Q130 80 226 110 L206 280 Q130 300 54 280 Z" fill="#fde6ec" stroke="${O}" stroke-width="4"/>
    <path d="M44 150 Q130 130 216 150 L206 278 Q130 298 54 278 Z" fill="#f7a8bd"/>
    <path d="M44 150 Q130 130 216 150" fill="none" stroke="#fff" stroke-width="5" opacity=".7"/>
    ${[[80, 250], [110, 262], [140, 258], [170, 248], [96, 232], [156, 228], [126, 240]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="#e8607f" stroke="${O}" stroke-width="3"/><circle cx="${x - 3}" cy="${y - 3}" r="3" fill="#ffd0dc"/>`).join('')}
    <path d="M30 104 Q130 70 230 104 Q236 118 226 120 Q130 92 34 120 Q24 118 30 104 Z" fill="#fff4f6" stroke="${O}" stroke-width="4"/>
    <circle cx="190" cy="100" r="22" fill="#e8607f" stroke="${O}" stroke-width="4"/>${[[182, 92], [194, 96], [186, 106], [198, 108]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="3" fill="#ffe08a"/>`).join('')}
    <path d="M182 80 q8 -10 18 -2 q-4 8 -18 2 Z" fill="#7ccf8e" stroke="${O}" stroke-width="2.5"/>
    <path d="M64 170 v70" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".6"/>
    <path d="M222 40 l4 -10 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 Z M24 60 l3 -7 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 Z" fill="#fff" stroke="${O}" stroke-width="2"/>
  </svg>`;
  const FOLDER = (label, start) => `<button class="folder" data-start="${start}"><svg viewBox="0 0 60 48"><path d="M4 10 h18 l6 6 h28 v28 h-52 Z" fill="#f48aa6" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M4 18 h52" stroke="${O}" stroke-width="3"/><rect x="22" y="26" width="16" height="5" rx="2.5" fill="#fff"/></svg><span>${label}</span></button>`;

  function home() {
    clearTimeout(memoTimer);
    if (typeof melodyStop === 'function' && melodyStop) melodyStop();
    let best = {}; try { best = JSON.parse(localStorage.getItem('tests-qi-best')) || {}; } catch { best = {}; }
    const keys = Object.keys(TESTS);
    const done = keys.filter(k => best[k] !== undefined).length;
    app.innerHTML = `
    <section class="scene">
      <span class="spark s1">✦</span><span class="spark s2">✦</span><span class="spark s3">✧</span><span class="dot d1"></span><span class="dot d2"></span>
      <div class="win list-win">
        <div class="bar"><span class="bar-title">liste des épreuves</span><span class="dots"><i></i><i></i></span></div>
        <div class="rows" id="rows">${keys.map(k => { const t = TESTS[k], ok = best[k] !== undefined; return `
          <button class="row${ok ? ' done' : ''}" data-start="${k}" data-name="${t.title.toLowerCase()}">
            <span class="r-ic">${ok ? '✓' : t.icon}</span><span class="r-name">${t.title}</span><span class="r-pts">${ok ? `${best[k]}/10` : fmt(t.questions.length)}</span>
          </button>`; }).join('')}
        </div>
        <p class="legend">10 questions par partie · ${done}/${keys.length} épreuves tentées · correction détaillée</p>
        <form class="chat" id="chat"><input id="q" placeholder="chercher une épreuve…" autocomplete="off"><button>go ➤</button></form>
      </div>

      <div class="win timer-win">
        <div class="timer-tag">${keys.length} : ${fmt(total)}</div>
        <div class="bar"><span class="dots"><i></i><i></i></span></div>
        <div class="timer-body">
          <div class="mini-tea">🧋</div>
          <div><strong>--:--</strong><small>+ tout le temps qu’il te faut</small></div>
        </div>
      </div>

      <div class="folders">${FOLDER('test complet', 'complet')}${FOLDER('test express', 'icar16')}${FOLDER('grand défi', 'progressives')}</div>
      <div class="tea-wrap">${TEA}</div>
    </section>`;
    app.querySelectorAll('[data-start]').forEach(el => el.onclick = e => { e.preventDefault(); startTest(el.dataset.start); window.scrollTo(0, 0); });
    const filter = () => { const v = document.getElementById('q').value.trim().toLowerCase(); document.querySelectorAll('#rows .row').forEach(r => { r.hidden = !!v && !r.dataset.name.includes(v); }); };
    document.getElementById('q').oninput = filter;
    document.getElementById('chat').onsubmit = e => { e.preventDefault(); const first = [...document.querySelectorAll('#rows .row')].find(r => !r.hidden); if (first) first.click(); };
    window.scrollTo(0, 0);
  }

  renderHome = home;
  document.querySelectorAll('.side [data-start]').forEach(el => el.onclick = e => { e.preventDefault(); startTest(el.dataset.start); window.scrollTo(0, 0); });
  document.getElementById('logo').onclick = e => { e.preventDefault(); home(); };
  home();
})();
