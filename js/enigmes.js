// 5e catégorie : énigmes classiques, réécrites avec nos propres mots.
// ~75 énigmes écrites à la main + variantes chiffrées des grands classiques, pour arriver à 200.
(function () {
  const TARGET = 400; // les 200 premières sont inchangées : la génération continue simplement plus loin
  let seed = 7310;
  const R = () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const ri = (a, b) => a + Math.floor(R() * (b - a + 1));
  const pick = a => a[Math.floor(R() * a.length)];
  const mix = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const fr = x => String(Math.round(x * 100) / 100).replace('.', ',');
  const pl = (n, w) => `${n} ${w}${n > 1 ? 's' : ''}`;

  // Options numériques : la bonne réponse + 3 pièges (entiers ou décimaux positifs, tous différents)
  function opts(ans, cands, unit = '') {
    const w = [];
    for (const x of mix(cands)) {
      if (x !== ans && x > 0 && Number.isFinite(x) && !w.includes(x)) w.push(x);
      if (w.length === 3) break;
    }
    for (let k = 1; w.length < 3; k++) for (const x of [ans + k, ans - k]) if (x > 0 && !w.includes(x) && w.length < 3) w.push(x);
    return { options: [ans, ...w].map(v => fr(v) + unit), answer: 0 };
  }

  /* ---------------- Énigmes écrites à la main : [question, [bonne, piège, piège, piège], explication, suite?] ---------------- */
  const H = [
    ['Si 5 machines fabriquent 5 objets en 5 minutes, combien de temps faut-il à 100 machines pour fabriquer 100 objets ?', ['5 minutes', '100 minutes', '20 minutes', '1 minute'], 'Chaque machine fabrique 1 objet en 5 minutes. 100 machines font donc 100 objets dans le même temps : 5 minutes.'],
    ['Pendant une course, tu doubles la personne qui est 2e. Quelle place occupes-tu maintenant ?', ['2e', '1re', '3e', 'On ne peut pas savoir'], 'Tu prends sa place : tu es 2e, et elle devient 3e.'],
    ['Combien de mois de l’année comptent au moins 28 jours ?', ['12', '1', '6', '11'], 'Tous les mois ont au moins 28 jours, pas seulement février.'],
    ['Le père de Marie a cinq filles : Nana, Néné, Nini, Nono. Comment s’appelle la cinquième ?', ['Marie', 'Nunu', 'Nina', 'On ne peut pas savoir'], 'L’énoncé le dit dès le début : c’est le père de Marie.'],
    ['Un berger a 17 moutons. Tous sauf 9 s’enfuient. Combien lui en reste-t-il ?', ['9', '8', '17', '0'], '« Tous sauf 9 » s’enfuient : il en reste donc 9.'],
    ['Combien d’animaux de chaque espèce Moïse a-t-il emmenés dans l’arche ?', ['Aucun', '1', '2', '7'], 'Dans le récit, c’est Noé qui construit l’arche, pas Moïse.'],
    ['Dans un tiroir, il y a 10 chaussettes noires et 10 blanches, mélangées. Dans le noir, combien dois-tu en prendre au minimum pour être sûr d’avoir une paire de la même couleur ?', ['3', '2', '11', '20'], 'Avec 2 couleurs, les 2 premières peuvent être différentes, mais la 3e sera forcément de la couleur de l’une d’elles.'],
    ['Avant-hier, j’avais 25 ans, et l’année prochaine j’aurai 28 ans. Quel jour sommes-nous ?', ['Le 1er janvier', 'Le 31 décembre', 'Le 30 décembre', 'C’est impossible'], 'Mon anniversaire est le 31 décembre. Le 30 décembre (avant-hier) j’avais 25 ans, le 31 j’en ai eu 26, cette année j’en aurai 27 et l’an prochain 28.'],
    ['Une fille a autant de frères que de sœurs, mais chacun de ses frères a deux fois plus de sœurs que de frères. Combien y a-t-il d’enfants dans la famille ?', ['7', '5', '6', '8'], '4 filles et 3 garçons : chaque fille a 3 sœurs et 3 frères, chaque garçon a 2 frères et 4 sœurs.'],
    ['Quelle lettre vient ensuite ?', ['H', 'N', 'D', 'O'], 'Ce sont les initiales des nombres : Un, Deux, Trois, Quatre, Cinq, Six, Sept… puis Huit.', 'U · D · T · Q · C · S · S · ?'],
    ['Quelle lettre vient ensuite ?', ['D', 'L', 'M', 'S'], 'Ce sont les initiales des jours de la semaine : après samedi vient dimanche.', 'L · M · M · J · V · S · ?'],
    ['Quelle lettre vient ensuite ?', ['A', 'S', 'J', 'M'], 'Ce sont les initiales des mois : après juillet vient août.', 'J · F · M · A · M · J · J · ?'],
    ['Trois interrupteurs commandent trois ampoules situées dans une autre pièce, qu’on ne voit pas. Tu ne peux aller voir les ampoules qu’une seule fois. Comment savoir quel interrupteur commande quelle ampoule ?', ['Allumer le 1er quelques minutes, l’éteindre, allumer le 2e, puis aller toucher les ampoules', 'Allumer les trois en même temps', 'Allumer le 1er et aller voir', 'C’est impossible'], 'L’ampoule allumée correspond au 2e interrupteur, l’ampoule éteinte mais chaude au 1er, l’ampoule éteinte et froide au 3e.'],
    ['Un fermier doit faire traverser une rivière à un loup, une chèvre et un chou. Sa barque ne porte que lui et un seul passager. Laissés seuls, le loup mange la chèvre et la chèvre mange le chou. Que doit-il emmener en premier ?', ['La chèvre', 'Le loup', 'Le chou', 'Rien, il traverse seul'], 'Le loup ne mange pas le chou : on emmène d’abord la chèvre. Puis le loup, on ramène la chèvre, on emmène le chou, et on revient chercher la chèvre.'],
    ['Deux pères et deux fils vont à la pêche. Ils attrapent 3 poissons et chacun en rapporte un. Comment est-ce possible ?', ['Ils ne sont que trois : un grand-père, son fils et son petit-fils', 'L’un d’eux n’a rien pêché', 'Ils ont coupé un poisson en deux', 'C’est impossible'], 'Le père du milieu est à la fois père et fils : il y a 2 pères et 2 fils, mais seulement 3 personnes.'],
    ['Un coq pond un œuf tout en haut d’un toit pointu. De quel côté l’œuf tombe-t-il ?', ['Aucun : un coq ne pond pas d’œufs', 'À gauche', 'À droite', 'Du côté du vent'], 'Ce sont les poules qui pondent, pas les coqs.'],
    ['Un train électrique roule vers le nord, et le vent souffle vers le sud. Dans quelle direction part la fumée ?', ['Il n’y a pas de fumée', 'Vers le sud', 'Vers le nord', 'Vers le haut'], 'Un train électrique ne produit pas de fumée.'],
    ['Quel est le plus petit nombre entier supérieur à 1 qui, divisé par 2, 3, 4, 5 ou 6, donne toujours un reste de 1 ?', ['61', '31', '121', '25'], 'Ce nombre moins 1 doit être divisible par 2, 3, 4, 5 et 6, donc par 60. Le plus petit est 60 + 1 = 61.'],
    ['Un livre coûte 10 € plus la moitié de son prix. Combien coûte-t-il ?', ['20 €', '15 €', '10 €', '30 €'], 'Si le prix est P : P = 10 + P/2, donc P/2 = 10 et P = 20 €.'],
    ['Il faut 2 minutes pour monter à pied du 1er au 3e étage. Au même rythme, combien de temps pour monter du 1er au 7e étage ?', ['6 minutes', '7 minutes', '4 minutes', '14 minutes'], 'Du 1er au 3e, on monte 2 étages : 1 minute par étage. Du 1er au 7e, on monte 6 étages : 6 minutes.'],
    ['Un médecin te donne 3 comprimés à prendre, un toutes les demi-heures. Combien de temps vont-ils durer ?', ['1 heure', '1 h 30', '2 heures', '30 minutes'], 'Tu prends le 1er tout de suite, le 2e 30 minutes après et le 3e au bout d’une heure.'],
    ['Il y a 5 pommes sur la table. Tu en prends 3. Combien de pommes as-tu ?', ['3', '2', '5', '8'], 'Tu as les 3 pommes que tu as prises.'],
    ['Sur une île, les chevaliers disent toujours la vérité et les fripons mentent toujours. Anna dit, en parlant d’elle et de Bruno : « Nous sommes tous les deux des fripons. » Qui est quoi ?', ['Anna est fripon, Bruno est chevalier', 'Les deux sont fripons', 'Les deux sont chevaliers', 'Anna est chevalier, Bruno est fripon'], 'Un chevalier ne peut pas dire qu’il est fripon : Anna est donc fripon et sa phrase est fausse. Ils ne sont pas tous les deux fripons : Bruno est chevalier.'],
    ['Sur la même île, Claire dit, en parlant d’elle et de David : « Au moins l’un de nous deux est un fripon. » Qui est quoi ?', ['Claire est chevalier, David est fripon', 'Les deux sont fripons', 'Les deux sont chevaliers', 'Claire est fripon, David est chevalier'], 'Si Claire était fripon, sa phrase serait vraie : impossible. Elle est donc chevalier, sa phrase est vraie, et David est fripon.'],
    ['Sur la même île, Emma dit : « Félix est un chevalier. » Félix dit : « Emma et moi sommes de types différents. » Qui est quoi ?', ['Les deux sont fripons', 'Les deux sont chevaliers', 'Emma est chevalier, Félix est fripon', 'Emma est fripon, Félix est chevalier'], 'Si Emma disait vrai, Félix serait chevalier, mais sa phrase « types différents » serait alors fausse. Emma ment donc : Félix est fripon, et ils sont bien du même type.'],
    ['La somme des âges de Paul et de son père est 50 ans. Le père a 4 fois l’âge de Paul. Quel âge a Paul ?', ['10 ans', '12 ans', '8 ans', '12,5 ans'], 'Paul a x ans, son père 4x : x + 4x = 50, donc x = 10.'],
    ['Combien de fois écrit-on le chiffre 9 en écrivant tous les nombres de 1 à 100 ?', ['20', '10', '11', '19'], '9, 19, 29… 99 donnent 10 fois le 9 en unités, et 90 à 99 donnent 10 fois le 9 en dizaines : 20 en tout.'],
    ['Combien de fois écrit-on le chiffre 1 en écrivant tous les nombres de 1 à 20 ?', ['12', '11', '10', '13'], '1, 10, 12, 13… 19 en contiennent un chacun (10 nombres), et 11 en contient deux : 12 en tout.'],
    ['Combien y a-t-il de carrés de toutes tailles dans une grille de 3 × 3 cases ?', ['14', '9', '10', '13'], '9 petits carrés, 4 carrés de 2 × 2 et 1 grand carré de 3 × 3 : 14.'],
    ['Combien y a-t-il de carrés de toutes tailles sur un échiquier de 8 × 8 cases ?', ['204', '64', '65', '100'], 'On additionne les carrés de chaque taille : 64 + 49 + 36 + 25 + 16 + 9 + 4 + 1 = 204.'],
    ['Si 2 + 3 = 10, 7 + 2 = 63 et 6 + 5 = 66, combien font 8 + 4 ?', ['96', '12', '32', '84'], 'La règle est a × (a + b) : 2 × 5 = 10, 7 × 9 = 63, 6 × 11 = 66, donc 8 × 12 = 96.'],
    ['Un homme montre un portrait et dit : « Je n’ai ni frère ni sœur, mais le père de cet homme est le fils de mon père. » Qui est sur le portrait ?', ['Son fils', 'Lui-même', 'Son père', 'Son neveu'], 'Sans frère ni sœur, « le fils de mon père », c’est moi. Le père de l’homme du portrait, c’est donc moi : c’est mon fils.'],
    ['Un homme est né en 1990 et il est mort en 1960, à 30 ans. Comment est-ce possible ?', ['Ces années sont avant Jésus-Christ', 'Il a voyagé dans le temps', 'C’est une erreur de date', 'Il est né dans un autre pays'], 'Avant notre ère, les années se comptent à rebours : de 1990 av. J.-C. à 1960 av. J.-C., il s’écoule 30 ans.'],
    ['Si avant-hier était jeudi, quel jour serons-nous après-demain ?', ['Lundi', 'Dimanche', 'Samedi', 'Mardi'], 'Si avant-hier était jeudi, aujourd’hui est samedi. Après-demain, ce sera lundi.'],
    ['Si demain est mardi, quel jour était avant-hier ?', ['Samedi', 'Dimanche', 'Vendredi', 'Jeudi'], 'Si demain est mardi, aujourd’hui est lundi. Avant-hier, c’était samedi.'],
    ['Combien de fois peut-on soustraire 5 de 25 ?', ['Une seule fois', '5 fois', '4 fois', 'Autant qu’on veut'], 'Après la première soustraction, on ne soustrait plus 5 de 25 mais de 20.'],
    ['Qu’est-ce qui est le plus lourd : un kilo de plumes ou un kilo de plomb ?', ['Ils pèsent pareil', 'Le plomb', 'Les plumes', 'Ça dépend du volume'], 'Un kilo reste un kilo, quelle que soit la matière.'],
    ['Dans une classe, 60 % des élèves sont des filles, et 25 % des filles portent des lunettes. Quelle part de la classe est faite de filles à lunettes ?', ['15 %', '25 %', '35 %', '40 %'], '25 % de 60 % : 0,25 × 60 = 15 %.'],
    ['La moyenne de 4 nombres est 10. On ajoute le nombre 20. Quelle est la nouvelle moyenne ?', ['12', '15', '11', '10'], 'La somme des 4 nombres est 40. Avec 20, on obtient 60 pour 5 nombres : 60 ÷ 5 = 12.'],
    ['Combien de fois les deux aiguilles d’une horloge se superposent-elles en 12 heures ?', ['11', '12', '24', '10'], 'L’aiguille des minutes rattrape celle des heures toutes les 12/11 d’heure (environ 1 h 05) : en 12 heures, cela fait 11 fois.'],
    ['Trois roues dentées sont alignées et chacune entraîne la suivante. La première tourne dans le sens des aiguilles d’une montre. Dans quel sens tourne la troisième ?', ['Dans le sens des aiguilles d’une montre', 'Dans le sens inverse', 'Elle ne tourne pas', 'On ne peut pas savoir'], 'Chaque roue inverse le sens de la précédente : la 2e tourne dans l’autre sens, la 3e retrouve le sens de la 1re.'],
    ['Tous les chats ont quatre pattes. Mon animal a quatre pattes. Que peut-on en conclure ?', ['On ne peut pas savoir si c’est un chat', 'C’est un chat', 'Ce n’est pas un chat', 'Tous les animaux à quatre pattes sont des chats'], 'Beaucoup d’animaux ont quatre pattes sans être des chats : on ne peut rien conclure.'],
    ['Un train de 1 km de long entre dans un tunnel de 1 km, à 60 km/h. Combien de temps faut-il pour qu’il en soit entièrement sorti ?', ['2 minutes', '1 minute', '1 minute 30', '3 minutes'], 'L’avant parcourt 1 km dans le tunnel, puis encore 1 km pour que l’arrière en sorte : 2 km, à 1 km par minute.'],
    ['Pendant une course, tu dépasses le dernier. Quelle place occupes-tu ?', ['C’est impossible', 'Avant-dernier', 'Dernier', 'Premier'], 'Pour dépasser le dernier, il faudrait être derrière lui : c’est donc toi qui serais le dernier.'],
    ['Un nombre à deux chiffres a des chiffres dont la somme vaut 9. Si on inverse ses chiffres, il augmente de 27. Quel est ce nombre ?', ['36', '45', '27', '63'], '36 : 3 + 6 = 9, et 63 − 36 = 27.'],
    ['Un père et son fils ont un accident. Le père est soigné sur place ; le fils est emmené à l’hôpital, où le chirurgien dit : « Je ne peux pas opérer ce garçon, c’est mon fils. » Comment est-ce possible ?', ['Le chirurgien est sa mère', 'Le chirurgien est son grand-père', 'C’est son oncle', 'C’est impossible'], 'Le chirurgien est une chirurgienne : c’est la mère du garçon.'],
    ['Qu’est-ce qui a des dents mais ne mord jamais ?', ['Un peigne', 'Un requin', 'Un chien', 'Un crocodile'], 'Un peigne a des dents, mais il ne mord pas.'],
    ['Plus j’en fais, plus j’en laisse derrière moi. Que suis-je ?', ['Des pas', 'Des erreurs', 'Des amis', 'Du bruit'], 'À chaque pas que tu fais, tu en laisses un derrière toi.'],
    ['Qu’est-ce qui monte et descend sans jamais bouger ?', ['Un escalier', 'Un ascenseur', 'Un ballon', 'Une balançoire'], 'Un escalier « monte » et « descend », mais il ne bouge pas.'],
    ['Qu’est-ce qui t’appartient, mais que les autres utilisent plus que toi ?', ['Ton prénom', 'Ta voiture', 'Ton téléphone', 'Ta maison'], 'Les autres disent ton prénom bien plus souvent que toi.'],
    ['Je suis toujours devant toi, mais tu ne peux jamais me voir. Que suis-je ?', ['L’avenir', 'Le ciel', 'Ton ombre', 'Le vent'], 'L’avenir est toujours devant toi, mais on ne le voit jamais.'],
    ['Il est 9 h. Quelle heure sera-t-il dans 50 heures ?', ['11 h', '9 h', '23 h', '13 h'], '50 heures = 2 jours (48 h) + 2 h : il sera 11 h.'],
    ['Quel nombre vient ensuite ?', ['312211', '122111', '1112221', '211211'], 'Chaque nombre décrit le précédent à voix haute : 111221 se lit « trois 1, deux 2, un 1 », soit 312211.', '1 · 11 · 21 · 1211 · 111221 · ?'],
    ['Quel nombre vient ensuite ?', ['33', '25', '34', '31'], 'Chaque nombre est le double du précédent moins 1 : 17 × 2 − 1 = 33.', '2 · 3 · 5 · 9 · 17 · ?'],
    ['Quel nombre vient ensuite ?', ['3125', '1024', '625', '512'], 'Ce sont 1¹, 2², 3³, 4⁴, puis 5⁵ = 3 125.', '1 · 4 · 27 · 256 · ?'],
    ['Quel nombre vient ensuite ?', ['0', '1', '2', '3'], 'On retire 1, puis 2, puis 3, puis 4 : 4 − 4 = 0.', '10 · 9 · 7 · 4 · ?'],
    ['Quel nombre vient ensuite ?', ['360', '144', '288', '216'], 'On multiplie par 2, puis 3, puis 4, puis 5 : 72 × 5 = 360.', '3 · 6 · 18 · 72 · ?'],
    ['Tu entres dans une pièce sombre avec une seule allumette. Il y a une bougie, une lampe à huile et un poêle à bois. Qu’allumes-tu en premier ?', ['L’allumette', 'La bougie', 'La lampe à huile', 'Le poêle'], 'Avant tout le reste, il faut allumer l’allumette.'],
    ['La seule fille de la mère de ma mère, c’est…', ['Ma mère', 'Ma tante', 'Ma grand-mère', 'Ma cousine'], 'La mère de ma mère est ma grand-mère. Si elle n’a qu’une fille, c’est forcément ma mère.'],
    ['Le fils unique du père de mon père, c’est…', ['Mon père', 'Mon oncle', 'Mon grand-père', 'Mon frère'], 'Le père de mon père est mon grand-père. S’il n’a qu’un fils, c’est mon père.'],
    ['Sur un dé à six faces classique, combien vaut la somme de deux faces opposées ?', ['7', '6', '8', 'Ça dépend des faces'], 'Sur un dé classique, 1 est opposé à 6, 2 à 5 et 3 à 4 : la somme vaut toujours 7.'],
    ['Avec seulement des pièces de 2 € et de 5 €, quel montant est impossible à payer exactement ?', ['3 €', '7 €', '9 €', '11 €'], '7 = 5 + 2, 9 = 5 + 2 + 2 et 11 = 5 + 2 + 2 + 2, mais 3 € ne peut pas s’obtenir.'],
    ['Une poule et demie pond un œuf et demi en un jour et demi. Combien d’œufs une poule pond-elle en 3 jours ?', ['2', '1', '3', '1,5'], 'Une poule pond 1 œuf en un jour et demi, donc 2 œufs en 3 jours.'],
    ['Un homme pousse sa voiture jusqu’à un hôtel et annonce aussitôt qu’il est ruiné. Pourquoi ?', ['Il joue au Monopoly', 'Sa voiture est en panne', 'L’hôtel est trop cher', 'Il a perdu son portefeuille'], 'C’est une partie de Monopoly : son pion voiture tombe sur une case avec un hôtel, et le loyer le ruine.'],
    ['Paul a 4 sœurs. Chacune de ses sœurs a un frère. Combien y a-t-il d’enfants dans la famille ?', ['5', '8', '9', '6'], 'Les 4 sœurs ont toutes le même frère : Paul. 4 + 1 = 5 enfants.'],
    ['Un camion de 4 m de haut est bloqué sous un pont de 3,99 m. Comment le faire passer sans rien démonter ?', ['Dégonfler un peu les pneus', 'Accélérer', 'Peindre le camion', 'Passer en marche arrière'], 'En dégonflant un peu les pneus, le camion perd les quelques millimètres nécessaires.'],
    ['Un bus part avec 20 passagers. Au 1er arrêt, 5 descendent et 3 montent. Au 2e arrêt, 8 descendent et 2 montent. Combien d’arrêts le bus a-t-il faits ?', ['2', '12', '10', '3'], 'La question porte sur le nombre d’arrêts, pas sur les passagers : 2.'],
    ['Tu plies une feuille de papier en deux, 3 fois de suite. Combien d’épaisseurs obtiens-tu ?', ['8', '6', '3', '9'], 'Chaque pliage double le nombre d’épaisseurs : 2, 4, puis 8.'],
    ['Tu coupes une ficelle de 10 m en morceaux de 1 m. Combien de coupes fais-tu ?', ['9', '10', '11', '5'], 'Pour obtenir 10 morceaux, il suffit de 9 coupes : la dernière coupe sépare les deux derniers morceaux.'],
    ['Combien de piquets faut-il pour une clôture droite de 20 m, avec un piquet tous les 2 m, y compris aux deux bouts ?', ['11', '10', '12', '20'], 'Il y a 10 intervalles de 2 m, donc 11 piquets.'],
    ['Une montre retarde de 2 minutes par heure. De combien retarde-t-elle au bout d’une journée ?', ['48 minutes', '24 minutes', '2 heures', '1 heure'], '24 heures × 2 minutes = 48 minutes.'],
    ['Combien de jours y a-t-il dans 4 années qui se suivent, dont une bissextile ?', ['1461', '1460', '1464', '1465'], '3 × 365 + 366 = 1 461 jours.'],
    ['Avec 6 allumettes, peut-on former 4 triangles dont tous les côtés mesurent une allumette ?', ['Oui, en formant une pyramide à 4 faces', 'Non, c’est impossible', 'Oui, en cassant des allumettes', 'Oui, à plat, en étoile'], 'À plat c’est impossible, mais en 3D, une pyramide à base triangulaire (un tétraèdre) a 6 arêtes et 4 faces triangulaires.'],
  ];

  /* ---------------- Variantes chiffrées des grands classiques ---------------- */
  const T = [
    () => { // l'escargot dans le puits
      const [who, p] = pick([['un escargot', 'il'], ['une grenouille', 'elle'], ['une limace', 'elle'], ['un lézard', 'il']]);
      const D = ri(6, 30), u = ri(2, 6), d = ri(1, u - 1);
      if (u >= D) return null;
      const k = Math.ceil((D - u) / (u - d)), ans = k + 1;
      return { q: `${cap(who)} est au fond d’un puits de ${D} m. Chaque jour, ${p} monte de ${u} m, mais chaque nuit ${p} glisse de ${d} m. Au bout de combien de jours sort-${p} du puits ?`,
        ...opts(ans, [Math.ceil(D / (u - d)), ans + 1, ans - 1, Math.ceil(D / u)]),
        explain: `Chaque jour et nuit complets, ${p} gagne ${u - d} m. Le dernier jour, ${p} sort avant de glisser : il suffit d’être à ${D - u} m le matin, ce qui prend ${pl(k, 'jour')}. ${cap(p)} sort donc le jour ${ans}.` };
    },
    () => { // ce qui double chaque jour
      const L = ri(8, 60), half = R() < 0.6;
      const [intro, unit] = pick([
        [`Des nénuphars doublent leur surface chaque jour. Il leur faut ${L} jours pour couvrir tout l’étang.`, 'jour'],
        [`Des algues doublent leur surface chaque jour. Il leur faut ${L} jours pour recouvrir tout le lac.`, 'jour'],
        [`Une colonie de bactéries double de taille chaque minute. Il lui faut ${L} minutes pour remplir tout un bocal.`, 'minute'],
      ]);
      const ans = half ? L - 1 : L - 2;
      return { q: `${intro} Au bout de combien de ${unit}s en était-on ${half ? 'à la moitié' : 'au quart'} ?`,
        ...opts(ans, [Math.round(L / 2), Math.round(L / 4), half ? L - 2 : L - 1, ans - 2]),
        explain: (() => {
          const one = unit === 'jour' ? 'un jour' : 'une minute';
          return `Comme tout double à chaque ${unit}, on était à la moitié ${one} avant la fin${half ? '' : `, et au quart deux ${unit}s avant`} : au bout de ${pl(ans, unit)}.`;
        })() };
    },
    () => { // la raquette et la balle
      const ball = ri(1, 40) * 5, diff = ri(2, 20) * 50, total = 2 * ball + diff;
      const e = cts => (cts / 100).toFixed(2).replace('.', ',') + ' €';
      const [a, b] = pick([['une raquette', 'une balle'], ['un stylo', 'une recharge'], ['un livre', 'un marque-page'], ['une tasse', 'une soucoupe'], ['une lampe', 'une ampoule']]);
      const w = [2 * ball, ball + 5, ball + 10, ball - 5].filter(x => x > 0 && x !== ball);
      const o = [...new Set(w)].slice(0, 3);
      if (o.length < 3) return null;
      return { q: `${cap(a)} et ${b} coûtent ${e(total)} au total. ${cap(a)} coûte ${e(diff)} de plus qu’${b}. Combien coûte ${b} ?`,
        options: [e(ball), ...o.map(e)], answer: 0,
        explain: `Si ${b} coûte x, ${a} coûte x + ${e(diff)}. Donc 2x + ${e(diff)} = ${e(total)}, soit x = ${e(ball)}. Vérification : ${e(ball)} + ${e(ball + diff)} = ${e(total)}. (Le piège : répondre ${e(2 * ball)}.)` };
    },
    () => { // poignées de main / matchs
      const n = ri(4, 16), ans = n * (n - 1) / 2, match = R() < 0.4;
      return { q: match ? `Dans un tournoi de ${n} équipes, chaque équipe affronte une fois chacune des autres. Combien de matchs y a-t-il en tout ?`
                        : `${n} personnes se retrouvent et chacune serre la main de toutes les autres, une seule fois. Combien de poignées de main en tout ?`,
        ...opts(ans, [n * (n - 1), n * n, ans + n, (n - 1) * (n - 2) / 2]),
        explain: `Chacun ${match ? 'joue' : 'serre la main de'} ${n - 1} ${match ? 'matchs' : 'personnes'} : ${n} × ${n - 1} = ${n * (n - 1)}. Mais chaque ${match ? 'match' : 'poignée'} est comptée deux fois : ${n * (n - 1)} ÷ 2 = ${ans}.` };
    },
    () => { // couper une bûche
      const per = ri(2, 8), p1 = ri(2, 5), p2 = ri(p1 + 1, 10), ans = per * (p2 - 1);
      return { q: `Il faut ${per * (p1 - 1)} minutes pour couper une bûche en ${p1} morceaux. Combien de minutes faut-il pour la couper en ${p2} morceaux ?`,
        ...opts(ans, [Math.round(per * (p1 - 1) / p1 * p2), per * p2, ans - per]),
        explain: `${p1} morceaux, c’est ${pl(p1 - 1, 'coupe')}, donc ${per} min par coupe. ${p2} morceaux, c’est ${p2 - 1} coupes : ${p2 - 1} × ${per} = ${ans} min.` };
    },
    () => { // l'horloge qui sonne
      const per = ri(1, 3), k1 = ri(3, 6), k2 = ri(k1 + 2, 12), ans = per * (k2 - 1);
      return { q: `Une horloge met ${per * (k1 - 1)} secondes pour sonner ${k1} coups. Combien de secondes lui faut-il pour sonner ${k2} coups ?`,
        ...opts(ans, [Math.round(per * (k1 - 1) / k1 * k2), per * k2, ans + per]),
        explain: `Entre ${k1} coups, il y a ${k1 - 1} intervalles, soit ${per} s chacun. Entre ${k2} coups, il y a ${k2 - 1} intervalles : ${k2 - 1} × ${per} = ${ans} s.` };
    },
    () => { // travailleurs
      const [P, S, V, v, s] = pick([['peintres', 'murs', 'peignent', 'peint', 'mur'], ['boulangers', 'gâteaux', 'préparent', 'prépare', 'gâteau'], ['jardiniers', 'haies', 'taillent', 'taille', 'haie']]);
      const a = ri(2, 6), k = ri(1, 3), m = ri(1, 3);
      if (k === 1 && m === 1) return null;
      const ans = a * k * m;
      return { q: `${a} ${P} ${V} ${a} ${S} en ${a} heures. Combien de ${S} ${V} ${a * k} ${P} en ${a * m} heures ?`,
        ...opts(ans, [a * k, a * m, a * k + a * m, ans * 2]),
        explain: `Un seul ${P.slice(0, -1)} ${v} 1 ${s} en ${a} heures. En ${a * m} heures, il en fait ${m}. À ${a * k}, ils en font ${a * k} × ${m} = ${ans}.` };
    },
    () => { // vitesse moyenne
      const [v1, v2] = pick([[60, 40], [30, 60], [20, 30], [40, 120], [50, 75], [60, 90], [30, 70], [12, 24], [80, 120], [45, 90], [10, 40], [15, 30]]);
      const ans = 2 * v1 * v2 / (v1 + v2);
      return { q: `Tu fais l’aller à ${v1} km/h et le retour, par la même route, à ${v2} km/h. Quelle est ta vitesse moyenne sur l’aller-retour ?`,
        ...opts(ans, [(v1 + v2) / 2, Math.max(v1, v2) - Math.min(v1, v2), ans + 5], ' km/h'),
        explain: `Ce n’est pas la moyenne simple : on passe plus de temps à la vitesse la plus lente. Vitesse moyenne = 2 × ${v1} × ${v2} ÷ (${v1} + ${v2}) = ${fr(ans)} km/h.` };
    },
    () => { // deux robinets
      const [a, b] = pick([[3, 6], [4, 12], [6, 12], [10, 15], [12, 24], [20, 30], [5, 20], [8, 24], [9, 18], [14, 35], [6, 30], [15, 30]]);
      const ans = a * b / (a + b);
      return { q: `Un robinet remplit une baignoire en ${a} minutes, un autre en ${b} minutes. Ouverts ensemble, en combien de minutes la remplissent-ils ?`,
        ...opts(ans, [(a + b) / 2, a + b, b - a], ' min'),
        explain: `En une minute, le 1er remplit 1/${a} de la baignoire et le 2e 1/${b}. Ensemble : 1/${a} + 1/${b} = 1/${ans}. Il faut donc ${ans} minutes.` };
    },
    () => { // billes dans un sac
      const cols = mix([['rouges', 'rouge'], ['bleues', 'bleue'], ['vertes', 'verte'], ['jaunes', 'jaune'], ['noires', 'noire'], ['blanches', 'blanche']]).slice(0, ri(2, 4));
      const ns = cols.map(() => ri(2, 9)), total = ns.reduce((x, y) => x + y);
      const list = cols.map((c, i) => `${ns[i]} ${c[0]}`);
      const txt = `${list.slice(0, -1).join(', ')} et ${list[list.length - 1]}`;
      if (R() < 0.5) {
        const ans = cols.length + 1;
        return { q: `Un sac contient des billes : ${txt}. Sans regarder, combien dois-tu en tirer au minimum pour être sûr d’en avoir deux de la même couleur ?`,
          ...opts(ans, [cols.length, 3, total, ans + 1]),
          explain: `Au pire, les ${cols.length} premières billes sont toutes de couleurs différentes. La suivante tombe forcément sur une couleur déjà tirée : ${ans}.` };
      }
      const k = ri(0, cols.length - 1), ans = total - ns[k] + 1;
      return { q: `Un sac contient des billes : ${txt}. Sans regarder, combien dois-tu en tirer au minimum pour être sûr d’avoir au moins une bille ${cols[k][1]} ?`,
        ...opts(ans, [ns[k], total, ans - 1, ns[k] + 1]),
        explain: `Au pire, tu tires d’abord les ${total - ns[k]} billes des autres couleurs. La suivante est forcément ${cols[k][1]} : ${ans}.` };
    },
    () => { // jours de la semaine
      const J = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
      const d = ri(0, 6), N = ri(8, 400), r = N % 7, ans = J[(d + N) % 7];
      return { q: `Nous sommes ${J[d]}. Quel jour serons-nous dans ${N} jours ?`,
        options: [ans, ...mix(J.filter(x => x !== ans)).slice(0, 3)].map(cap), answer: 0,
        explain: `${N} = 7 × ${Math.floor(N / 7)} + ${r}. Les semaines complètes ne changent rien : ${r === 0 ? 'on retombe sur le même jour' : `on avance de ${pl(r, 'jour')} à partir de ${J[d]}`}, donc ${ans}.` };
    },
    () => { // deux trains qui se croisent
      const t = ri(1, 5), v1 = ri(4, 12) * 10, v2 = ri(4, 12) * 10, D = t * (v1 + v2);
      return { q: `Deux trains partent en même temps de deux villes distantes de ${D} km et roulent l’un vers l’autre, à ${v1} km/h et à ${v2} km/h. Au bout de combien d’heures se croisent-ils ?`,
        ...opts(t, [D / v1, D / v2, t + 1, D / (v1 + v2) * 2], ' h'),
        explain: `Ils se rapprochent de ${v1} + ${v2} = ${v1 + v2} km chaque heure : ${D} ÷ ${v1 + v2} = ${t} h.` };
    },
    () => { // âge d'un parent et d'un enfant
      const [P, C, p] = pick([['Une mère', 'sa fille', 'elle'], ['Un père', 'son fils', 'il'], ['Une mère', 'son fils', 'elle'], ['Un père', 'sa fille', 'il']]);
      const [k, j] = pick([[3, 2], [4, 3], [5, 3], [4, 2], [5, 4], [5, 2], [6, 4]]);
      const n = ri(2, 20), num = n * (j - 1);
      if (num % (k - j)) return null;
      const s = num / (k - j);
      if (s < 2 || k * s > 80 || (k - 1) * s < 18) return null;
      return { q: `${P} a aujourd’hui ${k} fois l’âge de ${C}. Dans ${n} ans, ${p} aura ${j} fois l’âge de ${C}. Quel âge a ${C} aujourd’hui ?`,
        ...opts(s, [n, s + 2, s * 2, k * s], ' ans'),
        explain: `Si ${C} a x ans : ${k}x + ${n} = ${j} × (x + ${n}), donc ${k - j}x = ${num} et x = ${s}. Vérification : dans ${n} ans, ${k * s + n} = ${j} × ${s + n}.` };
    },
    () => { // engrenages
      const a = ri(2, 8) * 5, b = ri(2, 8) * 5;
      if (a === b) return null;
      const g = (x, y) => (y ? g(y, x % y) : x);
      const t = (b / g(a, b)) * ri(1, 3), ans = t * a / b;
      return { q: `Une roue dentée de ${a} dents entraîne une roue de ${b} dents. Quand la première fait ${t} tours, combien de tours fait la seconde ?`,
        ...opts(ans, [t * b / a, t, ans + 1]),
        explain: `${t} tours × ${a} dents = ${t * a} dents qui passent. La seconde roue a ${b} dents : ${t * a} ÷ ${b} = ${ans} tours.` };
    },
    () => { // recycler les bougies
      const r = ri(2, 5), N = ri(r + 2, 40);
      let total = N, stubs = N; const steps = [N];
      while (stubs >= r) { const nw = Math.floor(stubs / r); total += nw; steps.push(nw); stubs = stubs % r + nw; }
      return { q: `Avec les restes de ${r} bougies, on peut fabriquer une nouvelle bougie. Tu as ${N} bougies. Combien de bougies peux-tu faire brûler en tout ?`,
        ...opts(total, [N, N + Math.floor(N / r), total + 1, total - 1]),
        explain: `On brûle les ${N} bougies, puis on refabrique avec les restes, et on recommence avec les nouveaux restes : ${steps.join(' + ')} = ${total}.` };
    },
    () => { // hausse puis baisse
      const x = pick([10, 20, 30, 40, 50, 25]), up = R() < 0.6, loss = x * x / 100;
      const first = up ? `augmente de ${x} %, puis baisse de ${x} %` : `baisse de ${x} %, puis augmente de ${x} %`;
      const mid = up ? 100 + x : 100 - x;
      return { q: `Le prix d’un article ${first}. Par rapport au prix de départ, il est…`,
        options: [`${fr(loss)} % moins cher`, 'Au même prix', `${fr(loss)} % plus cher`, `${x} % moins cher`], answer: 0,
        explain: `Avec 100 € au départ : on passe à ${mid} €, puis ${up ? 'on retire' : 'on ajoute'} ${x} % de ${mid} €, soit ${fr(mid * x / 100)} €. On arrive à ${fr(100 - loss)} € : ${fr(loss)} % de moins.` };
    },
    () => { // numéroter les pages
      const N = ri(20, 999);
      const ans = Math.min(N, 9) + Math.max(0, Math.min(N, 99) - 9) * 2 + Math.max(0, N - 99) * 3;
      const parts = ['9 chiffres pour les pages 1 à 9'];
      parts.push(`${(Math.min(N, 99) - 9) * 2} pour les pages 10 à ${Math.min(N, 99)}`);
      if (N > 99) parts.push(`${(N - 99) * 3} pour les pages 100 à ${N}`);
      return { q: `Pour numéroter les pages d’un livre de 1 à ${N}, combien de chiffres faut-il écrire en tout ?`,
        ...opts(ans, [ans + 9, ans - 9, N * (N > 99 ? 3 : 2), ans + (N > 99 ? 99 : 9)]),
        explain: `${parts.join(', ')} : ${ans} chiffres.` };
    },
    () => { // angle des aiguilles
      const h = ri(1, 12), m = ri(0, 11) * 5;
      const hp = (h % 12) * 30 + m / 2, mp = m * 6;
      let a = Math.abs(hp - mp); a = Math.min(a, 360 - a);
      let naive = Math.abs((h % 12) * 30 - mp); naive = Math.min(naive, 360 - naive);
      return { q: `Quel est le plus petit angle entre les deux aiguilles d’une horloge à ${h} h ${m === 0 ? 'pile' : String(m).padStart(2, '0')} ?`,
        ...opts(a, [naive, a + 30, Math.abs(a - 15), a + 15], '°'),
        explain: `L’aiguille des heures avance de 0,5° par minute : elle est à ${fr(hp)}°. Celle des minutes est à ${mp}°. L’écart (le plus petit) est de ${fr(a)}°.` };
    },
    () => { // l'âge de la sœur
      const a = ri(2, 10) * 2, N = ri(a + 5, 80), ans = N - a / 2;
      return { q: `Quand j’avais ${a} ans, ma sœur avait la moitié de mon âge. J’ai maintenant ${N} ans. Quel âge a ma sœur ?`,
        ...opts(ans, [N / 2, ans - a / 2, ans + 1], ' ans'),
        explain: `Ma sœur a ${a / 2} ans de moins que moi, et cet écart ne change jamais : ${N} − ${a / 2} = ${ans} ans.` };
    },
    () => { // trouver la pièce plus lourde
      const N = ri(3, 81);
      let ans = 0; while (3 ** ans < N) ans++;
      let two = 0; while (2 ** two < N) two++;
      return { q: `Tu as ${N} pièces identiques, sauf une qui est un peu plus lourde. Avec une balance à deux plateaux, combien de pesées faut-il au minimum pour être sûr de la trouver ?`,
        ...opts(ans, [two, ans + 1, ans - 1]),
        explain: `Chaque pesée sépare les pièces en trois groupes (plateau gauche, plateau droit, à côté) : on garde le groupe suspect. Avec ${pl(ans, 'pesée')}, on peut départager jusqu’à 3${ans > 1 ? '^' + ans : ''} = ${3 ** ans} pièces, et ${N} ≤ ${3 ** ans}.` };
    },
    () => { // poules et lapins
      const H = ri(6, 30), r = ri(1, H - 1), legs = 4 * r + 2 * (H - r);
      const [an, sp] = pick([['lapins', 'poules'], ['moutons', 'canards'], ['chèvres', 'oies']]);
      return { q: `Dans une ferme, il y a des ${sp} et des ${an}. On compte ${H} têtes et ${legs} pattes. Combien y a-t-il de ${an} ?`,
        ...opts(r, [H - r, legs / 4, r + 2, r - 1]),
        explain: `Si tous avaient 2 pattes, il y en aurait ${2 * H}. Les ${legs - 2 * H} pattes en plus viennent des ${an}, qui en ont 2 de plus chacun : ${legs - 2 * H} ÷ 2 = ${r}.` };
    },
  ];

  const qs = H.map(([q, options, explain, big]) => ({ q, options, answer: 0, explain, ...(big ? { big } : {}) }));
  const seen = new Set(qs.map(q => q.q + (q.big || '')));
  for (let guard = 0; qs.length < TARGET && guard < 50000; guard++) {
    const q = T[guard % T.length]();
    if (!q || seen.has(q.q) || new Set(q.options).size !== q.options.length) continue;
    seen.add(q.q);
    qs.push(q);
  }

  TESTS.enigmes = {
    title: 'Énigmes classiques',
    icon: '🧩',
    color: '#c98a12',
    desc: 'Les grands casse-têtes et questions pièges des tests de QI.',
    questions: qs,
  };
})();
