// Maquette « Théâtre de l'esprit » : décor de scène dessiné en SVG (rideaux, colonnes, chandeliers, médaillon céleste).
(function () {
  const fmt = n => n.toLocaleString('fr-FR');
  const total = Object.values(TESTS).reduce((s, t) => s + t.questions.length, 0);
  const D = '#5f567d', M = '#9a90b8', L = '#d8d1e8', P = '#f4efe9';

  // Décor latéral : rideau drapé, embrasse à pompon, colonne cannelée, chandelier, vase
  function side() {
    const folds = [30, 60, 90, 120, 150].map((x, i) => `<path d="M${x} 40 C${x - 6} 220 ${x - 30 - i * 6} 380 ${70 + i * 4} 520 C${90 + i * 10} 640 ${x + 4} 780 ${x + 8} 1000" fill="none" stroke="${D}" stroke-width="${i % 2 ? 1.2 : 2}" opacity=".45"/>`).join('');
    const swag = Array.from({ length: 4 }, (_, i) => `<path d="M${i * 60} 34 Q${i * 60 + 30} 92 ${i * 60 + 60} 34" fill="${L}" stroke="${D}" stroke-width="1.5"/><path d="M${i * 60 + 8} 44 Q${i * 60 + 30} 80 ${i * 60 + 52} 44" fill="none" stroke="${D}" stroke-width="1" opacity=".5"/>`).join('');
    const flutes = [192, 202, 212, 222].map(x => `<path d="M${x} 190 V820" stroke="${D}" stroke-width="1.2" opacity=".5"/>`).join('');
    return `<svg viewBox="0 0 240 1000" preserveAspectRatio="xMinYMin slice" class="side-svg">
      <defs>
        <linearGradient id="cur" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b8afd2"/><stop offset=".5" stop-color="#d9d2ea"/><stop offset="1" stop-color="#a69cc4"/></linearGradient>
        <linearGradient id="col" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#cfc8e2"/><stop offset=".5" stop-color="#f3efe9"/><stop offset="1" stop-color="#bdb4d6"/></linearGradient>
        <radialGradient id="fl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6dc" stop-opacity=".9"/><stop offset="1" stop-color="#fff6dc" stop-opacity="0"/></radialGradient>
      </defs>
      <rect x="180" y="160" width="52" height="680" fill="url(#col)" stroke="${D}" stroke-width="1.5"/>${flutes}
      <path d="M170 160 H242 V178 H170 Z M174 146 q12 -22 30 -8 q10 -14 22 0 q16 -12 18 8 Z" fill="${L}" stroke="${D}" stroke-width="1.5"/>
      <path d="M172 840 H240 V858 H172 Z M166 858 H246 V876 H166 Z" fill="${L}" stroke="${D}" stroke-width="1.5"/>
      <path d="M0 30 H178 C160 220 128 380 78 520 C118 600 158 760 168 1000 H0 Z" fill="url(#cur)" stroke="${D}" stroke-width="1.5"/>${folds}
      ${swag}<rect x="0" y="22" width="240" height="14" fill="${M}" stroke="${D}" stroke-width="1.2"/>
      <path d="M58 512 q22 -10 44 6 q-22 12 -44 -6 Z" fill="${M}" stroke="${D}" stroke-width="1.2"/>
      <path d="M100 518 v40" stroke="${D}" stroke-width="1.5"/><path d="M92 556 h16 l-3 36 h-10 Z" fill="${M}" stroke="${D}"/>${[94, 98, 102, 106].map(x => `<path d="M${x} 592 v12" stroke="${D}"/>`).join('')}
      ${[[112, 760, 120], [140, 790, 90]].map(([x, y, h]) => `
        <circle cx="${x}" cy="${y - h - 18}" r="30" fill="url(#fl)"/>
        <path d="M${x} ${y - h - 10} q-5 -10 0 -18 q5 8 0 18 Z" fill="#fff3c4" stroke="#e8c97a"/>
        <rect x="${x - 5}" y="${y - h - 8}" width="10" height="${h * .45}" fill="#faf7f2" stroke="${D}"/>
        <path d="M${x - 14} ${y - h * .55} h28 l-6 8 h-16 Z M${x - 3} ${y - h * .55 + 8} h6 v${h * .5} h-6 Z" fill="${L}" stroke="${D}"/>
        <path d="M${x - 16} ${y} h32 l-6 -10 h-20 Z" fill="${L}" stroke="${D}"/>`).join('')}
      <path d="M196 960 q-22 -40 0 -70 h20 q22 30 0 70 Z" fill="${L}" stroke="${D}" stroke-width="1.5"/><path d="M200 890 q8 -40 30 -60 M206 892 q-14 -30 -30 -40 M210 890 q4 -30 20 -50" fill="none" stroke="${D}" stroke-width="1.5"/>
      <rect x="150" y="960" width="100" height="40" fill="${M}" stroke="${D}"/>
    </svg>`;
  }
  document.getElementById('side-left').innerHTML = side();
  document.getElementById('side-right').innerHTML = side();

  // Médaillon céleste : ciel étoilé, croissant, orbites, étoile-boussole, volutes
  const MEDAL = `
  <svg viewBox="0 0 400 380" class="medal" aria-hidden="true">
    <defs>
      <radialGradient id="msky" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#8a80b0"/><stop offset="1" stop-color="#3f3864"/></radialGradient>
      <radialGradient id="mm" cx=".4" cy=".4" r=".7"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#d9d1e8"/></radialGradient>
    </defs>
    <path d="M200 0 L214 160 L200 380 L186 160 Z M30 190 L190 176 L370 190 L190 204 Z" fill="${L}" stroke="${D}" stroke-width="1.5"/>
    <path d="M200 30 l-22 40 l22 -10 l22 10 Z M200 350 l-22 -40 l22 10 l22 -10 Z" fill="#efeaf6" stroke="${D}" stroke-width="1.2"/>
    ${[[-1, 1], [1, 1]].map(([sx]) => `<path d="M${200 + sx * 138} 120 q${sx * 30} -20 ${sx * 20} -50 q${sx * -10} 20 ${sx * -24} 10 M${200 + sx * 138} 260 q${sx * 30} 20 ${sx * 20} 50 q${sx * -10} -20 ${sx * -24} -10" fill="none" stroke="${D}" stroke-width="2"/>`).join('')}
    <circle cx="200" cy="190" r="138" fill="${P}" stroke="${D}" stroke-width="2"/>
    <circle cx="200" cy="190" r="126" fill="url(#msky)" stroke="${D}" stroke-width="2"/>
    ${Array.from({ length: 40 }, (_, i) => { const a = i * 2.4, r = 20 + (i * 37) % 100; return `<circle cx="${(200 + Math.cos(a) * r).toFixed(1)}" cy="${(190 + Math.sin(a) * r).toFixed(1)}" r="${i % 4 ? .9 : 1.8}" fill="#fff" opacity=".85"/>`; }).join('')}
    <ellipse cx="200" cy="190" rx="110" ry="46" fill="none" stroke="#e6e0f2" stroke-width="1" opacity=".7" transform="rotate(-18 200 190)"/>
    <ellipse cx="200" cy="190" rx="96" ry="96" fill="none" stroke="#e6e0f2" stroke-width=".8" opacity=".5" stroke-dasharray="3 5"/>
    <circle cx="104" cy="212" r="5" fill="#e6e0f2"/><circle cx="292" cy="160" r="4" fill="#e6e0f2"/><circle cx="160" cy="98" r="3" fill="#fff"/>
    <circle cx="214" cy="180" r="52" fill="url(#mm)"/><circle cx="236" cy="168" r="46" fill="url(#msky)"/>
    <path d="M150 120 l3 -8 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 Z M270 250 l2 -6 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 Z" fill="#fff"/>
  </svg>`;
  const ORN = `<svg viewBox="0 0 200 20" class="orn" aria-hidden="true"><path d="M10 10 H80 M120 10 H190" stroke="${M}" stroke-width="1"/><path d="M100 2 l4 8 l-4 8 l-4 -8 Z" fill="${M}"/><circle cx="86" cy="10" r="2" fill="${M}"/><circle cx="114" cy="10" r="2" fill="${M}"/></svg>`;

  function home() {
    clearTimeout(memoTimer);
    if (typeof melodyStop === 'function' && melodyStop) melodyStop();
    app.innerHTML = `
    <section class="parchment">
      ${MEDAL}
      <h1>Le Théâtre de l’Esprit</h1>
      <p class="sub">${fmt(total)} énigmes attendent derrière le rideau</p>
      <form class="ticket" id="ticket">
        <select id="pick" aria-label="Choisis ton épreuve">
          <option value="">Choisis ton épreuve…</option>
          ${Object.entries(TESTS).map(([k, t]) => `<option value="${k}">${t.title}</option>`).join('')}
        </select>
        <button type="submit" class="pill filled">Lever le rideau</button>
        <button type="button" class="pill" data-start="complet">Représentation complète · 40 questions</button>
        <button type="button" class="pill" data-start="progressives">Le grand défi · 30 matrices</button>
      </form>
      ${ORN}
      <h2>Au programme ce soir</h2>
      <ol class="program">${Object.entries(TESTS).map(([k, t], i) => `
        <li><a href="#" data-start="${k}"><span class="act">Acte ${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'][i]}</span>${t.title}</a></li>`).join('')}
      </ol>
      ${ORN}
      <p class="epigraph">« Ici, nul chrono ne presse la pensée : prends le temps de chaque scène. »</p>
    </section>`;
    app.querySelectorAll('[data-start]').forEach(el => el.onclick = e => { e.preventDefault(); startTest(el.dataset.start); window.scrollTo(0, 0); });
    document.getElementById('ticket').onsubmit = e => { e.preventDefault(); startTest(document.getElementById('pick').value || 'complet'); window.scrollTo(0, 0); };
    window.scrollTo(0, 0);
  }

  renderHome = home;
  document.getElementById('logo').onclick = e => { e.preventDefault(); home(); };
  home();
})();
