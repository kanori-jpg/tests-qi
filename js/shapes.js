// Dessin SVG des cases des matrices visuelles.
const INK = '#2f3a56';
let svgUid = 0;

// Positions des formes selon leur nombre (repère 100 × 100) et rayon associé
const LAYOUTS = {
  1: { r: 28, pts: [[50, 50]] },
  2: { r: 18, pts: [[28, 50], [72, 50]] },
  3: { r: 15, pts: [[50, 27], [27, 72], [73, 72]] },
  4: { r: 14, pts: [[30, 30], [70, 30], [30, 70], [70, 70]] },
  5: { r: 11, pts: [[24, 24], [76, 24], [50, 50], [24, 76], [76, 76]] },
  6: { r: 11, pts: [[22, 32], [50, 32], [78, 32], [22, 68], [50, 68], [78, 68]] },
};
const SIZES = { s: 0.55, m: 0.82, l: 1.12 };

const poly = (pts, cx, cy, r) =>
  pts.map(([x, y]) => `${(cx + x * r).toFixed(1)},${(cy + y * r).toFixed(1)}`).join(' ');

function shapeEl(shape, cx, cy, r, paint, rot) {
  const attrs = `${paint} transform="rotate(${rot} ${cx} ${cy})"`;
  switch (shape) {
    case 'circle':
      return `<circle cx="${cx}" cy="${cy}" r="${r * 0.9}" ${attrs}/>`;
    case 'square':
      return `<rect x="${cx - r * 0.8}" y="${cy - r * 0.8}" width="${r * 1.6}" height="${r * 1.6}" rx="2" ${attrs}/>`;
    case 'triangle':
      return `<polygon points="${poly([[0, -1], [0.95, 0.75], [-0.95, 0.75]], cx, cy, r)}" ${attrs}/>`;
    case 'diamond':
      return `<polygon points="${poly([[0, -1], [0.75, 0], [0, 1], [-0.75, 0]], cx, cy, r)}" ${attrs}/>`;
    case 'star': {
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const a = (-90 + i * 36) * Math.PI / 180;
        const k = i % 2 ? 0.45 : 1;
        pts.push([Math.cos(a) * k, Math.sin(a) * k]);
      }
      return `<polygon points="${poly(pts, cx, cy, r)}" ${attrs}/>`;
    }
    case 'arrow':
      return `<polygon points="${poly([[0, -1], [0.72, -0.15], [0.26, -0.15], [0.26, 1], [-0.26, 1], [-0.26, -0.15], [-0.72, -0.15]], cx, cy, r)}" ${attrs}/>`;
  }
  return '';
}

// Renvoie le SVG d'une case { s, n, f, r, z }
function cellSVG(cell) {
  const id = `st${++svgUid}`;
  const layout = LAYOUTS[cell.n] || LAYOUTS[1];
  const r = layout.r * (cell.n === 1 ? SIZES[cell.z] / SIZES.m : 1);
  const fill = cell.f === 'full' ? INK : cell.f === 'striped' ? `url(#${id})` : '#fff';
  const paint = `fill="${fill}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"`;
  const shapes = layout.pts.map(([x, y]) => shapeEl(cell.s, x, y, r, paint, cell.r)).join('');
  return `<svg viewBox="0 0 100 100" class="cell-svg" aria-hidden="true">
    <defs><pattern id="${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="7" height="7" fill="#fff"/><line x1="0" y1="0" x2="0" y2="7" stroke="${INK}" stroke-width="3.5"/>
    </pattern></defs>${shapes}</svg>`;
}

// Grille 3 × 3 dont la dernière case est inconnue
function gridHTML(cells, small = false) {
  const items = cells.map(cell => `<div class="m-cell">${cellSVG(cell)}</div>`).join('');
  return `<div class="matrix${small ? ' small' : ''}">${items}<div class="m-cell missing">?</div></div>`;
}
