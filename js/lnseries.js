// Catégorie « Suites de lettres et de chiffres » : courtes suites de lettres, de chiffres ou des deux,
// avec 6 propositions, sur le modèle des items « Letter and Number Series » de l'ICAR. Questions originales.
(function () {
  let seed = 909;
  const R = () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const ri = (a, b) => a + Math.floor(R() * (b - a + 1));
  const pick = a => a[Math.floor(R() * a.length)];
  const AL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const L = i => AL[i];
  const ok = i => i >= 0 && i <= 25;
  const Q = 'Quel élément vient ensuite dans cette suite ?';
  const seq = t => t.join(' · ') + ' · ?';
  const plural = n => (n > 1 ? 's' : '');

  // 6 lettres proposées : la bonne + des voisines plausibles
  function letterOpts(ans, extra) {
    const c = [...new Set([ans, ...extra, ans + 1, ans - 1, ans + 2, ans - 2, ans + 3, ans - 3].filter(ok))];
    return c.length >= 6 ? c.slice(0, 6).map(L) : null;
  }
  function numOpts(ans, extra) {
    const c = [...new Set([ans, ...extra, ans + 1, ans - 1, ans + 2, ans - 2, ans * 2, ans + 10].filter(x => Number.isInteger(x) && x >= 0))];
    return c.slice(0, 6).map(String);
  }

  const makers = [
    () => { // lettres à pas constant (en avant ou en arrière)
      const d = pick([1, 2, 3, 4, 5, -1, -2, -3, -4]), n = 5, s = d > 0 ? ri(0, 25 - n * d) : ri(-n * d, 25);
      const t = Array.from({ length: n }, (_, i) => s + i * d), a = s + n * d;
      const o = letterOpts(a, [a + d, t[n - 1] + 1]);
      return o && { q: Q, big: seq(t.map(L)), options: o, rule: 'pas',
        explain: `On ${d > 0 ? 'avance' : 'recule'} de ${Math.abs(d)} lettre${plural(Math.abs(d))} à chaque fois dans l’alphabet : après ${L(t[n - 1])} vient ${L(a)}.` };
    },
    () => { // lettres à pas alternés
      const a1 = ri(1, 3), a2 = ri(1, 4); if (a1 === a2) return null;
      const t = [ri(0, 6)]; for (let i = 0; i < 5; i++) t.push(t[i] + (i % 2 ? a2 : a1));
      // 6 lettres affichées = 5 écarts (a1, a2, a1, a2, a1) : l'écart suivant est a2
      const a = t[5] + a2; if (!ok(a)) return null;
      const o = letterOpts(a, [t[5] + a1]);
      return o && { q: Q, big: seq(t.map(L)), options: o,
        explain: `On avance alternativement de ${a1} puis de ${a2} lettre${plural(a2)}. Le dernier pas était de ${a1}, donc on avance maintenant de ${a2} : après ${L(t[5])} vient ${L(a)}.` };
    },
    () => { // lettres à pas croissants
      const d0 = ri(1, 2), s = ri(0, 5), t = [s];
      for (let i = 0; i < 4; i++) t.push(t[i] + d0 + i);
      const a = t[4] + d0 + 4; if (!ok(a)) return null;
      const o = letterOpts(a, [t[4] + d0 + 3]);
      return o && { q: Q, big: seq(t.map(L)), options: o,
        explain: `Les écarts grandissent de 1 à chaque fois (${[0, 1, 2, 3].map(i => '+' + (d0 + i)).join(', ')}), donc on avance ensuite de ${d0 + 4} : ${L(a)}.` };
    },
    () => { // deux suites de lettres entremêlées (l'une monte, l'autre descend)
      const s1 = ri(0, 8), s2 = ri(17, 25), d1 = ri(1, 3), d2 = ri(1, 3);
      const t = []; for (let i = 0; i < 3; i++) { t.push(s1 + i * d1); t.push(s2 - i * d2); }
      const a = s1 + 3 * d1;
      const o = letterOpts(a, [s2 - 3 * d2, t[4] + 1]);
      return o && { q: Q, big: seq(t.map(L)), options: o,
        explain: `Deux suites alternent : ${[0, 1, 2].map(i => L(s1 + i * d1)).join(', ')} (on avance de ${d1}) et ${[0, 1, 2].map(i => L(s2 - i * d2)).join(', ')} (on recule de ${d2}). La suivante appartient à la 1re suite : ${L(a)}.` };
    },
    () => { // couples lettre + chiffre
      const dl = ri(1, 3), dn = pick([1, 2, 3, 5]), s = ri(0, 10), n0 = ri(1, 9);
      const t = Array.from({ length: 4 }, (_, i) => L(s + i * dl) + (n0 + i * dn));
      const al = s + 4 * dl, an = n0 + 4 * dn; if (!ok(al)) return null;
      const ans = L(al) + an;
      const opts = [...new Set([ans, L(al) + (an + dn), L(al + 1) + an, L(al - 1) + an, L(al) + (an - 1), L(al + dl) + (an + dn), L(al) + (an + 1)])].slice(0, 6);
      return opts.length === 6 && { q: Q, big: seq(t), options: opts,
        explain: `La lettre avance de ${dl} et le nombre augmente de ${dn} à chaque fois : après ${t[3]} vient ${ans}.` };
    },
    () => { // la lettre et son rang dans l'alphabet
      const d = ri(2, 4), s = ri(0, 8), t = Array.from({ length: 4 }, (_, i) => L(s + i * d) + (s + i * d + 1));
      const a = s + 4 * d; if (!ok(a)) return null;
      const ans = L(a) + (a + 1);
      const opts = [...new Set([ans, L(a) + a, L(a) + (a + 2), L(a + 1) + (a + 1), L(a - 1) + a, L(a + 1) + (a + 2)])];
      return opts.length === 6 && { q: Q, big: seq(t), options: opts,
        explain: `Chaque lettre est suivie de son rang dans l’alphabet (A = 1, B = 2…), et on avance de ${d} lettres : ${L(a)} est la ${a + 1}e lettre, donc ${ans}.` };
    },
    () => { // motif de répétition : A, B B, C C C…
      const s = ri(0, 18), grp = [1, 2, 3, 4], t = [];
      grp.forEach((g, i) => { for (let k = 0; k < g; k++) t.push(s + i); });
      const cut = ri(6, 8), shown = t.slice(0, cut), a = t[cut];
      const o = letterOpts(a, [a + 1, a - 1]);
      return o && { q: Q, big: seq(shown.map(L)), options: o,
        explain: `Chaque lettre est répétée une fois de plus que la précédente : ${L(s)} une fois, ${L(s + 1)} deux fois, ${L(s + 2)} trois fois, ${L(s + 3)} quatre fois. La suivante est donc ${L(a)}.` };
    },
    () => { // courtes suites de chiffres
      const kind = pick(['add', 'mul', 'alt', 'sq']);
      let t, a, ex;
      if (kind === 'add') { const d = ri(2, 9), s = ri(1, 20); t = [0, 1, 2, 3, 4].map(i => s + i * d); a = s + 5 * d; ex = `On ajoute ${d} à chaque fois.`; }
      if (kind === 'mul') { const k = ri(2, 3), s = ri(1, 4); t = [0, 1, 2, 3].map(i => s * k ** i); a = s * k ** 4; ex = `On multiplie par ${k} à chaque fois.`; }
      if (kind === 'alt') { const u = ri(2, 6), v = ri(1, 4); t = [ri(1, 9)]; for (let i = 0; i < 5; i++) t.push(t[i] + (i % 2 ? -v : u)); a = t[5] - v; ex = `On alterne +${u} et −${v} ; le dernier pas était +${u}, donc on fait −${v}.`; if (u === v) return null; }
      if (kind === 'sq') { const s = ri(1, 6); t = [0, 1, 2, 3, 4].map(i => (s + i) ** 2); a = (s + 5) ** 2; ex = `Ce sont les carrés de ${s} à ${s + 4} ; le suivant est ${s + 5}² .`; }
      if (t.some(x => x < 0)) return null;
      return { q: 'Quel nombre vient ensuite dans cette suite ?', big: seq(t), options: numOpts(a, [t[t.length - 1] + (t[t.length - 1] - t[t.length - 2])]),
        explain: `${ex} La réponse est ${a}.`.replace('² .', '².') };
    },
  ];

  const qs = [], seen = new Set();
  for (let g = 0; qs.length < 400 && g < 30000; g++) {
    const q = makers[g % makers.length]();
    if (!q || seen.has(q.big) || q.options.length !== 6 || new Set(q.options).size !== 6) continue;
    seen.add(q.big);
    qs.push({ q: q.q, big: q.big, options: q.options, answer: 0, explain: q.explain + ' (Format des suites de lettres et de chiffres de l’ICAR.)' });
  }
  TESTS.lettresnombres = { title: 'Suites de lettres et de chiffres', icon: '🔡', color: '#be185d',
    desc: 'Courtes suites de lettres, de chiffres ou des deux : trouve l’élément suivant parmi 6.', questions: qs };
})();
