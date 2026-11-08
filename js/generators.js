// Complète chaque catégorie jusqu'à 200 questions.
// Logique, matrices et mémoire sont générées avec un hasard « à graine fixe » :
// la banque est donc exactement la même à chaque chargement de la page.
// Les questions verbales sont écrites à la main (en bas du fichier).
(function () {
  const TARGET = 200;

  let seed = 20261104;
  const R = () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const ri = (a, b) => a + Math.floor(R() * (b - a + 1));
  const pick = a => a[Math.floor(R() * a.length)];
  const mix = a => {
    const b = [...a];
    for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
    return b;
  };
  const sample = (a, n) => mix(a).slice(0, n);
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const seqText = arr => arr.join(' · ') + ' · ?';
  const ord = n => (n === 1 ? '1er' : `${n}e`);
  const ordF = n => (n === 1 ? '1re' : `${n}e`);
  const L = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // 4 options numériques : la bonne + 3 pièges plausibles
  function numOpts(ans, cands) {
    const w = [];
    for (const x of mix(cands)) {
      if (x !== ans && x >= 0 && Number.isInteger(x) && !w.includes(x)) w.push(x);
      if (w.length === 3) break;
    }
    for (let k = 1; w.length < 3; k++) {
      for (const x of [ans + k, ans - k]) if (x >= 0 && !w.includes(x) && w.length < 3) w.push(x);
    }
    return { options: [ans, ...w].map(String), answer: 0 };
  }
  function textOpts(ans, wrongs) {
    const w = [...new Set(wrongs)].filter(x => x !== ans);
    if (w.length < 3) return null;
    return { options: [ans, ...sample(w, 3)], answer: 0 };
  }

  const qKey = q => JSON.stringify([q.q, q.big, q.grid, q.memo]);
  function fill(cat, makers, target = TARGET) {
    const qs = TESTS[cat].questions;
    const seen = new Set(qs.map(qKey));
    for (let guard = 0; qs.length < target && guard < 50000; guard++) {
      const q = makers[guard % makers.length]();
      if (!q || !q.options || q.options.length < 4) continue;
      const distinct = new Set(q.options.map(o => JSON.stringify(o))).size === q.options.length;
      const k = qKey(q);
      if (!distinct || seen.has(k)) continue;
      seen.add(k);
      qs.push(q);
    }
  }

  /* =========================== LOGIQUE =========================== */
  const QS = 'Quel nombre complète la suite ?';
  const logique = [
    () => { // suite arithmétique
      const d = ri(2, 15), down = R() < 0.3;
      const a = down ? ri(5 * d + 1, 5 * d + 60) : ri(1, 60);
      const t = range(0, 4).map(i => (down ? a - i * d : a + i * d));
      const ans = down ? t[4] - d : t[4] + d;
      return { q: QS, big: seqText(t), ...numOpts(ans, [ans + 1, ans - 1, ans + d, ans - d, ans + 2]),
        explain: down ? `On retire ${d} à chaque fois : ${t[4]} − ${d} = ${ans}.` : `On ajoute ${d} à chaque fois : ${t[4]} + ${d} = ${ans}.` };
    },
    () => { // suite géométrique (montante ou descendante)
      const k = ri(2, 4), a = ri(1, 7), n = k === 2 ? 5 : 4;
      if (R() < 0.3) {
        const t = range(1, n).reverse().map(i => a * k ** i);
        return { q: QS, big: seqText(t), ...numOpts(a, [a + 1, a * 2, a - 1, t[n - 1] - a * k + a + 1]),
          explain: `Chaque nombre est divisé par ${k} : ${t[n - 1]} ÷ ${k} = ${a}.` };
      }
      const t = range(0, n - 1).map(i => a * k ** i), last = t[n - 1], ans = last * k;
      return { q: QS, big: seqText(t), ...numOpts(ans, [last * (k + 1), ans - k, ans + a, ans - 1, last + a * k]),
        explain: `Chaque nombre est multiplié par ${k} : ${last} × ${k} = ${ans}.` };
    },
    () => { // écarts qui augmentent
      const a = ri(1, 20), d0 = ri(1, 5), s = ri(1, 3);
      const t = [a], diffs = [];
      for (let i = 0; i < 4; i++) { diffs.push(d0 + i * s); t.push(t[i] + d0 + i * s); }
      const nd = d0 + 4 * s, ans = t[4] + nd;
      return { q: QS, big: seqText(t), ...numOpts(ans, [ans - s, ans + s, ans + 1, t[4] + diffs[3]]),
        explain: `Les écarts augmentent de ${s} à chaque fois : ${diffs.map(x => '+' + x).join(', ')}, puis +${nd}. Donc ${t[4]} + ${nd} = ${ans}.` };
    },
    () => { // deux opérations en alternance
      const variants = [[['×', 2], ['+', ri(1, 5)]], [['×', 2], ['−', ri(1, 5)]], [['+', ri(4, 12)], ['−', ri(1, 3)]], [['×', 3], ['−', ri(1, 6)]]];
      const ops = pick(variants);
      const ap = (x, [o, v]) => (o === '×' ? x * v : o === '+' ? x + v : x - v);
      const n = ops[0][0] === '×' ? 5 : 6;
      const t = [ri(2, 9)];
      for (let i = 0; i < n - 1; i++) t.push(ap(t[i], ops[i % 2]));
      const nextOp = ops[(n - 1) % 2], ans = ap(t[n - 1], nextOp);
      if (t.some(v => v <= 0) || ans <= 0) return null;
      const name = o => `${o[0]} ${o[1]}`;
      return { q: QS, big: seqText(t), ...numOpts(ans, [ap(t[n - 1], ops[n % 2]), ans + 1, ans - 1, ans + 2]),
        explain: `On alterne ${name(ops[0])} puis ${name(ops[1])}. Ici on fait ${name(nextOp)} : ${t[n - 1]} ${nextOp[0]} ${nextOp[1]} = ${ans}.` };
    },
    () => { // carrés ou cubes
      const n0 = ri(1, 8), k = pick([0, 0, 1, -1, 2, 3]), cube = k === 0 && R() < 0.3;
      if (cube && n0 > 4) return null;
      const p = cube ? 3 : 2;
      const t = range(0, 4).map(i => (n0 + i) ** p + k), ans = (n0 + 5) ** p + k;
      const kt = k > 0 ? ` plus ${k}` : k < 0 ? ` moins ${-k}` : '';
      return { q: QS, big: seqText(t), ...numOpts(ans, [ans + 1, ans - 1, t[4] + (t[4] - t[3]), ans + 2]),
        explain: `Ce sont les ${cube ? 'cubes' : 'carrés'} de ${n0} à ${n0 + 4}${kt}. Le suivant est ${n0 + 5}${cube ? '³' : '²'}${kt} = ${ans}.` };
    },
    () => { // type Fibonacci
      const a = ri(1, 9), b = ri(a, 12), t = [a, b];
      while (t.length < 6) t.push(t[t.length - 1] + t[t.length - 2]);
      const ans = t[4] + t[5];
      return { q: QS, big: seqText(t), ...numOpts(ans, [ans + 1, ans - 1, t[5] + (t[5] - t[4]), t[5] * 2]),
        explain: `Chaque nombre est la somme des deux précédents : ${t[4]} + ${t[5]} = ${ans}.` };
    },
    () => { // lettres à pas constant
      const d = ri(2, 4), s = ri(0, 25 - 4 * d);
      const t = range(0, 3).map(i => L[s + i * d]), ai = s + 4 * d;
      const o = textOpts(L[ai], [ai - 1, ai + 1, ai + 2, ai - 2].filter(i => i >= 0 && i <= 25).map(i => L[i]));
      return o && { q: 'Quelle lettre complète la suite ?', big: seqText(t), ...o,
        explain: `On avance de ${d} lettres dans l’alphabet à chaque fois : après ${t[3]} vient ${L[ai]}.` };
    },
    () => { // lettres à pas croissant
      const d0 = ri(1, 2), steps = [d0, d0 + 1, d0 + 2, d0 + 3];
      const s = ri(0, 25 - steps.reduce((a, b) => a + b));
      const idx = [s];
      steps.forEach(st => idx.push(idx[idx.length - 1] + st));
      const t = idx.slice(0, 4).map(i => L[i]), ai = idx[4];
      const o = textOpts(L[ai], [ai - 1, ai + 1, idx[3] + steps[2], ai + 2].filter(i => i >= 0 && i <= 25).map(i => L[i]));
      return o && { q: 'Quelle lettre complète la suite ?', big: seqText(t), ...o,
        explain: `On avance de ${steps.slice(0, 3).join(', ')}, puis ${steps[3]} lettres : après ${t[3]} vient ${L[ai]}.` };
    },
    () => { // deux suites entremêlées
      const a = ri(1, 20), d1 = ri(1, 6), b = ri(20, 60), d2 = pick([-1, 1]) * ri(2, 7);
      const A = range(0, 3).map(i => a + i * d1), B = range(0, 3).map(i => b + i * d2);
      if (B[3] <= 0) return null;
      const t = [A[0], B[0], A[1], B[1], A[2], B[2], A[3]], ans = B[3];
      const sign = x => (x > 0 ? `+${x}` : `−${-x}`);
      return { q: QS, big: seqText(t), ...numOpts(ans, [A[3] + d1, ans + 1, ans - 1, ans + d2]),
        explain: `Deux suites sont mélangées, une case sur deux : ${A.join(', ')} (${sign(d1)}) et ${B.slice(0, 3).join(', ')} (${sign(d2)}). La suivante appartient à la 2e suite : ${ans}.` };
    },
    () => { // problème d'âge
      const child = pick(['Léo', 'Inès', 'Hugo', 'Lina', 'Nathan', 'Jade', 'Tom', 'Emma', 'Noah', 'Chloé']);
      const [pp, pr] = pick([['son père', 'il'], ['sa mère', 'elle']]);
      const A = ri(4, 15), n = ri(1, 20), B = 2 * A + n;
      return { q: `${child} a ${A} ans et ${pp} a ${B} ans. Dans combien d’années ${pp} aura-t-${pr} exactement le double de l’âge ${/^[AEIOUÉ]/.test(child) ? `d’${child}` : `de ${child}`} ?`,
        ...numOpts(n, [n + 1, n - 1, B - A, n + 2, Math.round(B / 2) - A]),
        explain: `Dans n ans, ${pp} aura ${B} + n ans et ${child} ${A} + n ans. On veut ${B} + n = 2 × (${A} + n), donc n = ${B} − 2 × ${A} = ${n}.` };
    },
    () => { // nombre mystère
      const x = ri(2, 25), a = ri(2, 9), b = ri(1, 30), sub = R() < 0.4;
      const c = sub ? a * x - b : a * x + b;
      if (c <= 0) return null;
      const mid = sub ? c + b : c - b;
      return { q: `Je pense à un nombre. Je le multiplie par ${a}, puis ${sub ? `je retire ${b}` : `j’ajoute ${b}`}. J’obtiens ${c}. Quel est ce nombre ?`,
        ...numOpts(x, [x + 1, x - 1, x + 2, Math.floor(c / a)]),
        explain: `On fait le chemin inverse : ${c} ${sub ? '+' : '−'} ${b} = ${mid}, puis ${mid} ÷ ${a} = ${x}.` };
    },
    () => { // proportionnalité
      const it = pick(['cahiers', 'stylos', 'croissants', 'tickets de bus', 'gommes', 'cartes postales', 'bouteilles d’eau']);
      const u = ri(2, 9), n = ri(2, 6);
      let m = ri(3, 12); if (m === n) m++;
      const ans = u * m, o = numOpts(ans, [ans + u, ans - u, u * n + m, ans + 1]);
      o.options = o.options.map(v => `${v} €`);
      return { q: `${n} ${it} coûtent ${u * n} €. Combien coûtent ${m} ${it} ?`, ...o,
        explain: `Un seul coûte ${u * n} ÷ ${n} = ${u} €, donc ${m} coûtent ${m} × ${u} = ${ans} €.` };
    },
    () => { // syllogismes
      const [A, B, C] = sample(['Blip', 'Zorg', 'Kip', 'Trull', 'Mirk', 'Flon', 'Grub', 'Plaf', 'Snud', 'Vorp', 'Glim', 'Tazz'], 3);
      const forms = [
        { s: `Tous les ${A}s sont des ${B}s. Tous les ${B}s sont des ${C}s.`, ok: `Tous les ${A}s sont des ${C}s`,
          bad: [`Tous les ${C}s sont des ${A}s`, `Aucun ${A} n’est un ${C}`, `Certains ${A}s ne sont pas des ${C}s`],
          ex: `Chaque ${A} est un ${B}, et chaque ${B} est un ${C} : chaque ${A} est donc forcément un ${C}.` },
        { s: `Aucun ${A} n’est un ${B}. Tous les ${C}s sont des ${B}s.`, ok: `Aucun ${C} n’est un ${A}`,
          bad: [`Tous les ${C}s sont des ${A}s`, `Certains ${C}s sont des ${A}s`, `Tous les ${A}s sont des ${C}s`],
          ex: `Les ${C}s sont tous des ${B}s, et aucun ${B} n’est un ${A} : aucun ${C} ne peut donc être un ${A}.` },
        { s: `Tous les ${A}s sont des ${B}s. Certains ${B}s sont des ${C}s.`, ok: `On ne peut rien conclure sur les ${A}s et les ${C}s`,
          bad: [`Tous les ${A}s sont des ${C}s`, `Certains ${A}s sont des ${C}s`, `Aucun ${A} n’est un ${C}`],
          ex: `Les ${B}s qui sont des ${C}s ne sont pas forcément des ${A}s : on ne peut rien affirmer.` },
        { s: `Certains ${A}s sont des ${B}s. Tous les ${B}s sont des ${C}s.`, ok: `Certains ${A}s sont des ${C}s`,
          bad: [`Tous les ${A}s sont des ${C}s`, `Aucun ${A} n’est un ${C}`, `Tous les ${C}s sont des ${A}s`],
          ex: `Les ${A}s qui sont des ${B}s sont aussi des ${C}s : certains ${A}s sont donc des ${C}s.` },
      ];
      const f = pick(forms);
      return { q: `${f.s} Que peut-on conclure avec certitude ?`, options: [f.ok, ...f.bad], answer: 0, explain: f.ex };
    },
    () => { // classement
      const N = sample(['Alex', 'Sam', 'Charlie', 'Camille', 'Noa', 'Lou', 'Eden', 'Maxime', 'Sacha', 'Robin'], 4);
      const que = n => (/^[AEIOU]/.test(n) ? `qu’${n}` : `que ${n}`);
      const facts = mix([0, 1, 2].map(i => `${N[i]} court plus vite ${que(N[i + 1])}.`)).join(' ');
      const [ask, k] = pick([['Qui court le plus vite ?', 0], ['Qui court le moins vite ?', 3], ['Qui est le 2e plus rapide ?', 1], ['Qui est le 3e plus rapide ?', 2]]);
      return { q: `${facts} ${ask}`, options: [N[k], ...N.filter((_, i) => i !== k)], answer: 0,
        explain: `Du plus rapide au moins rapide : ${N.join(', ')}.` };
    },
  ];

  /* =========================== MATRICES =========================== */
  const SHAPES = ['circle', 'square', 'triangle', 'diamond', 'star'];
  const FILLS = ['full', 'striped', 'empty'];
  const SH = { circle: ['cercle', 0], square: ['carré', 0], triangle: ['triangle', 0], diamond: ['losange', 0], star: ['étoile', 1], arrow: ['flèche', 1] };
  const FA = { full: ['plein', 'pleine'], striped: ['rayé', 'rayée'], empty: ['vide', 'vide'] };
  const DIR = { 0: 'vers le haut', 45: 'vers le haut à droite', 90: 'vers la droite', 135: 'vers le bas à droite',
                180: 'vers le bas', 225: 'vers le bas à gauche', 270: 'vers la gauche', 315: 'vers le haut à gauche' };
  const norm = a => ((a % 360) + 360) % 360;

  function desc(x) {
    if (x.s === 'arrow') return `${x.n === 1 ? 'une flèche' : x.n + ' flèches'} ${DIR[norm(x.r)]}`;
    const [name, fem] = SH[x.s], adj = FA[x.f][fem];
    if (x.n === 1) {
      const size = x.z === 's' ? (fem ? 'petite ' : 'petit ') : x.z === 'l' ? (fem ? 'grande ' : 'grand ') : '';
      return `${fem ? 'une' : 'un'} ${size}${name} ${adj}`;
    }
    return `${x.n} ${name}s ${adj}s`;
  }

  function matOpts(ans, plausible) {
    const out = [], ks = new Set();
    const add = x => {
      if (x.n > 1) x = { ...x, z: 'm' };          // la taille ne compte que pour une forme seule
      const k = JSON.stringify(x);
      if (out.length < 6 && x.n >= 1 && x.n <= 6 && !ks.has(k)) { ks.add(k); out.push(x); }
    };
    add(ans);
    mix(plausible).forEach(add);
    const muts = [];
    if (ans.s === 'arrow') [45, 90, 135, 180, 225, 270, 315].forEach(d => muts.push({ ...ans, r: norm(ans.r + d) }));
    else {
      SHAPES.filter(s => s !== ans.s).forEach(s => muts.push({ ...ans, s }));
      FILLS.forEach(f => muts.push({ ...ans, f }));
      if (ans.n === 1) ['s', 'm', 'l'].forEach(z => muts.push({ ...ans, z }));
    }
    [ans.n - 1, ans.n + 1].forEach(n => muts.push({ ...ans, n }));
    mix(muts).forEach(add);
    return { options: out, answer: 0 };
  }

  const build = f => { const g = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) g.push(f(i, j)); return g; };
  const mat = (cells, plausible, why) => {
    const ans = cells.pop();
    return { q: 'Quelle case complète la grille ?', grid: cells, ...matOpts(ans, plausible), explain: `${why} Il faut ${desc(ans)}.` };
  };

  const matrices = [
    () => { // le nombre varie par colonne, la forme par ligne
      const S = sample(SHAPES, 3), f = pick(FILLS), down = R() < 0.35, c0 = ri(1, 2);
      const N = down ? [c0 + 2, c0 + 1, c0] : [c0, c0 + 1, c0 + 2];
      return mat(build((i, j) => c(S[i], N[j], f)), [c(S[1], N[2], f), c(S[2], N[1], f)],
        `Chaque ligne garde la même forme et, de gauche à droite, le nombre ${down ? 'diminue' : 'augmente'} (${N.join(', ')}).`);
    },
    () => { // remplissage par colonne
      const S = sample(SHAPES, 3), F = mix(FILLS), n = ri(1, 2);
      return mat(build((i, j) => c(S[i], n, F[j])), [c(S[2], n, F[1]), c(S[1], n, F[2]), c(S[2], n, F[0])],
        `Chaque ligne a sa forme, et chaque colonne a son remplissage (${F.map(x => FA[x][0]).join(', ')}).`);
    },
    () => { // carré latin des formes + nombre par ligne
      const S = sample(SHAPES, 3), f = pick(FILLS), N = sample([1, 2, 3, 4], 3);
      return mat(build((i, j) => c(S[(i + j) % 3], N[i], f)), [c(S[0], N[2], f), c(S[2], N[2], f), c(S[1], N[1], f)],
        'Chaque ligne et chaque colonne contient une seule fois chaque forme, et le nombre est le même sur toute une ligne.');
    },
    () => { // taille qui grandit ou rapetisse
      const S = sample(SHAPES, 3), F = [pick(FILLS), pick(FILLS), pick(FILLS)], up = R() < 0.5, Z = up ? ['s', 'm', 'l'] : ['l', 'm', 's'];
      return mat(build((i, j) => c(S[i], 1, F[i], 0, Z[j])), [c(S[2], 1, F[2], 0, Z[1]), c(S[1], 1, F[2], 0, Z[2]), c(S[2], 1, F[1], 0, Z[2])],
        `Dans chaque ligne, la forme et le remplissage restent les mêmes et la taille ${up ? 'grandit' : 'diminue'}.`);
    },
    () => { // addition
      const S = sample(SHAPES, 3), f = pick(FILLS);
      const rows = range(0, 2).map(() => { const a = ri(1, 4), b = ri(1, Math.min(4, 6 - a)); return [a, b, a + b]; });
      const [a, b] = rows[2];
      return mat(build((i, j) => c(S[i], rows[i][j], f)), [c(S[2], b, f), c(S[2], a, f)],
        `Dans chaque ligne, la 3e case est la somme des deux premières : ${a} + ${b} = ${a + b}.`);
    },
    () => { // soustraction
      const S = sample(SHAPES, 3), f = pick(FILLS);
      const rows = range(0, 2).map(() => { const a = ri(2, 6), b = ri(1, a - 1); return [a, b, a - b]; });
      const [a, b] = rows[2];
      return mat(build((i, j) => c(S[i], rows[i][j], f)), [c(S[2], b, f), c(S[2], Math.min(6, a + b), f)],
        `Dans chaque ligne, la 3e case vaut la 1re moins la 2e : ${a} − ${b} = ${a - b}.`);
    },
    () => { // rotation de flèche
      const step = pick([45, 90, -45, -90]), cont = R() < 0.5, start = pick([0, 45, 90, 135, 180, 225, 270, 315]);
      const shift = cont ? 2 * step : step;
      const sens = step > 0 ? 'dans le sens des aiguilles d’une montre' : 'dans le sens inverse des aiguilles d’une montre';
      return mat(build((i, j) => c('arrow', 1, 'full', norm(start + i * shift + j * step))), [],
        `La flèche tourne de ${Math.abs(step)}° ${sens} à chaque case, et chaque ligne commence ${cont ? 'là où la précédente s’est arrêtée' : 'avec un cran de décalage par rapport à la précédente'}.`);
    },
    () => { // double carré latin : forme et remplissage
      const S = sample(SHAPES, 3), F = mix(FILLS);
      return mat(build((i, j) => c(S[(i + j) % 3], 1, F[(j + 2 * i) % 3])), [c(S[1], 1, F[1]), c(S[1], 1, F[2]), c(S[0], 1, F[0]), c(S[2], 1, F[0])],
        'Chaque ligne et chaque colonne contient une fois chaque forme et une fois chaque remplissage.');
    },
    () => { // flèches : nombre par ligne, direction par colonne
      const N = sample([1, 2, 3, 4], 3), step = pick([45, 90, -90, 135]), start = pick([0, 90, 180, 270, 45]);
      return mat(build((i, j) => c('arrow', N[i], 'full', norm(start + j * step))),
        [c('arrow', N[1], 'full', norm(start + 2 * step)), c('arrow', N[2], 'full', norm(start + step))],
        `Le nombre de flèches dépend de la ligne (${N.join(', ')}) et leur direction dépend de la colonne.`);
    },
    () => { // forme par colonne, nombre par ligne
      const S = sample(SHAPES, 3), N = sample([1, 2, 3, 4, 5], 3), f = pick(FILLS);
      return mat(build((i, j) => c(S[j], N[i], f)), [c(S[2], N[1], f), c(S[1], N[2], f)],
        'La forme dépend de la colonne et le nombre dépend de la ligne.');
    },
  ];

  /* =========================== MÉMOIRE =========================== */
  const WORDS = ['Chat', 'Lune', 'Piano', 'Rose', 'Train', 'Livre', 'Plage', 'Nuage', 'Pomme', 'Cheval', 'Bateau', 'Forêt', 'Miroir', 'Lampe',
    'Jardin', 'Tigre', 'Violon', 'Fusée', 'Château', 'Rivière', 'Orange', 'Montagne', 'Cerise', 'Hibou', 'Valise', 'Tambour', 'Étoile',
    'Glace', 'Moulin', 'Crayon', 'Ballon', 'Phare', 'Tortue', 'Bougie', 'Sapin', 'Camion', 'Plume', 'Fromage', 'Requin', 'Parapluie'];
  const EMO = [['🍎', 'pomme'], ['🚗', 'voiture'], ['🐶', 'chien'], ['⭐', 'étoile'], ['🎈', 'ballon'], ['📚', 'livres'], ['🌙', 'lune'],
    ['🎸', 'guitare'], ['🐱', 'chat'], ['🌻', 'tournesol'], ['⚽', 'ballon de foot'], ['🍕', 'pizza'], ['🚲', 'vélo'], ['🎁', 'cadeau'],
    ['🐟', 'poisson'], ['🌈', 'arc-en-ciel'], ['🍌', 'banane'], ['🔑', 'clé'], ['☂️', 'parapluie'], ['🐢', 'tortue']];
  const COLORS = [['🔴', 'rouge', 'rouges'], ['🔵', 'bleu', 'bleus'], ['🟢', 'vert', 'verts'], ['🟡', 'jaune', 'jaunes'], ['🟣', 'violet', 'violets'], ['🟠', 'orange', 'orange']];
  const CITIES = ['Paris', 'Rome', 'Oslo', 'Lima', 'Tokyo', 'Berlin', 'Madrid', 'Dakar', 'Québec', 'Lisbonne', 'Athènes', 'Vienne', 'Prague', 'Dublin', 'Séoul', 'Montréal'];
  const CONS = 'BCDFGHJKLMNPRSTVXZ'.split('');
  const digits = n => sample(range(1, 9), n);
  const tDigits = n => Math.round(2 + n * 0.7);
  const swapAt = (a, i) => { const b = [...a]; [b[i], b[i + 1]] = [b[i + 1], b[i]]; return b; };
  const changeOne = a => { const b = [...a]; const i = ri(0, a.length - 1); b[i] = pick(range(1, 9).filter(d => !a.includes(d))); return b; };
  const sp = a => a.join(' ');

  const memoire = [
    () => { // restituer la séquence
      const d = digits(ri(4, 6)), s = sp(d);
      const o = textOpts(s, [...range(0, d.length - 2).map(i => sp(swapAt(d, i))), sp(changeOne(d)), sp(changeOne(d))]);
      return o && { memo: s, time: tDigits(d.length), q: 'Quelle séquence était affichée ?', ...o, explain: `La séquence était ${s}.` };
    },
    () => { // n-ième chiffre
      const d = digits(ri(5, 7)), k = ri(1, d.length), ans = String(d[k - 1]);
      const o = textOpts(ans, d.filter((_, i) => i !== k - 1).map(String));
      return o && { memo: sp(d), time: tDigits(d.length), q: `Quel était le ${ord(k)} chiffre ?`, ...o, explain: `Dans ${sp(d)}, le ${ord(k)} chiffre est ${ans}.` };
    },
    () => { // mot absent
      const list = sample(WORDS, ri(5, 6)), others = WORDS.filter(w => !list.includes(w)), ans = pick(others);
      return { memo: list.join(' · '), time: list.length + 1, q: 'Quel mot n’était PAS dans la liste ?',
        options: [ans, ...sample(list, 3)], answer: 0, explain: `La liste était : ${list.join(', ')}. « ${ans} » n’y figurait pas.` };
    },
    () => { // mot présent
      const list = sample(WORDS, ri(5, 6)), others = WORDS.filter(w => !list.includes(w)), ans = pick(list);
      return { memo: list.join(' · '), time: list.length + 1, q: 'Quel mot était dans la liste ?',
        options: [ans, ...sample(others, 3)], answer: 0, explain: `La liste était : ${list.join(', ')}. Seul « ${ans} » en faisait partie.` };
    },
    () => { // compter une couleur
      const cols = sample(COLORS, 4), target = cols[0], k = ri(1, 4), total = ri(6, 8);
      const seq = mix([...Array(k).fill(target[0]), ...range(1, total - k).map(() => pick(cols.slice(1))[0])]);
      return { memo: seq.join(' '), time: 5, q: `Combien de ronds ${target[2]} y avait-il ?`, ...numOpts(k, [k + 1, k - 1, k + 2, k - 2]),
        explain: `Il y avait ${k} rond${k > 1 ? 's' : ''} ${k > 1 ? target[2] : target[1]} sur ${total}.` };
    },
    () => { // séquence à l'envers
      const d = digits(ri(5, 6)), rev = [...d].reverse(), s = sp(rev);
      const o = textOpts(s, [sp(swapAt(rev, ri(0, rev.length - 2))), sp(swapAt(rev, ri(0, rev.length - 2))), sp(d), sp(changeOne(rev))]);
      return o && { memo: sp(d), time: tDigits(d.length), q: 'Quelle est cette séquence lue à l’envers ?', ...o,
        explain: `${sp(d)} à l’envers donne ${s}.` };
    },
    () => { // objet qui suit
      const list = sample(EMO, 6), p = ri(0, 4), ans = list[p + 1][0];
      const o = textOpts(ans, list.filter((_, i) => i !== p && i !== p + 1).map(e => e[0]));
      return o && { memo: list.map(e => e[0]).join(' '), time: 5, q: `Quel objet venait juste après ${list[p][0]} ?`, ...o,
        explain: `L’ordre était : ${list.map(e => e[1]).join(', ')}. Après ${list[p][0]} venait ${ans}.` };
    },
    () => { // somme du premier et du dernier
      const d = digits(ri(6, 7)), n = d.length, sum = d[0] + d[n - 1];
      return { memo: sp(d), time: tDigits(n), q: 'Combien font le premier et le dernier chiffre additionnés ?',
        ...numOpts(sum, [sum + 1, sum - 1, d[0] + d[1], d[n - 2] + d[n - 1], sum + 2]),
        explain: `Le premier chiffre était ${d[0]} et le dernier ${d[n - 1]} : ${d[0]} + ${d[n - 1]} = ${sum}.` };
    },
    () => { // position d'un mot
      const list = sample(WORDS, 6), k = ri(1, 6), ans = list[k - 1];
      const o = textOpts(ans, list.filter(w => w !== ans));
      return o && { memo: list.join(' · '), time: 7, q: `Quel mot était en ${ordF(k)} position ?`, ...o,
        explain: `L’ordre était : ${list.join(', ')}. Le mot en ${ordF(k)} position est ${ans}.` };
    },
    () => { // ordre alphabétique
      const ls = sample(CONS, 5), sorted = [...ls].sort();
      if (sp(ls) === sp(sorted)) return null;
      const o = textOpts(sp(sorted), [sp(swapAt(sorted, 0)), sp(swapAt(sorted, 1)), sp(swapAt(sorted, 2)), sp(swapAt(sorted, 3)), sp(ls)]);
      return o && { memo: sp(ls), time: 5, q: 'Remets ces lettres dans l’ordre alphabétique.', ...o,
        explain: `Les lettres étaient ${ls.join(', ')}. Dans l’ordre alphabétique : ${sp(sorted)}.` };
    },
    () => { // paires ville – nombre
      const cs = sample(CITIES, 4), ns = sample(range(1, 9), 4), k = ri(0, 3);
      return { memo: cs.map((x, i) => `${x} – ${ns[i]}`).join(' · '), time: 8, q: `Quel nombre était associé à ${cs[k]} ?`,
        options: [String(ns[k]), ...ns.filter((_, i) => i !== k).map(String)], answer: 0,
        explain: `Les paires étaient : ${cs.map((x, i) => `${x} ${ns[i]}`).join(', ')}.` };
    },
    () => { // chiffre absent
      const d = digits(6), ans = String(pick(range(1, 9).filter(x => !d.includes(x))));
      return { memo: sp(d), time: tDigits(6), q: 'Lequel de ces chiffres n’était PAS affiché ?',
        options: [ans, ...sample(d, 3).map(String)], answer: 0, explain: `La séquence était ${sp(d)} : le ${ans} n’y figurait pas.` };
    },
  ];

  /* =========================== VERBAL (écrit à la main) =========================== */
  // [mot, bonne réponse, piège, piège, piège]
  const SYN = [
    ['rapide', 'véloce', 'lourd', 'calme', 'petit'], ['content', 'joyeux', 'triste', 'fatigué', 'pressé'],
    ['commencer', 'débuter', 'terminer', 'attendre', 'refuser'], ['bâtir', 'construire', 'détruire', 'dessiner', 'acheter'],
    ['aisé', 'facile', 'pénible', 'lent', 'rare'], ['désuet', 'démodé', 'moderne', 'solide', 'coûteux'],
    ['audacieux', 'téméraire', 'prudent', 'timide', 'paresseux'], ['sagace', 'avisé', 'naïf', 'bavard', 'maladroit'],
    ['dérisoire', 'insignifiant', 'énorme', 'sérieux', 'précieux'], ['frugal', 'sobre', 'abondant', 'gourmand', 'riche'],
    ['vétuste', 'délabré', 'neuf', 'propre', 'spacieux'], ['loquace', 'bavard', 'silencieux', 'discret', 'sérieux'],
    ['intrépide', 'courageux', 'peureux', 'fatigué', 'distrait'], ['hâtif', 'précipité', 'réfléchi', 'tardif', 'lent'],
    ['opulent', 'riche', 'pauvre', 'modeste', 'simple'], ['laconique', 'bref', 'long', 'bavard', 'confus'],
    ['véhément', 'fougueux', 'calme', 'mou', 'poli'], ['candide', 'naïf', 'rusé', 'méfiant', 'cruel'],
    ['immuable', 'invariable', 'changeant', 'fragile', 'rapide'], ['tenace', 'obstiné', 'inconstant', 'faible', 'distrait'],
    ['bienveillant', 'indulgent', 'méchant', 'sévère', 'indifférent'], ['exigu', 'étroit', 'vaste', 'haut', 'clair'],
    ['néfaste', 'nuisible', 'bénéfique', 'utile', 'neutre'], ['placide', 'calme', 'nerveux', 'agité', 'colérique'],
    ['fortuit', 'accidentel', 'prévu', 'volontaire', 'régulier'], ['raffiné', 'élégant', 'grossier', 'vulgaire', 'simple'],
    ['erroné', 'faux', 'exact', 'précis', 'juste'], ['abolir', 'supprimer', 'créer', 'instaurer', 'maintenir'],
    ['accroître', 'augmenter', 'diminuer', 'réduire', 'garder'], ['dissimuler', 'cacher', 'montrer', 'révéler', 'avouer'],
    ['entraver', 'gêner', 'aider', 'faciliter', 'permettre'], ['sinueux', 'tortueux', 'droit', 'rectiligne', 'plat'],
    ['morose', 'maussade', 'gai', 'enjoué', 'rieur'], ['insipide', 'fade', 'savoureux', 'épicé', 'sucré'],
    ['lucide', 'clairvoyant', 'aveugle', 'confus', 'endormi'], ['vorace', 'glouton', 'sobre', 'rassasié', 'délicat'],
    ['hostile', 'défavorable', 'amical', 'accueillant', 'favorable'], ['rétif', 'récalcitrant', 'docile', 'obéissant', 'soumis'],
    ['véridique', 'exact', 'mensonger', 'faux', 'inventé'], ['aride', 'sec', 'humide', 'fertile', 'mouillé'],
    ['cocasse', 'drôle', 'triste', 'tragique', 'banal'], ['assidu', 'régulier', 'absent', 'irrégulier', 'paresseux'],
    ['rudimentaire', 'sommaire', 'perfectionné', 'complexe', 'élaboré'], ['pérenne', 'durable', 'passager', 'fragile', 'court'],
    ['ostensible', 'visible', 'discret', 'caché', 'secret'], ['bénin', 'anodin', 'grave', 'dangereux', 'mortel'],
    ['épier', 'espionner', 'ignorer', 'oublier', 'négliger'], ['réprimander', 'gronder', 'féliciter', 'encourager', 'remercier'],
    ['ébahi', 'stupéfait', 'indifférent', 'blasé', 'calme'], ['fallacieux', 'trompeur', 'honnête', 'sincère', 'véridique'],
  ];
  const ANT = [
    ['généreux', 'avare', 'gentil', 'riche', 'calme'], ['abondant', 'rare', 'nombreux', 'large', 'varié'],
    ['ancien', 'moderne', 'vieux', 'usé', 'antique'], ['timide', 'audacieux', 'réservé', 'discret', 'poli'],
    ['optimiste', 'pessimiste', 'joyeux', 'confiant', 'rêveur'], ['accepter', 'refuser', 'prendre', 'recevoir', 'choisir'],
    ['fragile', 'robuste', 'délicat', 'cassant', 'léger'], ['clair', 'obscur', 'lumineux', 'net', 'transparent'],
    ['diurne', 'nocturne', 'quotidien', 'solaire', 'matinal'], ['innocent', 'coupable', 'naïf', 'pur', 'libre'],
    ['docile', 'rebelle', 'obéissant', 'sage', 'calme'], ['éloigner', 'rapprocher', 'écarter', 'chasser', 'quitter'],
    ['majorité', 'minorité', 'totalité', 'plupart', 'ensemble'], ['humble', 'orgueilleux', 'modeste', 'simple', 'discret'],
    ['paisible', 'agité', 'calme', 'serein', 'tranquille'], ['prudent', 'imprudent', 'sage', 'attentif', 'réfléchi'],
    ['enrichir', 'appauvrir', 'gagner', 'améliorer', 'augmenter'], ['précoce', 'tardif', 'rapide', 'jeune', 'hâtif'],
    ['concave', 'convexe', 'creux', 'plat', 'rond'], ['légal', 'illégal', 'juste', 'officiel', 'permis'],
    ['sincère', 'hypocrite', 'honnête', 'franc', 'loyal'], ['négligent', 'soigneux', 'distrait', 'paresseux', 'lent'],
    ['ascendant', 'descendant', 'montant', 'parent', 'élevé'], ['croissance', 'décroissance', 'hausse', 'progrès', 'développement'],
    ['dense', 'clairsemé', 'épais', 'compact', 'serré'], ['intérieur', 'extérieur', 'dedans', 'central', 'interne'],
    ['bruyant', 'silencieux', 'sonore', 'tapageur', 'agité'], ['spontané', 'réfléchi', 'naturel', 'rapide', 'impulsif'],
    ['victoire', 'défaite', 'succès', 'triomphe', 'combat'], ['permanent', 'temporaire', 'durable', 'constant', 'stable'],
    ['attirer', 'repousser', 'séduire', 'charmer', 'appeler'], ['aimable', 'désagréable', 'gentil', 'poli', 'souriant'],
    ['maximal', 'minimal', 'total', 'élevé', 'optimal'], ['avouer', 'nier', 'reconnaître', 'dire', 'confesser'],
    ['superflu', 'indispensable', 'inutile', 'excessif', 'accessoire'], ['obéir', 'désobéir', 'écouter', 'suivre', 'respecter'],
    ['entier', 'partiel', 'complet', 'total', 'intact'], ['vulgaire', 'raffiné', 'grossier', 'banal', 'commun'],
    ['rugueux', 'lisse', 'rêche', 'dur', 'épais'], ['fréquent', 'rare', 'habituel', 'courant', 'régulier'],
    ['apparaître', 'disparaître', 'surgir', 'venir', 'naître'], ['actif', 'passif', 'dynamique', 'vif', 'énergique'],
    ['complimenter', 'critiquer', 'flatter', 'féliciter', 'vanter'], ['ajouter', 'retrancher', 'additionner', 'joindre', 'compléter'],
    ['sobre', 'extravagant', 'simple', 'discret', 'modeste'], ['majeur', 'mineur', 'adulte', 'principal', 'grand'],
    ['expansion', 'contraction', 'extension', 'croissance', 'développement'], ['allumer', 'éteindre', 'brûler', 'enflammer', 'éclairer'],
    ['franchise', 'hypocrisie', 'sincérité', 'honnêteté', 'loyauté'], ['inférieur', 'supérieur', 'moindre', 'bas', 'petit'],
  ];
  // [A, B, C, bonne réponse, piège, piège, piège, explication]
  const ANA = [
    ['Pied', 'chaussure', 'main', 'gant', 'bague', 'doigt', 'bras', 'On met une chaussure au pied et un gant à la main.'],
    ['Chien', 'aboyer', 'chat', 'miauler', 'hennir', 'bêler', 'rugir', 'C’est le cri de l’animal : le chien aboie, le chat miaule.'],
    ['Été', 'hiver', 'jour', 'nuit', 'soleil', 'matin', 'semaine', 'L’été s’oppose à l’hiver comme le jour s’oppose à la nuit.'],
    ['Peintre', 'pinceau', 'écrivain', 'stylo', 'livre', 'bibliothèque', 'lecteur', 'C’est l’outil de travail : le pinceau pour le peintre, le stylo pour l’écrivain.'],
    ['Vache', 'veau', 'jument', 'poulain', 'agneau', 'cheval', 'écurie', 'Le petit de la vache est le veau, celui de la jument est le poulain.'],
    ['Eau', 'soif', 'nourriture', 'faim', 'repas', 'cuisine', 'goût', 'L’eau calme la soif, la nourriture calme la faim.'],
    ['Œil', 'voir', 'oreille', 'entendre', 'parler', 'sentir', 'toucher', 'L’œil sert à voir, l’oreille sert à entendre.'],
    ['Mouton', 'laine', 'abeille', 'miel', 'ruche', 'fleur', 'piqûre', 'Le mouton produit la laine, l’abeille produit le miel.'],
    ['Poisson', 'nageoire', 'oiseau', 'aile', 'bec', 'nid', 'œuf', 'La nageoire fait avancer le poisson dans l’eau, l’aile fait voler l’oiseau.'],
    ['Seconde', 'minute', 'minute', 'heure', 'jour', 'temps', 'montre', '60 secondes font une minute, 60 minutes font une heure.'],
    ['Pilote', 'avion', 'capitaine', 'navire', 'port', 'mer', 'équipage', 'Le pilote commande l’avion, le capitaine commande le navire.'],
    ['Boulanger', 'pain', 'boucher', 'viande', 'couteau', 'boutique', 'farine', 'Le boulanger vend du pain, le boucher vend de la viande.'],
    ['Arbre', 'forêt', 'mouton', 'troupeau', 'berger', 'laine', 'prairie', 'Plusieurs arbres forment une forêt, plusieurs moutons forment un troupeau.'],
    ['Gramme', 'kilogramme', 'mètre', 'kilomètre', 'centimètre', 'distance', 'litre', 'Un kilogramme vaut 1 000 grammes, un kilomètre vaut 1 000 mètres.'],
    ['Rapide', 'lent', 'léger', 'lourd', 'mince', 'fin', 'aérien', 'Rapide est le contraire de lent, léger est le contraire de lourd.'],
    ['Glace', 'froid', 'feu', 'chaud', 'fumée', 'bois', 'rouge', 'La glace est froide, le feu est chaud.'],
    ['Cuisinier', 'cuisine', 'mécanicien', 'garage', 'voiture', 'outil', 'moteur', 'C’est le lieu de travail : la cuisine pour le cuisinier, le garage pour le mécanicien.'],
    ['Lettre', 'mot', 'mot', 'phrase', 'syllabe', 'alphabet', 'lettre', 'Les lettres forment les mots, les mots forment les phrases.'],
    ['Thermomètre', 'température', 'balance', 'poids', 'taille', 'prix', 'volume', 'Le thermomètre mesure la température, la balance mesure le poids.'],
    ['Racine', 'arbre', 'fondations', 'maison', 'brique', 'terrain', 'toit', 'Les racines tiennent l’arbre, les fondations tiennent la maison.'],
    ['Nord', 'sud', 'orient', 'occident', 'gauche', 'droite', 'haut', 'Le nord s’oppose au sud, l’orient (l’est) s’oppose à l’occident (l’ouest).'],
    ['Lune', 'nuit', 'soleil', 'jour', 'étoile', 'ciel', 'été', 'La lune brille la nuit, le soleil brille le jour.'],
    ['Écrire', 'stylo', 'couper', 'ciseaux', 'papier', 'tissu', 'coller', 'On écrit avec un stylo, on coupe avec des ciseaux.'],
    ['Ville', 'maire', 'pays', 'président', 'capitale', 'citoyen', 'frontière', 'Le maire dirige la ville, le président dirige le pays.'],
    ['Fleur', 'bouquet', 'page', 'livre', 'feuille', 'encre', 'ligne', 'Plusieurs fleurs forment un bouquet, plusieurs pages forment un livre.'],
    ['Chenille', 'papillon', 'têtard', 'grenouille', 'poisson', 'mare', 'insecte', 'La chenille devient papillon, le têtard devient grenouille.'],
    ['Musicien', 'orchestre', 'joueur', 'équipe', 'match', 'ballon', 'arbitre', 'Le musicien fait partie d’un orchestre, le joueur fait partie d’une équipe.'],
    ['Pomme', 'pommier', 'gland', 'chêne', 'noisette', 'forêt', 'sapin', 'La pomme pousse sur le pommier, le gland pousse sur le chêne.'],
    ['Doigt', 'main', 'orteil', 'pied', 'ongle', 'jambe', 'chaussure', 'Le doigt est sur la main, l’orteil est sur le pied.'],
    ['Sec', 'mouillé', 'vide', 'plein', 'creux', 'rien', 'ouvert', 'Sec est le contraire de mouillé, vide est le contraire de plein.'],
    ['Professeur', 'élève', 'médecin', 'patient', 'hôpital', 'infirmier', 'maladie', 'Le professeur s’occupe de l’élève, le médecin s’occupe du patient.'],
    ['Gant', 'main', 'chapeau', 'tête', 'cheveux', 'écharpe', 'cou', 'Le gant se porte sur la main, le chapeau sur la tête.'],
    ['Encre', 'stylo', 'essence', 'voiture', 'pétrole', 'route', 'garage', 'L’encre fait fonctionner le stylo, l’essence fait rouler la voiture.'],
    ['Avril', 'mai', 'lundi', 'mardi', 'dimanche', 'semaine', 'mois', 'Mai vient après avril, mardi vient après lundi.'],
    ['Enfant', 'enfance', 'vieillard', 'vieillesse', 'âge', 'sagesse', 'retraite', 'L’enfance est l’âge de l’enfant, la vieillesse celui du vieillard.'],
    ['Peu', 'beaucoup', 'rarement', 'souvent', 'parfois', 'jamais', 'hier', 'Peu s’oppose à beaucoup, rarement s’oppose à souvent.'],
    ['Cheval', 'écurie', 'vache', 'étable', 'prairie', 'lait', 'ferme', 'Le cheval dort à l’écurie, la vache à l’étable.'],
    ['Œuf', 'poule', 'lait', 'vache', 'fromage', 'beurre', 'ferme', 'La poule donne l’œuf, la vache donne le lait.'],
    ['Charpentier', 'bois', 'forgeron', 'fer', 'marteau', 'feu', 'enclume', 'Le charpentier travaille le bois, le forgeron travaille le fer.'],
    ['Triangle', '3', 'carré', '4', '5', '6', '8', 'C’est le nombre de côtés : 3 pour le triangle, 4 pour le carré.'],
    ['Pluie', 'parapluie', 'soleil', 'parasol', 'nuage', 'chaleur', 'plage', 'Le parapluie protège de la pluie, le parasol protège du soleil.'],
    ['Hiver', 'neige', 'automne', 'feuilles mortes', 'soleil', 'fleurs', 'chaleur', 'La neige tombe en hiver, les feuilles mortes tombent en automne.'],
    ['Silence', 'bruit', 'obscurité', 'lumière', 'nuit', 'ombre', 'noir', 'Le silence s’oppose au bruit, l’obscurité s’oppose à la lumière.'],
    ['Aquarium', 'poissons', 'volière', 'oiseaux', 'chats', 'insectes', 'singes', 'L’aquarium accueille des poissons, la volière accueille des oiseaux.'],
    ['Myope', 'lunettes', 'sourd', 'appareil auditif', 'canne', 'fauteuil', 'musique', 'La personne myope s’aide de lunettes, la personne sourde d’un appareil auditif.'],
  ];
  // [4 mots, index de l'intrus, explication]
  const INT = [
    [['Lion', 'Tigre', 'Panthère', 'Loup'], 3, 'Le loup n’est pas un félin.'],
    [['Paris', 'Lyon', 'Madrid', 'Marseille'], 2, 'Madrid est en Espagne, les autres villes sont en France.'],
    [['Carré', 'Triangle', 'Cercle', 'Cube'], 3, 'Le cube est un volume, les autres sont des figures planes.'],
    [['Dauphin', 'Requin', 'Baleine', 'Phoque'], 1, 'Le requin est un poisson, les autres sont des mammifères.'],
    [['Mercure', 'Vénus', 'Lune', 'Mars'], 2, 'La Lune est un satellite, les autres sont des planètes.'],
    [['Rose', 'Tulipe', 'Chêne', 'Marguerite'], 2, 'Le chêne est un arbre, les autres sont des fleurs.'],
    [['Couteau', 'Fourchette', 'Cuillère', 'Assiette'], 3, 'L’assiette n’est pas un couvert.'],
    [['Lundi', 'Mars', 'Jeudi', 'Samedi'], 1, 'Mars est un mois, les autres sont des jours.'],
    [['Pigeon', 'Chauve-souris', 'Moineau', 'Merle'], 1, 'La chauve-souris est un mammifère, les autres sont des oiseaux.'],
    [['Euro', 'Dollar', 'Yen', 'Kilo'], 3, 'Le kilo est une unité de masse, les autres sont des monnaies.'],
    [['Nil', 'Amazone', 'Sahara', 'Danube'], 2, 'Le Sahara est un désert, les autres sont des fleuves.'],
    [['Courir', 'Sauter', 'Nager', 'Rapide'], 3, 'Rapide est un adjectif, les autres sont des verbes.'],
    [['Huit', 'Douze', 'Quinze', 'Vingt'], 2, 'Quinze est impair, les autres sont pairs.'],
    [['Mètre', 'Litre', 'Kilogramme', 'Thermomètre'], 3, 'Le thermomètre est un instrument, les autres sont des unités de mesure.'],
    [['Cuivre', 'Fer', 'Or', 'Bois'], 3, 'Le bois n’est pas un métal.'],
    [['Piano', 'Guitare', 'Flûte', 'Pinceau'], 3, 'Le pinceau n’est pas un instrument de musique.'],
    [['Neige', 'Grêle', 'Pluie', 'Vent'], 3, 'Le vent n’est pas de l’eau qui tombe du ciel.'],
    [['Sapin', 'Pin', 'Épicéa', 'Bouleau'], 3, 'Le bouleau perd ses feuilles en hiver, les autres sont des conifères.'],
    [['Ordinateur', 'Tablette', 'Téléphone', 'Livre'], 3, 'Le livre n’est pas un appareil électronique.'],
    [['Football', 'Tennis', 'Basket', 'Échecs'], 3, 'Les échecs ne se jouent pas avec une balle.'],
    [['Abeille', 'Fourmi', 'Araignée', 'Mouche'], 2, 'L’araignée a 8 pattes : ce n’est pas un insecte.'],
    [['Allemagne', 'Italie', 'Brésil', 'Espagne'], 2, 'Le Brésil n’est pas en Europe.'],
    [['Joyeux', 'Heureux', 'Ravi', 'Triste'], 3, 'Triste est le seul mot qui n’exprime pas la joie.'],
    [['Avion', 'Hélicoptère', 'Fusée', 'Sous-marin'], 3, 'Le sous-marin ne vole pas.'],
    [['4', '9', '16', '20'], 3, '20 n’est pas un carré parfait (4 = 2², 9 = 3², 16 = 4²).'],
    [['Crayon', 'Stylo', 'Feutre', 'Gomme'], 3, 'La gomme ne sert pas à écrire.'],
    [['Été', 'Automne', 'Décembre', 'Printemps'], 2, 'Décembre est un mois, les autres sont des saisons.'],
    [['Coton', 'Laine', 'Soie', 'Plastique'], 3, 'Le plastique n’est pas une fibre naturelle.'],
    [['Pédiatre', 'Dentiste', 'Chirurgien', 'Avocat'], 3, 'L’avocat n’est pas un métier de la santé.'],
    [['Hexagone', 'Pentagone', 'Octogone', 'Sphère'], 3, 'La sphère n’est pas un polygone.'],
    [['Cheval', 'Âne', 'Zèbre', 'Vache'], 3, 'La vache n’est pas un équidé.'],
    [['Saturne', 'Jupiter', 'Neptune', 'Soleil'], 3, 'Le Soleil est une étoile, les autres sont des planètes.'],
    [['Volcan', 'Montagne', 'Colline', 'Vallée'], 3, 'La vallée est un creux, les autres sont des reliefs en hauteur.'],
    [['Mozart', 'Beethoven', 'Picasso', 'Chopin'], 2, 'Picasso était peintre, les autres étaient compositeurs.'],
    [['Œil', 'Nez', 'Oreille', 'Genou'], 3, 'Le genou n’est pas sur la tête.'],
    [['Kilomètre', 'Centimètre', 'Millimètre', 'Kilogramme'], 3, 'Le kilogramme mesure une masse, les autres une longueur.'],
    [['Pain', 'Croissant', 'Baguette', 'Fromage'], 3, 'Le fromage n’est pas fait par le boulanger.'],
    [['Hibou', 'Chouette', 'Chauve-souris', 'Poule'], 3, 'La poule n’est pas un animal de nuit.'],
    [['Marteau', 'Tournevis', 'Scie', 'Clou'], 3, 'Le clou n’est pas un outil.'],
    [['Anglais', 'Espagnol', 'Allemand', 'Mexique'], 3, 'Le Mexique est un pays, les autres sont des langues.'],
    [['Grenouille', 'Crapaud', 'Salamandre', 'Lézard'], 3, 'Le lézard est un reptile, les autres sont des amphibiens.'],
    [['Addition', 'Soustraction', 'Multiplication', 'Équation'], 3, 'L’équation n’est pas une opération.'],
    [['Cerf', 'Biche', 'Faon', 'Lapin'], 3, 'Le lapin n’appartient pas à la famille du cerf.'],
    [['Bonjour', 'Salut', 'Bonsoir', 'Merci'], 3, 'Merci n’est pas une salutation.'],
    [['Shakespeare', 'Molière', 'Victor Hugo', 'Napoléon'], 3, 'Napoléon n’était pas écrivain.'],
  ];

  // « ce que abeille » → « ce qu’abeille » (h muet : « ce qu’heure » ; h aspiré : « ce que haut »)
  const H_MUET = ['heure', 'herbe', 'homme', 'hiver', 'hôpital', 'huile', 'histoire'];
  const queC = c => (/^[aeiouyàâéèêëîïôœùû]/i.test(c) || H_MUET.some(w => c.startsWith(w)) ? `ce qu’${c}` : `ce que ${c}`);
  const synQ = ([w, a, ...d]) => ({ q: `Quel mot est le plus proche de « ${w} » ?`, options: [a, ...d], answer: 0,
    explain: `« ${w} » a le même sens que « ${a} ».` });
  const antQ = ([w, a, ...d]) => ({ q: `Quel est le contraire de « ${w} » ?`, options: [a, ...d], answer: 0,
    explain: `Le contraire de « ${w} » est « ${a} ».` });
  const anaQ = ([A, B, C, a, d1, d2, d3, ex]) => ({ q: `${A} est à ${B.toLowerCase()} ${queC(C.toLowerCase())} est à…`,
    options: [a, d1, d2, d3], answer: 0, explain: ex });
  const intQ = ([words, k, ex]) => ({ q: 'Quel mot est l’intrus ?', options: words, answer: k, explain: ex });

  const verbal = mix([...SYN.map(synQ), ...ANT.map(antQ), ...ANA.map(anaQ), ...INT.map(intQ)]);

  fill('logique', logique);
  fill('matrices', matrices);
  fill('memoire', memoire);
  TESTS.verbal.questions.push(...verbal.slice(0, TARGET - TESTS.verbal.questions.length));

  /* ===== Agrandissement à 400 questions : les 200 premières restent identiques, on ajoute à la suite ===== */
  const BIG = 400;
  fill('logique', logique, BIG);
  fill('matrices', matrices, BIG);
  fill('memoire', memoire, BIG);

  const SYN2 = [
    ['affable', 'aimable', 'bourru', 'timide', 'fier'], ['anodin', 'insignifiant', 'grave', 'important', 'rare'],
    ['apathique', 'indolent', 'énergique', 'nerveux', 'joyeux'], ['austère', 'sévère', 'joyeux', 'luxueux', 'frivole'],
    ['belliqueux', 'agressif', 'pacifique', 'calme', 'peureux'], ['caduc', 'périmé', 'valable', 'récent', 'solide'],
    ['chétif', 'malingre', 'robuste', 'vigoureux', 'gras'], ['concis', 'succinct', 'prolixe', 'long', 'flou'],
    ['cupide', 'avide', 'généreux', 'désintéressé', 'prodigue'], ['désinvolte', 'nonchalant', 'appliqué', 'sérieux', 'guindé'],
    ['dévoué', 'fidèle', 'ingrat', 'traître', 'égoïste'], ['éloquent', 'persuasif', 'muet', 'maladroit', 'confus'],
    ['émérite', 'chevronné', 'novice', 'débutant', 'maladroit'], ['enjoué', 'gai', 'morose', 'triste', 'sérieux'],
    ['étourdi', 'distrait', 'attentif', 'prudent', 'concentré'], ['exhaustif', 'complet', 'partiel', 'sommaire', 'bref'],
    ['fastidieux', 'ennuyeux', 'passionnant', 'captivant', 'amusant'], ['fébrile', 'agité', 'calme', 'serein', 'posé'],
    ['flagrant', 'évident', 'douteux', 'caché', 'discret'], ['fourbe', 'perfide', 'loyal', 'franc', 'honnête'],
    ['frêle', 'fragile', 'robuste', 'solide', 'costaud'], ['futile', 'frivole', 'essentiel', 'grave', 'utile'],
    ['hardi', 'audacieux', 'craintif', 'timide', 'prudent'], ['hétéroclite', 'disparate', 'homogène', 'uniforme', 'ordonné'],
    ['impassible', 'imperturbable', 'ému', 'agité', 'nerveux'], ['impétueux', 'fougueux', 'calme', 'posé', 'lent'],
    ['indolent', 'paresseux', 'actif', 'travailleur', 'vif'], ['inexorable', 'implacable', 'clément', 'souple', 'indulgent'],
    ['intègre', 'honnête', 'corrompu', 'malhonnête', 'véreux'], ['jovial', 'joyeux', 'maussade', 'sinistre', 'triste'],
    ['lacunaire', 'incomplet', 'complet', 'exhaustif', 'parfait'], ['limpide', 'clair', 'trouble', 'boueux', 'opaque'],
    ['magnanime', 'généreux', 'mesquin', 'rancunier', 'avare'], ['méticuleux', 'minutieux', 'négligent', 'bâclé', 'distrait'],
    ['modique', 'faible', 'élevé', 'énorme', 'considérable'], ['narquois', 'moqueur', 'sérieux', 'bienveillant', 'respectueux'],
    ['obsolète', 'dépassé', 'moderne', 'actuel', 'neuf'], ['onéreux', 'coûteux', 'bon marché', 'gratuit', 'modique'],
    ['opiniâtre', 'acharné', 'inconstant', 'mou', 'hésitant'], ['pusillanime', 'craintif', 'courageux', 'brave', 'hardi'],
    ['prodigue', 'dépensier', 'avare', 'économe', 'radin'], ['propice', 'favorable', 'défavorable', 'nuisible', 'contraire'],
    ['querelleur', 'chamailleur', 'conciliant', 'paisible', 'aimable'], ['serein', 'paisible', 'anxieux', 'agité', 'tourmenté'],
    ['subtil', 'fin', 'grossier', 'lourd', 'simple'], ['téméraire', 'imprudent', 'prudent', 'réfléchi', 'craintif'],
    ['tacite', 'implicite', 'explicite', 'formel', 'écrit'], ['vigilant', 'attentif', 'distrait', 'négligent', 'endormi'],
    ['versatile', 'changeant', 'constant', 'stable', 'fidèle'], ['zélé', 'dévoué', 'paresseux', 'négligent', 'indifférent'],
  ];
  const ANT2 = [
    ['courageux', 'lâche', 'brave', 'hardi', 'fort'], ['vaste', 'exigu', 'immense', 'large', 'étendu'],
    ['lent', 'rapide', 'calme', 'lourd', 'tardif'], ['loyal', 'perfide', 'fidèle', 'sincère', 'dévoué'],
    ['gai', 'triste', 'joyeux', 'enjoué', 'drôle'], ['louange', 'blâme', 'éloge', 'compliment', 'hommage'],
    ['émerger', 'sombrer', 'surgir', 'apparaître', 'sortir'], ['construire', 'démolir', 'bâtir', 'édifier', 'monter'],
    ['haïr', 'aimer', 'détester', 'mépriser', 'exécrer'], ['opaque', 'transparent', 'sombre', 'épais', 'trouble'],
    ['vrai', 'faux', 'exact', 'juste', 'réel'], ['calme', 'agité', 'serein', 'paisible', 'tranquille'],
    ['profond', 'superficiel', 'creux', 'grave', 'intense'], ['avare', 'prodigue', 'radin', 'pingre', 'économe'],
    ['neuf', 'usé', 'récent', 'moderne', 'frais'], ['libre', 'captif', 'indépendant', 'autonome', 'affranchi'],
    ['riche', 'pauvre', 'aisé', 'fortuné', 'opulent'], ['joie', 'chagrin', 'bonheur', 'gaieté', 'allégresse'],
    ['courtois', 'grossier', 'poli', 'aimable', 'galant'], ['réel', 'imaginaire', 'concret', 'vrai', 'tangible'],
    ['aîné', 'cadet', 'premier', 'grand', 'vieux'], ['ouvrir', 'fermer', 'déverrouiller', 'entrouvrir', 'percer'],
    ['acheter', 'vendre', 'acquérir', 'payer', 'commander'], ['recevoir', 'donner', 'obtenir', 'accepter', 'percevoir'],
    ['large', 'étroit', 'ample', 'vaste', 'gros'], ['réussite', 'échec', 'succès', 'victoire', 'triomphe'],
    ['lumière', 'obscurité', 'clarté', 'éclat', 'lueur'], ['vif', 'apathique', 'rapide', 'alerte', 'éveillé'],
    ['sécher', 'mouiller', 'essuyer', 'assécher', 'durcir'], ['discret', 'voyant', 'réservé', 'sobre', 'modeste'],
    ['mépriser', 'estimer', 'dédaigner', 'dénigrer', 'ignorer'], ['compliqué', 'simple', 'complexe', 'difficile', 'ardu'],
    ['crispé', 'détendu', 'nerveux', 'tendu', 'raide'], ['progresser', 'régresser', 'avancer', 'évoluer', 'grandir'],
    ['condamner', 'acquitter', 'punir', 'juger', 'blâmer'], ['citadin', 'campagnard', 'urbain', 'habitant', 'voisin'],
    ['orgueil', 'modestie', 'fierté', 'vanité', 'arrogance'], ['conserver', 'jeter', 'garder', 'préserver', 'stocker'],
    ['souple', 'rigide', 'flexible', 'élastique', 'mou'], ['baisser', 'hausser', 'diminuer', 'réduire', 'descendre'],
    ['doux', 'rude', 'tendre', 'suave', 'moelleux'], ['désordre', 'ordre', 'chaos', 'pagaille', 'fouillis'],
    ['sommet', 'base', 'cime', 'faîte', 'pic'], ['aube', 'crépuscule', 'aurore', 'matin', 'lever'],
    ['féroce', 'doux', 'cruel', 'sauvage', 'violent'], ['naïf', 'rusé', 'crédule', 'ingénu', 'simple'],
    ['fertile', 'stérile', 'fécond', 'riche', 'productif'], ['habile', 'maladroit', 'adroit', 'doué', 'agile'],
    ['attentif', 'distrait', 'concentré', 'vigilant', 'appliqué'], ['convergent', 'divergent', 'parallèle', 'central', 'unifié'],
  ];
  const ANA2 = [
    ['Abeille', 'ruche', 'fourmi', 'fourmilière', 'colonie', 'insecte', 'terrier', 'La ruche est la maison de l’abeille, la fourmilière celle de la fourmi.'],
    ['Plume', 'oiseau', 'écaille', 'poisson', 'aile', 'mer', 'peau', 'Les plumes couvrent l’oiseau, les écailles couvrent le poisson.'],
    ['Ampoule', 'lumière', 'radiateur', 'chaleur', 'froid', 'électricité', 'maison', 'L’ampoule produit de la lumière, le radiateur de la chaleur.'],
    ['Clé', 'porte', 'code', 'coffre-fort', 'chiffre', 'banque', 'voleur', 'La clé ouvre la porte, le code ouvre le coffre-fort.'],
    ['Lait', 'fromage', 'raisin', 'vin', 'vigne', 'fruit', 'pépin', 'On fabrique le fromage avec du lait, le vin avec du raisin.'],
    ['Blé', 'farine', 'olive', 'huile', 'arbre', 'noyau', 'vert', 'Le blé donne la farine, l’olive donne l’huile.'],
    ['Matin', 'soir', 'lever', 'coucher', 'réveil', 'midi', 'dormir', 'Le matin s’oppose au soir comme le lever (du soleil) au coucher.'],
    ['Petit', 'minuscule', 'grand', 'immense', 'moyen', 'haut', 'large', 'Minuscule, c’est très petit ; immense, c’est très grand.'],
    ['Tiède', 'brûlant', 'frais', 'glacé', 'chaud', 'doux', 'humide', 'Brûlant, c’est tiède poussé à l’extrême ; glacé, c’est frais poussé à l’extrême.'],
    ['Marcher', 'courir', 'parler', 'crier', 'chuchoter', 'chanter', 'dire', 'Courir, c’est marcher plus fort ; crier, c’est parler plus fort.'],
    ['Auteur', 'roman', 'compositeur', 'symphonie', 'piano', 'orchestre', 'chef', 'L’auteur écrit un roman, le compositeur écrit une symphonie.'],
    ['Médecin', 'ordonnance', 'juge', 'verdict', 'tribunal', 'avocat', 'loi', 'Le médecin rédige une ordonnance, le juge rend un verdict.'],
    ['Abeille', 'essaim', 'poisson', 'banc', 'mer', 'nageoire', 'aquarium', 'Un groupe d’abeilles forme un essaim, un groupe de poissons forme un banc.'],
    ['Pain', 'boulangerie', 'médicament', 'pharmacie', 'médecin', 'ordonnance', 'malade', 'On achète le pain à la boulangerie, les médicaments à la pharmacie.'],
    ['Kilo', 'masse', 'litre', 'volume', 'eau', 'poids', 'mètre', 'Le kilo mesure une masse, le litre mesure un volume.'],
    ['Mètre', 'longueur', 'seconde', 'durée', 'minute', 'vitesse', 'horloge', 'Le mètre mesure une longueur, la seconde mesure une durée.'],
    ['Pomme', 'fruit', 'carotte', 'légume', 'orange', 'racine', 'jardin', 'La pomme est un fruit, la carotte est un légume.'],
    ['Golfeur', 'club', 'joueur de tennis', 'raquette', 'balle', 'filet', 'court', 'Le golfeur frappe avec un club, le joueur de tennis avec une raquette.'],
    ['Haut', 'bas', 'plafond', 'plancher', 'mur', 'toit', 'porte', 'Le haut s’oppose au bas comme le plafond au plancher.'],
    ['Chirurgien', 'scalpel', 'menuisier', 'rabot', 'bois', 'meuble', 'atelier', 'C’est l’outil du métier : le scalpel pour le chirurgien, le rabot pour le menuisier.'],
    ['Grain', 'plage', 'goutte', 'océan', 'pluie', 'eau', 'vague', 'La plage est faite de grains de sable, l’océan de gouttes d’eau.'],
    ['Brebis', 'agneau', 'chèvre', 'chevreau', 'bouc', 'lait', 'ferme', 'Le petit de la brebis est l’agneau, celui de la chèvre est le chevreau.'],
    ['Cheval', 'hennir', 'vache', 'meugler', 'brouter', 'ruminer', 'galoper', 'C’est le cri de l’animal : le cheval hennit, la vache meugle.'],
    ['Lundi', 'semaine', 'janvier', 'année', 'mois', 'hiver', 'février', 'Lundi est un jour de la semaine, janvier est un mois de l’année.'],
    ['Cercle', 'sphère', 'carré', 'cube', 'rectangle', 'losange', 'triangle', 'La sphère est le cercle en 3D, le cube est le carré en 3D.'],
    ['Avion', 'aéroport', 'bateau', 'port', 'mer', 'voile', 'capitaine', 'L’avion se pose à l’aéroport, le bateau accoste au port.'],
    ['Facteur', 'lettres', 'livreur', 'colis', 'camion', 'adresse', 'client', 'Le facteur apporte les lettres, le livreur apporte les colis.'],
    ['Œuf', 'omelette', 'pomme de terre', 'frites', 'patate', 'champ', 'sel', 'Avec des œufs on fait une omelette, avec des pommes de terre des frites.'],
    ['Rire', 'joie', 'pleurer', 'tristesse', 'larmes', 'bébé', 'colère', 'On rit de joie, on pleure de tristesse.'],
    ['Phare', 'marins', 'panneau', 'conducteurs', 'route', 'signal', 'police', 'Le phare guide les marins, le panneau guide les conducteurs.'],
    ['Boussole', 'direction', 'montre', 'heure', 'bracelet', 'aiguille', 'poignet', 'La boussole indique la direction, la montre indique l’heure.'],
    ['Lion', 'lionceau', 'ours', 'ourson', 'tanière', 'miel', 'grizzli', 'Le petit du lion est le lionceau, celui de l’ours est l’ourson.'],
    ['Ville', 'rue', 'forêt', 'sentier', 'arbre', 'clairière', 'bois', 'On circule en ville par les rues, en forêt par les sentiers.'],
    ['Ciel', 'nuage', 'mer', 'vague', 'bateau', 'sel', 'plage', 'Les nuages passent dans le ciel, les vagues sur la mer.'],
    ['Acteur', 'scène', 'boxeur', 'ring', 'gant', 'combat', 'arbitre', 'L’acteur joue sur scène, le boxeur combat sur un ring.'],
    ['Voiture', 'volant', 'vélo', 'guidon', 'pédale', 'roue', 'selle', 'On dirige la voiture avec le volant, le vélo avec le guidon.'],
    ['Larme', 'œil', 'sueur', 'peau', 'chaleur', 'effort', 'sport', 'Les larmes sortent des yeux, la sueur sort de la peau.'],
    ['Arbre', 'branche', 'main', 'doigt', 'bras', 'poignet', 'gant', 'Les branches partent de l’arbre comme les doigts partent de la main.'],
    ['Fleur', 'pétale', 'livre', 'page', 'auteur', 'lecture', 'bibliothèque', 'La fleur est faite de pétales, le livre est fait de pages.'],
    ['Poisson', 'eau', 'oiseau', 'air', 'nid', 'plume', 'arbre', 'Le poisson se déplace dans l’eau, l’oiseau dans l’air.'],
    ['Rapide', 'guépard', 'lent', 'tortue', 'lièvre', 'cheval', 'aigle', 'Le guépard est l’animal rapide par excellence, la tortue l’animal lent.'],
    ['Sucré', 'sucre', 'salé', 'sel', 'poivre', 'mer', 'vinaigre', 'Le sucre rend sucré, le sel rend salé.'],
    ['Musicien', 'partition', 'acteur', 'scénario', 'scène', 'costume', 'public', 'Le musicien suit sa partition, l’acteur suit son scénario.'],
    ['Jour', '24', 'heure', '60', '12', '24', '100', 'Un jour compte 24 heures, une heure compte 60 minutes.'],
    ['Neuf', 'vieux', 'début', 'fin', 'milieu', 'commencement', 'départ', 'Neuf s’oppose à vieux comme début s’oppose à fin.'],
    ['Bourgeon', 'fleur', 'enfant', 'adulte', 'bébé', 'école', 'jouet', 'Le bourgeon devient une fleur, l’enfant devient un adulte.'],
    ['Sculpteur', 'marbre', 'potier', 'argile', 'vase', 'tour', 'four', 'Le sculpteur travaille le marbre, le potier travaille l’argile.'],
    ['Lettre', 'enveloppe', 'cadeau', 'emballage', 'ruban', 'anniversaire', 'fête', 'On glisse la lettre dans une enveloppe, on met le cadeau dans un emballage.'],
    ['Ruche', 'miel', 'vigne', 'raisin', 'vendange', 'cep', 'tonneau', 'La ruche donne le miel, la vigne donne le raisin.'],
    ['Gauche', 'droite', 'avant', 'arrière', 'côté', 'haut', 'milieu', 'Gauche s’oppose à droite comme avant s’oppose à arrière.'],
  ];
  const INT2 = [
    [['Tulipe', 'Rose', 'Lys', 'Persil'], 3, 'Le persil est une herbe aromatique, les autres sont des fleurs.'],
    [['Rome', 'Berlin', 'Madrid', 'Barcelone'], 3, 'Barcelone n’est pas une capitale.'],
    [['Saumon', 'Truite', 'Thon', 'Crabe'], 3, 'Le crabe n’est pas un poisson.'],
    [['Vélo', 'Trottinette', 'Roller', 'Moto'], 3, 'La moto est la seule à avoir un moteur.'],
    [['Jaune', 'Rouge', 'Bleu', 'Vert'], 3, 'En peinture, jaune, rouge et bleu sont les couleurs primaires ; le vert s’obtient en mélangeant jaune et bleu.'],
    [['Diamant', 'Rubis', 'Émeraude', 'Granit'], 3, 'Le granit n’est pas une pierre précieuse.'],
    [['Lait', 'Beurre', 'Fromage', 'Œuf'], 3, 'L’œuf n’est pas un produit laitier.'],
    [['Aigle', 'Moineau', 'Hirondelle', 'Autruche'], 3, 'L’autruche ne vole pas.'],
    [['Voiture', 'Bus', 'Camion', 'Train'], 3, 'Le train roule sur des rails, les autres sur la route.'],
    [['Lyon', 'Bordeaux', 'Lille', 'Genève'], 3, 'Genève est en Suisse, les autres villes sont en France.'],
    [['Chapeau', 'Casquette', 'Béret', 'Écharpe'], 3, 'L’écharpe ne se porte pas sur la tête.'],
    [['Seine', 'Loire', 'Rhône', 'Léman'], 3, 'Le Léman est un lac, les autres sont des fleuves.'],
    [['Triangle', 'Carré', 'Pentagone', 'Cercle'], 3, 'Le cercle n’a pas de côtés droits.'],
    [['Janvier', 'Mars', 'Mai', 'Juin'], 3, 'Juin a 30 jours, les autres en ont 31.'],
    [['2', '3', '5', '9'], 3, '9 n’est pas un nombre premier (9 = 3 × 3).'],
    [['Kangourou', 'Koala', 'Wombat', 'Panda'], 3, 'Le panda n’est pas un marsupial.'],
    [['Couteau', 'Scie', 'Hache', 'Marteau'], 3, 'Le marteau ne coupe pas.'],
    [['Trompette', 'Saxophone', 'Flûte', 'Violoncelle'], 3, 'Le violoncelle est un instrument à cordes, les autres sont à vent.'],
    [['Terre', 'Mars', 'Vénus', 'Jupiter'], 3, 'Jupiter est une planète géante gazeuse, les autres sont rocheuses.'],
    [['Monet', 'Renoir', 'Degas', 'Balzac'], 3, 'Balzac était écrivain, les autres étaient peintres.'],
    [['Acier', 'Bronze', 'Laiton', 'Or'], 3, 'L’or est un métal pur, les autres sont des alliages.'],
    [['Pomme', 'Poire', 'Coing', 'Prune'], 3, 'La prune a un noyau, les autres ont des pépins.'],
    [['Hêtre', 'Chêne', 'Érable', 'Rosier'], 3, 'Le rosier est un arbuste, pas un arbre.'],
    [['Lundi', 'Mardi', 'Dimanche', 'Mercredi'], 2, 'Dimanche est un jour de week-end.'],
    [['Cœur', 'Poumon', 'Foie', 'Fémur'], 3, 'Le fémur est un os, les autres sont des organes.'],
    [['Litre', 'Millilitre', 'Centilitre', 'Kilomètre'], 3, 'Le kilomètre mesure une longueur, les autres un volume.'],
    [['Rugby', 'Football', 'Handball', 'Natation'], 3, 'La natation ne se joue pas avec un ballon.'],
    [['Croissant', 'Pain au chocolat', 'Brioche', 'Baguette'], 3, 'La baguette est du pain, pas une viennoiserie.'],
    [['Asie', 'Europe', 'Afrique', 'Groenland'], 3, 'Le Groenland est une île, pas un continent.'],
    [['Épée', 'Lance', 'Dague', 'Bouclier'], 3, 'Le bouclier sert à se protéger, pas à attaquer.'],
    [['Hier', 'Aujourd’hui', 'Demain', 'Toujours'], 3, '« Toujours » ne désigne pas un jour précis.'],
    [['Cent', 'Mille', 'Million', 'Douzaine'], 3, 'Une douzaine vaut 12 : ce n’est pas une puissance de 10.'],
    [['Abricot', 'Pêche', 'Cerise', 'Banane'], 3, 'La banane n’a pas de noyau.'],
    [['Gorille', 'Chimpanzé', 'Orang-outan', 'Kangourou'], 3, 'Le kangourou n’est pas un grand singe.'],
    [['Python', 'Cobra', 'Vipère', 'Anguille'], 3, 'L’anguille est un poisson, les autres sont des serpents.'],
    [['Printemps', 'Été', 'Hiver', 'Midi'], 3, 'Midi est un moment de la journée, pas une saison.'],
    [['Cuisine', 'Salon', 'Chambre', 'Jardin'], 3, 'Le jardin n’est pas une pièce de la maison.'],
    [['Aquarelle', 'Huile', 'Gouache', 'Marbre'], 3, 'Le marbre n’est pas une peinture.'],
    [['Chanter', 'Danser', 'Peindre', 'Dormir'], 3, 'Dormir n’est pas une activité artistique.'],
    [['Pharaon', 'Pyramide', 'Sphinx', 'Colisée'], 3, 'Le Colisée est romain, les autres évoquent l’Égypte ancienne.'],
    [['Lune', 'Soleil', 'Étoile', 'Nuage'], 3, 'Le nuage n’est pas un astre.'],
    [['Œil', 'Oreille', 'Nez', 'Cheveu'], 3, 'Le cheveu n’est pas un organe des sens.'],
    [['Mètre', 'Pied', 'Pouce', 'Gramme'], 3, 'Le gramme mesure une masse, les autres une longueur.'],
    [['Ours', 'Loup', 'Renard', 'Vache'], 3, 'La vache est un animal domestique.'],
    [['Bougie', 'Lampe', 'Lanterne', 'Couverture'], 3, 'La couverture n’éclaire pas.'],
    [['Euro', 'Livre sterling', 'Franc suisse', 'Mètre'], 3, 'Le mètre n’est pas une monnaie.'],
    [['Violet', 'Indigo', 'Orange', 'Noir'], 3, 'Le noir n’est pas une couleur de l’arc-en-ciel.'],
    [['Paris', 'Londres', 'Tokyo', 'Sydney'], 3, 'Sydney n’est pas une capitale.'],
    [['Chêne', 'Sapin', 'Bouleau', 'Champignon'], 3, 'Le champignon n’est pas un arbre.'],
    [['Ski', 'Luge', 'Patinage', 'Surf'], 3, 'Le surf ne se pratique pas sur la neige ou la glace.'],
  ];
  TESTS.verbal.questions.push(...mix([...SYN2.map(synQ), ...ANT2.map(antQ), ...ANA2.map(anaQ), ...INT2.map(intQ)]));

  // Identifiant stable de chaque question (sert à éviter les répétitions)
  Object.entries(TESTS).forEach(([cat, t]) => t.questions.forEach((q, i) => { q.id = `${cat}-${i}`; }));
})();
