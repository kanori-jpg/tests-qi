// Application : accueil → quiz → résultats
const app = document.getElementById('app');
const BEST_KEY = 'tests-qi-best';
let state = null;
let memoTimer = null;

const shuffle = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const loadBest = () => {
  try { return JSON.parse(localStorage.getItem(BEST_KEY)) || {}; } catch { return {}; }
};
const saveBest = (key, score) => {
  const best = loadBest();
  if (best[key] === undefined || score > best[key]) {
    best[key] = score;
    localStorage.setItem(BEST_KEY, JSON.stringify(best));
    return true;
  }
  return false;
};

function optionHTML(q, idx) {
  const o = q.options[idx];
  if (q.grid || q.analogy || q.grid2) return cellSVG(o);
  if (q.penta) return pentaSVG(o);
  if (q.cube) return Array.isArray(o) ? cubeSVG(o) : symbolSVG(o);
  if (q.ocube) return orientedCubeSVG(o);
  return `<span>${o}</span>`;
}
const isVisual = q => !!(q.grid || q.cube || q.analogy || q.penta || q.grid2 || q.ocube);

// Figure affichée au-dessus des réponses (la correction montre aussi la solution des labyrinthes)
function figureHTML(q, corr) {
  if (q.cube) return cubeFigure(q);
  if (q.ocube) return orientedFigure(q);
  if (q.analogy) return analogyHTML(q.analogy);
  if (q.penta) return pentaAnalogyHTML(q.penta);
  if (q.grid2) return grid2HTML(q.grid2, corr);
  if (q.frag) return `<div class="figure"><div class="fig-frag">${fragSVG(q.frag, false)}</div>${corr ? `<div class="fig-frag">${fragSVG(q.frag, true)}</div>` : ''}</div>`;
  if (q.maze) return `<div class="figure"><div class="fig-maze">${mazeSVG(q.maze, corr)}</div></div>`;
  return '';
}

// Test complet : 5 questions tirées au hasard dans chaque catégorie, puis mélangées
const FULL = { title: 'Test complet', icon: '⭐', color: '#3f5bd9', perCat: 2,
  desc: 'Un mélange de toutes les catégories, avec ton score par catégorie.' };

const QUIZ_SIZE = 10;
const SEEN_KEY = 'tests-qi-seen';

// Tire n questions au hasard, en évitant celles déjà vues tant qu'il en reste de nouvelles
// (filter : pour ne tirer que dans une partie de la catégorie)
function draw(cat, n, filter = null) {
  let seen = {};
  try { seen = JSON.parse(localStorage.getItem(SEEN_KEY)) || {}; } catch { seen = {}; }
  const all = filter ? TESTS[cat].questions.filter(filter) : TESTS[cat].questions;
  let done = new Set(seen[cat] || []);
  let picked = shuffle(all.filter(q => !done.has(q.id))).slice(0, n);
  if (picked.length < n) {   // toute la banque a été vue : on repart à zéro
    done = new Set();
    picked = picked.concat(shuffle(all.filter(q => !picked.includes(q)))).slice(0, n);
  }
  picked.forEach(q => done.add(q.id));
  seen[cat] = [...done];
  localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  return picked;
}

function buildFullTest() {
  const questions = shuffle(Object.keys(TESTS).flatMap(cat => draw(cat, FULL.perCat).map(q => ({ ...q, cat }))));
  return { ...FULL, mixed: true, questions };
}

// Niveau de difficulté d'une matrice, d'après la règle utilisée
const MATRIX_LEVELS = ['Une règle simple', 'Deux règles combinées', 'Calcul, rotation ou carré latin', 'Double carré latin'];
function matrixLevel(q) {
  const e = q.explain;
  if (/une fois chaque forme et une fois chaque remplissage|un cercle, un carré et un triangle, ainsi/.test(e)) return 4;
  if (/somme|moins la 2e|La flèche tourne|une seule fois chaque forme/.test(e)) return 3;
  if (/La forme dépend de la colonne|Le nombre de flèches dépend/.test(e)) return 2;
  return 1;
}

