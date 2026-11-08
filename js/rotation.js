// 7e catégorie : rotation 3D (questions originales, dans l'esprit des tests de rotation mentale).
// Chaque face d'un cube porte un symbole différent. Les symboles sont symétriques par quart de tour :
// seule compte leur position sur le cube, pas leur orientation sur la face.
// Les bonnes réponses et les pièges sont vérifiés par le calcul des 24 orientations possibles du cube.

/* ------------------------- Dessin ------------------------- */
const CUBE_INK = '#2f3a56';
const SYM_NAMES = {
  disc: 'le rond plein', ring: 'le cercle', square: 'le carré', plus: 'la croix +',
  cross: 'la croix ×', dots: 'les quatre points', diamond: 'le losange', target: 'la cible',
};

// Symbole dessiné dans un carré de -1 à 1
function symUnit(s) {
  const st = `stroke="${CUBE_INK}" vector-effect="non-scaling-stroke" fill="none"`;
  switch (s) {
    case 'disc': return `<circle r=".45" fill="${CUBE_INK}"/>`;
    case 'ring': return `<circle r=".5" ${st} stroke-width="2.5"/>`;
    case 'square': return `<rect x="-.42" y="-.42" width=".84" height=".84" fill="${CUBE_INK}"/>`;
    case 'plus': return `<path d="M-.6 0H.6M0 -.6V.6" ${st} stroke-width="3.5"/>`;
    case 'cross': return `<path d="M-.45 -.45L.45 .45M.45 -.45L-.45 .45" ${st} stroke-width="3.5"/>`;
    case 'dots': return [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, y]) => `<circle cx="${x * 0.4}" cy="${y * 0.4}" r=".16" fill="${CUBE_INK}"/>`).join('');
    case 'diamond': return `<polygon points="0,-.62 .62,0 0,.62 -.62,0" fill="${CUBE_INK}"/>`;
    case 'target': return `<circle r=".56" ${st} stroke-width="2.5"/><circle r=".2" fill="${CUBE_INK}"/>`;
  }
  return '';
}

// Cube vu en perspective : [dessus, devant (à gauche), droite]
const CUBE_FACES = [
  { pts: '50,8 88,28 50,48 12,28', m: '19 -10 19 10 50 28', fill: '#eef1f8' },
  { pts: '12,28 50,48 50,92 12,72', m: '19 10 0 22 31 60', fill: '#dce1ee' },
  { pts: '50,48 88,28 88,72 50,92', m: '19 -10 0 22 69 60', fill: '#c6cddf' },
];
function cubeSVG(view) {
  return `<svg viewBox="0 0 100 100" class="cell-svg" aria-hidden="true">${CUBE_FACES.map((f, i) =>
    `<polygon points="${f.pts}" fill="${f.fill}" stroke="${CUBE_INK}" stroke-width="2" stroke-linejoin="round"/>
     <g transform="matrix(${f.m})">${symUnit(view[i])}</g>`).join('')}</svg>`;
}
function symbolSVG(s, cls = 'cell-svg') {
  return `<svg viewBox="-1.2 -1.2 2.4 2.4" class="${cls}" aria-hidden="true">${symUnit(s)}</svg>`;
}

// Patrons (dépliages) : position [colonne, ligne] de chaque face
const NET_LAYOUTS = [
  { w: 4, h: 3, cells: { U: [1, 0], L: [0, 1], F: [1, 1], R: [2, 1], B: [3, 1], D: [1, 2] } },
  { w: 3, h: 4, cells: { U: [1, 0], L: [0, 1], F: [1, 1], R: [2, 1], D: [1, 2], B: [1, 3] } },
];
function netSVG(state, layout) {
  const L = NET_LAYOUTS[layout], S = 30;
  const cells = Object.entries(L.cells).map(([face, [x, y]]) =>
    `<rect x="${x * S}" y="${y * S}" width="${S}" height="${S}" fill="#eef1f8" stroke="${CUBE_INK}" stroke-width="1.5"/>
     <g transform="translate(${x * S + S / 2} ${y * S + S / 2}) scale(${S * 0.42})">${symUnit(state[face])}</g>`).join('');
  return `<svg viewBox="-2 -2 ${L.w * S + 4} ${L.h * S + 4}" class="net-svg" aria-hidden="true">${cells}</svg>`;
}

