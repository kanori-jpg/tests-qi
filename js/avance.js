// 4 catégories de questions originales, dans l'esprit de types d'exercices de recherche :
// analogies de figures, déduction (si… alors), suites avancées, labyrinthes de points.
// Toutes les réponses sont calculées par le programme.

/* ------------------------- Dessins partagés ------------------------- */
function analogyHTML(a) {
  const cell = x => `<div class="m-cell">${x ? cellSVG(x) : '?'}</div>`;
  return `<div class="analogy">
    <div class="an-pair">${cell(a[0])}<span class="an-arrow">→</span>${cell(a[1])}</div>
    <span class="an-sep">comme</span>
    <div class="an-pair">${cell(a[2])}<span class="an-arrow">→</span><div class="m-cell missing">?</div></div>
  </div>`;
}

function mazeSVG(m, showPath) {
  const dx = 22, dy = 22, H = m.rows.length, W = (H - 1) * dx + 30, Ht = (H - 1) * dy + 30;
  const X = (k, i) => W / 2 + (i - k / 2) * dx, Y = k => Ht - 15 - k * dy;
  let lines = '', dots = '', path = '';
  for (let k = 0; k < H - 1; k++) for (let i = 0; i <= k; i++) for (const j of [i, i + 1]) {
    lines += `<line x1="${X(k, i)}" y1="${Y(k)}" x2="${X(k + 1, j)}" y2="${Y(k + 1)}" stroke="#d3d8e5" stroke-width="2"/>`;
  }
  if (showPath) {
    path = `<polyline points="${m.path.map((i, k) => `${X(k, i)},${Y(k)}`).join(' ')}" fill="none" stroke="#e0524d" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  }
  m.rows.forEach((row, k) => row.forEach((g, i) => {
    if (k === 0) dots += `<circle cx="${X(0, 0)}" cy="${Y(0)}" r="6" fill="#1f9d6b"/>`;
    else if (g) dots += `<circle cx="${X(k, i)}" cy="${Y(k)}" r="6" fill="#f2b705" stroke="#a87b00" stroke-width="1.5"/>`;
    else dots += `<circle cx="${X(k, i)}" cy="${Y(k)}" r="3.5" fill="#9aa3b8"/>`;
  }));
  return `<svg viewBox="0 0 ${W} ${Ht}" class="maze-svg" aria-hidden="true">${lines}${path}${dots}</svg>`;
}

// Labyrinthe à tracer (format A-PMT) : o.user = chemin de l'utilisateur, o.best = afficher le meilleur chemin,
// o.interactive = rendre cliquables les deux points accessibles au-dessus du dernier point
function traceSVG(m, o = {}) {
  const dx = 26, dy = 24, H = m.rows.length, W = (H - 1) * dx + 40, Ht = (H - 1) * dy + 40;
  const X = (k, i) => W / 2 + (i - k / 2) * dx, Y = k => Ht - 20 - k * dy;
  const user = o.user || [0], onUser = new Set(user.map((i, k) => k + ',' + i));
  let s = '';
  for (let k = 0; k < H - 1; k++) for (let i = 0; i <= k; i++) for (const j of [i, i + 1]) {
    s += `<line x1="${X(k, i)}" y1="${Y(k)}" x2="${X(k + 1, j)}" y2="${Y(k + 1)}" stroke="#d3d8e5" stroke-width="2"/>`;
  }
  const line = (p, attrs) => `<polyline points="${p.map((i, k) => `${X(k, i)},${Y(k)}`).join(' ')}" fill="none" stroke-linejoin="round" stroke-linecap="round" ${attrs}/>`;
  if (o.best) s += line(m.path, 'stroke="#e0524d" stroke-width="7" opacity=".35"');
  if (user.length > 1) s += line(user, 'stroke="#3f5bd9" stroke-width="3.5"');
  m.rows.forEach((row, k) => row.forEach((g, i) => {
    const ring = onUser.has(k + ',' + i) && k > 0 ? ' stroke="#3f5bd9" stroke-width="2.5"' : '';
    if (k === 0) s += `<circle cx="${X(0, 0)}" cy="${Y(0)}" r="7" fill="#1f9d6b"/>`;
    else if (g) s += `<circle cx="${X(k, i)}" cy="${Y(k)}" r="6.5" fill="#f2b705"${ring || ' stroke="#a87b00" stroke-width="1.2"'}/>`;
    else s += `<circle cx="${X(k, i)}" cy="${Y(k)}" r="${ring ? 5 : 4}" fill="${ring ? '#fff' : '#9aa3b8'}"${ring}/>`;
  }));
  if (o.interactive && user.length < H) {
    const k = user.length, last = user[k - 1];
    for (const i of [last, last + 1]) {
      s += `<circle class="hit" data-k="${k}" data-i="${i}" cx="${X(k, i)}" cy="${Y(k)}" r="12" fill="rgba(63,91,217,.15)" stroke="#3f5bd9" stroke-width="1.5" stroke-dasharray="3 2"/>`;
    }
  }
  return `<svg viewBox="0 0 ${W} ${Ht}" class="trace-svg" aria-label="Labyrinthe de points">${s}</svg>`;
}
const traceGold = (m, user) => user.reduce((s, i, k) => s + (k > 0 && m.rows[k][i] ? 1 : 0), 0);

// Pentagone en 10 cases (5 secteurs extérieurs + 5 secteurs centraux), couleurs façon Max Bill
const PENTA_COLORS = ['#ffffff', '#f2c230', '#d9412b', '#2f5fb3'];
const PENTA_NAMES = ['blanc', 'jaune', 'rouge', 'bleu'];
function pentaSVG(cells) {
  const P = (r, i) => { const a = (-90 + 72 * i) * Math.PI / 180; return [50 + r * Math.cos(a), 52 + r * Math.sin(a)]; };
  const pt = ([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`;
  let s = '';
  for (let i = 0; i < 5; i++) {
    const o1 = P(44, i), o2 = P(44, i + 1), n1 = P(22, i), n2 = P(22, i + 1);
    s += `<polygon points="${[o1, o2, n2, n1].map(pt).join(' ')}" fill="${PENTA_COLORS[cells[i]]}"/>`;
    s += `<polygon points="${['50,52', pt(n1), pt(n2)].join(' ')}" fill="${PENTA_COLORS[cells[5 + i]]}"/>`;
  }
  // traits par-dessus
  for (let i = 0; i < 5; i++) s += `<line x1="50" y1="52" x2="${P(44, i)[0].toFixed(1)}" y2="${P(44, i)[1].toFixed(1)}" stroke="#2f3a56" stroke-width="1.5"/>`;
  s += `<polygon points="${[0, 1, 2, 3, 4].map(i => pt(P(22, i))).join(' ')}" fill="none" stroke="#2f3a56" stroke-width="1.5"/>`;
  s += `<polygon points="${[0, 1, 2, 3, 4].map(i => pt(P(44, i))).join(' ')}" fill="none" stroke="#2f3a56" stroke-width="2.2" stroke-linejoin="round"/>`;
  return `<svg viewBox="0 0 100 100" class="cell-svg" aria-hidden="true">${s}</svg>`;
}
function pentaAnalogyHTML(a) {
  const cell = x => `<div class="m-cell">${pentaSVG(x)}</div>`;
  return `<div class="analogy">
    <div class="an-pair">${cell(a[0])}<span class="an-arrow">→</span>${cell(a[1])}</div>
    <span class="an-sep">comme</span>
    <div class="an-pair">${cell(a[2])}<span class="an-arrow">→</span><div class="m-cell missing">?</div></div>
  </div>`;
}

// Grille 2 × 2 dont la case en bas à droite manque (format des analogies de figures de Blum et al.)
function grid2HTML(cells, small = false) {
  return `<div class="matrix two${small ? ' small' : ''}">${cells.map(c => `<div class="m-cell">${cellSVG(c)}</div>`).join('')}<div class="m-cell missing">?</div></div>`;
}

/* ------------------------- Génération ------------------------- */
(function () {
  const TARGET = 200;
  let seed = 9090;
  const R = () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const ri = (a, b) => a + Math.floor(R() * (b - a + 1));
  const pick = a => a[Math.floor(R() * a.length)];
  const mix = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const sample = (a, n) => mix(a).slice(0, n);
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const cap = s => s[0].toUpperCase() + s.slice(1);

  function numOpts(ans, cands) {
    const w = [];
    for (const x of mix(cands)) { if (x !== ans && Number.isInteger(x) && x >= 0 && !w.includes(x)) w.push(x); if (w.length === 3) break; }
    for (let k = 1; w.length < 3; k++) for (const x of [ans + k, ans - k]) if (x >= 0 && !w.includes(x) && w.length < 3) w.push(x);
    return { options: [ans, ...w].map(String), answer: 0 };
  }

  function build(makers, keyOf, n = TARGET) {
    const qs = [], seen = new Set();
    for (let g = 0; qs.length < n && g < 50000; g++) {
      const q = makers[g % makers.length]();
      if (!q) continue;
      const k = keyOf(q);
      if (seen.has(k) || new Set(q.options.map(o => JSON.stringify(o))).size !== q.options.length) continue;
      seen.add(k);
      qs.push(q);
    }
    return qs;
  }

  /* ============ 1. Analogies de figures ============ */
  const SHAPES = ['circle', 'square', 'triangle', 'diamond', 'star'];
  const FILLS = ['full', 'striped', 'empty'];
  const SHN = { circle: ['cercle', 0], square: ['carré', 0], triangle: ['triangle', 0], diamond: ['losange', 0], star: ['étoile', 1], arrow: ['flèche', 1] };
  const FA = { full: ['plein', 'pleine'], striped: ['rayé', 'rayée'], empty: ['vide', 'vide'] };
  const ZN = { s: 'petite', m: 'moyenne', l: 'grande' };
  const DIR = { 0: 'vers le haut', 45: 'vers le haut à droite', 90: 'vers la droite', 135: 'vers le bas à droite', 180: 'vers le bas', 225: 'vers le bas à gauche', 270: 'vers la gauche', 315: 'vers le haut à gauche' };
  const norm = a => ((a % 360) + 360) % 360;
  const tidy = x => ({ ...x, z: x.n > 1 ? 'm' : x.z, r: x.s === 'arrow' ? norm(x.r) : 0, f: x.s === 'arrow' ? 'full' : x.f });
  function desc(x) {
    if (x.s === 'arrow') return `${x.n === 1 ? 'une flèche' : x.n + ' flèches'} ${DIR[norm(x.r)]}`;
    const [name, fem] = SHN[x.s], adj = FA[x.f][fem];
    if (x.n === 1) {
      const size = x.z === 's' ? (fem ? 'petite ' : 'petit ') : x.z === 'l' ? (fem ? 'grande ' : 'grand ') : '';
      return `${fem ? 'une' : 'un'} ${size}${name} ${adj}`;
    }
    return `${x.n} ${name}s ${adj}s`;
  }

  // Règles de transformation : chacune fixe la valeur de départ (A et C) et la valeur d'arrivée (B et la réponse)
  const RULES = {
    fill: () => {
      const [f1, f2] = sample(FILLS, 2);
      return { from: x => ({ ...x, f: f1 }), to: x => ({ ...x, f: f2 }), undo: x => ({ ...x, f: f1 }), alt: x => ({ ...x, f: FILLS.find(f => f !== f1 && f !== f2) }),
        txt: `le remplissage passe de « ${FA[f1][0]} » à « ${FA[f2][0]} »`, arrows: false, single: false };
    },
    count: () => {
      let a, k;
      do { a = ri(1, 5); k = pick([-2, -1, 1, 2, 3]); } while (a + k < 1 || a + k > 6 || (a + k) % a === 0 || a % (a + k) === 0);
      return { k, a, txt: `le nombre de formes ${k > 0 ? 'augmente' : 'diminue'} de ${Math.abs(k)}`, count: true, arrows: true, single: false };
    },
    size: () => {
      const [z1, z2] = sample(['s', 'm', 'l'], 2);
      return { from: x => ({ ...x, z: z1 }), to: x => ({ ...x, z: z2 }), undo: x => ({ ...x, z: z1 }), alt: x => ({ ...x, z: ['s', 'm', 'l'].find(z => z !== z1 && z !== z2) }),
        txt: `la forme passe de ${ZN[z1]} à ${ZN[z2]}`, arrows: false, single: true };
    },
    rot: () => {
      const d = pick([45, 90, 135, 180, -45, -90]);
      return { d, txt: d === 180 ? 'la flèche fait un demi-tour' : `la flèche tourne de ${Math.abs(d)}° ${d > 0 ? 'dans le sens des aiguilles d’une montre' : 'dans le sens inverse des aiguilles d’une montre'}`, rot: true, arrows: true, single: false };
    },
  };
  const COMBOS = [['fill'], ['count'], ['size'], ['rot'], ['fill', 'count'], ['fill', 'size'], ['rot', 'count']];

  function figAnalogy() {
    const combo = pick(COMBOS), rules = combo.map(n => RULES[n]());
    const arrows = combo.includes('rot');
    const single = combo.includes('size');
    const [sA, sC] = arrows ? ['arrow', 'arrow'] : sample(SHAPES, 2);
    const cnt = rules.find(r => r.count);
    let A = { s: sA, n: single ? 1 : ri(1, 3), f: pick(FILLS), r: 0, z: 'm' };
    let C = { s: sC, n: single ? 1 : ri(1, 3), f: pick(FILLS), r: 0, z: 'm' };
    let B, D;
    if (cnt) {
      A.n = cnt.a;
      let c; do { c = ri(1, 5); } while (c === cnt.a || c + cnt.k < 1 || c + cnt.k > 6);
      C.n = c;
    }
    const rot = rules.find(r => r.rot);
    if (rot) { A.r = pick([0, 45, 90, 180, 270]); do { C.r = pick([0, 45, 90, 135, 180, 225, 270, 315]); } while (C.r === A.r); }
    rules.forEach(r => { if (r.from) { A = r.from(A); C = r.from(C); } });
    const apply = x => {
      let y = { ...x };
      rules.forEach(r => { if (r.to) y = r.to(y); if (r.count) y.n = x.n + r.k; if (r.rot) y.r = norm(x.r + r.d); });
      return y;
    };
    B = apply(A); D = apply(C);
    [A, B, C, D] = [A, B, C, D].map(tidy);
    // Pièges : C inchangé, transformation partielle, mauvaise valeur, forme de A
    const traps = [C, B, { ...D, s: A.s }];
    rules.forEach(r => {
      if (r.undo) traps.push(r.undo(D)), traps.push(r.alt(D));
      if (r.count) traps.push({ ...D, n: C.n * (cnt.a + cnt.k) / cnt.a }, { ...D, n: D.n + 1 }, { ...D, n: D.n - 1 });
      if (r.rot) traps.push({ ...D, r: norm(C.r - r.d) }, { ...D, r: norm(D.r + 90) }, { ...D, r: norm(D.r + 180) });
    });
    const out = [D], ks = new Set([JSON.stringify(D)]);
    for (const t of mix(traps).map(tidy)) {
      const k = JSON.stringify(t);
      if (out.length < 4 && Number.isInteger(t.n) && t.n >= 1 && t.n <= 6 && !ks.has(k)) { ks.add(k); out.push(t); }
    }
    if (out.length < 4) return null;
    const c = (s, n, f, r, z) => ({ s, n, f, r, z });
    return { q: 'La 1re case se transforme en la 2e. Quelle case obtient-on en appliquant la même transformation à la 3e ?',
      analogy: [A, B, C].map(x => c(x.s, x.n, x.f, x.r, x.z)), options: out.map(x => c(x.s, x.n, x.f, x.r, x.z)), answer: 0,
      explain: `De la 1re à la 2e case, ${rules.map(r => r.txt).join(', et ')}. On fait pareil avec ${desc(C)} : on obtient ${desc(D)}.` };
  }

  /* ============ 2. Déduction (si… alors) ============ */
  const PROPS = [
    ['il pleut', 'il ne pleut pas'], ['la route est mouillée', 'la route n’est pas mouillée'], ['Léa vient à la fête', 'Léa ne vient pas à la fête'],
    ['Tom vient à la fête', 'Tom ne vient pas à la fête'], ['le magasin est ouvert', 'le magasin est fermé'], ['la lampe est allumée', 'la lampe est éteinte'],
    ['le train est en retard', 'le train n’est pas en retard'], ['Sam a révisé', 'Sam n’a pas révisé'], ['Sam réussit l’examen', 'Sam ne réussit pas l’examen'],
    ['le chat est dehors', 'le chat n’est pas dehors'], ['il fait beau', 'il ne fait pas beau'], ['nous allons à la plage', 'nous n’allons pas à la plage'],
    ['le téléphone est chargé', 'le téléphone n’est pas chargé'], ['Nina appelle', 'Nina n’appelle pas'], ['la porte est verrouillée', 'la porte n’est pas verrouillée'],
    ['le gâteau est cuit', 'le gâteau n’est pas cuit'], ['l’alarme sonne', 'l’alarme ne sonne pas'], ['Paul prend le bus', 'Paul ne prend pas le bus'],
    ['Paul arrive à l’heure', 'Paul n’arrive pas à l’heure'], ['le jardin est arrosé', 'le jardin n’est pas arrosé'], ['les fleurs poussent', 'les fleurs ne poussent pas'],
    ['le match est annulé', 'le match n’est pas annulé'], ['le chien aboie', 'le chien n’aboie pas'], ['la fenêtre est ouverte', 'la fenêtre est fermée'],
  ];
  const fix = s => s.replace(/\bSi il/g, 'S’il').replace(/\bsi il/g, 's’il');
  const S = s => fix(cap(s) + '.');
  const si = (p, q) => fix(`Si ${p}, alors ${q}.`);
  const unk = p => `On ne peut pas savoir si ${p}`.replace(/si il/g, 's’il');
  // Une « proposition » : [vrai, faux] (parfois inversée pour varier)
  const prop = () => { const p = pick(PROPS); return R() < 0.3 ? [p[1], p[0]] : p; };
  const props = n => { const ps = sample(PROPS, n); return ps.map(p => (R() < 0.3 ? [p[1], p[0]] : p)); };
  const ASK = 'Que peut-on en conclure avec certitude ?';
  const ded = (prem, ok, wrongs, explain) => ({ q: `${prem} ${ASK}`, options: [cap(ok), ...wrongs.map(cap)], answer: 0, explain });

  const deduction = [
    () => { const [[p, np], [q, nq]] = props(2); return ded(`${si(p, q)} ${S(p)}`, q, [nq, np, unk(p)], `La règle s’applique directement : « ${cap(p)} », donc « ${q} ».`); },
    () => { const [[p, np], [q, nq]] = props(2); return ded(`${si(p, q)} ${S(nq)}`, np, [p, q, unk(p)], `D’après la règle, « ${cap(p)} » entraîne « ${q} ». Or c’est faux : c’est donc ${fix('que ' + np).replace(/^que il/, 'qu’il')}.`); },
    () => { const [[p, np], [q, nq]] = props(2); return ded(`${si(p, q)} ${S(q)}`, unk(p), [p, np, nq], `C’est le piège classique : « ${cap(q)} » peut avoir une autre cause. La règle dit seulement ce qui se passe dans le cas « ${p} ».`); },
    () => { const [[p, np], [q, nq]] = props(2); return ded(`${si(p, q)} ${S(np)}`, unk(q), [nq, q, p], `La règle ne dit rien du cas « ${np} » : « ${q} » reste possible, ou pas.`); },
    () => { const [[p, np], [q, nq]] = props(2); return ded(`${cap(p)} ou ${q} (au moins l’un des deux). ${S(np)}`, q, [nq, p, unk(q)], `Au moins l’une des deux choses est vraie. Comme la première est fausse, la seconde est forcément vraie.`); },
    () => { const [[p, np], [q, nq], [r, nr]] = props(3); return ded(`${si(p, q)} ${si(q, r)} ${S(p)}`, r, [nr, nq, unk(r)], `On enchaîne les deux règles : « ${cap(p)} », donc « ${q} », donc « ${r} ».`); },
    () => { const [[p, np], [q, nq], [r, nr]] = props(3); return ded(`${si(p, q)} ${si(q, r)} ${S(nr)}`, np, [p, q, unk(p)], `D’après les règles, « ${cap(p)} » entraîne « ${q} », qui entraîne « ${r} ». Or c’est faux : c’est donc ${('que ' + np).replace(/^que il/, 'qu’il')}.`); },
    () => { const [[p, np], [q, nq]] = props(2); return ded(`${cap(p)} seulement si ${q}. ${S(p)}`.replace(/seulement si il/g, 'seulement s’il'), q, [nq, np, unk(q)], `« A seulement si B » veut dire : si A, alors forcément B.`); },
    () => { const [[p, np], [q, nq]] = props(2); return ded(`${cap(p)} seulement si ${q}. ${S(q)}`.replace(/seulement si il/g, 'seulement s’il'), unk(p), [p, np, nq], `« A seulement si B » veut dire : si A, alors B. Savoir que B est vrai ne suffit pas pour savoir si A l’est.`); },
    () => { const [[p, np], [q, nq]] = props(2); return ded(`Ces deux phrases ne peuvent pas être vraies en même temps : « ${cap(p)} » et « ${cap(q)} ». ${S(p)}`, nq, [q, np, unk(q)], `Les deux ne peuvent pas être vraies ensemble. Comme la première est vraie, la seconde est fausse.`); },
    () => { const [[p, np], [q, nq]] = props(2); return ded(`Soit ${p}, soit ${q}, mais pas les deux. ${S(np)}`.replace(/Soit il/g, 'Soit il'), q, [nq, p, unk(q)], `Exactement une des deux choses est vraie. Comme la première est fausse, c’est la seconde.`); },
    () => { // contraposée
      const [[p, np], [q, nq]] = props(2);
      return { q: fix(`Quelle phrase veut dire exactement la même chose que : « Si ${p}, alors ${q} » ?`),
        options: [fix(`Si ${nq}, alors ${np}`), fix(`Si ${q}, alors ${p}`), fix(`Si ${np}, alors ${nq}`), fix(`Si ${p}, alors ${nq}`)], answer: 0,
        explain: 'C’est la « contraposée » : « si A alors B » revient exactement à « si non B alors non A ». Les autres phrases changent le sens.' };
    },
  ];

  /* ============ 3. Suites avancées ============ */
  const QS = 'Quel nombre complète la suite ?';
  const seq = t => t.join(' · ') + ' · ?';
  const PR = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41];
  const suites = [
    () => { // écarts géométriques
      const a = ri(1, 15), d = ri(1, 3), k = pick([2, 3]);
      const t = [a]; for (let i = 0; i < 5; i++) t.push(t[i] + d * k ** i);
      const ans = t[5] + d * k ** 5;
      return { q: QS, big: seq(t), ...numOpts(ans, [t[5] * 2, ans - d, t[5] + d * k ** 4 * 2, ans + k]),
        explain: `Les écarts sont multipliés par ${k} à chaque fois : ${range(0, 4).map(i => '+' + d * k ** i).join(', ')}, puis +${d * k ** 5}. Donc ${t[5]} + ${d * k ** 5} = ${ans}.` };
    },
    () => { // n × (n + 1)
      const n0 = ri(1, 8), t = range(n0, n0 + 4).map(n => n * (n + 1)), n = n0 + 5, ans = n * (n + 1);
      return { q: QS, big: seq(t), ...numOpts(ans, [n * n, ans - 2, t[4] + (t[4] - t[3]), ans + n]),
        explain: `Chaque nombre est le produit de deux entiers qui se suivent : ${n0} × ${n0 + 1}, ${n0 + 1} × ${n0 + 2}… Le suivant est ${n} × ${n + 1} = ${ans}.` };
    },
    () => { // nombres triangulaires décalés
      const n0 = ri(1, 6), k = ri(0, 10), T = n => n * (n + 1) / 2;
      const t = range(n0, n0 + 4).map(n => T(n) + k), ans = T(n0 + 5) + k;
      return { q: QS, big: seq(t), ...numOpts(ans, [ans - 1, ans + 1, t[4] + (t[4] - t[3]), ans + 2]),
        explain: `Les écarts augmentent de 1 à chaque fois : +${n0 + 1}, +${n0 + 2}, +${n0 + 3}, +${n0 + 4}, puis +${n0 + 5}. Donc ${t[4]} + ${n0 + 5} = ${ans}.` };
    },
    () => { // x → k·x + c
      const k = pick([2, 3]), c = pick([-2, -1, 1, 2, 3]), a = ri(1, 6);
      const t = [a]; for (let i = 0; i < 4; i++) t.push(t[i] * k + c);
      if (t.some(v => v <= 0)) return null;
      const ans = t[4] * k + c, cs = c > 0 ? `+ ${c}` : `− ${-c}`;
      return { q: QS, big: seq(t), ...numOpts(ans, [t[4] * k, ans + 2 * c, t[4] * (k + 1), ans - 1]),
        explain: `Chaque nombre est le précédent multiplié par ${k}, ${c > 0 ? 'plus' : 'moins'} ${Math.abs(c)} : ${t[4]} × ${k} ${cs} = ${ans}.` };
    },
    () => { // écarts = nombres premiers
      const s = ri(0, 5), a = ri(1, 30), t = [a];
      for (let i = 0; i < 5; i++) t.push(t[i] + PR[s + i]);
      const ans = t[5] + PR[s + 5];
      return { q: QS, big: seq(t), ...numOpts(ans, [t[5] + PR[s + 4] + 2, ans - 2, ans + 2, t[5] + PR[s + 4]]),
        explain: `Les écarts sont les nombres premiers à la suite : ${PR.slice(s, s + 5).map(p => '+' + p).join(', ')}, puis +${PR[s + 5]}. Donc ${t[5]} + ${PR[s + 5]} = ${ans}.` };
    },
    () => { // multiplications croissantes
      const a = ri(1, 4), m0 = ri(1, 2), t = [a];
      for (let i = 0; i < 4; i++) t.push(t[i] * (m0 + i));
      const ans = t[4] * (m0 + 4);
      return { q: QS, big: seq(t), ...numOpts(ans, [t[4] * (m0 + 3), t[4] * (m0 + 5), t[4] + (t[4] - t[3]), ans + t[4]]),
        explain: `On multiplie par ${m0}, puis ${m0 + 1}, ${m0 + 2}, ${m0 + 3}… Le suivant est ${t[4]} × ${m0 + 4} = ${ans}.` };
    },
    () => { // deux suites mêlées : carrés et arithmétique
      const n0 = ri(1, 5), b = ri(2, 20), d = ri(2, 7);
      const t = []; for (let i = 0; i < 4; i++) { t.push((n0 + i) ** 2); if (i < 3) t.push(b + i * d); }
      const ans = b + 3 * d;
      return { q: QS, big: seq(t), ...numOpts(ans, [(n0 + 4) ** 2, ans + d, ans - d, ans + 1]),
        explain: `Deux suites sont mélangées, une case sur deux : les carrés ${range(n0, n0 + 3).map(n => n * n).join(', ')}, et ${b}, ${b + d}, ${b + 2 * d} (+${d}). La suivante appartient à la 2e suite : ${ans}.` };
    },
    () => { // somme des trois précédents
      const a = ri(0, 3), b = ri(1, 3), c = ri(1, 4), t = [a, b, c];
      while (t.length < 7) t.push(t[t.length - 1] + t[t.length - 2] + t[t.length - 3]);
      const ans = t[4] + t[5] + t[6];
      return { q: QS, big: seq(t), ...numOpts(ans, [t[5] + t[6], ans + 1, ans - 1, t[6] * 2]),
        explain: `Chaque nombre est la somme des trois précédents : ${t[4]} + ${t[5]} + ${t[6]} = ${ans}.` };
    },
    () => { // écarts alternés croissants : +1, −2, +3, −4…
      const a = ri(10, 40), s = ri(1, 3), t = [a];
      for (let i = 0; i < 5; i++) t.push(t[i] + (i % 2 ? -(s + i) : s + i));
      const nd = 5 % 2 ? -(s + 5) : s + 5, ans = t[5] + nd;
      return { q: QS, big: seq(t), ...numOpts(ans, [t[5] - nd, t[5] + nd + 1, ans - 1, ans + 2]),
        explain: `Les écarts alternent entre + et −, en grandissant de 1 : ${range(0, 4).map(i => (i % 2 ? '−' : '+') + (s + i)).join(', ')}, puis ${nd < 0 ? '−' : '+'}${Math.abs(nd)}. Donc ${t[5]} ${nd < 0 ? '−' : '+'} ${Math.abs(nd)} = ${ans}.` };
    },
    () => { // puissances moins / plus n
      const b = pick([2, 3]), sg = pick([1, -1]), t = range(1, b === 2 ? 6 : 5).map(n => b ** n + sg * n);
      const n = t.length + 1, ans = b ** n + sg * n;
      return { q: QS, big: seq(t), ...numOpts(ans, [b ** n, ans + 2 * sg, t[t.length - 1] * b, ans - sg]),
        explain: `Chaque terme vaut ${b} puissance n ${sg > 0 ? 'plus' : 'moins'} n (n = 1, 2, 3…). Le suivant est ${b}^${n} ${sg > 0 ? '+' : '−'} ${n} = ${ans}.` };
    },
    () => { // nombres premiers transformés
      const s = ri(0, 4), k = pick([1, 2, 3]), c = ri(-1, 5), f = p => p * k + c;
      const t = PR.slice(s, s + 5).map(f), ans = f(PR[s + 5]);
      const form = k === 1 ? `les nombres premiers${c ? (c > 0 ? ` plus ${c}` : ` moins ${-c}`) : ''}` : `${k} fois les nombres premiers${c ? (c > 0 ? `, plus ${c}` : `, moins ${-c}`) : ''}`;
      return { q: QS, big: seq(t), ...numOpts(ans, [f(PR[s + 5] + 1), ans + k, t[4] + (t[4] - t[3]), ans - k]),
        explain: `Ce sont ${form} : ${PR.slice(s, s + 6).join(', ')}… Le suivant vient de ${PR[s + 5]} : ${ans}.` };
    },
  ];

  /* --- Suites selon les 13 modèles de Loe, Sun, Simonfy & Doebler (2018), Journal of Intelligence 6(2), 20 — licence CC BY --- */
  const LOE = 'Loe, Sun, Simonfy & Doebler (2018), Journal of Intelligence, licence CC BY';
  const Q2 = 'Quels sont les deux nombres suivants ?';
  const seq2 = t => t.join(' · ') + ' · ? · ?';
  const pairStr = (a, b) => `${a} · ${b}`;
  function pairOpts(a, b, cands) {
    const ok = pairStr(a, b), w = [];
    for (const [x, y] of mix(cands)) { const s = pairStr(x, y); if (s !== ok && x >= 0 && y >= 0 && Number.isInteger(x) && Number.isInteger(y) && !w.includes(s)) w.push(s); if (w.length === 3) break; }
    for (let k = 1; w.length < 3; k++) { const s = pairStr(a + k, b + k); if (!w.includes(s)) w.push(s); }
    return { options: [ok, ...w], answer: 0 };
  }
  const src = m => ` (Modèle ${m} de ${LOE}.)`;

  // Les exemples imprimés dans l'article (tableau 2), avec leur réponse
  const LOE_EXAMPLES = [
    [3, [1, 2, 4, 8, 16], [32], 'Chaque nombre est le double du précédent.'],
    [4, [1, 10, 2, 20, 3, 30], [4, 40], 'Deux suites alternent : 1, 2, 3… (+1) et 10, 20, 30… (+10).'],
    [5, [2, 7, 4, 14, 8, 28, 16], [56, 32], 'Deux suites alternent, chacune doublant à chaque fois : 2, 4, 8, 16, 32 et 7, 14, 28, 56.'],
    [6, [2, 4, 7, 11, 16], [22], 'Les écarts augmentent de 1 : +2, +3, +4, +5, puis +6.'],
    [7, [3, 10, 24, 52, 108], [220], 'Pour passer d’un nombre au suivant, on ajoute 2 puis on multiplie par 2 : (108 + 2) × 2 = 220.'],
    [8, [1, 3, 8, 10, 207], [209], 'Les nombres vont par paires dont l’écart est toujours 2 : (1, 3), (8, 10), (207, 209).'],
    [9, [1, 1, 2, 3, 5, 8], [13], 'Chaque nombre est la somme des deux précédents : 5 + 8 = 13.'],
    [10, [2, 15, 4, 17, 7, 19, 11, 21, 16], [23, 22], 'Deux suites alternent : 15, 17, 19, 21, 23 (+2) et 2, 4, 7, 11, 16, 22 (écarts +2, +3, +4, +5, +6).'],
    [11, [1, 7, 14, 20, 40, 46], [92, 98], 'Les nombres vont par paires d’écart 6, et chaque paire commence au double de la fin de la précédente : 46 × 2 = 92, puis 92 + 6 = 98.'],
    [12, [1, 22, 44, 2, 66, 88, 3], [110, 132], 'Le motif se répète : un nombre de la suite 1, 2, 3…, puis deux nombres de la suite 22, 44, 66… (+22).'],
    [13, [1, 5, 8, 3, 209, 212, 5, 41], [44, 7], 'Le motif se répète : un nombre de la suite 1, 3, 5, 7… (+2), puis une paire d’écart 3 : (5, 8), (209, 212), (41, 44).'],
  ];
  // (calculé à la fin, pour ne pas changer le tirage des autres catégories)
  const loeExamples = () => LOE_EXAMPLES.map(([m, t, a, e]) => a.length === 1
    ? { q: QS, big: seq(t), ...numOpts(a[0], [a[0] + 1, a[0] - 1, a[0] * 2, a[0] + 2]), explain: `${e} Exemple publié dans ${LOE} (modèle ${m}).` }
    : { q: Q2, big: seq2(t), ...pairOpts(a[0], a[1], [[a[1], a[0]], [a[0] + 1, a[1]], [a[0], a[1] + 1], [a[0] - 1, a[1] - 1]]), explain: `${e} Exemple publié dans ${LOE} (modèle ${m}).` });

  const loeModels = [
    () => { // modèle 4 : deux suites arithmétiques alternées
      const a = ri(1, 9), d1 = ri(1, 5), b = ri(10, 50), d2 = pick([5, 10, 3, 4, 7]);
      const A = range(0, 3).map(i => a + i * d1), B = range(0, 3).map(i => b + i * d2);
      const t = [A[0], B[0], A[1], B[1], A[2], B[2]];
      return { q: Q2, big: seq2(t), ...pairOpts(A[3], B[3], [[B[3], A[3]], [A[3] + d1, B[3]], [A[3], B[3] + d2], [A[3] + 1, B[3] - 1]]),
        explain: `Deux suites alternent : ${A.join(', ')} (+${d1}) et ${B.join(', ')} (+${d2}).${src(4)}` };
    },
    () => { // modèle 5 : une suite arithmétique et une suite géométrique alternées
      const a = ri(1, 6), k = pick([2, 3]), b = ri(2, 30), d = ri(2, 9);
      const A = range(0, 3).map(i => a * k ** i), B = range(0, 3).map(i => b + i * d);
      const t = [A[0], B[0], A[1], B[1], A[2], B[2]];
      return { q: Q2, big: seq2(t), ...pairOpts(A[3], B[3], [[B[3], A[3]], [A[2] + (A[2] - A[1]), B[3]], [A[3], B[3] + d], [A[3] * k, B[3]]]),
        explain: `Deux suites alternent : ${A.join(', ')} (× ${k}) et ${B.join(', ')} (+${d}).${src(5)}` };
    },
    () => { // modèle 7 : ajouter puis multiplier
      const c = ri(1, 4), k = pick([2, 3]), a = ri(1, 6), t = [a];
      for (let i = 0; i < 4; i++) t.push((t[i] + c) * k);
      const ans = (t[4] + c) * k;
      if (ans > 5000) return null;
      return { q: QS, big: seq(t), ...numOpts(ans, [t[4] * k + c, t[4] * k, ans + k, ans - c]),
        explain: `Pour passer d’un nombre au suivant, on ajoute ${c} puis on multiplie par ${k} : (${t[4]} + ${c}) × ${k} = ${ans}.${src(7)}` };
    },
    () => { // modèle 8 : paires sans lien, à écart fixe
      const d = ri(1, 9), starts = sample(range(1, 300), 3);
      const t = [starts[0], starts[0] + d, starts[1], starts[1] + d, starts[2]], ans = starts[2] + d;
      return { q: QS, big: seq(t), ...numOpts(ans, [ans + 1, ans - 1, starts[2] + d * 2, starts[2] - d]),
        explain: `Les nombres vont par paires dont l’écart est toujours ${d} : (${t[0]}, ${t[1]}), (${t[2]}, ${t[3]}), (${t[4]}, ${ans}).${src(8)}` };
    },
    () => { // modèle 10 : une suite à écarts croissants et une suite arithmétique alternées
      const a = ri(1, 10), d0 = ri(1, 3), b = ri(10, 40), d = ri(2, 6);
      const A = [a]; for (let i = 0; i < 5; i++) A.push(A[i] + d0 + i);
      const B = range(0, 4).map(i => b + i * d);
      const t = [A[0], B[0], A[1], B[1], A[2], B[2], A[3], B[3], A[4]];
      return { q: Q2, big: seq2(t), ...pairOpts(B[4], A[5], [[A[5], B[4]], [B[4] + d, A[5]], [B[4], A[5] - 1], [B[4], A[4] + d0 + 3]]),
        explain: `Deux suites alternent : ${B.join(', ')} (+${d}) et ${A.join(', ')} (écarts ${range(0, 4).map(i => '+' + (d0 + i)).join(', ')}).${src(10)}` };
    },
    () => { // modèle 11 : paires à écart fixe, chaque paire dépend de la précédente
      const d = ri(2, 9), k = pick([2, 3]), a = ri(1, 5);
      const P = [[a, a + d]]; for (let i = 1; i < 4; i++) { const s = P[i - 1][1] * k; P.push([s, s + d]); }
      if (P[3][1] > 3000) return null;
      const t = P.slice(0, 3).flat();
      return { q: Q2, big: seq2(t), ...pairOpts(P[3][0], P[3][1], [[P[3][0], P[3][0] + d + 1], [P[2][1] + d, P[2][1] + 2 * d], [P[2][0] * k, P[2][0] * k + d], [P[3][1], P[3][0]]]),
        explain: `Les nombres vont par paires d’écart ${d}, et chaque paire commence à ${k === 2 ? 'deux' : 'trois'} fois la fin de la précédente : ${P[2][1]} × ${k} = ${P[3][0]}, puis ${P[3][0]} + ${d} = ${P[3][1]}.${src(11)}` };
    },
    () => { // modèle 12 : motif S1, S2, S2
      const a = ri(1, 5), d1 = ri(1, 3), b = ri(5, 30), d2 = ri(3, 25);
      const S1 = range(0, 3).map(i => a + i * d1), S2 = range(0, 5).map(i => b + i * d2);
      const t = [S1[0], S2[0], S2[1], S1[1], S2[2], S2[3], S1[2]];
      return { q: Q2, big: seq2(t), ...pairOpts(S2[4], S2[5], [[S1[3], S2[4]], [S2[4], S1[3]], [S2[4] + 1, S2[5] + 1], [S2[3] + d1, S2[4]]]),
        explain: `Le motif se répète : un nombre de la suite ${S1.join(', ')} (+${d1}), puis deux nombres de la suite ${S2.join(', ')}… (+${d2}).${src(12)}` };
    },
    () => { // modèle 13 : motif S1, paire sans lien, S1, paire…
      const a = ri(1, 9), d1 = ri(1, 4), d = ri(2, 9), st = sample(range(2, 250), 3);
      const S1 = range(0, 3).map(i => a + i * d1);
      const t = [S1[0], st[0], st[0] + d, S1[1], st[1], st[1] + d, S1[2], st[2]];
      return { q: Q2, big: seq2(t), ...pairOpts(st[2] + d, S1[3], [[S1[3], st[2] + d], [st[2] + d + 1, S1[3]], [st[2] + d, S1[3] + d1], [st[2] + 2 * d, S1[3]]]),
        explain: `Le motif se répète : un nombre de la suite ${S1.join(', ')} (+${d1}), puis une paire d’écart ${d} : (${st[0]}, ${st[0] + d}), (${st[1]}, ${st[1] + d}), (${st[2]}, ${st[2] + d}).${src(13)}` };
    },
  ];

  /* ============ 4. Labyrinthes de points ============ */
  function maze() {
    const H = ri(5, 8), dens = 0.3 + R() * 0.2, wantMax = R() < 0.75;
    const rows = range(0, H - 1).map(k => range(0, k).map(() => k > 0 && R() < dens));
    // Programmation dynamique depuis le haut
    const best = rows.map(r => r.map(() => 0)), next = rows.map(r => r.map(() => 0));
    for (let k = H - 1; k >= 0; k--) for (let i = 0; i <= k; i++) {
      const g = rows[k][i] ? 1 : 0;
      if (k === H - 1) { best[k][i] = g; continue; }
      const a = best[k + 1][i], b = best[k + 1][i + 1];
      const takeB = wantMax ? b > a : b < a;
      best[k][i] = g + (takeB ? b : a); next[k][i] = takeB ? i + 1 : i;
    }
    const path = [0]; for (let k = 0; k < H - 1; k++) path.push(next[k][path[k]]);
    const ans = best[0][0], golds = rows.flat().filter(Boolean).length;
    if (golds < 4) return null;
    return { q: `Tu pars du point vert, en bas. À chaque étape, tu montes d’un cran vers la gauche ou vers la droite, jusqu’à la rangée du haut. Combien de points dorés peux-tu traverser ${wantMax ? 'au maximum' : 'au minimum'} ?`,
      maze: { rows, path }, ...numOpts(ans, [ans + 1, ans - 1, ans + 2, ans - 2]),
      explain: `Le ${wantMax ? 'meilleur' : 'chemin le plus « vide »'} passe par ${ans} point${ans > 1 ? 's' : ''} doré${ans > 1 ? 's' : ''} (tracé en rouge). Astuce : on part du haut et on note, pour chaque point, le ${wantMax ? 'meilleur' : 'plus petit'} total possible au-dessus de lui ; on redescend ainsi jusqu’au départ.` };
  }

  TESTS.figures = { title: 'Analogies de figures', icon: '🔺', color: '#d0567c', desc: 'Trouve la transformation et applique-la à une autre figure.',
    questions: build([figAnalogy], q => JSON.stringify([q.analogy, q.options[0]])) };
  TESTS.deduction = { title: 'Déduction (si… alors)', icon: '🔗', color: '#8a5a2b', desc: 'Raisonnement logique pur : que peut-on conclure avec certitude ?',
    questions: build(deduction, q => q.q) };
  TESTS.suites = { title: 'Suites avancées', icon: '📈', color: '#0f766e', desc: 'Des suites de nombres plus coriaces.',
    questions: build(suites, q => q.big) };
  TESTS.labyrinthes = { title: 'Labyrinthes de points', icon: '🟡', color: '#2e7d32', desc: 'Trouve le chemin qui ramasse le plus (ou le moins) de points dorés.',
    questions: build([maze], q => JSON.stringify(q.maze.rows) + q.q) };

  // Suites de l'article de Loe et al. : ajoutées EN PLUS des 200 suites existantes (banque de 400)
  const known = new Set(TESTS.suites.questions.map(q => q.big));
  const extra = [...loeExamples(), ...build(loeModels, q => q.big)].filter(q => !known.has(q.big) && known.add(q.big));
  TESTS.suites.questions.push(...extra.slice(0, 200));

  // Agrandissement à 400 des autres catégories : on ajoute à la suite, sans toucher aux 200 premières
  const grow = (cat, makers, keyOf) => {
    const t = TESTS[cat].questions, ks = new Set(t.map(keyOf));
    t.push(...build(makers, keyOf, 400).filter(q => !ks.has(keyOf(q)) && ks.add(keyOf(q))).slice(0, 400 - t.length));
  };
  grow('figures', [figAnalogy], q => JSON.stringify([q.analogy, q.options[0]]));
  grow('deduction', deduction, q => q.q);
  grow('labyrinthes', [maze], q => JSON.stringify(q.maze.rows) + q.q);

  /* ============ Labyrinthes à tracer, au format du test A-PMT ============ */
  // Format décrit par Loe & Rust (2019), « The perceptual maze test revisited », Assessment 26(8) :
  // labyrinthes en V de 10, 14 ou 18 rangs, avec 20, 30 ou 40 % de points dorés. Labyrinthes générés ici.
  function traceMaze() {
    const H = pick([10, 14, 18]), sat = pick([0.2, 0.3, 0.4]);
    const cells = [];
    for (let k = 1; k < H; k++) for (let i = 0; i <= k; i++) cells.push(k + ',' + i);
    const gold = new Set(sample(cells, Math.round(sat * cells.length)));
    const rows = range(0, H - 1).map(k => range(0, k).map(i => gold.has(k + ',' + i)));
    const best = rows.map(r => r.map(() => 0)), next = rows.map(r => r.map(() => 0));
    for (let k = H - 1; k >= 0; k--) for (let i = 0; i <= k; i++) {
      const g = rows[k][i] ? 1 : 0;
      if (k === H - 1) { best[k][i] = g; continue; }
      const a = best[k + 1][i], b = best[k + 1][i + 1];
      best[k][i] = g + Math.max(a, b); next[k][i] = b > a ? i + 1 : i;
    }
    const path = [0]; for (let k = 0; k < H - 1; k++) path.push(next[k][path[k]]);
    return {
      q: 'Pars du point vert, en bas. À chaque étape, clique sur l’un des deux points juste au-dessus (à gauche ou à droite), jusqu’à la rangée du haut. Ramasse le plus de points dorés possible : pour réussir, il faut atteindre le maximum.',
      trace: true, maze: { rows, path }, maxGold: best[0][0],
      options: ['Chemin avec le maximum de points dorés', 'Chemin sans le maximum de points dorés'], answer: 0,
      explain: `Le maximum possible était de ${best[0][0]} points dorés (un chemin optimal est surligné en rouge). Labyrinthe de ${H} rangs, ${Math.round(sat * 100)} % de points dorés, au format du test A-PMT (Loe & Rust, 2019).`,
    };
  }
  TESTS.trace = { title: 'Labyrinthes à tracer', icon: '🧭', color: '#7b8f1a',
    desc: 'Le format du vrai test A-PMT : trace toi-même le chemin qui ramasse le plus de points dorés.',
    questions: build([traceMaze], q => JSON.stringify(q.maze.rows), 400) };

  /* ============ Logique propositionnelle (format « 2 affirmations, 6 conclusions ») ============ */
  // Format inspiré de Gühne, Doebler, Condon, Luo & Sun (2020), European Journal of Psychological Assessment.
  // Questions générées ici ; la bonne réponse est calculée par table de vérité.
  const NONE = 'Aucune de ces réponses';
  function propItem() {
    const V = props(3);
    const lit = (v, s) => ({ t: 'lit', v, s });
    const rl = v => lit(v, R() < 0.65);
    const bin = (t, x, y) => ({ t, a: rl(x), b: rl(y) });
    const ev = (f, a) => f.t === 'lit' ? a[f.v] === f.s : f.t === 'and' ? ev(f.a, a) && ev(f.b, a) : f.t === 'or' ? ev(f.a, a) || ev(f.b, a) : !ev(f.a, a) || ev(f.b, a);
    const txt = f => f.t === 'lit' ? V[f.v][f.s ? 0 : 1] : f.t === 'and' ? `${txt(f.a)} et ${txt(f.b)}` : f.t === 'or' ? `${txt(f.a)} ou ${txt(f.b)}` : fix(`si ${txt(f.a)}, alors ${txt(f.b)}`);
    const sent = f => fix(cap(txt(f)));
    const ALL = range(0, 7).map(m => [!!(m & 1), !!(m & 2), !!(m & 4)]);
    const sig = f => ALL.map(a => (ev(f, a) ? 1 : 0)).join('');

    const p1 = bin(pick(['if', 'or', 'if']), 0, 1);
    const p2 = R() < 0.3 ? rl(pick([0, 1])) : bin(pick(['if', 'or', 'if']), pick([0, 1]), 2);
    const sat = ALL.filter(a => ev(p1, a) && ev(p2, a));
    if (!sat.length || sat.length === 8) return null;
    const premSigs = new Set([sig(p1), sig(p2)]);

    // Réserve de conclusions candidates, une seule par « sens logique » (deux phrases équivalentes ne peuvent pas coexister)
    const pool = new Map();
    for (let g = 0; g < 120; g++) {
      const f = R() < 0.25 ? rl(ri(0, 2)) : bin(pick(['if', 'if', 'or', 'and']), ...sample([0, 1, 2], 2));
      const s = sig(f);
      if (s === '11111111' || s === '00000000' || premSigs.has(s) || pool.has(s)) continue;
      pool.set(s, f);
    }
    const ok = [...pool.values()].filter(f => sat.every(a => ev(f, a)));
    const ko = mix([...pool.values()].filter(f => !sat.every(a => ev(f, a))));
    if (!ok.length) return null; // on veut que « aucune » reste rare (environ 15 %)
    const none = R() < 0.15;
    if (ko.length < 6) return null;
    const chosen = none ? ko.slice(0, 6) : mix([pick(ok), ...ko.slice(0, 5)]);
    const good = none ? null : chosen.find(f => sat.every(a => ev(f, a)));
    const options = [...chosen.map(sent), NONE];

    const caseTxt = a => { const parts = V.map((p, v) => p[a[v] ? 0 : 1]); return `${parts[0]}, ${parts[1]} et ${parts[2]}`; };
    const cases = sat.length <= 4 ? `Les seules situations possibles sont : ${sat.map(a => `« ${caseTxt(a)} »`).join(' ; ')}. ` : '';
    return {
      q: `${S(txt(p1))} ${S(txt(p2))} Laquelle de ces conclusions est forcément vraie ?`,
      options, answer: none ? 6 : chosen.indexOf(good), keepOrder: true,
      explain: `${cases}${none ? 'Aucune des six conclusions n’est vraie dans toutes les situations compatibles avec les deux phrases.' : `« ${sent(good)} » est vraie dans toutes les situations compatibles avec les deux phrases : c’est la seule conclusion certaine. Les autres peuvent être fausses dans au moins une de ces situations.`} (Format inspiré de Gühne et al., 2020.)`,
    };
  }
  /* ============ Analogies de pentagones (format décrit par Doebler, 2016) ============ */
  // Règles (« radicaux ») combinables : rotation, miroir, échange de deux couleurs, échange centre/anneau.
  const pRot = (c, r) => { const o = [...c]; for (let i = 0; i < 5; i++) { o[(i + r) % 5] = c[i]; o[5 + (i + r) % 5] = c[5 + i]; } return o; };
  const pMir = c => { const o = [...c]; for (let i = 0; i < 5; i++) { o[(9 - i) % 5] = c[i]; o[5 + (9 - i) % 5] = c[5 + i]; } return o; };
  const pCol = (c, a, b) => c.map(x => (x === a ? b : x === b ? a : x));
  const pRing = c => [...c.slice(5), ...c.slice(0, 5)];
  const pApply = (c, T) => T.reduce((x, t) => t.t === 'rot' ? pRot(x, t.r) : t.t === 'mir' ? pMir(x) : t.t === 'col' ? pCol(x, t.a, t.b) : pRing(x), c);
  const pKey = c => c.join('');
  const ROT_TXT = { 1: 'un cinquième de tour (72°) dans le sens des aiguilles d’une montre', 2: 'deux cinquièmes de tour (144°) dans le sens des aiguilles d’une montre',
    3: 'deux cinquièmes de tour (144°) dans le sens inverse des aiguilles d’une montre', 4: 'un cinquième de tour (72°) dans le sens inverse des aiguilles d’une montre' };
  const pTxt = t => t.t === 'rot' ? `la figure tourne ${/^un/.test(ROT_TXT[t.r]) ? 'd’' : 'de '}${ROT_TXT[t.r]}` : t.t === 'mir' ? 'la figure est retournée comme dans un miroir (gauche ↔ droite)'
    : t.t === 'col' ? `le ${PENTA_NAMES[t.a]} et le ${PENTA_NAMES[t.b]} échangent leur place` : 'le centre et l’anneau extérieur échangent leurs couleurs';
  // Toutes les transformations possibles (rotations × miroir × échange centre/anneau × échange de deux couleurs)
  const SWAPS = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
  const GROUP = [];
  for (let r = 0; r < 5; r++) for (const m of [0, 1]) for (const g of [0, 1]) for (const sw of [null, ...SWAPS]) {
    GROUP.push(c => { let x = pRot(c, r); if (m) x = pMir(x); if (g) x = pRing(x); return sw ? pCol(x, sw[0], sw[1]) : x; });
  }
  const randPenta = () => {
    const c = range(0, 9).map(() => ri(0, 3));
    if (new Set(c).size < 3) return null;
    // pas de symétrie : sinon une rotation ou un miroir pourrait passer inaperçu
    for (let r = 0; r < 5; r++) { if (r && pKey(pRot(c, r)) === pKey(c)) return null; if (pKey(pMir(pRot(c, r))) === pKey(c)) return null; }
    return c;
  };
  function pentaItem() {
    const A = randPenta(), C = randPenta();
    if (!A || !C || pKey(A) === pKey(C)) return null;
    const common = [0, 1, 2, 3].filter(x => A.includes(x) && C.includes(x));
    const kinds = sample(['rot', 'mir', 'col', 'ring'], ri(1, 3));
    if (kinds.includes('col') && common.length < 2) return null;
    const T = mix(kinds).map(k => k === 'rot' ? { t: 'rot', r: ri(1, 4) } : k === 'col' ? (([a, b]) => ({ t: 'col', a, b }))(sample(common, 2)) : { t: k });
    const B = pApply(A, T), D = pApply(C, T);
    if (pKey(B) === pKey(A) || pKey(D) === pKey(C)) return null;
    // Une seule réponse possible : toutes les transformations qui changent A en B doivent donner la même chose sur C
    const results = new Set(GROUP.filter(g => pKey(g(A)) === pKey(B)).map(g => pKey(g(C))));
    if (results.size !== 1) return null;
    // Pièges construits par règles : une règle oubliée, une rotation différente, un miroir en plus, d'autres couleurs…
    const traps = [C, B];
    T.forEach((t, k) => { if (T.length > 1) traps.push(pApply(C, T.filter((_, j) => j !== k))); });
    T.forEach((t, k) => {
      const alt = [...T];
      if (t.t === 'rot') [1, 2, 3, 4].filter(r => r !== t.r).forEach(r => { alt[k] = { t: 'rot', r }; traps.push(pApply(C, alt)); });
      if (t.t === 'col') SWAPS.filter(([a, b]) => a !== t.a || b !== t.b).forEach(([a, b]) => { alt[k] = { t: 'col', a, b }; traps.push(pApply(C, alt)); });
      if (t.t === 'mir') { alt[k] = { t: 'rot', r: ri(1, 4) }; traps.push(pApply(C, alt)); }
    });
    traps.push(pApply(C, [...T, { t: 'mir' }]), pApply(C, [...T, { t: 'rot', r: ri(1, 4) }]), pApply(C, [...T, { t: 'ring' }]));
    const out = [D], ks = new Set([pKey(D)]);
    for (const t of mix(traps)) { if (out.length < 6 && !ks.has(pKey(t))) { ks.add(pKey(t)); out.push(t); } }
    if (out.length < 6) return null;
    return { q: 'La 1re figure se transforme en la 2e. Quelle figure obtient-on en appliquant exactement la même transformation à la 3e ?',
      penta: [A, B, C], options: out, answer: 0,
      explain: `De la 1re à la 2e figure : ${T.map(pTxt).join(', puis ')}. On fait la même chose avec la 3e figure. (Format des analogies de figures décrit par Doebler, 2016.)` };
  }
  TESTS.propositions ={ title: 'Logique propositionnelle', icon: '⚖️', color: '#5a6b8c',
    desc: 'Deux affirmations, six conclusions : une seule est forcément vraie (ou aucune).',
    questions: build([propItem], q => q.q, 400) };

  // (généré en dernier pour ne pas modifier le tirage des catégories précédentes)
  TESTS.pentagones = { title: 'Analogies de pentagones', icon: '⬟', color: '#c2410c',
    desc: 'Rotations, miroirs et échanges de couleurs à repérer sur des pentagones façon Max Bill.',
    questions: build([pentaItem], q => JSON.stringify(q.penta), 400) };

  /* ============ Analogies en grille 2 × 2 (format de Blum, Holling, Galibert & Forthmann, 2016) ============ */
  // Une règle agit sur les lignes (A→B et C→D), une autre sur les colonnes (A→C et B→D).
  // Ainsi A:B::C:D et A:C::B:D sont vraies toutes les deux, comme dans le test original.
  const ATTR = {
    s: { vals: () => SHAPES, txt: (a, b) => `la forme passe d’${SHN[a][1] ? 'une' : 'un'} ${SHN[a][0]} à ${SHN[b][1] ? 'une' : 'un'} ${SHN[b][0]}` },
    f: { vals: () => FILLS, txt: (a, b) => `le remplissage passe de « ${FA[a][0]} » à « ${FA[b][0]} »` },
    n: { vals: () => [1, 2, 3, 4], txt: (a, b) => `le nombre de formes passe de ${a} à ${b}` },
    z: { vals: () => ['s', 'm', 'l'], txt: (a, b) => `la taille passe de ${ZN[a]} à ${ZN[b]}` },
  };
  const grid2Item = () => {
    const arrows = R() < 0.25;
    const c4 = x => tidy({ s: x.s, n: x.n, f: x.f, r: x.r || 0, z: x.z });
    let A, row, col, txtRow, txtCol, apply;
    if (arrows) {
      // Flèches : rotation sur les lignes, et rotation ou nombre sur les colonnes
      const d1 = pick([45, 90, 135, -45, -90]);
      const byCount = R() < 0.5;
      const d2 = pick([45, 90, 180, -90].filter(d => d !== d1 && d !== -d1));
      let n1 = ri(1, 3), n2 = ri(1, 4); while (n2 === n1) n2 = ri(1, 4);
      A = { s: 'arrow', n: n1, f: 'full', r: pick([0, 45, 90, 180, 270]), z: 'm' };
      row = x => ({ ...x, r: norm(x.r + d1) });
      col = byCount ? x => ({ ...x, n: n2 }) : x => ({ ...x, r: norm(x.r + d2) });
      const rotTxt = d => d === 180 ? 'la flèche fait un demi-tour' : `la flèche tourne de ${Math.abs(d)}° ${d > 0 ? 'dans le sens des aiguilles d’une montre' : 'dans le sens inverse des aiguilles d’une montre'}`;
      txtRow = rotTxt(d1);
      txtCol = byCount ? `le nombre de flèches passe de ${n1} à ${n2}` : rotTxt(d2);
    } else {
      // Formes : 1 ou 2 attributs changent sur les lignes, 1 autre sur les colonnes (taille et nombre ne vont pas ensemble)
      let keys;
      do { keys = sample(['s', 'f', 'n', 'z'], R() < 0.4 ? 3 : 2); } while (keys.includes('n') && keys.includes('z'));
      const rowKeys = keys.slice(0, keys.length - 1), colKey = keys[keys.length - 1];
      A = { s: pick(SHAPES), n: keys.includes('z') ? 1 : ri(1, 3), f: pick(FILLS), r: 0, z: keys.includes('z') ? pick(['s', 'm', 'l']) : 'm' };
      const ch = {};
      for (const k of keys) { const v = pick(ATTR[k].vals().filter(x => x !== A[k])); ch[k] = v; }
      row = x => { const y = { ...x }; rowKeys.forEach(k => { y[k] = ch[k]; }); return y; };
      col = x => ({ ...x, [colKey]: ch[colKey] });
      txtRow = rowKeys.map(k => ATTR[k].txt(A[k], ch[k])).join(', et ');
      txtCol = ATTR[colKey].txt(A[colKey], ch[colKey]);
    }
    const B = row(A), C = col(A), D = row(col(A)), D2 = col(row(A));
    if (JSON.stringify(c4(D)) !== JSON.stringify(c4(D2))) return null; // les deux chemins doivent mener à la même case
    // Pièges : une case de la grille, une seule règle appliquée, une règle « exagérée » ou inversée, un attribut en plus
    const traps = [A, B, C];
    if (arrows) traps.push({ ...D, r: norm(D.r + 90) }, { ...D, r: norm(D.r + 180) }, { ...D, r: norm(2 * C.r - D.r) }, { ...D, n: D.n + 1 }, { ...D, n: Math.max(1, D.n - 1) });
    else {
      ['s', 'f', 'n', 'z'].forEach(k => ATTR[k].vals().forEach(v => {
        if (k === 'z' && D.n > 1) return;
        if (v !== D[k]) traps.push({ ...D, [k]: v });
      }));
    }
    const out = [c4(D)], ks = new Set([JSON.stringify(c4(D))]);
    // on garde d'abord les cases de la grille (A, B, C), puis des pièges proches, mélangés
    for (const t of [...traps.slice(0, 3), ...mix(traps.slice(3))].map(c4)) {
      const k = JSON.stringify(t);
      if (out.length < 6 && t.n >= 1 && t.n <= 6 && !ks.has(k)) { ks.add(k); out.push(t); }
    }
    if (out.length < 6) return null;
    return { q: 'Quelle case complète la grille ? (la règle doit marcher sur les lignes comme sur les colonnes)',
      grid2: [A, B, C].map(c4), options: out, answer: 0,
      explain: `Sur chaque ligne (de gauche à droite), ${txtRow}. Sur chaque colonne (de haut en bas), ${txtCol}. La case manquante combine les deux règles : ${desc(c4(D))}. (Format des analogies de figures de Blum et al., 2016.)` };
  };
  TESTS.grille2 = { title: 'Analogies 2 × 2', icon: '🔲', color: '#0e7490',
    desc: 'La case manquante doit respecter la règle des lignes et celle des colonnes.',
    questions: build([grid2Item], q => JSON.stringify(q.grid2), 400) };
})();