// Formats de test particuliers, construits avec les questions des catégories
const SPECIAL = {
  complet: { ...FULL, size: () => FULL.perCat * Object.keys(TESTS).length, build: buildFullTest },
  icar16: {
    title: 'Test express (format ICAR 16)', icon: '⚡', color: '#0f766e',
    desc: '16 questions, 4 de chaque type : raisonnement verbal, suites, matrices et rotation 3D, comme le test court de l’ICAR.',
    size: () => 16,
    build: () => ({ title: 'Test express (format ICAR 16)', icon: '⚡', color: '#0f766e', mixed: true,
      questions: shuffle(['verbal', 'suites', 'matrices', 'rotation'].flatMap(cat => draw(cat, 4).map(q => ({ ...q, cat })))) }),
  },
  progressives: {
    title: 'Matrices progressives', icon: '📶', color: '#8b6cf0',
    desc: '30 matrices de plus en plus difficiles, dans l’esprit des matrices de Raven : 4 niveaux, de la règle simple au double carré latin.',
    size: () => 30,
    build: () => ({ title: 'Matrices progressives', icon: '📶', color: '#8b6cf0', byLevel: true, visual: true,
      // pas de mélange : la difficulté augmente au fil du test
      questions: [[1, 8], [2, 8], [3, 8], [4, 6]].flatMap(([lv, n]) => draw('matrices', n, q => matrixLevel(q) === lv).map(q => ({ ...q, level: lv }))) }),
  },
};

/* ---------- Accueil ---------- */
function renderHome() {
  clearTimeout(memoTimer);
  if (typeof melodyStop === 'function' && melodyStop) melodyStop();
  const best = loadBest();
  const cards = Object.entries(TESTS).map(([key, t]) => `
    <article class="test-card" style="--accent:${t.color}">
      <div class="test-icon">${t.icon}</div>
      <h2>${t.title}</h2>
      <p>${t.desc}</p>
      <div class="test-meta">
        <span>${QUIZ_SIZE} questions</span><span>Banque de ${t.questions.length}</span><span>Sans chrono</span>
      </div>
      ${best[key] !== undefined ? `<div class="best">Meilleur score : <strong>${best[key]}/${QUIZ_SIZE}</strong></div>` : '<div class="best muted">Pas encore tenté</div>'}
      <button class="btn primary" data-start="${key}">Commencer</button>
    </article>`).join('');

  const specials = Object.entries(SPECIAL).map(([key, s]) => `
    <article class="full-card" style="--accent:${s.color}">
      <div class="test-icon">${s.icon}</div>
      <div class="full-body">
        <h2>${s.title}</h2>
        <p>${s.desc}</p>
        <div class="test-meta"><span>${s.size()} questions</span>${key === 'complet' ? `<span>${Object.keys(TESTS).length} catégories</span>` : ''}<span>Sans chrono</span></div>
      </div>
      <div class="full-side">
        ${best[`${key}:${s.size()}`] !== undefined ? `<div class="best">Meilleur score : <strong>${best[`${key}:${s.size()}`]}/${s.size()}</strong></div>` : '<div class="best muted">Pas encore tenté</div>'}
        <button class="btn primary" data-start="${key}">Commencer</button>
      </div>
    </article>`).join('');
  app.innerHTML = `
    <section class="hero">
      <h1>Teste ton intelligence</h1>
      <p>À chaque partie, 10 questions tirées au hasard dans une banque de près de 7 000 questions, à ton rythme. À la fin, tu obtiens ton score et la correction détaillée de chaque question.</p>
    </section>
    <h2 class="section-title">Tests complets</h2>
    ${specials}
    <h2 class="section-title">Tests par catégorie</h2>
    <section class="cards">${cards}</section>`;

  app.querySelectorAll('[data-start]').forEach(b => b.onclick = () => startTest(b.dataset.start));
  window.scrollTo(0, 0);
}

/* ---------- Quiz ---------- */
function startTest(key) {
  const test = SPECIAL[key] ? SPECIAL[key].build() : { ...TESTS[key], questions: draw(key, QUIZ_SIZE) };
  state = {
    key, test,
    index: 0,
    answers: Array(test.questions.length).fill(null),
    perms: test.questions.map(q => (q.keepOrder ? q.options.map((_, i) => i) : shuffle(q.options.map((_, i) => i)))),
    memoSeen: test.questions.map(() => false),
    paths: test.questions.map(() => [0]), // chemins tracés dans les labyrinthes
    heard: test.questions.map(() => false), // mélodies déjà écoutées (une seule écoute)
  };
  renderQuestion();
}

