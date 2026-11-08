// Choix du design : bouton flottant « Design » sur chaque page, choix mémorisé dans le navigateur.
// Chargé dans le <head> : redirige tout de suite vers le design choisi, puis ajoute le bouton et les sources.
(function () {
  const KEY = 'tests-qi-theme';
  const THEMES = [
    ['rose', 'Rose pastel', '#f39ab0', '#ffe4ec'],
    ['fantasy', 'Fantasy', '#2a1838', '#b48ad8'],
    ['nuit', 'La ville qui rêve', '#1d2147', '#f6d58b'],
    ['neon', 'Néon rose', '#2a0f22', '#ff5fa2'],
    ['cristal', 'Cristal de lune', '#3e2f7a', '#c9b6ff'],
    ['theatre', 'Théâtre de l’esprit', '#5f567d', '#f4efe9'],
    ['kawaii', 'Stream kawaii', '#4f2030', '#f39ab0'],
    ['planning', 'Planning pixel', '#8f6fe0', '#f6b6d8'],
  ];
  const ids = THEMES.map(t => t[0]);
  const DEFAULT = 'rose';
  const script = document.currentScript;
  const here = (script && script.dataset.theme) || 'accueil';
  const root = here === 'accueil' ? '' : '../../';
  const urlOf = id => `${root}themes/${id}/index.html`; // nom de fichier complet : marche aussi sur les pages publiées

  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch { /* stockage indisponible */ }
  if (here === 'accueil') {
    // L'adresse du site mène toujours au design choisi (ou au design par défaut)
    location.replace(urlOf(ids.includes(saved) ? saved : DEFAULT));
    return;
  }
  // Ouvrir directement une page de design revient à le choisir
  try { localStorage.setItem(KEY, here); } catch { /* rien */ }

  const SOURCES = `Sources : Army Alpha (1918), formes 8 et 5, d'après C. C. Brigham, <em>A Study of American Intelligence</em> (1923) et R. M. Yerkes, <em>Psychological Examining in the United States Army</em> (1921), tous deux dans le domaine public. Une partie des suites avancées reprend les exemples et les modèles de B. Loe, L. Sun, F. Simonfy &amp; P. Doebler (2018), « Evaluating an Automated Number Series Item Generator Using Linear Logistic Test Models », <em>Journal of Intelligence</em>, 6(2), 20 (licence CC BY). Les labyrinthes à tracer reprennent le format du test A-PMT décrit par B. S. Loe &amp; J. Rust (2019), « The perceptual maze test revisited: Evaluating the difficulty of automatically generated mazes », <em>Assessment</em>, 26(8), 1524-1539 ; les labyrinthes eux-mêmes sont générés par ce site. Le format des questions de logique propositionnelle s'inspire de D. Gühne, P. Doebler, D. M. Condon, F. Luo &amp; L. Sun (2020), « Validity and reliability of automatically generated propositional reasoning items », <em>European Journal of Psychological Assessment</em> ; les questions sont générées par ce site. Les analogies de pentagones suivent le principe du générateur d'analogies de figures présenté par P. Doebler (2016), « Variabilität der Itemschwierigkeit durch automatische Itemgenerierung », congrès de la DGPs, Leipzig (règles combinées : rotations, miroirs, échanges de couleurs ; figures inspirées de Max Bill) ; les figures sont générées par ce site. Les analogies 2 × 2 reprennent le format du Test of Figural Analogies : D. Blum, H. Holling, M. S. Galibert &amp; B. Forthmann (2016), « Task difficulty prediction of figural analogies », <em>Intelligence</em>, 56, 72-81 ; et D. Blum &amp; H. Holling (2018), « Automatic Generation of Figural Analogies With the IMak Package », <em>Frontiers in Psychology</em>, 9:1286 ; les questions sont générées par ce site. L'oreille musicale suit le principe des tests de discrimination mélodique décrits par P. M. C. Harrison, J. J. Musil &amp; D. Müllensiefen (2016), « Modelling melodic discrimination tests: Descriptive and explanatory approaches », <em>Journal of New Music Research</em> ; les mélodies sont générées et jouées par ce site. Les cubes orientés reprennent le format des items de rotation 3D de l'ICAR : D. M. Condon &amp; W. Revelle (2014), « The International Cognitive Ability Resource: Development and initial validation of a public-domain measure », <em>Intelligence</em>, 43, 52-64 ; les cubes sont générés par ce site.`;

  const CSS = `
  .tq-btn { position: fixed; right: 18px; bottom: 18px; z-index: 9998; display: flex; align-items: center; gap: 8px; padding: 9px 16px 9px 12px; border: 0; border-radius: 999px; background: #fff; color: #2b2a33; font: 600 14px/1 "Segoe UI", system-ui, sans-serif; cursor: pointer; box-shadow: 0 6px 22px rgba(20, 15, 40, .28), 0 0 0 1px rgba(20, 15, 40, .08); }
  .tq-btn:hover { transform: translateY(-2px); }
  .tq-dot { width: 18px; height: 18px; border-radius: 50%; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15); }
  .tq-panel { position: fixed; right: 18px; bottom: 70px; z-index: 9999; width: 290px; max-width: calc(100vw - 36px); max-height: calc(100vh - 100px); overflow-y: auto; background: #fff; color: #2b2a33; border-radius: 16px; padding: 14px; font: 14px/1.4 "Segoe UI", system-ui, sans-serif; box-shadow: 0 16px 50px rgba(20, 15, 40, .35); }
  .tq-panel[hidden] { display: none; }
  .tq-panel h3 { margin: 0 0 2px; font: 700 16px "Segoe UI", system-ui, sans-serif; color: #2b2a33; }
  .tq-panel p { margin: 0 0 10px; color: #6d6b78; font-size: 12.5px; }
  .tq-list { display: grid; gap: 6px; }
  .tq-opt { display: flex; align-items: center; gap: 10px; width: 100%; padding: 7px 10px; border: 1.5px solid #e3e1ea; border-radius: 12px; background: #fff; color: #2b2a33; cursor: pointer; font: 600 14px "Segoe UI", system-ui, sans-serif; text-align: left; }
  .tq-opt:hover { border-color: #b8b4c8; background: #faf9fc; }
  .tq-opt.on { border-color: #2b2a33; background: #f3f2f7; }
  .tq-opt .tq-dot { width: 26px; height: 26px; flex-shrink: 0; }
  .tq-opt span:last-child { margin-left: auto; font-size: 12px; color: #2b2a33; }
  [data-sources] { display: block; margin-top: 10px; font-size: .78em; line-height: 1.5; opacity: .85; }
  @media (max-width: 600px) { .tq-btn { right: 12px; bottom: 12px; padding: 8px; } .tq-btn b { display: none; } .tq-panel { right: 12px; bottom: 60px; } }`;

  const swatch = t => `background: linear-gradient(135deg, ${t[2]} 0 50%, ${t[3]} 50% 100%)`;

  function build() {
    document.querySelectorAll('[data-sources]').forEach(el => { el.innerHTML = SOURCES; });
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const cur = THEMES.find(t => t[0] === here) || THEMES[0];
    const btn = document.createElement('button');
    btn.className = 'tq-btn'; btn.type = 'button'; btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'tq-panel');
    btn.innerHTML = `<span class="tq-dot" style="${swatch(cur)}"></span><b>Design</b>`;
    btn.title = 'Changer le design du site';
    const panel = document.createElement('div');
    panel.className = 'tq-panel'; panel.id = 'tq-panel'; panel.hidden = true;
    panel.innerHTML = `<h3>Choisis ton design</h3><p>Ton choix est gardé pour tes prochaines visites. Tes scores restent les mêmes dans tous les designs.</p>
      <div class="tq-list">${THEMES.map(t => `<button type="button" class="tq-opt${t[0] === here ? ' on' : ''}" data-id="${t[0]}"><span class="tq-dot" style="${swatch(t)}"></span>${t[1]}<span>${t[0] === here ? '✓' : ''}</span></button>`).join('')}</div>`;
    document.body.append(panel, btn);
    const toggle = open => { panel.hidden = !open; btn.setAttribute('aria-expanded', String(open)); };
    btn.onclick = e => { e.stopPropagation(); toggle(panel.hidden); };
    panel.onclick = e => {
      e.stopPropagation();
      const o = e.target.closest('.tq-opt'); if (!o) return;
      const id = o.dataset.id;
      try { localStorage.setItem(KEY, id); } catch { /* rien */ }
      if (id === here) toggle(false); else location.href = urlOf(id);
    };
    document.addEventListener('click', () => toggle(false));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
