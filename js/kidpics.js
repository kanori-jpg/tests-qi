// Dessins pour les explications « Développe » : chaque image est calculée à partir des données de la question
// (angle de la flèche, jours de la semaine, fractions, suite de nombres, mélodie…), pour illustrer l'explication simple.
const kidPics = (function () {
  const K = { ink: '#3b3552', blue: '#4f7fd9', red: '#e05a6a', green: '#2f9e64', yellow: '#ffd166', orange: '#f29f4b', grey: '#b9b4c7', soft: '#eef0fb', pink: '#f7c6d6' };
  const strip = s => String(s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const r1 = n => Math.round(n * 10) / 10;
  const svg = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-hidden="true" font-family="inherit">${body}</svg>`;
  const fig = (pic, cap) => `<figure class="kid-pic">${pic}${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
  const text = (x, y, s, o = {}) => `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${o.a || 'middle'}" font-size="${o.s || 13}" font-weight="${o.w || 700}" fill="${o.c || K.ink}" dominant-baseline="middle">${esc(s)}</text>`;
  // Pointe de flèche : (x, y) = base, (ux, uy) = direction
  const head = (x, y, ux, uy, s, c) => `<polygon points="${r1(x + ux * s)},${r1(y + uy * s)} ${r1(x - uy * s * .65)},${r1(y + ux * s * .65)} ${r1(x + uy * s * .65)},${r1(y - ux * s * .65)}" fill="${c}"/>`;
  // Arc de cercle avec pointe (angles en degrés, 0 = en haut, sens des aiguilles positif)
  const P = (cx, cy, r, a) => [cx + r * Math.sin(a * Math.PI / 180), cy - r * Math.cos(a * Math.PI / 180)];
  function arc(cx, cy, r, a0, a1, c, w = 3) {
    const [x0, y0] = P(cx, cy, r, a0), [x1, y1] = P(cx, cy, r, a1), cw = a1 > a0 ? 1 : 0, big = Math.abs(a1 - a0) > 180 ? 1 : 0;
    const t = a1 * Math.PI / 180, s = cw ? 1 : -1;
    return `<path d="M${r1(x0)} ${r1(y0)} A${r} ${r} 0 ${big} ${cw} ${r1(x1)} ${r1(y1)}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>` + head(x1, y1, Math.cos(t) * s, Math.sin(t) * s, 8, c);
  }

  // ---------- Horloge : une flèche qui tourne ----------
  const TOURS = { 45: 'Un huitième de tour', 90: 'Un quart de tour', 135: 'Trois huitièmes de tour', 180: 'Un demi-tour', 225: 'Cinq huitièmes de tour', 270: 'Trois quarts de tour', 315: 'Sept huitièmes de tour' };
  const heure = h => { h = ((h % 12) + 12) % 12 || 12; const w = Math.floor(h), half = h - w >= .5; return `${w} heure${w > 1 ? 's' : ''}${half ? ' et demie' : ''}`.replace(/^12 heures$/, 'midi'); };
  function clock(deg, dir) {
    const cx = 90, cy = 88, R = 66, a1 = deg * dir;
    let b = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff" stroke="${K.ink}" stroke-width="3"/>`;
    for (let i = 0; i < 12; i++) { const [x0, y0] = P(cx, cy, R - (i % 3 ? 7 : 11), i * 30), [x1, y1] = P(cx, cy, R - 2, i * 30); b += `<line x1="${r1(x0)}" y1="${r1(y0)}" x2="${r1(x1)}" y2="${r1(y1)}" stroke="${K.ink}" stroke-width="${i % 3 ? 1.5 : 3}"/>`; }
    [[0, '12'], [90, '3'], [180, '6'], [270, '9']].forEach(([a, s]) => { const [x, y] = P(cx, cy, R - 19, a); b += text(x, y, s, { s: 12, c: K.grey }); });
    b += arc(cx, cy, 22, 0, a1, K.orange, 4);
    const hand = (a, c) => { const [x, y] = P(cx, cy, R - 34, a), t = a * Math.PI / 180; return `<line x1="${cx}" y1="${cy}" x2="${r1(x)}" y2="${r1(y)}" stroke="${c}" stroke-width="5" stroke-linecap="round"/>` + head(x, y, Math.sin(t), -Math.cos(t), 9, c); };
    b += hand(0, K.grey) + hand(a1, K.blue) + `<circle cx="${cx}" cy="${cy}" r="5" fill="${K.ink}"/>`;
    b += text(205, 70, 'avant', { a: 'start', c: K.grey }) + `<line x1="190" y1="70" x2="200" y2="70" stroke="${K.grey}" stroke-width="5" stroke-linecap="round"/>`;
    b += text(205, 96, 'après', { a: 'start', c: K.blue }) + `<line x1="190" y1="96" x2="200" y2="96" stroke="${K.blue}" stroke-width="5" stroke-linecap="round"/>`;
    const name = TOURS[deg] || `${deg} degrés`;
    const cap = `${name} ${dir > 0 ? 'dans le sens des aiguilles' : 'dans l’autre sens'} : l’aiguille part de midi et arrive sur ${heure(a1 / 30)}.${deg === 90 ? ' Quatre quarts de tour, et elle revient à midi !' : ''}`;
    return fig(svg(260, 176, b), cap);
  }

  // Roue à 5 pointes (pentagones)
  function wheel(steps, dir) {
    const cx = 90, cy = 86, R = 58;
    const pts = [0, 1, 2, 3, 4].map(i => P(cx, cy, R, i * 72));
    let b = `<polygon points="${pts.map(p => p.map(r1).join(',')).join(' ')}" fill="${K.soft}" stroke="${K.ink}" stroke-width="3"/>`;
    b += arc(cx, cy, R + 14, 0, 72 * steps * dir, K.orange, 4);
    const end = ((steps * dir) % 5 + 5) % 5;
    pts.forEach((p, i) => { b += `<circle cx="${r1(p[0])}" cy="${r1(p[1])}" r="${i === 0 || i === end ? 9 : 5}" fill="${i === 0 ? K.grey : i === end ? K.blue : '#fff'}" stroke="${K.ink}" stroke-width="2"/>`; });
    return fig(svg(180, 172, b), `La figure tourne comme une roue : la pointe du haut (grise) avance de ${steps === 1 ? 'une pointe' : 'deux pointes'} ${dir > 0 ? 'dans le sens des aiguilles' : 'dans l’autre sens'} et arrive sur la pointe bleue.`);
  }

  // Miroir
  function mirror() {
    const shape = `<path d="M0 0 h34 v12 h-20 v10 h14 v12 h-14 v26 h-14 Z" fill="${K.blue}" stroke="${K.ink}" stroke-width="2.5"/>`;
    const b = `<g transform="translate(36 22)">${shape}</g><line x1="110" y1="10" x2="110" y2="110" stroke="${K.grey}" stroke-width="3" stroke-dasharray="6 6"/>` +
      `<g transform="translate(184 22) scale(-1 1)">${shape}</g>` + text(110, 120, 'miroir', { s: 12, c: K.grey });
    return fig(svg(220, 130, b), 'Comme ton reflet : ce qui était à gauche passe à droite, et ce qui était à droite passe à gauche.');
  }
  function swapColors() {
    const b = `<circle cx="50" cy="60" r="24" fill="${K.blue}" stroke="${K.ink}" stroke-width="2.5"/><circle cx="170" cy="60" r="24" fill="${K.orange}" stroke="${K.ink}" stroke-width="2.5"/>` +
      `<path d="M78 42 Q110 10 142 42" fill="none" stroke="${K.ink}" stroke-width="2.5"/>${head(142, 42, .7, .7, 8, K.ink)}<path d="M142 78 Q110 110 78 78" fill="none" stroke="${K.ink}" stroke-width="2.5"/>${head(78, 78, -.7, -.7, 8, K.ink)}`;
    return fig(svg(220, 120, b), 'Les deux couleurs échangent leur place, comme deux amis qui échangent leur chaise.');
  }

  // ---------- Ronde des jours ----------
  const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  function dayWheel(start, end, dir, n) {
    const s = DAYS.indexOf(start), e = DAYS.indexOf(end);
    if (s < 0 || e < 0) return '';
    const cx = 120, cy = 104, R = 72;
    let b = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${K.soft}" stroke-width="22"/>`;
    const steps = (((e - s) * dir) % 7 + 7) % 7;
    if (steps) b += arc(cx, cy, R - 30, s * 360 / 7, s * 360 / 7 + dir * steps * 360 / 7, K.orange, 3.5);
    DAYS.forEach((d, i) => {
      const [x, y] = P(cx, cy, R, i * 360 / 7), col = i === s ? K.blue : i === e ? K.green : null;
      b += `<circle cx="${r1(x)}" cy="${r1(y)}" r="19" fill="${col || '#fff'}" stroke="${K.ink}" stroke-width="2"/>` + text(x, y + 1, d.slice(0, 3), { s: 11.5, c: col ? '#fff' : K.ink });
    });
    const tours = n && n >= 7 ? ` ${n} jours, c’est ${Math.floor(n / 7)} tour${n >= 14 ? 's' : ''} complet${n >= 14 ? 's' : ''} de la ronde (qui ne changent rien) plus ${n % 7} pas.` : '';
    return fig(svg(240, 208, b), `On part de <b>${start}</b> (en bleu) et on ${dir > 0 ? 'avance' : 'recule'} dans la ronde jusqu’à <b>${end}</b> (en vert).${tours}`);
  }

  // ---------- Pizzas (fractions) ----------
  const NUM = { un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5 };
  const DEN = { tiers: 3, quart: 4, quarts: 4, cinquième: 5, cinquièmes: 5, sixième: 6, sixièmes: 6, huitième: 8, huitièmes: 8, dixième: 10, dixièmes: 10 };
  function pizza(k, d, label) {
    const cx = 52, cy = 52, R = 42;
    let b = `<circle cx="${cx}" cy="${cy}" r="${R + 5}" fill="#e9b872" stroke="${K.ink}" stroke-width="2"/>`;
    for (let i = 0; i < d; i++) {
      const [x0, y0] = P(cx, cy, R, i * 360 / d), [x1, y1] = P(cx, cy, R, (i + 1) * 360 / d);
      b += `<path d="M${cx} ${cy} L${r1(x0)} ${r1(y0)} A${R} ${R} 0 0 1 ${r1(x1)} ${r1(y1)} Z" fill="${i < k ? K.orange : '#fff3d6'}" stroke="${K.ink}" stroke-width="1.6"/>`;
      if (i < k) { const [px, py] = P(cx, cy, R * .55, (i + .5) * 360 / d); b += `<circle cx="${r1(px)}" cy="${r1(py)}" r="4" fill="${K.red}"/>`; }
    }
    return `<div class="kid-pizza">${svg(104, 104, b)}<span>${esc(label)}</span></div>`;
  }
  function pizzas(t) {
    const found = [...t.matchAll(/\b(un|une|deux|trois|quatre|cinq) (tiers|quarts?|cinquièmes?|sixièmes?|huitièmes?|dixièmes?)\b/g)].slice(0, 2);
    if (!found.length) return '';
    const items = found.map(m => { const k = NUM[m[1]], d = DEN[m[2]]; return pizza(k, d, `${m[1]} ${m[2]} : on coupe en ${d}, on garde ${k}`); });
    return fig(`<div class="kid-row">${items.join('')}</div>`, found.length > 1 ? 'On fait les deux découpages l’un après l’autre, en commençant par celui qui est le plus près du nombre.' : '');
  }

  // ---------- Tablette de chocolat (carrés) ----------
  function chocolate() {
    const bar = (n, x0) => { let b = ''; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) b += `<rect x="${x0 + j * 15}" y="${12 + i * 15}" width="13" height="13" rx="2" fill="#8a5a3b" stroke="#5c3a24"/>`; return b + text(x0 + n * 7.5, 22 + n * 15, `${n} × ${n} = ${n * n}`); };
    return fig(svg(200, 100, bar(3, 20) + bar(4, 100)), 'Un nombre « au carré », c’est une tablette bien carrée : on compte tous les carreaux.');
  }

  // ---------- Suites : la grenouille saute de nombre en nombre ----------
  const isLetter = s => /^[A-Z]$/.test(s), isNum = s => /^-?\d+$/.test(s);
  const val = s => isLetter(s) ? s.charCodeAt(0) - 64 : +s;
  function tokensOf(q, ans) {
    const raw = strip(q.big).split('·').map(x => x.trim()).filter(Boolean);
    const fill = String(ans ?? '').split('·').map(x => x.trim()).filter(Boolean);
    let f = 0;
    return raw.map(x => x === '?' ? { v: fill[f++] ?? '?', ans: true } : { v: x });
  }
  function frog(q, e, ans) {
    const tk = tokensOf(q, ans);
    if (tk.length < 3 || tk.length > 10 || !tk.every(t => isNum(t.v)) && !tk.every(t => isLetter(t.v))) return '';
    const letters = isLetter(tk[0].v);
    const ops = (e.match(/alterne (× ?\d+|[+−] ?\d+) (?:puis|et) (× ?\d+|[+−] ?\d+)/) || []).slice(1).map(s => s.replace(' ', ''));
    const lett = e.match(/alternativement de (\d+) puis de (\d+)/);
    const vals = tk.map(t => val(t.v));
    const ratios = vals.slice(1).map((v, i) => vals[i] ? v / vals[i] : NaN);
    const sameRatio = !letters && ratios.every(r => r === ratios[0]) && Number.isInteger(ratios[0]) && ratios[0] > 1;
    const labels = vals.slice(1).map((v, i) => {
      if (ops.length === 2) return ops[i % 2].replace('−', '−').replace('×', '×');
      if (lett) return '+' + lett[1 + (i % 2)];
      if (sameRatio) return '×' + ratios[0];
      const d = v - vals[i]; return (d >= 0 ? '+' : '−') + Math.abs(d);
    });
    const W = 54, w = tk.length * W + 16;
    let b = '';
    tk.forEach((t, i) => {
      const x = 8 + i * W + W / 2;
      b += `<rect x="${x - 22}" y="62" width="44" height="30" rx="9" fill="${t.ans ? K.green : '#fff'}" stroke="${t.ans ? K.green : K.ink}" stroke-width="2"/>` + text(x, 78, t.v, { s: t.v.length > 3 ? 12 : 15, c: t.ans ? '#fff' : K.ink });
      if (i) {
        const x0 = x - W, col = t.ans ? K.green : K.orange;
        b += `<path d="M${x0 + 6} 58 Q${x0 + W / 2} 18 ${x - 8} 56" fill="none" stroke="${col}" stroke-width="2.5"/>` + head(x - 8, 56, .35, .94, 7, col);
        b += text(x0 + W / 2, 26, labels[i - 1], { s: 12.5, c: col });
      }
    });
    b += `<text x="${8 + W / 2 - 18}" y="112" font-size="20">🐸</text>`;
    const cap = letters ? 'La grenouille saute de lettre en lettre : le nombre au-dessus de chaque saut dit de combien de lettres elle avance dans l’alphabet (− veut dire qu’elle recule).'
      : 'La grenouille saute de nombre en nombre : au-dessus de chaque saut, on écrit ce qu’on ajoute (+), ce qu’on enlève (−) ou par combien on multiplie (×). Le dernier saut, en vert, donne la réponse.';
    return fig(svg(w, 124, b), cap);
  }
  // Deux petits trains
  function trains(q, ans) {
    const tk = tokensOf(q, ans);
    if (tk.length < 4 || tk.length > 12) return '';
    const W = 50, rows = [[], []];
    tk.forEach((t, i) => rows[i % 2].push({ ...t, i }));
    const w = Math.ceil(tk.length / 2) * W + 70;
    let b = '';
    [[K.red, '🚂', 22], [K.blue, '🚃', 78]].forEach(([c, em, y], r) => {
      b += `<text x="8" y="${y + 20}" font-size="24">${em}</text>`;
      rows[r].forEach((t, j) => {
        const x = 46 + j * W;
        b += `<rect x="${x}" y="${y}" width="${W - 6}" height="34" rx="6" fill="${t.ans ? K.green : '#fff'}" stroke="${c}" stroke-width="3"/>` + text(x + (W - 6) / 2, y + 17, t.v, { s: t.v.length > 3 ? 11 : 14, c: t.ans ? '#fff' : K.ink });
        if (j) b += `<line x1="${x - 6}" y1="${y + 17}" x2="${x}" y2="${y + 17}" stroke="${c}" stroke-width="3"/>`;
      });
    });
    return fig(svg(w, 124, b), 'On range les éléments un sur deux : le train rouge prend le 1er, le 3e, le 5e… et le train bleu prend le 2e, le 4e, le 6e… Chaque train suit sa propre règle. La case verte est la réponse.');
  }
  // Les nombres qui se donnent la main (somme des précédents)
  function handsSum(e) {
    const m = e.match(/((?:\d+ \+ )+\d+) = (\d+)/);
    if (!m) return '';
    const parts = m[1].split(' + ');
    return fig(`<div class="kid-eq">${parts.map(p => `<b>${p}</b>`).join('<i>+</i>')}<i>=</i><b class="ok">${m[2]}</b></div>`, 'Les derniers nombres se donnent la main et s’additionnent pour faire le suivant.');
  }

  // ---------- Boîtes emboîtées (syllogismes) ----------
  function euler(t) {
    const tous = [...t.matchAll(/Tous les (\S+?)s sont des (\S+?)s\b/g)].map(m => [m[1], m[2]]);
    const aucun = t.match(/Aucun (\S+) n’est un (\S+?)\./);
    const cert = t.match(/Certains (\S+?)s sont des (\S+?)s\b/);
    const lab = (x, y, s, c) => text(x, y, s + 's', { s: 12.5, c });
    const ell = (cx, cy, rx, ry, c) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${c}" fill-opacity=".18" stroke="${c}" stroke-width="2.5"/>`;
    let b = '', cap = '';
    if (tous.length === 2 && !aucun && !cert) {
      const names = tous.flat(), inner = tous.find(p => !tous.some(o => o[1] === p[0]));
      if (!inner) return '';
      const mid = inner[1], outer = tous.find(p => p[0] === mid)?.[1];
      if (!outer) return '';
      b = ell(140, 92, 125, 76, K.blue) + ell(140, 104, 82, 50, K.orange) + ell(140, 114, 40, 26, K.green) + lab(140, 30, outer, K.blue) + lab(140, 69, mid, K.orange) + lab(140, 115, inner[0], K.green);
      cap = `Les ${inner[0]}s sont dans la boîte des ${mid}s, qui est dans la boîte des ${outer}s : les ${inner[0]}s sont donc forcément dans la grande boîte.`;
      void names;
    } else if (aucun && tous.length === 1) {
      const [x, y] = [aucun[1], aucun[2]], [z, y2] = tous[0];
      const big = y2 === y ? y : y2 === x ? x : null;
      if (!big) return '';
      const alone = big === y ? x : y;
      b = ell(100, 92, 85, 62, K.blue) + ell(100, 104, 40, 26, K.orange) + `<circle cx="232" cy="92" r="40" fill="${K.red}" fill-opacity=".18" stroke="${K.red}" stroke-width="2.5"/>` +
        lab(100, 44, big, K.blue) + lab(100, 104, z, K.orange) + lab(232, 92, alone, K.red);
      cap = `Les ${z}s sont rangés dans la boîte des ${big}s, et cette boîte ne touche pas celle des ${alone}s : aucun ${z} ne peut être un ${alone}.`;
    } else if (cert && tous.length === 1 && tous[0][0] === cert[2]) {
      const [a, bb] = [cert[1], cert[2]], c = tous[0][1];
      b = ell(115, 92, 100, 70, K.blue) + ell(100, 104, 48, 34, K.orange) + `<circle cx="178" cy="108" r="40" fill="${K.green}" fill-opacity=".18" stroke="${K.green}" stroke-width="2.5"/>` +
        lab(115, 36, c, K.blue) + lab(88, 104, bb, K.orange) + lab(196, 112, a, K.green);
      cap = `Le morceau des ${a}s qui touche les ${bb}s est forcément dans la grande boîte des ${c}s : certains ${a}s sont donc des ${c}s.`;
    } else if (cert && tous.length === 1 && tous[0][1] === cert[1]) {
      const [a, bb] = tous[0], c = cert[2];
      b = ell(110, 92, 92, 64, K.blue) + ell(76, 98, 36, 26, K.orange) + `<circle cx="200" cy="92" r="46" fill="${K.green}" fill-opacity=".18" stroke="${K.green}" stroke-width="2.5"/>` +
        lab(100, 40, bb, K.blue) + lab(76, 98, a, K.orange) + lab(222, 92, c, K.green);
      cap = `Les ${c}s touchent la boîte des ${bb}s, mais peut-être pas le coin des ${a}s : on ne peut pas savoir.`;
    } else return '';
    return fig(svg(280, 176, b), cap);
  }

  // ---------- Petits dessins d'énigmes ----------
  function fence(e) {
    const m = e.match(/(\d+) intervalles/);
    const b = [0, 1, 2, 3, 4].map(i => `<rect x="${20 + i * 50}" y="20" width="10" height="60" rx="3" fill="#c99b6d" stroke="${K.ink}" stroke-width="2"/>`).join('') +
      [0, 1, 2, 3].map(i => `<path d="M${32 + i * 50} 92 q${19} 14 ${38} 0" fill="none" stroke="${K.orange}" stroke-width="2.5"/>` + text(51 + i * 50, 112, String(i + 1), { s: 12, c: K.orange })).join('');
    return fig(svg(260, 124, b), `5 piquets, mais seulement 4 espaces (en orange) entre eux. Il y a toujours un espace de moins que de piquets${m ? ` : ici, ${m[1]} espaces` : ''}.`);
  }
  function log(e) {
    const m = e.match(/(\d+) morceaux[^.]*?(\d+) coupes?/);
    const p = m ? Math.min(+m[1], 12) : 3;
    const W = 220 / p;
    let b = '';
    for (let i = 0; i < p; i++) b += `<rect x="${20 + i * W + (i ? 3 : 0)}" y="30" width="${W - (i ? 6 : 3)}" height="40" rx="8" fill="#c99b6d" stroke="${K.ink}" stroke-width="2"/>`;
    for (let i = 1; i < p; i++) b += `<line x1="${20 + i * W}" y1="18" x2="${20 + i * W}" y2="82" stroke="${K.red}" stroke-width="3" stroke-dasharray="5 4"/>` + text(20 + i * W, 96, '✂', { s: 14, c: K.red });
    return fig(svg(260, 106, b), `${p} morceaux, mais seulement ${p - 1} coup${p > 2 ? 's' : ''} de scie (en rouge) : un coup de moins que de morceaux.`);
  }
  function ages(t, e) {
    const m = t.match(/Quand j’avais (\d+) ans, ma sœur avait la moitié de mon âge\. J’ai maintenant (\d+) ans/);
    if (!m) return '';
    const a = +m[1], gap = a / 2, now = +m[2], max = now;
    const bar = (y, v, c, lbl) => `<rect x="80" y="${y}" width="${r1(v / max * 200)}" height="16" rx="5" fill="${c}"/>` + text(76, y + 8, lbl, { a: 'end', s: 12 }) + text(86 + v / max * 200, y + 8, `${v} ans`, { a: 'start', s: 12 });
    const b = text(10, 12, 'Avant', { a: 'start', s: 12, c: K.grey }) + bar(20, a, K.blue, 'moi') + bar(42, gap, K.orange, 'ma sœur') +
      text(10, 80, 'Maintenant', { a: 'start', s: 12, c: K.grey }) + bar(88, now, K.blue, 'moi') + bar(110, now - gap, K.orange, 'ma sœur');
    return fig(svg(330, 134, b), `L’écart entre les deux barres est toujours de ${gap} ans : quand je vieillis d’un an, ma sœur aussi.`);
  }
  // Horloge qui sonne : des coups et des silences entre eux
  function chimes(e) {
    const m = e.match(/Entre (\d+) coups, il y a (\d+) intervalles, soit (\d+) s chacun/);
    if (!m) return '';
    const n = Math.min(+m[1], 8), W = 44, w = n * W + 30;
    let b = '';
    for (let i = 0; i < n; i++) {
      const x = 22 + i * W;
      b += `<text x="${x}" y="40" font-size="22" text-anchor="middle">🔔</text>`;
      if (i) b += `<path d="M${x - W + 10} 54 q${(W - 20) / 2} 14 ${W - 20} 0" fill="none" stroke="${K.orange}" stroke-width="2.5"/>` + text(x - W / 2, 76, `${m[3]} s`, { s: 11.5, c: K.orange });
    }
    return fig(svg(w, 88, b), `${m[1]} coups de cloche, mais seulement ${m[2]} silences entre eux (en orange). Ce sont les silences qui prennent du temps, pas les coups !`);
  }
  // Horloge à une heure précise (angle entre les aiguilles)
  function timeClock(h, mi) {
    const cx = 90, cy = 88, R = 66, aH = (h % 12) * 30 + mi * .5, aM = mi * 6;
    let b = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff" stroke="${K.ink}" stroke-width="3"/>`;
    for (let i = 0; i < 12; i++) { const [x0, y0] = P(cx, cy, R - (i % 3 ? 7 : 11), i * 30), [x1, y1] = P(cx, cy, R - 2, i * 30); b += `<line x1="${r1(x0)}" y1="${r1(y0)}" x2="${r1(x1)}" y2="${r1(y1)}" stroke="${K.ink}" stroke-width="${i % 3 ? 1.5 : 3}"/>`; }
    let a0 = Math.min(aH, aM), a1 = Math.max(aH, aM);
    if (a1 - a0 > 180) [a0, a1] = [a1, a0 + 360];
    const [x0, y0] = P(cx, cy, 26, a0), [x1, y1] = P(cx, cy, 26, a1);
    b += `<path d="M${cx} ${cy} L${r1(x0)} ${r1(y0)} A26 26 0 0 1 ${r1(x1)} ${r1(y1)} Z" fill="${K.yellow}" fill-opacity=".7"/>`;
    const hand = (a, len, w, c) => { const [x, y] = P(cx, cy, len, a); return `<line x1="${cx}" y1="${cy}" x2="${r1(x)}" y2="${r1(y)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`; };
    b += hand(aH, R - 30, 7, K.blue) + hand(aM, R - 12, 4, K.orange) + `<circle cx="${cx}" cy="${cy}" r="5" fill="${K.ink}"/>`;
    b += `<line x1="190" y1="70" x2="204" y2="70" stroke="${K.blue}" stroke-width="7" stroke-linecap="round"/>` + text(210, 70, 'heures', { a: 'start', c: K.blue });
    b += `<line x1="190" y1="96" x2="204" y2="96" stroke="${K.orange}" stroke-width="4" stroke-linecap="round"/>` + text(210, 96, 'minutes', { a: 'start', c: K.orange });
    return fig(svg(270, 176, b), `À ${h} h ${mi}, la petite aiguille (bleue) n’est pas pile sur le ${h % 12 || 12} : elle a déjà un peu avancé vers le chiffre suivant. L’angle cherché est la part jaune.`);
  }
  // Les deux aiguilles qui se rejoignent
  function overlaps() {
    const cx = 90, cy = 88, R = 66;
    let b = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff" stroke="${K.ink}" stroke-width="3"/>`;
    for (let k = 0; k < 11; k++) { const [x, y] = P(cx, cy, R - 12, k * 360 / 11); b += `<circle cx="${r1(x)}" cy="${r1(y)}" r="6" fill="${k ? K.orange : K.green}" stroke="${K.ink}" stroke-width="1.5"/>` + (k ? '' : ''); }
    const a = 360 / 11;
    const hand = (len, w, c) => { const [x, y] = P(cx, cy, len, a); return `<line x1="${cx}" y1="${cy}" x2="${r1(x)}" y2="${r1(y)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`; };
    b += hand(R - 18, 4, K.orange) + hand(R - 32, 7, K.blue) + `<circle cx="${cx}" cy="${cy}" r="5" fill="${K.ink}"/>`;
    return fig(svg(180, 176, b), 'Chaque rond orange est un moment où les deux aiguilles se retrouvent l’une sur l’autre (ici vers 1 h 05). En 12 heures, il y en a 11 : le 12e rendez-vous, c’est de nouveau midi (le rond vert).');
  }
  // Roues dentées
  function gears(t) {
    const N = { deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7 };
    const m = t.match(/(deux|trois|quatre|cinq|six|sept) roues dentées/i);
    const n = m ? N[m[1].toLowerCase()] : 3;
    const R = 26, w = n * 2 * R + 30;
    let b = '';
    for (let i = 0; i < n; i++) {
      const cx = 15 + R + i * 2 * R, cy = 60, cw = i % 2 === 0;
      for (let k = 0; k < 10; k++) { const [x, y] = P(cx, cy, R + 3, k * 36 + (i % 2) * 18); b += `<circle cx="${r1(x)}" cy="${r1(y)}" r="4.5" fill="${K.grey}" stroke="${K.ink}" stroke-width="1.2"/>`; }
      b += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${cw ? K.soft : '#fdecee'}" stroke="${K.ink}" stroke-width="2"/>` + arc(cx, cy, R - 10, cw ? -60 : 60, cw ? 60 : -60, cw ? K.blue : K.red, 2.5);
    }
    return fig(svg(w, 118, b) , 'Deux roues qui se touchent tournent toujours dans des sens contraires : bleu, rouge, bleu, rouge…');
  }
  function meet(e) {
    const m = e.match(/(\d+) \+ (\d+) = (\d+) km chaque heure : (\d+) ÷ \d+ = (\d+) h/);
    if (!m) return '';
    const b = `<line x1="30" y1="60" x2="270" y2="60" stroke="${K.grey}" stroke-width="6" stroke-linecap="round"/>` +
      `<text x="14" y="52" font-size="24">🚂</text><text x="262" y="52" font-size="24">🚂</text>` +
      `<line x1="40" y1="78" x2="120" y2="78" stroke="${K.blue}" stroke-width="3"/>${head(120, 78, 1, 0, 8, K.blue)}<line x1="260" y1="78" x2="190" y2="78" stroke="${K.orange}" stroke-width="3"/>${head(190, 78, -1, 0, 8, K.orange)}` +
      text(80, 96, `${m[1]} km/h`, { s: 12, c: K.blue }) + text(225, 96, `${m[2]} km/h`, { s: 12, c: K.orange }) + text(150, 20, `${m[4]} km entre eux`, { s: 12 });
    return fig(svg(300, 108, b), `Chaque heure, l’espace entre eux fond de ${m[1]} + ${m[2]} = ${m[3]} km, des deux côtés à la fois.`);
  }
  function balance() {
    const coins = (x, n, c) => Array.from({ length: n }, (_, i) => `<circle cx="${x + (i % 3) * 13}" cy="${74 - Math.floor(i / 3) * 12}" r="6" fill="${c}" stroke="${K.ink}" stroke-width="1.5"/>`).join('');
    const b = `<line x1="110" y1="20" x2="110" y2="110" stroke="${K.ink}" stroke-width="4"/><line x1="40" y1="34" x2="180" y2="34" stroke="${K.ink}" stroke-width="4"/>` +
      `<path d="M20 82 h52 l-8 10 h-36 Z M148 82 h52 l-8 10 h-36 Z" fill="${K.grey}" stroke="${K.ink}" stroke-width="2"/><path d="M40 34 L30 82 M40 34 L62 82 M180 34 L158 82 M180 34 L190 82" stroke="${K.ink}" stroke-width="1.5"/>` +
      coins(33, 6, K.yellow) + coins(161, 6, K.yellow) + coins(232, 6, K.yellow) + `<path d="M90 112 h40" stroke="${K.ink}" stroke-width="4"/>` +
      text(46, 104, 'tas 1', { s: 11 }) + text(174, 104, 'tas 2', { s: 11 }) + text(245, 104, 'tas 3', { s: 11 });
    return fig(svg(280, 120, b), 'On fait 3 tas pareils. Si la balance penche, la pièce lourde est dans le tas qui descend. Si elle reste droite, elle est dans le tas 3, à côté !');
  }
  function legs(t, e) {
    const m = e.match(/Si tous avaient 2 pattes, il y en aurait (\d+)\. Les (\d+) pattes en plus/);
    const an = t.match(/des (\S+) et des (\S+)\./);
    if (!m || !an) return '';
    return fig(`<div class="kid-legs"><span>🐾 Si tous les animaux avaient 2 pattes : <b>${m[1]}</b> pattes.</span><span>Mais on en compte <b>${m[2]}</b> de plus.</span><span>Chaque animal à 4 pattes en apporte <b>2</b> de plus : on partage ces ${m[2]} pattes en paquets de 2.</span></div>`, '');
  }

  // ---------- Déduction : des cases et des flèches ----------
  function chain(e) {
    const q = [...e.matchAll(/«\s*([^»]+?)\s*»/g)].map(m => m[1]);
    const box = (s, c = '') => `<span class="kid-box-word ${c}">${esc(s.charAt(0).toUpperCase() + s.slice(1))}</span>`;
    if (/On enchaîne les deux règles/.test(e) && q.length >= 3) return fig(`<div class="kid-chain">${box(q[0])}<i>➜</i>${box(q[1])}<i>➜</i>${box(q[2], 'ok')}</div>`, 'Comme des dominos : chaque case fait tomber la suivante.');
    if (/La règle s’applique directement/.test(e) && q.length >= 2) return fig(`<div class="kid-chain">${box(q[0])}<i>➜</i>${box(q[1], 'ok')}</div>`, 'Le début est arrivé, alors la flèche nous emmène à la suite.');
    if (/Or c’est faux/.test(e) && q.length >= 2) return fig(`<div class="kid-chain">${box(q[0], 'no')}<i>➜</i>${q.slice(1).map(s => box(s, 'no')).join('<i>➜</i>')}</div>`, 'Le bout de la flèche n’est pas arrivé (barré) : alors le début n’a pas pu arriver non plus.');
    return '';
  }

  // ---------- Mémoire à l'envers ----------
  function reverse(e) {
    const m = e.match(/^([\d ]+) à l’envers donne ([\d ]+)\./);
    if (!m) return '';
    const a = m[1].trim().split(' '), b = m[2].trim().split(' ');
    return fig(`<div class="kid-rev"><div>${a.map(d => `<b>${d}</b>`).join('')}</div><i>⟲ on rembobine</i><div>${b.map(d => `<b class="ok">${d}</b>`).join('')}</div></div>`, 'Le dernier chiffre passe en premier, puis l’avant-dernier, et ainsi de suite.');
  }

  // ---------- Mélodies : les notes dessinées ----------
  function melody(q) {
    const m = q.melody;
    if (!m || !Array.isArray(m.versions)) return '';
    const odd = m.odd, rel = m.versions.map(v => v.map(p => p - v[0])), all = rel.flat(), lo = Math.min(...all), hi = Math.max(...all);
    const n = rel[0].length, W = 26, H = 70, w = n * W + 90;
    let b = '';
    rel.forEach((v, k) => {
      const y0 = 10 + k * (H + 10);
      b += text(6, y0 + H / 2, `version ${k + 1}`, { a: 'start', s: 11.5, c: k === odd ? K.red : K.ink });
      const pts = v.map((p, i) => [80 + i * W, y0 + H - 8 - (p - lo) / Math.max(1, hi - lo) * (H - 16)]);
      b += `<polyline points="${pts.map(p => p.map(r1).join(',')).join(' ')}" fill="none" stroke="${K.grey}" stroke-width="2"/>`;
      pts.forEach(([x, y], i) => {
        const wrong = k === odd && i === m.pos;
        b += `<circle cx="${r1(x)}" cy="${r1(y)}" r="${wrong ? 8 : 6}" fill="${wrong ? K.red : k === odd ? K.pink : K.blue}" stroke="${K.ink}" stroke-width="1.5"/>`;
      });
    });
    return fig(svg(w, 3 * (H + 10) + 4, b), 'Chaque rond est une note : plus il est haut, plus la note est aiguë. Les trois versions ont le même dessin… sauf une note, en rouge, qui sort du chemin.');
  }

  // ---------- Cubes : patrons dépliés ----------
  // Patron en croix : U au-dessus de F, L à gauche, R à droite, B au bout, D en dessous (comme NET_LAYOUTS[0])
  const CROSS = { U: [1, 0], L: [0, 1], F: [1, 1], R: [2, 1], B: [3, 1], D: [1, 2] };
  const PAIR = { U: '#ffe7a0', D: '#ffe7a0', F: '#cfe0ff', B: '#cfe0ff', L: '#ffd0dc', R: '#ffd0dc' };
  const OPP = { U: 'D', D: 'U', F: 'B', B: 'F', L: 'R', R: 'L' };
  const SHOW = typeof CUBE_INK !== 'undefined';

  // Un vrai dé déplié : les faces opposées font toujours 7
  function dieNet() {
    const S = 40, PIPS = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
    const VAL = { F: 1, B: 6, U: 2, D: 5, L: 3, R: 4 };
    let b = '';
    Object.entries(CROSS).forEach(([f, [x, y]]) => {
      b += `<rect x="${x * S + 2}" y="${y * S + 2}" width="${S}" height="${S}" rx="6" fill="${PAIR[f]}" stroke="${K.ink}" stroke-width="2"/>`;
      PIPS[VAL[f]].forEach(([px, py]) => { b += `<circle cx="${x * S + 2 + S / 2 + px * 10}" cy="${y * S + 2 + S / 2 + py * 10}" r="4" fill="${K.ink}"/>`; });
    });
    return fig(svg(4 * S + 4, 3 * S + 4, b), 'Un vrai dé déplié, c’est son <b>patron</b>. Les cases de la même couleur se retrouvent face à face quand on le replie : 1 et 6, 2 et 5, 3 et 4 (ça fait toujours 7 !). Sur une rangée, deux cases séparées par une case deviennent le dessus et le dessous : on ne peut jamais les voir en même temps.');
  }

  // Patron d'un cube à symboles, cases coloriées par paires opposées
  function symbolNet(state, mark = []) {
    const S = 44;
    let b = '';
    Object.entries(CROSS).forEach(([f, [x, y]]) => {
      const s = state[f], on = mark.includes(f);
      b += `<rect x="${x * S + 3}" y="${y * S + 3}" width="${S}" height="${S}" rx="5" fill="${s === '?' ? '#f1f0f4' : PAIR[f]}" stroke="${on ? K.green : K.ink}" stroke-width="${on ? 4 : 2}"/>`;
      b += s === '?' ? text(x * S + 3 + S / 2, y * S + 3 + S / 2, '?', { s: 18, c: K.grey }) : `<g transform="translate(${x * S + 3 + S / 2} ${y * S + 3 + S / 2}) scale(${S * .36})">${symUnit(s)}</g>`;
    });
    return svg(4 * S + 6, 3 * S + 6, b);
  }
  // Cube en perspective avec des faces coloriées
  function tintCube(view, fills, draw) {
    return `<svg viewBox="0 0 100 100" width="96" aria-hidden="true">${CUBE_FACES.map((f, i) =>
      `<polygon points="${f.pts}" fill="${fills[i]}" stroke="${CUBE_INK}" stroke-width="2" stroke-linejoin="round"/><g transform="matrix(${f.m})">${draw(view[i])}</g>`).join('')}</svg>`;
  }

  // Rotation 3D (symboles sans sens) : on retrouve le cube complet
  const rotY = s => ({ U: s.U, D: s.D, F: s.R, R: s.B, B: s.L, L: s.F });
  const rotX = s => ({ U: s.F, F: s.D, D: s.B, B: s.U, L: s.L, R: s.R });
  function orient(s) {
    const seen = new Map(), todo = [s];
    while (todo.length) { const x = todo.shift(), k = JSON.stringify(x); if (!seen.has(k)) { seen.set(k, x); todo.push(rotY(x), rotX(x)); } }
    return [...seen.values()];
  }
  const vk = v => v.join(',');
  function stateFromViews(v1, v2) {
    const known = [...new Set([...v1, ...v2])], rest = [...known.filter(s => !v1.includes(s)), '?'];
    for (const p of [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]) {
      const st = { U: v1[0], F: v1[1], R: v1[2], D: rest[p[0]], B: rest[p[1]], L: rest[p[2]] };
      if (orient(st).some(o => vk([o.U, o.F, o.R]) === vk(v2))) return st;
    }
    return null;
  }
  const faceOf = (st, s) => Object.keys(st).find(f => st[f] === s);

  function cubeRotation(q) {
    if (!SHOW) return '';
    const out = [dieNet()];
    const ans = q.options[q.answer];
    if (q.net) {
      const st = q.net.state;
      if (typeof ans === 'string') {
        const x = st[OPP[faceOf(st, ans)]];
        out.push(fig(symbolNet(st, [faceOf(st, ans), faceOf(st, x)]), `Voici le patron de la question, colorié comme le dé : les deux cases entourées en vert ont la même couleur, donc elles se retrouvent face à face, ${SYM_NAMES[x]} et ${SYM_NAMES[ans]}.`));
      } else if (Array.isArray(ans)) {
        const fills = ans.map(s => PAIR[faceOf(st, s)]);
        out.push(fig(`<div class="kid-row">${symbolNet(st, ans.map(s => faceOf(st, s)))}<span class="kid-arrow">➜</span>${tintCube(ans, fills, symUnit)}</div>`,
          'Le patron colorié comme le dé, et le bon cube. Le bon cube montre trois faces de <b>trois couleurs différentes</b> : deux cases de même couleur sont face à face, on ne peut jamais les voir ensemble. En plus, les trois faces doivent être dans le même ordre que sur le patron replié (sinon, c’est le cube vu dans un miroir).'));
      }
    } else if (q.views) {
      const st = stateFromViews(q.views[0], q.views[1]);
      if (!st || !Array.isArray(ans)) return out.join('');
      const shared = q.views[0].find(s => q.views[1].includes(s));
      const pics = q.views.map((v, i) => `<div class="kid-pizza">${tintCube(v, v.map(s => PAIR[faceOf(st, s)]), symUnit)}<span>Vue ${i + 1}</span></div>`).join('');
      out.push(fig(`<div class="kid-row">${pics}<span class="kid-arrow">➜</span>${symbolNet(st, [faceOf(st, shared)])}</div>`,
        `On recolle les deux photos grâce à la face qu’elles ont en commun (${SYM_NAMES[shared]}, entourée en vert) : on retrouve presque tout le patron. La case « ? » n’a jamais été vue. Attention : sur le dessus du cube en 3D, les dessins ont l’air un peu tournés et écrasés (un losange y ressemble à un rectangle, une croix + à une croix ×).`));
      out.push(fig(`<div class="kid-row"><div class="kid-pizza">${tintCube(ans, ans.map(s => PAIR[faceOf(st, s)] || '#f1f0f4'), symUnit)}<span>La bonne vue</span></div></div>`,
        'La bonne vue montre trois couleurs différentes (pas deux faces opposées), dans le bon ordre autour du coin.'));
    }
    return out.join('');
  }

  // Cubes orientés (ICAR) : on déplie le cube X, en gardant le sens de chaque image
  const eq3 = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const mul3 = (M, v) => M.map(r => dot3(r, v));
  const tr3 = M => [0, 1, 2].map(i => M.map(r => r[i]));
  const ROTS = [];
  for (const p of [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]) for (let s = 0; s < 8; s++) {
    const M = [0, 1, 2].map(i => { const r = [0, 0, 0]; r[p[i]] = (s >> i) & 1 ? -1 : 1; return r; });
    const det = M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
    if (det === 1) ROTS.push(M);
  }
  // Faces vues sur le dessin du cube (mêmes axes que rotation-icar.js) et faces du patron en croix
  const VIEWPOS = [{ n: [0, 1, 0], ex: [0, 0, -1], ey: [1, 0, 0] }, { n: [0, 0, 1], ex: [1, 0, 0], ey: [0, -1, 0] }, { n: [1, 0, 0], ex: [0, 0, -1], ey: [0, -1, 0] }];
  const NETPOS = { U: { n: [0, 1, 0], ex: [1, 0, 0], ey: [0, 0, 1] }, F: { n: [0, 0, 1], ex: [1, 0, 0], ey: [0, -1, 0] }, R: { n: [1, 0, 0], ex: [0, 0, -1], ey: [0, -1, 0] },
    L: { n: [-1, 0, 0], ex: [0, 0, 1], ey: [0, -1, 0] }, B: { n: [0, 0, -1], ex: [-1, 0, 0], ey: [0, -1, 0] }, D: { n: [0, -1, 0], ex: [1, 0, 0], ey: [0, 0, -1] } };
  const UPS = { 0: [0, -1], 90: [1, 0], 180: [0, 1], 270: [-1, 0] };
  const upOf = (pos, a) => { const [x, y] = UPS[a]; return [0, 1, 2].map(i => x * pos.ex[i] + y * pos.ey[i]); };
  const angleOf = (pos, u) => { const l = [dot3(u, pos.ex), dot3(u, pos.ey)]; return +Object.keys(UPS).find(a => UPS[a][0] === l[0] && UPS[a][1] === l[1]); };
  const GCOL = ['#cfe0ff', '#ffe7a0', '#ffd0dc', '#d6f2e2', '#ffe0c2', '#e6dcff', '#d9f1f7', '#f6d6f0'];

  function cubeOriented(q) {
    if (!SHOW || typeof GLYPHS === 'undefined') return '';
    const X = q.target.map((t, i) => ({ g: t.g, n: VIEWPOS[i].n, u: upOf(VIEWPOS[i], t.r) }));
    const ans = q.options[q.answer];
    // Rotation qui transforme X en la bonne réponse
    const M = ROTS.find(M => VIEWPOS.every((pos, i) => {
      const src = X.find(k => eq3(mul3(M, k.n), pos.n));
      return src ? src.g === ans[i].g && eq3(mul3(M, src.u), upOf(pos, ans[i].r)) : !X.some(k => k.g === ans[i].g);
    }));
    if (!M) return '';
    const Mi = tr3(M), faces = [...X.map(f => ({ ...f, from: 'X' }))];
    ans.forEach((a, i) => { if (!X.some(k => k.g === a.g)) faces.push({ g: a.g, n: mul3(Mi, VIEWPOS[i].n), u: mul3(Mi, upOf(VIEWPOS[i], a.r)), from: 'new' }); });
    const colors = {};
    faces.forEach((f, i) => { colors[f.g] = GCOL[i % GCOL.length]; });
    const S = 46;
    let b = '';
    Object.entries(CROSS).forEach(([key, [x, y]]) => {
      const pos = NETPOS[key], f = faces.find(k => eq3(k.n, pos.n));
      const shown = f && ans.some(a => a.g === f.g);
      b += `<rect x="${x * S + 3}" y="${y * S + 3}" width="${S}" height="${S}" rx="5" fill="${f ? colors[f.g] : '#f1f0f4'}" stroke="${shown ? K.green : K.ink}" stroke-width="${shown ? 4 : 2}"/>`;
      b += f ? `<g transform="translate(${x * S + 3 + S / 2} ${y * S + 3 + S / 2}) scale(${S * .38}) rotate(${angleOf(pos, f.u)})">${GLYPHS[f.g](CUBE_INK)}</g>` : text(x * S + 3 + S / 2, y * S + 3 + S / 2, '?', { s: 18, c: K.grey });
    });
    const draw = v => `<g transform="rotate(${v.r})">${GLYPHS[v.g](CUBE_INK)}</g>`;
    const xCube = tintCube(q.target, q.target.map(t => colors[t.g]), draw), aCube = tintCube(ans, ans.map(a => colors[a.g]), draw);
    const hidden = faces.find(f => f.from === 'new');
    return fig(`<div class="kid-row"><div class="kid-pizza">${xCube}<span>Cube X</span></div><span class="kid-arrow">➜</span>${svg(4 * S + 6, 3 * S + 6, b)}<span class="kid-arrow">➜</span><div class="kid-pizza">${aCube}<span>La bonne réponse</span></div></div>`,
      `On déplie le cube X comme le patron d’un dé, en gardant le <b>sens</b> de chaque image. Chaque image a sa couleur, qu’on retrouve sur les deux cubes. Les cases entourées en vert sont celles qu’on voit sur la bonne réponse${hidden ? ' : l’une d’elles était cachée derrière le cube X, c’est pour ça qu’on ne la voyait pas' : ''}. Les « ? » sont des faces qu’on ne voit jamais. Regarde où pointe chaque image par rapport à sa voisine : c’est pareil sur les deux cubes.`);
  }

  // ---------- Choix de l'image ----------
  return function kidPics(q, cat) {
    const e = strip(q.explain), t = strip(q.q);
    const ans = (() => { const o = Array.isArray(q.options) ? q.options[q.answer] : null; return typeof o === 'string' || typeof o === 'number' ? strip(o) : null; })();
    const out = [];
    // Rotations
    const ang = e.match(/tourne (?:de |d’)(?:[^(°]*\()?(\d+)°/);
    if (ang && /flèche|figure/.test(e)) {
      const deg = +ang[1], dir = /sens inverse|vers la gauche/.test(e) ? -1 : 1;
      if (cat === 'pentagones') out.push(wheel(deg === 144 ? 2 : 1, dir)); else out.push(clock(deg, dir));
    }
    if (cat === 'pentagones' && /miroir/.test(e)) out.push(mirror());
    if (cat === 'pentagones' && /échangent/.test(e)) out.push(swapColors());
    // Jours de la semaine
    let d = e.match(/on avance de (\d+) jours? à partir de (\w+), donc (\w+)/);
    if (d) out.push(dayWheel(d[2], d[3], 1, +strip(q.q).match(/dans (\d+) jours/)?.[1] || 0));
    d = e.match(/aujourd’hui on est (\w+)\. (\d+) jours? plus (tard|tôt), on (?:sera|était) (\w+)/);
    if (d) out.push(dayWheel(d[1], d[4], d[3] === 'tard' ? 1 : -1, +d[2]));
    // Fractions
    if (/\b(?:un|deux|trois|quatre|cinq) (?:tiers|quarts?|cinquièmes?|sixièmes?|huitièmes?|dixièmes?) d/.test(t)) out.push(pizzas(t));
    // Suites
    if (q.big && ['logique', 'suites', 'lettresnombres', 'alpha'].includes(cat) && /suite|ensuite|suivants?/.test(t)) {
      if (/Deux suites (?:sont mélangées|alternent)|alternent, chacune/.test(e)) out.push(trains(q, ans));
      else if (/somme des (?:deux|trois) précédents/.test(e)) out.push(handsSum(e));
      else if (!/par paires|Le motif se répète/.test(e)) {
        if (/carrés/.test(e)) out.push(chocolate());
        out.push(frog(q, e, ans));
      }
    }
    // Logique
    if (/^(?:Tous|Aucun|Certains) /.test(t)) out.push(euler(t));
    if (cat === 'deduction') out.push(chain(e));
    // Énigmes
    if (/intervalles/.test(e)) out.push(chimes(e) || fence(e));
    const hm = t.match(/aiguilles d’une horloge à (\d+) h (\d+)/);
    if (hm) out.push(timeClock(+hm[1], +hm[2]));
    if (/aiguilles d’une horloge se superposent/.test(t)) out.push(overlaps());
    if (/roues dentées/.test(t)) out.push(gears(t));
    if (/\d+ morceaux[^.]*?\d+ coupes?/.test(e)) out.push(log(e));
    if (/cet écart ne change jamais/.test(e)) out.push(ages(t, e));
    if (/se rapprochent/.test(e)) out.push(meet(e));
    if (/pesée/.test(e)) out.push(balance());
    if (/Si tous avaient \d+ pattes/.test(e)) out.push(legs(t, e));
    // Mémoire, mélodies
    if (cat === 'memoire' && /à l’envers donne/.test(e)) out.push(reverse(e));
    if (cat === 'melodies') out.push(melody(q));
    // Cubes
    if (q.cube && (q.net || q.views)) out.push(cubeRotation(q));
    if (q.ocube && q.target) out.push(cubeOriented(q));
    return out.filter(Boolean).join('');
  };
})();
