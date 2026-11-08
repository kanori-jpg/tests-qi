// Catégorie « Formes incomplètes » : reconnaître un objet dont la silhouette est en partie effacée
// (exercice de « clôture perceptive », dans l'esprit des tests de Street et de Gollin).
// Silhouettes dessinées pour ce site ; aucune photo.

const FS = 'fill="none" stroke="currentColor"';
const starPts = (cx, cy, R, r, n = 5) => Array.from({ length: 2 * n }, (_, i) => {
  const a = (-90 + i * 180 / n) * Math.PI / 180, k = i % 2 ? r : R;
  return `${(cx + Math.cos(a) * k).toFixed(1)},${(cy + Math.sin(a) * k).toFixed(1)}`;
}).join(' ');
const sunRays = Array.from({ length: 8 }, (_, i) => `<rect x="46" y="6" width="8" height="18" rx="3" transform="rotate(${i * 45} 50 50)"/>`).join('');

// [nom affiché, famille de formes, dessin]
const OBJETS = {
  maison: ['une maison', 'large', '<path d="M50 12 L88 45 L80 45 L80 88 L56 88 L56 66 L44 66 L44 88 L20 88 L20 45 L12 45 Z"/><rect x="64" y="18" width="8" height="18"/>'],
  tasse: ['une tasse', 'objet', `<path d="M22 30 H70 V62 Q70 82 46 82 Q22 82 22 62 Z"/><path d="M70 38 Q88 38 88 52 Q88 66 70 66" ${FS} stroke-width="7"/><rect x="14" y="84" width="64" height="6" rx="3"/>`],
  cle: ['une clé', 'objet', `<circle cx="28" cy="50" r="15" ${FS} stroke-width="9"/><rect x="42" y="45" width="46" height="10"/><rect x="70" y="55" width="7" height="12"/><rect x="80" y="55" width="7" height="9"/>`],
  sapin: ['un sapin', 'haut', '<polygon points="50,8 70,36 62,36 78,58 66,58 84,80 16,80 34,58 22,58 38,36 30,36"/><rect x="44" y="80" width="12" height="12"/>'],
  poisson: ['un poisson', 'large', '<ellipse cx="44" cy="50" rx="30" ry="18"/><polygon points="70,50 92,30 92,70"/>'],
  etoile: ['une étoile', 'objet', `<polygon points="${starPts(50, 54, 44, 18)}"/>`],
  coeur: ['un cœur', 'rond', '<path d="M50 86 C20 64 8 46 16 30 C24 14 44 16 50 32 C56 16 76 14 84 30 C92 46 80 64 50 86 Z"/>'],
  lune: ['une lune', 'rond', '<path d="M60 12 A38 38 0 1 0 60 88 A50 50 0 0 1 60 12 Z"/>'],
  parapluie: ['un parapluie', 'rond', `<path d="M10 50 A40 40 0 0 1 90 50 Z"/><path d="M50 50 V80 Q50 90 40 90 Q32 90 32 82" ${FS} stroke-width="6"/>`],
  bouteille: ['une bouteille', 'haut', '<path d="M42 8 H58 V28 Q72 36 72 50 V88 Q72 92 68 92 H32 Q28 92 28 88 V50 Q28 36 42 28 Z"/>'],
  avion: ['un avion', 'large', '<ellipse cx="50" cy="50" rx="8" ry="40"/><polygon points="50,40 92,58 92,64 50,56 8,64 8,58"/><polygon points="50,78 66,90 66,94 50,88 34,94 34,90"/>'],
  voiture: ['une voiture', 'large', '<path d="M8 66 V54 Q8 48 16 46 L30 44 L40 30 H66 L78 44 Q92 46 92 56 V66 Z"/><circle cx="28" cy="68" r="10"/><circle cx="72" cy="68" r="10"/>'],
  champignon: ['un champignon', 'rond', '<path d="M8 50 Q10 14 50 12 Q90 14 92 50 Z"/><path d="M38 50 H62 L66 88 H34 Z"/>'],
  marteau: ['un marteau', 'objet', '<rect x="18" y="14" width="56" height="20" rx="3"/><rect x="42" y="34" width="12" height="56" rx="3"/>'],
  ciseaux: ['des ciseaux', 'objet', `<circle cx="30" cy="76" r="12" ${FS} stroke-width="6"/><circle cx="70" cy="76" r="12" ${FS} stroke-width="6"/><polygon points="36,66 46,60 72,8 64,8"/><polygon points="64,66 54,60 28,8 36,8"/>`],
  ampoule: ['une ampoule', 'rond', '<circle cx="50" cy="38" r="28"/><rect x="38" y="62" width="24" height="10"/><rect x="40" y="74" width="20" height="5"/><rect x="42" y="81" width="16" height="6" rx="3"/>'],
  cloche: ['une cloche', 'haut', '<path d="M50 10 Q70 12 72 40 Q74 62 88 74 H12 Q26 62 28 40 Q30 12 50 10 Z"/><circle cx="50" cy="82" r="8"/>'],
  chat: ['une tête de chat', 'rond', '<circle cx="50" cy="56" r="32"/><polygon points="22,42 22,8 46,28"/><polygon points="78,42 78,8 54,28"/>'],
  voilier: ['un voilier', 'large', '<path d="M10 70 H90 L78 88 H22 Z"/><rect x="48" y="10" width="4" height="60"/><polygon points="54,12 54,66 84,66"/><polygon points="46,20 46,66 20,66"/>'],
  lunettes: ['des lunettes', 'large', `<circle cx="28" cy="52" r="16" ${FS} stroke-width="7"/><circle cx="72" cy="52" r="16" ${FS} stroke-width="7"/><path d="M44 50 Q50 44 56 50" ${FS} stroke-width="5"/><path d="M12 50 L4 40 M88 50 L96 40" ${FS} stroke-width="5"/>`],
  fleche: ['une flèche', 'large', '<polygon points="8,42 60,42 60,24 92,50 60,76 60,58 8,58"/>'],
  eclair: ['un éclair', 'haut', '<polygon points="58,6 22,54 46,54 36,94 78,40 54,40 66,6"/>'],
  verre: ['un verre à pied', 'haut', '<path d="M24 10 H76 Q76 46 54 52 V82 H70 V90 H30 V82 H46 V52 Q24 46 24 10 Z"/>'],
  pomme: ['une pomme', 'rond', '<path d="M50 30 C34 18 10 26 12 52 C14 76 34 92 50 84 C66 92 86 76 88 52 C90 26 66 18 50 30 Z"/><rect x="48" y="12" width="5" height="18" rx="2"/><path d="M54 22 Q66 8 78 14 Q68 26 54 22 Z"/>'],
  note: ['une note de musique', 'haut', '<ellipse cx="34" cy="76" rx="16" ry="11" transform="rotate(-20 34 76)"/><rect x="46" y="12" width="6" height="64"/><path d="M52 12 Q76 22 74 44 Q68 30 52 30 Z"/>'],
  cadenas: ['un cadenas', 'objet', `<path d="M30 46 V32 A20 20 0 0 1 70 32 V46" ${FS} stroke-width="9"/><rect x="20" y="44" width="60" height="46" rx="6"/>`],
  fusee: ['une fusée', 'haut', '<path d="M50 6 Q68 24 66 60 H34 Q32 24 50 6 Z"/><polygon points="34,48 18,76 34,70"/><polygon points="66,48 82,76 66,70"/><polygon points="40,62 60,62 56,80 44,80"/>'],
  sablier: ['un sablier', 'haut', '<polygon points="22,8 78,8 78,14 54,50 78,86 78,92 22,92 22,86 46,50 22,14"/>'],
  feuille: ['une feuille', 'haut', '<path d="M50 8 Q86 30 74 66 Q64 86 52 90 L52 96 L48 96 L48 90 Q36 86 26 66 Q14 30 50 8 Z"/>'],
  couronne: ['une couronne', 'objet', '<polygon points="12,78 12,28 32,52 50,20 68,52 88,28 88,78"/><rect x="12" y="80" width="76" height="10"/>'],
  guitare: ['une guitare', 'haut', '<circle cx="50" cy="72" r="22"/><circle cx="50" cy="44" r="15"/><rect x="46" y="6" width="8" height="40"/><rect x="42" y="4" width="16" height="8" rx="2"/>'],
  nuage: ['un nuage', 'rond', '<circle cx="30" cy="58" r="18"/><circle cx="52" cy="44" r="22"/><circle cx="72" cy="58" r="18"/><rect x="30" y="56" width="42" height="20"/>'],
  soleil: ['un soleil', 'rond', `<circle cx="50" cy="50" r="22"/>${sunRays}`],
  bougie: ['une bougie', 'haut', '<rect x="38" y="40" width="24" height="52" rx="2"/><path d="M50 8 Q62 24 56 32 Q50 38 44 32 Q38 24 50 8 Z"/>'],
  chaise: ['une chaise', 'objet', '<rect x="24" y="8" width="8" height="84"/><rect x="24" y="50" width="52" height="8"/><rect x="68" y="58" width="8" height="34"/><rect x="32" y="14" width="18" height="6"/><rect x="32" y="28" width="18" height="6"/>'],
  ancre: ['une ancre', 'haut', `<circle cx="50" cy="16" r="8" ${FS} stroke-width="5"/><rect x="47" y="24" width="6" height="62"/><rect x="34" y="32" width="32" height="6"/><path d="M16 60 Q20 90 50 90 Q80 90 84 60" ${FS} stroke-width="7"/>`],
};

