// Catégorie « Cubes orientés » : rotation 3D au format décrit par l'ICAR (Condon & Revelle, 2014) :
// une seule vue d'un cube X, des images ORIENTÉES sur les faces, et 6 propositions dont une seule
// peut être une rotation de X. Cubes générés ici ; la réponse est vérifiée par calcul en 3D.

// Images non symétriques : leur sens compte. Dessinées dans un carré de -1 à 1, « haut » = y négatif.
const GLYPHS = {
  fleche: s => `<polygon points="0,-.68 .48,-.1 .16,-.1 .16,.62 -.16,.62 -.16,-.1 -.48,-.1" fill="${s}"/>`,
  equerre: s => `<path d="M-.42 -.62 V.48 H.5" fill="none" stroke="${s}" stroke-width="3.5" vector-effect="non-scaling-stroke"/>`,
  te: s => `<path d="M-.55 -.5 H.55 M0 -.5 V.62" fill="none" stroke="${s}" stroke-width="3.5" vector-effect="non-scaling-stroke"/>`,
  moitie: s => `<rect x="-.5" y="-.5" width="1" height="1" fill="none" stroke="${s}" stroke-width="2" vector-effect="non-scaling-stroke"/><rect x="-.5" y="-.5" width="1" height=".5" fill="${s}"/>`,
  coin: s => `<polygon points="-.58,-.58 .4,-.58 -.58,.4" fill="${s}"/>`,
  point: s => `<circle r=".55" fill="none" stroke="${s}" stroke-width="2" vector-effect="non-scaling-stroke"/><circle cy="-.3" r=".17" fill="${s}"/>`,
  drapeau: s => `<path d="M-.38 -.62 V.62" fill="none" stroke="${s}" stroke-width="3" vector-effect="non-scaling-stroke"/><polygon points="-.38,-.62 .5,-.36 -.38,-.1" fill="${s}"/>`,
  coupe: s => `<path d="M-.45 -.52 V.42 H.45 V-.52" fill="none" stroke="${s}" stroke-width="3.5" vector-effect="non-scaling-stroke"/>`,
};

// Vue orientée : [{ g: image, r: angle en degrés }] pour [dessus, devant (gauche), droite]
function orientedCubeSVG(view) {
  return `<svg viewBox="0 0 100 100" class="cell-svg" aria-hidden="true">${CUBE_FACES.map((f, i) =>
    `<polygon points="${f.pts}" fill="${f.fill}" stroke="${CUBE_INK}" stroke-width="2" stroke-linejoin="round"/>
     <g transform="matrix(${f.m})"><g transform="rotate(${view[i].r})">${GLYPHS[view[i].g](CUBE_INK)}</g></g>`).join('')}</svg>`;
}
function orientedFigure(q) {
  return `<div class="figure"><div class="fig-item">${orientedCubeSVG(q.target)}<span>Cube X</span></div></div>`;
}