function renderQuestion() {
  clearTimeout(memoTimer);
  const { test, index, answers, perms } = state;
  const q = test.questions[index];
  const total = test.questions.length;
  const last = index === total - 1;

  let body = '';
  const cat = test.mixed ? TESTS[q.cat] : null;
  const catTag = cat ? `<span class="cat-tag" style="--accent:${cat.color}">${cat.icon} ${cat.title}</span>` : '';
  const needsMemo = q.memo && !state.memoSeen[index];
  const needsListen = q.melody && !state.heard[index];
  if (needsListen) {
    body = `
      <p class="q-text">${q.q}</p>
      <div class="listen-stage">
        <div class="versions">${[1, 2, 3].map(v => `<span class="ver" id="ver-${v - 1}">Version ${v}</span>`).join('')}</div>
        <button class="btn primary" id="listen">▶ Écouter (une seule écoute)</button>
        <p class="listen-tip">Monte le son. Les réponses s’affichent à la fin de l’écoute.</p>
      </div>`;
  } else if (needsMemo) {
    body = `
      <p class="q-text">Mémorise ce qui va s'afficher pendant <strong>${q.time} secondes</strong>.</p>
      <div class="memo-stage" id="memo-stage">
        <button class="btn primary" id="show-memo">Je suis prêt·e</button>
      </div>`;
  } else if (q.trace) {
    const p = state.paths[index], H = q.maze.rows.length;
    body = `
      <p class="q-text">${q.q}</p>
      <div class="trace-box" id="trace">${traceSVG(q.maze, { user: p, interactive: true })}</div>
      <div class="trace-dirs">
        <button class="btn primary" data-dir="0" ${p.length === H ? 'disabled' : ''}>↖ Gauche</button>
        <button class="btn primary" data-dir="1" ${p.length === H ? 'disabled' : ''}>Droite ↗</button>
      </div>
      <div class="trace-bar">
        <span>Points dorés : <strong>${traceGold(q.maze, p)}</strong> · Rang ${p.length} / ${H}${p.length === H ? ' · <strong>Arrivé en haut !</strong>' : ''}</span>
        <span class="trace-btns">
          <button class="btn ghost" id="trace-undo" ${p.length < 2 ? 'disabled' : ''}>Annuler</button>
          <button class="btn ghost" id="trace-reset" ${p.length < 2 ? 'disabled' : ''}>Recommencer</button>
        </span>
      </div>`;
  } else {
    const opts = perms[index].map(orig => `
      <button class="option${answers[index] === orig ? ' selected' : ''}" data-opt="${orig}">
        ${optionHTML(q, orig)}
      </button>`).join('');
    body = `
      <p class="q-text">${q.q}</p>
      ${q.big ? `<div class="big-seq">${q.big}</div>` : ''}
      ${q.grid ? gridHTML(q.grid) : ''}
      ${figureHTML(q, false)}
      <div class="options${isVisual(q) ? ' visual' : ''}${q.cube || q.analogy ? ' four' : ''}">${opts}</div>`;
  }
  body = catTag + body;

  // Pas de retour en arrière dans le test de mémoire (la séquence ne peut pas être revue)
  const canGoBack = index > 0 && !test.memory;
  const showNav = !needsMemo && !needsListen;

  app.innerHTML = `
    <section class="quiz" style="--accent:${test.color}">
      <div class="quiz-top">
        <button class="link" id="quit">← Accueil</button>
        <span class="quiz-title">${test.icon} ${test.title}</span>
        <span class="counter">${index + 1} / ${total}</span>
      </div>
      <div class="progress"><div style="width:${(index / total) * 100}%"></div></div>
      <div class="q-card">${body}</div>
      ${showNav ? `<div class="quiz-nav">
        ${canGoBack ? '<button class="btn ghost" id="prev">Précédent</button>' : '<span></span>'}
        <button class="btn primary" id="next" ${answers[index] === null ? 'disabled' : ''}>${last ? 'Voir mes résultats' : 'Suivant'}</button>
      </div>` : ''}
    </section>`;

  document.getElementById('quit').onclick = () => {
    if (answers.every(a => a === null) || confirm('Quitter le test ? Tes réponses seront perdues.')) renderHome();
  };

  const showMemo = document.getElementById('show-memo');
  if (showMemo) showMemo.onclick = () => playMemo(q);

  const listen = document.getElementById('listen');
  if (listen) listen.onclick = () => {
    listen.disabled = true; listen.textContent = 'Écoute en cours…';
    playMelodies(q.melody,
      v => document.querySelectorAll('.ver').forEach((el, i) => el.classList.toggle('playing', i === v)),
      () => { state.heard[index] = true; if (state.index === index && document.getElementById('listen')) renderQuestion(); });
  };

  app.querySelectorAll('[data-opt]').forEach(btn => btn.onclick = () => {
    state.answers[index] = Number(btn.dataset.opt);
    app.querySelectorAll('[data-opt]').forEach(b => b.classList.toggle('selected', b === btn));
    document.getElementById('next').disabled = false;
  });

  // Labyrinthe à tracer : on clique sur l'un des deux points accessibles au-dessus
  if (q.trace) {
    const p = state.paths[index], H = q.maze.rows.length;
    const update = () => {
      state.answers[index] = p.length === H ? (traceGold(q.maze, p) === q.maxGold ? 0 : 1) : null;
      renderQuestion();
    };
    document.getElementById('trace').onclick = e => {
      const d = e.target.closest('[data-k]');
      if (!d) return;
      const k = +d.dataset.k, i = +d.dataset.i, lastI = p[p.length - 1];
      if (k === p.length && (i === lastI || i === lastI + 1)) { p.push(i); update(); }
    };
    // Sur téléphone, les points sont petits : deux gros boutons font avancer d'un cran
    document.querySelectorAll('[data-dir]').forEach(b => b.onclick = () => { if (p.length < H) { p.push(p[p.length - 1] + +b.dataset.dir); update(); } });
    document.getElementById('trace-undo').onclick = () => { if (p.length > 1) { p.pop(); update(); } };
    document.getElementById('trace-reset').onclick = () => { p.length = 1; update(); };
  }

  const prev = document.getElementById('prev');
  if (prev) prev.onclick = () => { state.index--; renderQuestion(); };
  const next = document.getElementById('next');
  if (next) next.onclick = () => {
    if (last) renderResults();
    else { state.index++; renderQuestion(); }
  };
}