let fragUid = 0;
// f = { obj, holes: [[x, y, rx, ry, angle]], noise: [[x, y, rx, ry, angle]], mirror }
function fragSVG(f, full) {
  const id = `fg${++fragUid}`, shape = OBJETS[f.obj][2];
  const flip = f.mirror ? ' transform="translate(100 0) scale(-1 1)"' : '';
  const ell = ([x, y, rx, ry, a], fill) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${a} ${x} ${y})" fill="${fill}"/>`;
  const body = full
    ? `<g fill="#1e2433" color="#1e2433"${flip}>${shape}</g>`
    : `<defs><mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="white"/>${f.holes.map(h => ell(h, 'black')).join('')}</mask></defs>
       <g mask="url(#${id})"><g fill="#1e2433" color="#1e2433"${flip}>${shape}</g></g>${f.noise.map(n => ell(n, '#1e2433')).join('')}`;
  return `<svg viewBox="0 0 100 100" class="frag-svg" aria-hidden="true"><rect width="100" height="100" fill="#fff"/>${body}</svg>`;
}

(function () {
  let seed = 5150;
  const R = () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const rf = (a, b) => Math.round((a + R() * (b - a)) * 10) / 10;
  const pick = a => a[Math.floor(R() * a.length)];
  const mix = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const names = Object.keys(OBJETS);
  // Part de la silhouette qui reste visible : de 62 à 75 % (facile), 50 à 62 % (moyen), 40 à 50 % (difficile)
  const LEVELS = [
    { name: 'facile', keep: [0.62, 0.75], r: [4, 8], noise: 0 },
    { name: 'moyen', keep: [0.5, 0.62], r: [5, 10], noise: 4 },
    { name: 'difficile', keep: [0.4, 0.5], r: [6, 12], noise: 9 },
  ];
  // Points « encrés » de chaque silhouette, mesurés une fois sur une grille (le navigateur fait le test géométrique)
  const INK = {};
  function inkPoints(obj) {
    if (INK[obj]) return INK[obj];
    const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.cssText = 'position:absolute;left:-9999px;top:0;width:100px;height:100px';
    svg.innerHTML = `<g fill="#000" color="#000">${OBJETS[obj][2]}</g>`;
    document.body.appendChild(svg);
    const els = [...svg.querySelectorAll('circle,rect,ellipse,polygon,path')].map(el => {
      const m = el.transform.baseVal.consolidate();
      return { el, inv: m ? m.matrix.inverse() : null, fill: el.getAttribute('fill') !== 'none', stroke: el.hasAttribute('stroke') };
    });
    const pts = [];
    for (let x = 1.5; x < 100; x += 3) for (let y = 1.5; y < 100; y += 3) {
      for (const { el, inv, fill, stroke } of els) {
        let p = svg.createSVGPoint(); p.x = x; p.y = y;
        if (inv) p = p.matrixTransform(inv);
        if ((fill && el.isPointInFill(p)) || (stroke && el.isPointInStroke(p))) { pts.push([x, y]); break; }
      }
    }
    svg.remove();
    return (INK[obj] = pts);
  }
  const inHole = (x, y) => ([hx, hy, rx, ry, a]) => {
    const t = -a * Math.PI / 180, dx = x - hx, dy = y - hy;
    const u = dx * Math.cos(t) - dy * Math.sin(t), v = dx * Math.sin(t) + dy * Math.cos(t);
    return (u / rx) ** 2 + (v / ry) ** 2 <= 1;
  };
  const blob = ([a, b]) => [rf(4, 96), rf(4, 96), rf(a, b), rf(a, b), Math.round(R() * 180)];

  function item(k) {
    const obj = names[k % names.length], L = LEVELS[Math.floor(k / names.length) % 3];
    const all = inkPoints(obj), mirror = R() < 0.3;
    // On efface petit à petit : on garde la liste des points encore visibles, et on refuse un trou
    // qui ferait passer sous le minimum du niveau.
    let visible = all.map(([x, y]) => [mirror ? 100 - x : x, y]);
    const holes = [];
    for (let tries = 0; visible.length / all.length > L.keep[1] && tries < 500; tries++) {
      const h = blob(L.r), rest = visible.filter(([x, y]) => !inHole(x, y)(h));
      if (rest.length / all.length >= L.keep[0]) { holes.push(h); visible = rest; }
    }
    const noise = Array.from({ length: L.noise }, () => blob([1.5, 3.5]));
    const frag = { obj, holes, noise, mirror };
    const fam = OBJETS[obj][1];
    const same = mix(names.filter(n => n !== obj && OBJETS[n][1] === fam)).slice(0, 2);
    const other = mix(names.filter(n => n !== obj && !same.includes(n))).slice(0, 3 - same.length);
    return { q: 'Une partie de cette image a été effacée. Quel objet représente-t-elle ?', frag,
      options: [obj, ...same, ...other].map(n => cap(OBJETS[n][0])), answer: 0,
      explain: `C’était ${OBJETS[obj][0]} (niveau ${L.name}). L’image complète est affichée ci-dessus : le cerveau sait « compléter » une forme à partir de quelques morceaux.` };
  }
  const cap = s => s[0].toUpperCase() + s.slice(1);

  // 400 questions : chaque objet, à chaque niveau, avec des effacements différents
  const qs = [];
  for (let k = 0; qs.length < 400; k++) qs.push(item(k));
  TESTS.formes = { title: 'Formes incomplètes', icon: '🔍', color: '#475569',
    desc: 'Reconnais un objet dont une partie de l’image a été effacée.', questions: mix(qs) };
})();