(function () {
  let seed = 2014;
  const R = () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const pick = a => a[Math.floor(R() * a.length)];
  const mix = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  // --- Géométrie : vecteurs entiers, 24 rotations du cube ---
  const eq = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const mul = (M, v) => M.map(r => dot(r, v));
  const ROTS = [];
  for (const p of [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]) for (let s = 0; s < 8; s++) {
    const M = [0, 1, 2].map(i => { const r = [0, 0, 0]; r[p[i]] = (s >> i) & 1 ? -1 : 1; return r; });
    const det = M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
    if (det === 1) ROTS.push(M);
  }
  const AXES = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  // Positions visibles : normale, et directions 3D des axes x et y du dessin de la face (cf. CUBE_FACES)
  const POS = [
    { n: [0, 1, 0], ex: [0, 0, -1], ey: [1, 0, 0] },  // dessus
    { n: [0, 0, 1], ex: [1, 0, 0], ey: [0, -1, 0] },  // devant (à gauche)
    { n: [1, 0, 0], ex: [0, 0, -1], ey: [0, -1, 0] }, // droite
  ];
  // angle de l'image (0/90/180/270, sens horaire à l'écran) ↔ direction 3D du « haut » de l'image
  const UPS = { 0: [0, -1], 90: [1, 0], 180: [0, 1], 270: [-1, 0] };
  const angleOf = (pos, u) => { const l = [dot(u, pos.ex), dot(u, pos.ey)]; return +Object.keys(UPS).find(a => UPS[a][0] === l[0] && UPS[a][1] === l[1]); };
  const upOf = (pos, a) => { const [x, y] = UPS[a]; return [0, 1, 2].map(i => x * pos.ex[i] + y * pos.ey[i]); };

  // Cube : 6 faces { g, n, u }
  const viewOf = faces => POS.map(pos => { const f = faces.find(x => eq(x.n, pos.n)); return { g: f.g, r: angleOf(pos, f.u) }; });
  const rotate = (faces, M) => faces.map(f => ({ g: f.g, n: mul(M, f.n), u: mul(M, f.u) }));
  const vkey = v => v.map(x => x.g + x.r).join('|');

  // Une vue est-elle possible pour un cube dont on ne connaît que la vue X ? (les faces cachées peuvent porter
  // n'importe quelle autre image, dans n'importe quel sens, mais jamais une image déjà visible sur X)
  function possible(target, view) {
    if (new Set(view.map(x => x.g)).size !== 3) return false;
    const known = target.map((t, i) => ({ g: t.g, n: POS[i].n, u: upOf(POS[i], t.r) }));
    const knownG = new Set(target.map(t => t.g));
    return ROTS.some(M => POS.every((pos, i) => {
      const src = known.find(k => eq(mul(M, k.n), pos.n));
      if (!src) return !knownG.has(view[i].g);
      return src.g === view[i].g && eq(mul(M, src.u), upOf(pos, view[i].r));
    }));
  }

  function item() {
    const gl = mix(Object.keys(GLYPHS)).slice(0, 6);
    const faces = AXES.map((n, i) => ({ g: gl[i], n, u: pick(AXES.filter(a => dot(a, n) === 0)) }));
    const X = rotate(faces, pick(ROTS)), target = viewOf(X);
    const xg = new Set(target.map(t => t.g));
    const views = ROTS.map(M => viewOf(rotate(X, M)));
    // bonne réponse : une autre vue du même cube, qui montre au moins 2 faces visibles sur X (vérifiable)
    const good = mix(views.filter(v => vkey(v) !== vkey(target) && v.filter(x => xg.has(x.g)).length >= 2));
    if (!good.length) return null;
    const ans = good[0];
    // pièges : une image tournée dans le mauvais sens, deux faces échangées, une image en double…
    const traps = [];
    for (const v of [ans, ...good.slice(1, 4), target]) {
      v.forEach((x, i) => [90, 180, 270].forEach(d => { const w = v.map(y => ({ ...y })); w[i].r = (x.r + d) % 360; traps.push(w); }));
      [[0, 1], [1, 2], [0, 2]].forEach(([a, b]) => { const w = v.map(y => ({ ...y })); [w[a], w[b]] = [w[b], w[a]]; traps.push(w); });
    }
    const out = [ans], ks = new Set([vkey(ans)]);
    for (const t of mix(traps)) {
      if (out.length < 6 && !ks.has(vkey(t)) && !possible(target, t)) { ks.add(vkey(t)); out.push(t); }
    }
    if (out.length < 6) return null;
    return {
      q: 'Toutes les faces de ces cubes portent une image différente. Laquelle des vues proposées peut être le cube X après une rotation ? Attention au sens des images.',
      target, ocube: true, options: out, answer: 0,
      explain: 'La bonne réponse est le cube X vu sous un autre angle : chaque image reste à côté des mêmes voisines, et garde le même sens par rapport à elles. Dans les autres propositions, une image est tournée dans le mauvais sens, ou deux faces sont inversées : aucune rotation ne peut donner ça. (Format des items de rotation 3D de l’ICAR, Condon & Revelle, 2014.)',
    };
  }

  const qs = [], seen = new Set();
  for (let g = 0; qs.length < 400 && g < 20000; g++) {
    const q = item();
    if (!q) continue;
    const k = vkey(q.target) + '#' + vkey(q.options[0]);
    if (seen.has(k)) continue;
    seen.add(k); qs.push(q);
  }
  TESTS.cubesx = { title: 'Cubes orientés', icon: '🎲', color: '#1d6fa5',
    desc: 'Une seule vue du cube X, des images qui ont un sens : quelle vue peut être X après rotation ?', questions: qs };
})();