// Figure affichée au-dessus des réponses
function cubeFigure(q) {
  if (q.views) {
    return `<div class="figure">${q.views.map((v, i) =>
      `<div class="fig-item">${cubeSVG(v)}<span>Vue ${i + 1}</span></div>`).join('')}</div>`;
  }
  if (q.net) return `<div class="figure"><div class="fig-net">${netSVG(q.net.state, q.net.layout)}</div></div>`;
  return '';
}

/* ------------------------- Génération ------------------------- */
(function () {
  const TARGET = 400; // les 200 premières sont inchangées : la génération continue simplement plus loin
  let seed = 4242;
  const R = () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const pick = a => a[Math.floor(R() * a.length)];
  const mix = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const SYMS = Object.keys(SYM_NAMES);

  // Rotations du cube (positions : Up, Down, Front, Back, Left, Right)
  const rotY = s => ({ U: s.U, D: s.D, F: s.R, R: s.B, B: s.L, L: s.F });
  const rotX = s => ({ U: s.F, F: s.D, D: s.B, B: s.U, L: s.L, R: s.R });
  function orientations(s) {
    const seen = new Map(), todo = [s];
    while (todo.length) {
      const x = todo.shift(), k = JSON.stringify(x);
      if (!seen.has(k)) { seen.set(k, x); todo.push(rotY(x), rotX(x)); }
    }
    return [...seen.values()]; // 24 orientations
  }
  const view = s => [s.U, s.F, s.R];
  const key = v => v.join(',');

  function newCube() {
    const [U, D, F, B, L, R] = mix(SYMS).slice(0, 6);
    const st = { U, D, F, B, L, R };
    const opp = { [U]: D, [D]: U, [F]: B, [B]: F, [L]: R, [R]: L };
    const views = orientations(st).map(view);
    return { st, opp, views, valid: new Set(views.map(key)) };
  }

  // Bonne réponse + 3 vues impossibles (image miroir, ou deux faces opposées visibles ensemble)
  function cubeOptions(cube, exclude) {
    const ans = pick(cube.views.filter(v => !exclude.includes(key(v))));
    const [a, b, c] = ans;
    const wrong = [[a, c, b], pick(cube.views.map(([x, y, z]) => [y, x, z])), [a, b, cube.opp[a]], [cube.opp[b], b, c]];
    const out = [ans], ks = new Set([key(ans)]);
    for (const w of mix(wrong)) {
      if (out.length < 4 && !cube.valid.has(key(w)) && !ks.has(key(w)) && new Set(w).size === 3) { ks.add(key(w)); out.push(w); }
    }
    for (const w of mix(cube.views.map(([x, y, z]) => [x, z, y]))) {
      if (out.length < 4 && !ks.has(key(w))) { ks.add(key(w)); out.push(w); }
    }
    return { options: out, answer: 0, ans };
  }

  const oppText = cube => {
    const { U, D, F, B, L, R } = cube.st;
    // « de le carré » → « du carré », « de les quatre points » → « des quatre points »
    const de = s => (s.startsWith('le ') ? 'du ' + s.slice(3) : s.startsWith('les ') ? 'des ' + s.slice(4) : 'de ' + s);
    return `${SYM_NAMES[U]} est à l’opposé ${de(SYM_NAMES[D])}, ${SYM_NAMES[F]} ${de(SYM_NAMES[B])}, et ${SYM_NAMES[L]} ${de(SYM_NAMES[R])}`;
  };
  const why = 'Les autres vues sont impossibles : soit elles montrent côte à côte deux faces qui sont opposées, soit les trois faces y tournent dans le mauvais sens (c’est l’image du cube dans un miroir).';

  // Les 24 orientations exprimées en positions : pour chacune, quelles positions d'origine se retrouvent en haut / devant / à droite
  const POS = ['U', 'D', 'F', 'B', 'L', 'R'];
  const ORIENT = orientations(Object.fromEntries(POS.map(p => [p, p]))).map(view);
  const viewsOf = st => new Set(ORIENT.map(([a, b, c]) => key([st[a], st[b], st[c]])));
  const P3 = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];

  // Tous les cubes compatibles avec les vues montrées (la 6e face, jamais vue, reste inconnue).
  // On peut toujours tourner le cube pour placer la 1re vue en haut / devant / à droite :
  // il ne reste qu'à répartir les 3 autres symboles sur les faces cachées (6 possibilités).
  function compatible(known, shown) {
    const [u, f, r] = shown[0], rest = [...known.filter(s => !shown[0].includes(s)), '?'], out = [];
    for (const p of P3) {
      const V = viewsOf({ U: u, F: f, R: r, D: rest[p[0]], B: rest[p[1]], L: rest[p[2]] });
      if (shown.every(v => V.has(key(v)))) out.push(V);
    }
    return out;
  }

  const makers = [
    () => { // deux vues du même cube → quelle autre vue ?
      const cube = newCube();
      const v1 = view(cube.st);
      const v2 = pick(cube.views.filter(v => v.filter(s => v1.includes(s)).length === 1));
      const known = [...new Set([...v1, ...v2])];
      const Vs = compatible(known, [v1, v2]);
      const inAll = t => Vs.every(V => V.has(key(t))), inNone = t => Vs.every(V => !V.has(key(t)));
      const answers = cube.views.filter(v => v.every(s => known.includes(s)) && key(v) !== key(v1) && key(v) !== key(v2) && inAll(v));
      if (!answers.length) return null;
      const ans = pick(answers);
      const triples = [];
      for (const a of known) for (const b of known) for (const c of known) if (a !== b && b !== c && a !== c) triples.push([a, b, c]);
      const close = t => t.filter((s, i) => s === ans[i]).length + t.filter(s => ans.includes(s)).length;
      const wrong = mix(triples.filter(inNone)).sort((x, y) => close(y) - close(x)).slice(0, 6);
      const options = [ans, ...mix(wrong).slice(0, 3)];
      const shared = v1.find(s => v2.includes(s));
      return { q: 'Voici deux vues du même cube : chaque face porte un symbole différent. Quelle autre vue peut être ce même cube ?',
        views: [v1, v2], cube: true, options, answer: 0,
        explain: `Les deux vues ont ${SYM_NAMES[shared]} en commun : en les combinant, on retrouve la place de 5 faces. La bonne réponse montre ${SYM_NAMES[ans[0]]} en haut, ${SYM_NAMES[ans[1]]} à gauche et ${SYM_NAMES[ans[2]]} à droite : c’est la seule compatible avec les deux vues. ${why}` };
    },
    () => { // patron → quel cube ?
      const cube = newCube(), layout = Math.floor(R() * NET_LAYOUTS.length);
      const o = cubeOptions(cube, []);
      return { q: 'On plie ce patron pour former un cube. Quel cube peut-on obtenir ?',
        net: { state: cube.st, layout }, cube: true, options: o.options, answer: 0,
        explain: `Une fois plié, ${oppText(cube)}. Astuce : sur une même rangée du patron, deux cases séparées par une case se retrouvent toujours face à face. ${why}` };
    },
    () => { // patron → face opposée
      const cube = newCube(), layout = Math.floor(R() * NET_LAYOUTS.length);
      const x = pick(SYMS.filter(s => cube.opp[s])), ans = cube.opp[x];
      const others = mix(Object.keys(cube.opp).filter(s => s !== x && s !== ans)).slice(0, 3);
      return { q: `On plie ce patron pour former un cube. Quel symbole se retrouve sur la face opposée à ${symbolSVG(x, 'inline-sym')} ?`,
        net: { state: cube.st, layout }, cube: true, options: [ans, ...others], answer: 0,
        explain: `Une fois plié, ${SYM_NAMES[x]} et ${SYM_NAMES[ans]} se retrouvent face à face. Astuce : sur une même rangée du patron, deux cases séparées par une case sont toujours opposées.` };
    },
  ];
  const weights = [0, 0, 1, 1, 2]; // 2/5 deux vues, 2/5 patron → cube, 1/5 face opposée

  const qs = [], seen = new Set();
  for (let g = 0; qs.length < TARGET && g < 20000; g++) {
    const q = makers[weights[g % weights.length]]();
    const k = JSON.stringify([q.q, q.views, q.net, q.options[0]]);
    if (q.options.length < 4 || seen.has(k)) continue;
    seen.add(k);
    qs.push(q);
  }

  TESTS.rotation = {
    title: 'Rotation 3D',
    icon: '🧊',
    color: '#2a8fbf',
    desc: 'Fais tourner des cubes dans ta tête et plie des patrons.',
    questions: qs,
  };
})();
