// Catégorie « Oreille musicale » : discrimination mélodique, dans le principe décrit par
// Harrison, Musil & Müllensiefen (2016). Trois versions d'une même mélodie sont jouées dans des
// tonalités différentes ; l'une a une note changée. Mélodies générées ici, jouées par le navigateur.

let audioCtx = null;
let melodyStop = null;
const midiFreq = m => 440 * 2 ** ((m - 69) / 12);

// Joue les 3 versions à la suite. onVersion(i) est appelé au début de chaque version, onEnd() à la fin.
function playMelodies(mel, onVersion, onEnd) {
  if (melodyStop) melodyStop();
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const t0 = audioCtx.currentTime + 0.15, d = mel.dur, gap = 0.9, timers = [], nodes = [];
  let t = t0;
  mel.versions.forEach((notes, v) => {
    timers.push(setTimeout(() => onVersion && onVersion(v), (t - audioCtx.currentTime) * 1000));
    notes.forEach(m => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = 'triangle'; o.frequency.value = midiFreq(m);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.35, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + d * 0.95);
      o.connect(g).connect(audioCtx.destination);
      o.start(t); o.stop(t + d);
      nodes.push(o);
      t += d;
    });
    t += gap;
  });
  timers.push(setTimeout(() => { melodyStop = null; onEnd && onEnd(); }, (t - audioCtx.currentTime) * 1000));
  melodyStop = () => { timers.forEach(clearTimeout); nodes.forEach(o => { try { o.stop(); } catch (e) { /* déjà arrêté */ } }); melodyStop = null; };
}

(function () {
  let seed = 6161;
  const R = () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const ri = (a, b) => a + Math.floor(R() * (b - a + 1));
  const pick = a => a[Math.floor(R() * a.length)];
  const sample = (a, n) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b.slice(0, n); };
  const MAJ = [0, 2, 4, 5, 7, 9, 11];
  const deg2midi = (deg, tonic) => tonic + 12 * Math.floor(deg / 7) + MAJ[((deg % 7) + 7) % 7];
  const sign = x => Math.sign(x);
  const ORD = ['1re', '2e', '3e', '4e', '5e', '6e', '7e', '8e'];
  const LEVELS = [
    { name: 'facile', len: [5, 6], contour: 'change', dur: 0.42 },
    { name: 'moyen', len: [6, 7], contour: 'any', dur: 0.38 },
    { name: 'difficile', len: [7, 8], contour: 'keep', dur: 0.34 },
  ];

  function item(k) {
    const L = LEVELS[k % 3], len = ri(L.len[0], L.len[1]);
    // Mélodie en degrés de la gamme majeure, par petits pas (comme une vraie mélodie)
    const degs = [ri(2, 5)];
    while (degs.length < len) {
      const step = pick([-2, -1, -1, 1, 1, 2, 3, -3, 0]);
      degs.push(Math.max(0, Math.min(10, degs[degs.length - 1] + step)));
    }
    // Une note changée (jamais la première), d'un ou deux degrés
    const pos = ri(1, len - 1), delta = pick([-2, -1, 1, 2]);
    const alt = [...degs]; alt[pos] = degs[pos] + delta;
    if (alt[pos] < 0 || alt[pos] > 11) return null;
    const contourOf = d => d.slice(1).map((x, i) => sign(x - d[i]));
    const same = contourOf(degs).join() === contourOf(alt).join();
    if (L.contour === 'keep' && !same) return null;
    if (L.contour === 'change' && same) return null;
    // Trois tonalités différentes (transposition), la version différente placée au hasard
    const tonics = sample([55, 57, 58, 60, 62, 63, 65], 3);
    const odd = ri(0, 2);
    const versions = tonics.map((t, v) => (v === odd ? alt : degs).map(d => deg2midi(d, t)));
    const higher = deg2midi(alt[pos], 60) > deg2midi(degs[pos], 60);
    return {
      q: 'Tu vas entendre trois versions de la même mélodie, chacune dans une tonalité différente (plus aiguë ou plus grave). L’une d’elles a une note changée : laquelle ?',
      melody: { versions, dur: L.dur, degs, alt, odd, pos },
      options: ['Version 1', 'Version 2', 'Version 3'], answer: odd, keepOrder: true,
      explain: `La version ${odd + 1} était différente : sa ${ORD[pos]} note était plus ${higher ? 'aiguë' : 'grave'} (niveau ${L.name}${same ? ', le dessin de la mélodie restait le même' : ', le dessin de la mélodie changeait'}). Les deux autres jouaient exactement la même mélodie, simplement transposée. (Principe du test de Harrison, Musil & Müllensiefen, 2016.)`,
    };
  }

  const qs = [], seen = new Set();
  for (let k = 0; qs.length < 400 && k < 20000; k++) {
    const q = item(qs.length);
    if (!q) continue;
    const key = JSON.stringify(q.melody.versions);
    if (seen.has(key)) continue;
    seen.add(key); qs.push(q);
  }
  TESTS.melodies = { title: 'Oreille musicale', icon: '🎵', color: '#9333ea',
    desc: 'Trois versions d’une mélodie : trouve celle qui a une note changée (avec le son).', audio: true, questions: qs };
})();
