// Explications « Développe » : la même correction, racontée très simplement, comme à un enfant de 5 ans.
// kidExplain(q, cat) part de l'explication normale de la question (q.explain) et de ses données,
// choisit une image concrète adaptée au type de raisonnement, puis redit chaque étape avec des mots simples.
const kidExplain = (function () {
  const strip = s => String(s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // On retire les références savantes (elles restent dans l'explication normale)
  const noSources = s => s
    .replace(/\s*Exemple publié dans .*$/, '')
    .replace(/\s*Labyrinthe de \d+ rangs.*$/, '')
    .replace(/\s*\((?:Format|Army Alpha|Principe|Modèle|modèle|niveau)[^)]*\)/g, '')
    .replace(/\s*\(suite de Fibonacci\)/g, '')
    .replace(/\s*\(Le piège : ([^)]*)\)/, ' Attention au piège : $1')
    .trim();

  // Angles → morceaux de tour, plus parlants qu'un nombre de degrés
  const TOURS = { 45: 'un huitième de tour', 72: 'un cinquième de tour', 90: 'un quart de tour', 135: 'trois huitièmes de tour', 144: 'deux cinquièmes de tour',
    180: 'un demi-tour', 225: 'cinq huitièmes de tour', 270: 'trois quarts de tour', 315: 'sept huitièmes de tour', 360: 'un tour complet' };
  const tour = n => TOURS[n] || `${n} degrés`;

  // Les symboles de maths deviennent des mots
  function words(s) {
    return s
      .replace(/\s*\((?:\d+)°\)/g, '')
      .replace(/\bde (\d+)°/g, (m, n) => /^un/.test(tour(+n)) ? `d’${tour(+n)}` : `de ${tour(+n)}`)
      .replace(/(\d+)°/g, (m, n) => tour(+n))
      .replace(/(\d+)\^(\d+)/g, (m, a, b) => Array(+b).fill(a).join(' fois '))
      .replace(/(\d+)²/g, '$1 fois $1').replace(/(\d+)³/g, '$1 fois $1 fois $1')
      .replace(/\b([A-Z]) = (\d+)/g, '$1 → $2')
      .replace(/ × /g, ' fois ').replace(/ ÷ /g, ' partagé en ')
      .replace(/([\d)€]|\b[nx]|\dx) \+ (?=[\d(]|[nx]\b)/g, '$1 plus ').replace(/([\d)€]|\b[nx]|\dx) − (?=[\d(]|[nx]\b)/g, '$1 moins ')
      .replace(/ ≤ /g, ' ne dépasse pas ')
      .replace(/\b([a-z]) = /g, '$1 vaut ')
      .replace(/ = /g, ', ça fait ')
      .replace(/remplissage/g, 'coloriage')
      .replace(/sens inverse des aiguilles d’une montre/g, 'sens inverse des aiguilles d’une horloge')
      .replace(/sens des aiguilles d’une montre/g, 'même sens que les aiguilles d’une horloge');
  }
  // Une phrase par étape
  const steps = s => words(noSources(strip(s))).split(/(?<=[.!?])\s+(?=[A-ZÀ-ÖØ-Ý«0-9])/).map(t => t.trim()).filter(Boolean);

  const answerOf = q => {
    const o = Array.isArray(q.options) ? q.options[q.answer] : undefined;
    return (typeof o === 'string' || typeof o === 'number') && !/^(target|square|dots|plus|cross|disc|ring|diamond)$/.test(o) ? strip(o) : null;
  };
  const seqLast = q => { const b = strip(q.big).split('·').map(x => x.trim()).filter(x => x && x !== '?'); return b[b.length - 1]; };

  // ---------- Images de départ, selon le raisonnement repéré ----------
  const RULES = {
    // Suites de nombres et de lettres
    seq: [
    [/somme des (deux|trois) précédents/, (m) => `Chaque nombre, c’est les ${m[1]} nombres juste avant lui qui se donnent la main 🤝 : on les ajoute tous ensemble, et ça fait le nombre suivant.`],
    [/Deux suites (sont mélangées|alternent)|Le motif se répète|alternent, chacune/, () => `Ici, il y a <b>deux petits trains</b> 🚂🚃 qui avancent chacun leur tour : un nombre sur deux est dans le train rouge, l’autre dans le train bleu. Chaque train a sa propre règle. On regarde les deux trains séparément.`],
    [/par paires/, () => `Les nombres vont deux par deux, comme des chaussettes 🧦 : dans chaque paire, la 2e chaussette a toujours le même écart avec la 1re.`],
    [/nombres premiers/, () => `Les <b>nombres premiers</b>, ce sont des nombres « têtus » : impossible de les ranger en plusieurs petits tas égaux. Avec 7 bonbons 🍬, tu ne peux pas faire 2 tas pareils, ni 3 : il en reste toujours un ! Les nombres premiers sont 2, 3, 5, 7, 11, 13, 17, 19, 23, 29…`],
    [/Les écarts|écarts grandissent|On avance de \d+, \d+/, () => `Regarde la <b>taille des sauts</b> entre deux nombres, comme une grenouille 🐸 qui saute de nénuphar en nénuphar. Les sauts ne sont pas toujours pareils : ils suivent leur propre petite règle.`],
    [/carrés/, () => `Un nombre « au carré », c’est ce nombre fois lui-même. Pense à une tablette de chocolat bien carrée 🍫 : 3 rangées de 3 carreaux, ça fait 9 carreaux. 4 rangées de 4, ça fait 16.`],
    [/cubes de/, () => `Un nombre « au cube », c’est une grosse pile de petits cubes 🧊 : 2 cubes de long, 2 de large et 2 de haut, ça fait 2 fois 2 fois 2 = 8 petits cubes.`],
    [/produit de deux entiers/, () => `On multiplie deux nombres qui se suivent, comme deux amis côte à côte dans la file : 1 et 2, puis 2 et 3, puis 3 et 4…`],
    [/puissance/, () => `« 3 puissance 4 », c’est 3 fois 3 fois 3 fois 3 : on multiplie 3 par lui-même plusieurs fois, comme une histoire où chaque personne la raconte à 3 nouveaux amis 🗣️.`],
    [/On multiplie par \d+, puis \d+/, () => `À chaque fois, on multiplie, mais par un nombre un peu plus grand : fois 2, puis fois 3, puis fois 4… Ça grandit très vite, comme une boule de neige ⛄ qui roule.`],
    [/[Oo]n alterne|alternativement|alternent entre/, () => `C’est comme une <b>danse</b> 💃 : on fait un pas d’une sorte, puis un pas d’une autre sorte, puis on recommence. Il faut juste savoir quel pas vient maintenant.`],
    [/répétée une fois de plus/, () => `Chaque lettre vient une fois de plus que la précédente, comme un escalier de lettres 🪜 : une fois, deux fois, trois fois…`],
    [/rang dans l’alphabet/, () => `Chaque lettre a son numéro, comme une place dans la file : A est la 1re, B la 2e, C la 3e… On peut compter sur ses doigts en chantant l’alphabet 🎵.`],
    [/lettres?(?: dans l’alphabet)?|La lettre avance/, () => `Récite l’alphabet en comptant sur tes doigts ✋ : A, B, C, D, E… Avancer de 2 lettres, c’est sauter par-dessus une lettre. Reculer, c’est réciter l’alphabet à l’envers.`],
    [/(?:On ajoute|ajoute) (\d+) à chaque fois/, (m) => `Imagine un <b>escalier</b> 🪜 : à chaque marche, on monte de ${m[1]}. Pour trouver la marche suivante, on ajoute encore ${m[1]}.`],
    [/On (?:retire|enlève) (\d+)/, (m) => `C’est comme un paquet de bonbons 🍬 : à chaque fois, on en mange ${m[1]}. Il en reste donc ${m[1]} de moins à chaque étape.`],
    [/multiplié par \d+, (?:plus|moins)|on ajoute \d+ puis on multiplie/, () => `On fait deux petites choses à la suite, comme une recette 🧁 : d’abord une étape, puis l’autre, toujours dans le même ordre.`],
    [/multiplié par (\d+)|[Oo]n multiplie par (\d+) à chaque fois|est le double/, (m) => { const n = m[1] || m[2] || '2'; return `C’est comme des petits lapins 🐰 : à chaque étape, il y en a ${n} fois plus. « ${n} fois plus », c’est mettre ${n} tas pareils l’un à côté de l’autre.`; }],
    [/divisé par (\d+)/, (m) => `C’est comme couper un gâteau 🎂 en ${m[1]} parts égales et n’en garder qu’une : à chaque étape, le nombre devient ${m[1]} fois plus petit.`],

    ],
    // Problèmes de logique
    logic: [
    [/Chaque \S+ est un \S+, et chaque/, () => `Imagine des <b>boîtes rangées les unes dans les autres</b>, comme des poupées russes 🪆. Si la petite boîte est dans la moyenne, et la moyenne dans la grande, alors la petite est forcément dans la grande.`],
    [/aucun \S+ ne peut donc/, () => `Imagine deux boîtes 📦 qui ne se touchent pas du tout. Tout ce qui est rangé dans la première ne peut pas être dans la deuxième.`],
    [/certains \S+ sont donc/, () => `Imagine un groupe d’enfants 🧒 : quelques-uns portent un chapeau, et tous ceux qui portent un chapeau ont des bottes. Alors quelques enfants ont des bottes, c’est sûr !`],
    [/pas forcément|ne peut rien affirmer|On ne peut donc rien affirmer/, () => `Attention, c’est un piège 🪤 : on sait des choses, mais <b>pas assez</b> pour être sûr. Quand on ne peut pas être sûr, on dit « on ne peut pas savoir ».`],
    [/^Du plus (?:rapide|grand|âgé|petit|jeune|lent)|Du plus âgé au plus jeune/, () => `On range tout le monde en <b>file</b>, comme à la récré 🧒🧒🧒 : chaque phrase nous dit qui passe devant qui. On place les enfants un par un.`],
    [/Un seul coûte/, () => `Le truc, c’est de trouver d’abord le prix d’<b>un seul</b> objet 🛒, comme si on en achetait un tout seul. Ensuite, on en prend autant qu’on veut.`],
    [/chemin inverse/, () => `On <b>rembobine le film</b> ⏪ : on fait tout à l’envers, en partant de la fin. Ce qui était « fois 2 » devient « partager en 2 », et ce qui était « plus 8 » devient « moins 8 ».`],
    [/Dans n ans/, () => `Tout le monde grandit d’un an en même temps 🎂. On cherche le jour où le grand aura exactement deux fois l’âge du petit.`],
    [/chats? attrape/, () => `Chaque chat 🐱 travaille tout seul de son côté. Plus on lui laisse de temps, plus il attrape de souris 🐭.`],

    ],
    // Énigmes
    enig: [
    [/bougies/, () => `Avec les petits restes de bougies 🕯️, on peut en refaire des neuves, puis encore les brûler… Il faut compter aussi les bougies qu’on refabrique !`],
    [/intervalles/, () => `Entre les coups, il y a des <b>petits silences</b>. Regarde ta main ✋ : 5 doigts, mais seulement 4 espaces entre eux. Ce sont les espaces qui prennent du temps !`],
    [/Les semaines complètes ne changent rien/, () => `Les jours de la semaine font une <b>ronde</b> 📅 : après dimanche, on revient à lundi. Chaque fois qu’on avance de 7 jours, on retombe sur le même jour. On peut donc oublier les semaines entières et ne compter que ce qui reste.`],
    [/chiffres pour les pages/, () => `On compte les chiffres qu’il faut écrire 📖 : les pages 1 à 9 ont 1 chiffre chacune, les pages 10 à 99 en ont 2, et les pages à partir de 100 en ont 3.`],
    [/cet écart ne change jamais/, () => `Quand tu as un an de plus, ta sœur aussi 🎂 ! L’écart entre vous deux reste <b>toujours le même</b>, toute la vie.`],
    [/se rapprochent/, () => `Deux amis 🚶‍♀️🚶 marchent l’un vers l’autre : chaque heure, l’espace entre eux rétrécit des deux côtés à la fois.`],
    [/morceaux, c’est \d+ coupes/, () => `Pour couper un gâteau 🍰 en 3 morceaux, il suffit de 2 coups de couteau ! Il y a toujours un coup de couteau de moins que de morceaux.`],
    [/Si tous avaient \d+ pattes/, () => `On fait comme si tous les animaux avaient 2 pattes 🐔. Ensuite, on regarde combien de pattes il manque : ce sont les animaux à 4 pattes qui les ont !`],
    [/pesée/, () => `Une balance à deux plateaux ⚖️ partage les pièces en 3 tas : à gauche, à droite, et à côté. À chaque pesée, on sait dans quel tas se cache la pièce lourde.`],
    [/peintre/, () => `On regarde d’abord ce que fait <b>un seul</b> peintre 🎨, puis on multiplie par le nombre de peintres.`],

    ],
    // Déduction (si… alors)
    ded: [
    [/seulement si/, () => `« A seulement si B », ça veut dire que A ne peut pas arriver sans B. Comme : « Tu vas au parc seulement si tu mets tes chaussures 👟. » Tu es au parc ? Alors c’est sûr, tu as tes chaussures.`],
    [/contraposée/, () => `Pense à : « Si tu as mangé le gâteau, il y a des miettes 🍰. » Ça revient au même que : « S’il n’y a pas de miettes, tu n’as pas mangé le gâteau. » Les autres phrases changent l’histoire.`],
    [/La règle s’applique directement/, () => `Une règle « si… alors », c’est comme une <b>promesse</b> 🤝 : « Si tu ranges ta chambre, alors tu auras un dessert. » Ici, le début de la promesse est arrivé, donc la suite arrive aussi.`],
    [/Or c’est faux : c’est donc que/, () => `Pense à : « Si tu as mangé le gâteau, il y a des miettes 🍰. » Pas de miettes ? Alors tu n’as pas mangé le gâteau ! Ici c’est pareil : la suite de la règle n’est pas arrivée, donc le début non plus.`],
    [/ne dit rien du cas/, () => `La promesse dit ce qui se passe <b>si</b> tu ranges ta chambre. Mais si tu ne la ranges pas, la promesse ne dit rien du tout ! Peut-être un dessert, peut-être pas : on ne peut pas savoir 🤷.`],
    [/piège classique/, () => `Il y a des miettes 🍰 ? Ça ne veut pas dire que c’est toi qui as mangé le gâteau : c’est peut-être le chat 🐱 ! Une même chose peut avoir plusieurs causes, alors on ne peut pas savoir.`],
    [/On enchaîne les deux règles/, () => `C’est comme des <b>dominos</b> 🁢 : le premier fait tomber le deuxième, qui fait tomber le troisième.`],
    [/ne peuvent pas être vraies ensemble/, () => `C’est comme être assis et debout en même temps : impossible ! 🪑 Si l’une des deux phrases est vraie, l’autre est forcément fausse.`],
    [/Au moins l’une/, () => `On t’a promis un cadeau 🎁 <b>ou</b> un gâteau 🎂, au moins l’un des deux. Pas de cadeau ? Alors c’est sûr, il y aura le gâteau.`],
    [/Exactement une/, () => `C’est comme pile ou face 🪙 : c’est l’un ou l’autre, jamais les deux, et jamais aucun. Si ce n’est pas pile, c’est face !`],

    ],
    // Matrices
    mat: [
    [/somme des deux premières/, () => `Dans chaque ligne, on <b>verse les deux premières cases dans la troisième</b>, comme deux petits paniers 🧺 qu’on vide dans un grand.`],
    [/vaut la 1re moins la 2e/, () => `Dans chaque ligne, la 2e case <b>retire</b> des formes à la 1re, comme quand on mange des bonbons 🍬 dans un paquet : ce qui reste va dans la 3e case.`],
    [/une seule fois chaque forme|contient une fois chaque forme/, () => `C’est comme le <b>sudoku</b> 🧩 : dans chaque ligne et dans chaque colonne, chaque forme vient une seule fois, comme des amis qui ne veulent pas s’asseoir deux fois à la même table.`],
    [/taille (?:grandit|diminue)/, (m) => `Comme des <b>poupées russes</b> 🪆 : petite, moyenne, grande (ou l’inverse). La forme et le coloriage ne bougent pas, seule la taille change.`],
    [/nombre augmente/, () => `Dans chaque ligne, on <b>compte</b> 1, 2, 3 de gauche à droite, comme on compte ses doigts ☝️✌️.`],
    [/dépend de la colonne|chaque colonne a son|dépend de la ligne/, () => `C’est comme s’habiller 👕👖 : la ligne choisit une chose (par exemple le nombre) et la colonne choisit l’autre (par exemple la forme). Dans la case vide, on met les deux.`],
    [/flèche tourne/, () => `La flèche tourne comme <b>l’aiguille d’une horloge</b> 🕐. Un quart de tour, c’est passer de « midi » à « 3 heures ».`],

    ],
  };
  const RULESETS = { logique: ['seq', 'logic', 'enig'], suites: ['seq'], lettresnombres: ['seq'], alpha: ['seq', 'logic'], enigmes: ['enig', 'logic'], deduction: ['ded'], matrices: ['mat'], verbalmix: ['logic'] };

  // Images propres à une catégorie entière
  const CAT = {
    figures: () => `C’est un <b>tour de magie</b> 🪄 : on regarde ce que la baguette a changé entre la 1re et la 2e case, puis on fait exactement le même tour sur la 3e.`,
    pentagones: q => {
      const e = strip(q.explain);
      const extra = [
        /échangent/.test(e) && ` Deux couleurs <b>échangent leur place</b>, comme deux amis qui échangent leur chaise 🪑.`,
        /tourne/.test(e) && ` La figure <b>tourne comme une roue</b> 🎡 : un cinquième de tour, c’est passer d’une pointe à la suivante.`,
        /miroir/.test(e) && ` La figure se regarde dans un <b>miroir</b> 🪞 : comme ton reflet, la gauche devient la droite.`,
      ].filter(Boolean).join('');
      return `C’est un <b>tour de magie</b> 🪄 : on regarde ce que la baguette a fait à la 1re figure pour donner la 2e, puis on refait le même tour sur la 3e.${extra}`;
    },
    grille2: () => `Il y a <b>deux règles</b> en même temps : une pour les lignes ➡️ et une pour les colonnes ⬇️. C’est comme s’habiller 👕👖 : la ligne choisit le pull, la colonne choisit le pantalon. La case vide doit respecter les deux.`,
    propositions: q => {
      const e = strip(q.explain);
      const n = ((e.split(/situations possibles sont : /)[1] || '').split(/\. /)[0].match(/«/g) || []).length;
      return `On joue aux <b>détectives</b> 🔍 : on imagine toutes les petites histoires possibles qui respectent les deux règles${n ? ` (ici, il y en a ${n})` : ''}. Une réponse est sûre seulement si elle reste vraie dans <b>toutes</b> ces histoires, sans exception.`;
    },
    rotation: q => /plié|patron/.test(strip(q.explain) + strip(q.q))
      ? `Imagine une <b>boîte en carton</b> 📦 qu’on a dépliée à plat. Quand on la replie, deux cases d’une même rangée séparées par une case deviennent le dessus et le dessous : elles ne se voient jamais en même temps, comme le haut et le bas d’un dé 🎲.`
      : `Imagine un <b>dé</b> 🎲 qu’on prend en photo de deux côtés. Le dessin qu’on voit sur les deux photos sert de repère pour recoller les morceaux et savoir où est chaque dessin.`,
    cubesx: () => `Prends un <b>dé</b> 🎲 dans ta main et fais-le tourner : les dessins ne changent jamais de voisins, et ils ne se retournent pas tout seuls. Le bon cube est le même que le cube X, juste tourné. Les autres ont un dessin à l’envers ou deux faces échangées : c’est impossible avec un vrai dé.`,
    labyrinthes: q => {
      const min = /vide/.test(strip(q.explain));
      return `C’est une <b>chasse au trésor</b> 🪙 dans un escalier en zigzag : à chaque marche, tu choisis gauche ou droite, et tu veux ramasser ${min ? 'le <b>moins</b>' : 'le <b>plus</b>'} de pièces d’or possible. L’astuce des grands : on commence par le haut, et on note pour chaque point combien de pièces on peut encore ramasser au-dessus. Puis on redescend.`;
    },
    trace: () => `C’est une <b>chasse au trésor</b> 🪙 : à chaque marche, tu choisis gauche ou droite, et tu veux ramasser le plus de pièces d’or possible. On ne voit pas tout de suite le meilleur chemin, alors l’astuce est de partir du haut : pour chaque point, on note combien de pièces on peut encore gagner au-dessus.`,
    melodies: q => {
      const e = strip(q.explain);
      const m = e.match(/version (\d+) était différente : sa (\d+)e note était plus (aiguë|grave)/i);
      const hi = m && m[3] === 'aiguë';
      return `Imagine la même chanson chantée par un <b>papa ours</b> 🐻 (voix grave, toute basse) puis par une <b>petite souris</b> 🐭 (voix aiguë, toute haute). C’est la même chanson, juste plus haut ou plus bas.` +
        (m ? ` Mais dans la version ${m[1]}, une note s’est trompée : la ${m[2]}e note ${hi ? 'monte trop haut, comme un petit cri de souris 🐭' : 'descend trop bas, comme un gros grognement d’ours 🐻'}. C’est la fausse note !` : '');
    },
    formes: q => {
      const m = strip(q.explain).match(/C’était (une?|des) ([^(]+?) \(/);
      return `C’est comme un <b>puzzle</b> 🧩 où il manque des pièces. Ton cerveau est très fort : avec seulement quelques morceaux, il devine le dessin entier. C’est comme quand tu vois juste deux oreilles derrière le canapé et que tu sais que c’est le chat 🐱 !` +
        (m ? ` Ici, les morceaux faisaient ${m[1]} <b>${m[2]}</b>.` : '');
    },
  };

  // Mémoire : une image selon ce qu'il fallait retenir
  function memo(q) {
    const t = strip(q.q), e = strip(q.explain);
    const start = `Ta mémoire, c’est comme une <b>petite boîte à trésors</b> 🧠 où l’on range les choses quelques secondes.`;
    if (/à l’envers/.test(t + e)) return `${start} Lire à l’envers, c’est comme <b>rembobiner</b> ⏪ : on part de la fin et on revient au début.`;
    if (/premier et le dernier/.test(t)) return `${start} Ici, on n’a besoin que de deux trésors : le <b>premier</b> et le <b>dernier</b>. Ensuite, on les ajoute avec ses doigts ✋.`;
    if (/PAS/.test(t)) return `${start} On cherche l’<b>intrus</b> : celui qui n’était pas dans la boîte, comme un invité qui n’était pas à la fête 🎈.`;
    if (/ordre alphabétique/.test(t)) return `${start} Ensuite, on range les lettres dans l’ordre de la chanson de l’alphabet 🎵 : A, B, C, D…`;
    if (/\d+e chiffre/.test(t)) return `${start} On compte les places comme dans une file d’enfants 🧒 : le 1er, le 2e, le 3e…`;
    if (/ronds?/.test(t)) return `${start} Ici, on compte seulement les ronds d’une couleur, comme quand on compte les bonbons rouges dans un sachet 🍬.`;
    if (/associé/.test(t)) return `${start} Chaque mot avait son numéro, comme chaque enfant a son casier 🗄️ à l’école.`;
    if (/juste après|juste avant/.test(t)) return `${start} Les objets étaient en file comme les <b>wagons d’un train</b> 🚂 : on cherche le wagon juste à côté.`;
    return `${start} On essaie de revoir dans sa tête ce qu’on a vu, comme une photo 📸.`;
  }

  // Questions de mots, de culture, de bon sens
  function verbalish(q, cat) {
    const t = strip(q.q), e = strip(q.explain);
    if (/définition/.test(t)) return `On cherche le mot qui veut dire exactement ce que la phrase raconte, comme quand on joue à deviner un objet 🎁 à partir d’indices.`;
    if (/contraire|sens opposés/.test(t + e)) return `Le <b>contraire</b>, c’est le mot qui dit tout l’inverse, comme <i>jour</i> ☀️ et <i>nuit</i> 🌙, ou <i>grand</i> et <i>petit</i>.`;
    if (/plus proche de|même sens|même chose/.test(t + e)) return `Deux mots qui veulent dire la même chose, c’est comme <b>deux manteaux différents pour la même personne</b> 🧥 : les mots changent, mais l’idée est la même.`;
    if (/est à .* ce qu/.test(t)) return `C’est un <b>jeu de paires</b> 🧦 : on trouve le lien entre les deux premiers mots (à quoi ça sert, qui le fabrique, ce que ça donne…). Puis on cherche le mot qui a <b>le même lien</b> avec le troisième.`;
    if (/mêmes lettres/.test(t)) return `On mélange les lettres comme les perles d’un collier 📿 : on garde exactement les mêmes perles, mais on les range dans un autre ordre pour faire un nouveau mot.`;
    if (/intrus/.test(t)) return `Un <b>intrus</b>, c’est celui qui n’est pas de la même famille, comme une carotte 🥕 dans un panier de fruits 🍎🍐🍌.`;
    if (/Remets ces mots dans l’ordre/.test(t)) return `Les mots sont mélangés comme des <b>pièces de Lego</b> 🧱 : on les remet dans le bon ordre pour faire une vraie phrase. Ensuite, on se demande : est-ce que c’est vrai dans la vraie vie ?`;
    if (/ordre alphabétique/.test(t)) return `On range les mots comme dans un <b>dictionnaire</b> 📖 : on regarde la 1re lettre ; si c’est la même, on regarde la 2e, puis la 3e…`;
    if (/(?:avant-hier|après-demain|hier|demain)\b.*quel jour (?:serons|était|sera|est-on)/i.test(t)) return `Les jours de la semaine font une <b>ronde</b> 📅 : lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche… puis on recommence. D’abord on trouve quel jour on est aujourd’hui. Ensuite, on avance (ou on recule) en comptant sur ses doigts.`;
    if (/\b(?:un|deux|trois|quatre) (?:tiers|quarts?|cinquièmes?|dixièmes?) d/.test(t)) return `Un <b>tiers</b>, c’est couper une pizza 🍕 en 3 parts égales et en prendre une. Un <b>quart</b>, c’est la couper en 4. On fait les découpages l’un après l’autre, en commençant par la fin de la phrase.`;
    if (/Pour moi, /.test(t)) return `On dessine l’<b>arbre de la famille</b> 🌳 dans sa tête : qui est le papa de qui, qui est marié avec qui… et on suit les branches.`;
    if (/rang/.test(t) && /alphabet/.test(t)) return `On récite l’alphabet en comptant sur ses doigts ✋ : un rang avant, c’est la lettre juste avant ; un rang après, c’est la lettre juste après.`;
    if (/plus (?:jeune|âgé·?e?|grand·?e?|petit·?e?|rapide|lent·?e?) qu|plus vite qu/.test(t)) return `On range tout le monde en <b>file</b>, comme à la récré 🧒🧒🧒 : chaque phrase dit qui passe devant qui, et on place les gens un par un.`;
    if (/définition/.test(t)) return `On cherche le mot qui veut dire exactement ce que la phrase raconte, comme quand on joue à deviner un objet 🎁 à partir d’indices.`;
    if (/Les informations ne suffisent pas/.test(e)) return `Parfois, il manque un indice 🧩 : plusieurs réponses restent possibles, alors on ne peut pas savoir.`;
    if (cat === 'alpha' && /épreuve 3/.test(e)) return `C’est une question de <b>bon sens</b> 💡 : on se demande ce qui serait le plus utile ou le plus malin à faire dans la vraie vie.`;
    if (cat === 'alpha' && /épreuve 2/.test(e)) return `C’est un petit problème de calcul 🧮 : on le raconte comme une histoire, puis on compte doucement.`;
    if (/La bonne réponse est :|épreuve 8/.test(e)) return `C’est une question de <b>connaissances</b> 📚 : soit on le sait déjà, soit on l’apprend aujourd’hui… et la prochaine fois, on le saura !`;
    return null;
  }

  const CAT_DEFAULT = {
    logique: `On avance pas à pas, comme un petit détective 🔍.`,
    matrices: `La grille, c’est comme une <b>boîte de rangement</b> 🧺 avec des règles. On lit chaque ligne comme une phrase, de gauche à droite, pour trouver la règle.`,
    suites: `On regarde comment on passe d’un nombre au suivant, comme les marches d’un escalier 🪜.`,
    lettresnombres: `On regarde comment on passe d’un élément au suivant, comme les marches d’un escalier 🪜.`,
    enigmes: `Une énigme, c’est une petite histoire avec un <b>piège</b> 🪤. On la lit doucement, mot par mot, sans se précipiter.`,
    deduction: `Une règle « si… alors », c’est comme une <b>promesse</b> 🤝 : « Si tu ranges ta chambre, alors tu auras un dessert. »`,
    verbal: `On cherche le sens des mots, comme on cherche le nom d’un objet qu’on connaît bien 📖.`,
    verbalmix: `On avance pas à pas, comme un petit détective 🔍.`,
    alpha: `On avance pas à pas, comme un petit détective 🔍.`,
  };

  return function kidExplain(q, cat) {
    if (cat === 'progressives') cat = 'matrices';
    const e = strip(q.explain);
    let intro = null;
    if (CAT[cat]) intro = CAT[cat](q);
    else if (cat === 'memoire') intro = memo(q);
    const byRules = () => { for (const set of RULESETS[cat] || []) for (const [re, fn] of RULES[set]) { const m = e.match(re); if (m) return fn(m, q); } return null; };
    const wordy = ['verbal', 'verbalmix', 'alpha', 'enigmes'].includes(cat);
    // Pour les énigmes, les images précises passent d'abord ; pour les questions de mots, c'est l'inverse
    if (!intro && cat === 'enigmes') intro = byRules() || verbalish(q, cat);
    if (!intro && wordy) intro = verbalish(q, cat);
    if (!intro) intro = byRules();
    if (!intro) intro = CAT_DEFAULT[cat] || `On avance pas à pas, comme un petit détective 🔍.`;

    let list = steps(q.explain);
    if (cat === 'propositions') {
      // Chaque situation possible devient une petite histoire numérotée
      const [, after = ''] = noSources(e).split(/situations possibles sont : /);
      const cut = after.search(/\. (?=«|Aucune)/);
      if (cut > 0) {
        const stories = after.slice(0, cut).split(' ; ').map(x => x.replace(/[«»]/g, '').trim());
        list = [...stories.map((x, i) => `Histoire ${i + 1} : ${x}.`), ...steps(after.slice(cut + 2))];
      }
    }
    const ans = answerOf(q);
    const end = ans && !['propositions', 'melodies', 'formes', 'labyrinthes', 'trace'].includes(cat)
      ? `Donc la bonne réponse, c’est : <b>${esc(ans)}</b> 🎉`
      : cat === 'propositions' && ans ? `La seule réponse vraie dans toutes les histoires, c’est : <b>${esc(ans)}</b> 🎉` : '';
    const last = q.big && /suite|ensuite|suivants?/.test(strip(q.q)) && !/Deux suites|alternent|Le motif se répète|par paires/.test(e) ? seqLast(q) : null;
    return `
      <p class="kid-intro">${intro}</p>
      ${typeof kidPics === 'function' ? kidPics(q, cat) : ''}
      ${list.length ? `<p class="kid-step-title">${last ? `On part du dernier élément, <b>${esc(last)}</b>, et on regarde :` : 'Doucement, étape par étape :'}</p>
      <ol class="kid-steps">${list.map(s => `<li>${esc(s).replace(/&lt;(\/?)b&gt;/g, '<$1b>')}</li>`).join('')}</ol>` : ''}
      ${end ? `<p class="kid-end">${end}</p>` : ''}`;
  };
})();
