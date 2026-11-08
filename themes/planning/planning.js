// Maquette « Planning pixel » : écran de téléphone lavande, planning de la semaine, cartes « hors ligne » en pixel art.
(function () {
  const fmt = n => n.toLocaleString('fr-FR');
  const total = Object.values(TESTS).reduce((s, t) => s + t.questions.length, 0);
  const O = '#3a2a63';

  // Petit moteur de pixel art : chaque lettre de la grille est une couleur
  function px(rows, pal, cls, size = 1) {
    const w = rows[0].length, h = rows.length;
    let r = '';
    rows.forEach((row, y) => [...row].forEach((c, x) => { if (pal[c]) r += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${pal[c]}"/>`; }));
    return `<svg class="${cls}" viewBox="0 0 ${w} ${h}" width="${w * size}" height="${h * size}" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
  }
  const CLOUD = ['.....WWW.........', '...WWWWWW..WW....', '..WWWWWWWWWWWW...', '.WWWWWWWWWWWWWWW.', 'WWWWWWWWWWWWWWWWW'];
  const STAR = ['..O..', '.OPO.', 'OPPPO', '.OPO.', '..O..'];
  const FACE = ['X.X...X.X', '.X.....X.', 'X.X...X.X', '.........', '...XXX...', '..X...X..'];
  const cloud = s => px(CLOUD, { W: '#fff' }, 'pcloud', s);
  const star = (c, cls) => px(STAR, { O, P: c }, 'pstar ' + cls, 4);
  const face = px(FACE, { X: O }, 'pface', 3);

  // Statut du téléphone : semaine en cours, wifi, batterie
  const now = new Date(), dow = (now.getDay() + 6) % 7;
  const mon = new Date(now); mon.setDate(now.getDate() - dow);
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
  const mo = d => d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '').toUpperCase();
  document.getElementById('week').textContent = `SEMAINE DU ${mon.getDate()}${mo(mon) !== mo(sun) ? ' ' + mo(mon) : ''} AU ${sun.getDate()} ${mo(sun)}`;
  document.getElementById('icons').innerHTML = `<svg viewBox="0 0 20 14" width="18"><path d="M2 5 Q10 -2 18 5 M5 8 Q10 4 15 8 M8 11 Q10 9.5 12 11" fill="none" stroke="${O}" stroke-width="2" stroke-linecap="round"/></svg><svg viewBox="0 0 26 14" width="22"><rect x="1" y="1" width="21" height="12" rx="3" fill="none" stroke="${O}" stroke-width="2"/><rect x="4" y="4" width="11" height="6" fill="${O}"/><rect x="23" y="5" width="2.5" height="4" fill="${O}"/></svg>`;
  document.getElementById('env').innerHTML = `<svg viewBox="0 0 34 26" width="34"><rect x="2" y="3" width="30" height="21" rx="2" fill="#b49af0" stroke="${O}" stroke-width="2.5"/><path d="M2 4 L17 15 L32 4" fill="none" stroke="${O}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="30" cy="4" r="4.5" fill="#f28cc4" stroke="${O}" stroke-width="2"/></svg>`;
  document.getElementById('foot-l').textContent = `${Object.keys(TESTS).length} épreuves · ${fmt(total)} questions`;

  // Décor de fond : dossiers, étoiles, damier
  const FOLDER = (c1, c2) => `<svg viewBox="0 0 60 46" class="folder"><path d="M3 8 h18 l5 6 h31 v29 h-54 Z" fill="${c1}" stroke="${O}" stroke-width="2.5" stroke-linejoin="round"/><path d="M3 18 h54 v25 h-54 Z" fill="${c2}" stroke="${O}" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
  document.getElementById('deco').innerHTML = `
    <div class="f f1">${FOLDER('#f6b6d8', '#fff')}</div><div class="f f2">${FOLDER('#c6b2f5', '#fff')}</div>
    <div class="f f3">${FOLDER('#f6b6d8', '#fde7f3')}</div><div class="f f4">${FOLDER('#c6b2f5', '#f2ecff')}</div>
    <div class="chk c1"></div><div class="chk c2"></div>
    <span class="dia a1"></span><span class="dia a2"></span><span class="dia a3"></span><span class="dia a4"></span>`;

  // Le planning : 7 jours, 20 épreuves
  const DAYS = [
    ['lun', 'Logique & suites', ['logique', 'suites', 'lettresnombres']],
    ['mar', 'Les mots', ['verbal', 'verbalmix', 'alpha']],
    ['mer', 'Matrices', ['matrices', 'grille2', 'pentagones']],
    ['jeu', 'Voir dans l’espace', ['rotation', 'cubesx', 'figures']],
    ['ven', 'Déduction', ['deduction', 'propositions', 'enigmes']],
    ['sam', 'Mémoire & oreille', ['memoire', 'melodies', 'formes']],
    ['dim', 'Balade', ['labyrinthes', 'trace']],
  ];
  const SHORT = { lettresnombres: 'Lettres & chiffres', verbalmix: 'Verbal mixte', propositions: 'Logique propositionnelle', deduction: 'Si… alors', alpha: 'Army Alpha', figures: 'Analogies de figures' };

  function dayCard(i, wide, best) {
    const [tag, theme, keys] = DAYS[i];
    const today = i === dow;
    return `<article class="card day${wide ? ' wide' : ''}${today ? ' today' : ''}">
      ${today ? '<span class="ribbon"></span><span class="heart">♥</span>' : ''}
      <div class="day-head"><span class="tag">${tag}</span>${today ? '<span class="tday">aujourd’hui</span>' : ''}</div>
      <div class="day-txt"><h3>${theme}</h3><p>${keys.length} épreuves · 10 Q chacune</p></div>
      <div class="slots">${keys.map(k => { const t = TESTS[k], b = best[k]; return `
        <button class="slot" data-start="${k}"><span class="tm${b !== undefined ? ' done' : ''}">${b !== undefined ? b + '/10' : t.icon}</span><span class="sn">${SHORT[k] || t.title}</span></button>`; }).join('')}
      </div>
    </article>`;
  }
  function offCard(key, label, sub, strip) {
    return `<article class="card off${strip ? ' strip' : ''}" data-key="${key}">
      <button class="switch" aria-label="Lancer ${label}"><i></i></button>
      ${cloud(4)}${cloud(3)}${star('#f28cc4', 's1')}${star('#c6b2f5', 's2')}${star('#f28cc4', 's3')}
      <div class="off-txt"><b>${label}</b><small>${sub}</small></div>
      ${face}
    </article>`;
  }

  function home() {
    clearTimeout(memoTimer);
    if (typeof melodyStop === 'function' && melodyStop) melodyStop();
    let best = {}; try { best = JSON.parse(localStorage.getItem('tests-qi-best')) || {}; } catch { best = {}; }
    app.innerHTML = `
    <section class="plan">
      <div class="r2">${offCard('complet', 'hors ligne', 'test complet · 40 Q', false)}${dayCard(0, false, best)}</div>
      ${offCard('icar16', 'hors ligne', 'test express · 16 Q', true)}
      ${dayCard(1, true, best)}
      <div class="r3">${dayCard(2, false, best)}${dayCard(3, false, best)}${offCard('progressives', 'hors ligne', 'grand défi · 30 Q', false)}</div>
      ${dayCard(4, true, best)}
      <div class="r2">${dayCard(5, false, best)}${dayCard(6, false, best)}</div>
      <p class="hint">allume un écran « hors ligne » pour lancer un test spécial ✦ aucun chrono, jamais</p>
    </section>`;
    app.querySelectorAll('[data-start]').forEach(el => el.onclick = e => { e.preventDefault(); startTest(el.dataset.start); window.scrollTo(0, 0); });
    app.querySelectorAll('.card.off').forEach(card => card.onclick = () => {
      if (card.classList.contains('on')) return;
      card.classList.add('on');
      card.querySelector('.off-txt b').textContent = 'en ligne !';
      setTimeout(() => { startTest(card.dataset.key); window.scrollTo(0, 0); }, 550);
    });
    window.scrollTo(0, 0);
  }

  renderHome = home;
  document.getElementById('logo').onclick = e => { e.preventDefault(); home(); };
  document.getElementById('notch').onclick = () => home();
  home();
})();