function playMemo(q) {
  const stage = document.getElementById('memo-stage');
  stage.innerHTML = `
    <div class="memo-content">${q.memo}</div>
    <div class="memo-bar"><div style="animation-duration:${q.time}s"></div></div>`;
  memoTimer = setTimeout(() => {
    state.memoSeen[state.index] = true;
    renderQuestion();
  }, q.time * 1000);
}

/* ---------- Résultats ---------- */
function renderResults() {
  const { key, test, answers } = state;
  const total = test.questions.length;
  const score = test.questions.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0);
  // Pour les tests complets, le record dépend de la longueur du test (qui change si on ajoute des catégories)
  const record = saveBest(SPECIAL[key] ? `${key}:${total}` : key, score);
  const pct = Math.round((score / total) * 100);

  const verdict =
    pct >= 90 ? ['Excellent !', 'Un sans-faute ou presque, bravo.'] :
    pct >= 70 ? ['Très bien !', 'Tu maîtrises ce type de raisonnement.'] :
    pct >= 50 ? ['Pas mal !', 'Une bonne base, la correction t’aidera à progresser.'] :
                ['À travailler', 'Lis bien la correction : ces exercices se travaillent.'];

  // Détail par catégorie (test complet uniquement)
  let breakdown = '';
  if (test.byLevel) {
    const rows = MATRIX_LEVELS.map((name, k) => {
      const qs = test.questions.map((q, i) => ({ q, i })).filter(x => x.q.level === k + 1);
      const good = qs.filter(x => answers[x.i] === x.q.answer).length;
      return `
        <div class="bd-row" style="--accent:${test.color}">
          <span class="bd-name">Niveau ${k + 1} · ${name}</span>
          <div class="bd-bar"><div style="width:${(good / qs.length) * 100}%"></div></div>
          <span class="bd-score">${good}/${qs.length}</span>
        </div>`;
    }).join('');
    breakdown = `<div class="breakdown"><h2>Score par niveau</h2>${rows}</div>`;
  }
  if (test.mixed) {
    const rows = Object.entries(TESTS).filter(([cat]) => test.questions.some(q => q.cat === cat)).map(([cat, t]) => {
      const qs = test.questions.map((q, i) => ({ q, i })).filter(x => x.q.cat === cat);
      const good = qs.filter(x => answers[x.i] === x.q.answer).length;
      return `
        <div class="bd-row" style="--accent:${t.color}">
          <span class="bd-name">${t.icon} ${t.title}</span>
          <div class="bd-bar"><div style="width:${(good / qs.length) * 100}%"></div></div>
          <span class="bd-score">${good}/${qs.length}</span>
        </div>`;
    }).join('');
    breakdown = `<div class="breakdown"><h2>Score par catégorie</h2>${rows}</div>`;
  }

  const items = test.questions.map((q, i) => {
    const ok = answers[i] === q.answer;
    return `
      <li class="corr ${ok ? 'ok' : 'ko'}">
        <div class="corr-head">
          <span class="badge">${ok ? '✓' : '✗'}</span>
          <span class="corr-num">Question ${i + 1}</span>
          ${q.cat ? `<span class="cat-tag" style="--accent:${TESTS[q.cat].color}">${TESTS[q.cat].icon} ${TESTS[q.cat].title}</span>` : ''}
        </div>
        ${q.memo ? `<div class="corr-memo">À mémoriser : <strong>${q.memo}</strong></div>` : ''}
        <p class="corr-q">${q.q}</p>
        ${q.big ? `<div class="big-seq small">${q.big}</div>` : ''}
        ${q.grid ? gridHTML(q.grid, true) : ''}
        ${q.trace ? `<div class="figure"><div class="trace-box small">${traceSVG(q.maze, { user: state.paths[i], best: true })}</div></div>
          <p class="trace-note">Ton chemin (en bleu) : <strong>${traceGold(q.maze, state.paths[i])}</strong> point(s) doré(s) · maximum possible : <strong>${q.maxGold}</strong></p>` : figureHTML(q, true)}
        <div class="corr-answers${isVisual(q) ? ' visual' : ''}">
          <div><span class="lbl">Ta réponse</span><div class="ans ${ok ? 'good' : 'bad'}">${optionHTML(q, answers[i])}</div></div>
          ${ok ? '' : `<div><span class="lbl">Bonne réponse</span><div class="ans good">${optionHTML(q, q.answer)}</div></div>`}
        </div>
        ${q.melody ? `<button class="btn ghost replay" data-replay="${i}">▶ Réécouter les 3 versions</button>` : ''}
        <div class="explain-row">
          <p class="explain">💡 ${q.explain}</p>
          ${typeof kidExplain === 'function' ? `<button class="dev-btn" data-dev="${i}" aria-expanded="false" aria-controls="kid-${i}">🧸 Développe</button>` : ''}
        </div>
        <div class="kid-box" id="kid-${i}" hidden></div>
      </li>`;
  }).join('');

  app.innerHTML = `
    <section class="results" style="--accent:${test.color}">
      <div class="score-card">
        <div class="score-ring" style="--pct:${pct}">
          <div><strong>${score}</strong><span>/ ${total}</span></div>
        </div>
        <div class="score-text">
          <p class="eyebrow">${test.icon} ${test.title}</p>
          <h1>${verdict[0]}</h1>
          <p>${verdict[1]}</p>
          ${record ? '<p class="record">🏆 Nouveau meilleur score !</p>' : ''}
          <div class="actions">
            <button class="btn primary" id="retry">Recommencer</button>
            <button class="btn ghost" id="home">Autres tests</button>
          </div>
        </div>
      </div>
      ${breakdown}
      <h2 class="corr-title">Correction</h2>
      <ol class="corr-list">${items}</ol>
    </section>`;

  app.querySelectorAll('[data-replay]').forEach(b => b.onclick = () => {
    const btn = b; btn.disabled = true;
    playMelodies(test.questions[+b.dataset.replay].melody, null, () => { btn.disabled = false; });
  });
  // « Développe » : la même correction expliquée très simplement (js/simple.js)
  app.querySelectorAll('[data-dev]').forEach(b => b.onclick = () => {
    const i = +b.dataset.dev, box = document.getElementById(`kid-${i}`), q = test.questions[i];
    if (!box.innerHTML) box.innerHTML = `<p class="kid-title">Expliqué tout simplement</p>${kidExplain(q, q.cat || key)}`;
    box.hidden = !box.hidden;
    b.setAttribute('aria-expanded', String(!box.hidden));
    b.innerHTML = box.hidden ? '🧸 Développe' : '🧸 Replier';
  });
  document.getElementById('retry').onclick = () => startTest(key);
  document.getElementById('home').onclick = renderHome;
  window.scrollTo(0, 0);
}

document.getElementById('logo').onclick = e => { e.preventDefault(); renderHome(); };
renderHome();
