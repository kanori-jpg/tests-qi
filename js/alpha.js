// 6e catégorie : le test « Army Alpha » de l'armée américaine (1917-1918), forme 8.
// Source : C. C. Brigham, « A Study of American Intelligence », 1923 (domaine public),
// qui reproduit les 8 épreuves. Questions traduites en français, unités adaptées (km, €).
// Les items trop liés à l'Amérique de 1918 ou datés de façon choquante ont été retirés.
// Le livret ne donne pas les corrigés : les réponses ont été établies par nous.
(function () {
  const E = n => ` (Army Alpha, épreuve ${n})`;
  const qs = [];
  const add = (sub, q, options, explain, big) => qs.push({ q, options, answer: 0, explain: explain + E(sub), ...(big ? { big } : {}) });

  /* Épreuve 2 : raisonnement arithmétique */
  [
    ['Combien font 60 fusils et 5 fusils ?', ['65', '55', '300', '12'], '60 + 5 = 65.'],
    ['Si tu économises 9 € par mois pendant 3 mois, combien auras-tu économisé ?', ['27 €', '12 €', '21 €', '30 €'], '9 × 3 = 27 €.'],
    ['Si 48 hommes sont répartis en escouades de 8, combien y aura-t-il d’escouades ?', ['6', '8', '40', '56'], '48 ÷ 8 = 6.'],
    ['Marc avait 11 cigares. Il en achète 2 de plus, puis en fume 7. Combien lui en reste-t-il ?', ['6', '4', '20', '9'], '11 + 2 − 7 = 6.'],
    ['Une compagnie avance de 8 km, puis recule de 2 km. À quelle distance est-elle de sa position de départ ?', ['6 km', '10 km', '4 km', '8 km'], '8 − 2 = 6 km.'],
    ['Combien d’heures faut-il à un camion pour parcourir 42 km à 3 km/h ?', ['14 h', '12 h', '126 h', '39 h'], '42 ÷ 3 = 14 heures.'],
    ['Combien de crayons peut-on acheter avec 60 centimes, à 2 crayons pour 5 centimes ?', ['24', '12', '30', '150'], '60 centimes, c’est 12 fois 5 centimes, donc 12 × 2 = 24 crayons.'],
    ['Un régiment parcourt 40 km en cinq jours : 9 km le 1er jour, 6 km le 2e, 10 km le 3e et 6 km le 4e. Combien de kilomètres le dernier jour ?', ['9 km', '8 km', '31 km', '6 km'], '9 + 6 + 10 + 6 = 31 km les 4 premiers jours, donc 40 − 31 = 9 km.'],
    ['Tu achètes 2 paquets de tabac à 8 centimes et une pipe à 65 centimes. Combien doit-on te rendre sur un billet de 2 € ?', ['1,19 €', '1,27 €', '0,81 €', '1,35 €'], '2 × 8 + 65 = 81 centimes. 2,00 € − 0,81 € = 1,19 €.'],
    ['S’il faut 3 jours à 4 hommes pour creuser une tranchée, combien d’hommes faut-il pour la creuser en une demi-journée ?', ['24', '12', '6', '48'], 'Le travail représente 4 × 3 = 12 journées de travail. En une demi-journée, il faut 12 ÷ 0,5 = 24 hommes.'],
    ['Un marchand achète des mulets pour 2 000 €. Il les revend 2 400 €, en gagnant 50 € sur chaque mulet. Combien y avait-il de mulets ?', ['8', '40', '48', '12'], 'Le bénéfice total est 400 €, soit 50 € par mulet : 400 ÷ 50 = 8 mulets.'],
    ['Une recrue dépense un huitième de son argent en cartes postales, et deux fois plus pour du papier à lettres. Il lui reste 1 €. Combien avait-elle au départ ?', ['1,60 €', '1,33 €', '2,00 €', '1,25 €'], 'Elle dépense 1/8 + 2/8 = 3/8 de son argent. Il lui reste 5/8, qui valent 1 €. Au départ : 8/5 = 1,60 €.'],
    ['Si 3 tonnes et demie de trèfle coûtent 14 €, combien coûtent 6 tonnes et demie ?', ['26 €', '28 €', '24 €', '20 €'], 'Une tonne coûte 14 ÷ 3,5 = 4 €. Donc 6,5 × 4 = 26 €.'],
    ['Un navire a des vivres pour nourrir 700 hommes pendant 2 mois. Combien de temps dureraient-ils pour 400 hommes ?', ['3 mois et demi', '1 mois', '4 mois', '3 mois'], 'Les vivres représentent 700 × 2 = 1 400 « mois-hommes ». Pour 400 hommes : 1 400 ÷ 400 = 3,5 mois.'],
    ['Un avion parcourt 250 mètres en 10 secondes. Combien de mètres parcourt-il en un cinquième de seconde ?', ['5 m', '25 m', '50 m', '2 m'], 'Il fait 25 m par seconde, donc 25 ÷ 5 = 5 m en un cinquième de seconde.'],
    ['Un sous-marin fait 8 km/h sous l’eau et 20 km/h en surface. Combien de temps lui faut-il pour traverser un bras de mer de 100 km, s’il doit en faire les deux cinquièmes sous l’eau ?', ['8 h', '5 h', '7 h', '12,5 h'], 'Sous l’eau : 40 km à 8 km/h = 5 h. En surface : 60 km à 20 km/h = 3 h. Total : 8 h.'],
    ['Si 134 escouades doivent creuser 3 618 mètres de tranchée, combien de mètres chaque escouade doit-elle creuser ?', ['27', '26', '28', '37'], '3 618 ÷ 134 = 27 mètres.'],
    ['Une division compte 5 000 artilleurs, 15 000 fantassins et 1 000 cavaliers. Si chaque arme grandit dans la même proportion jusqu’à 23 100 hommes en tout, combien d’artilleurs seront ajoutés ?', ['500', '2 100', '700', '5 500'], 'La division passe de 21 000 à 23 100 hommes, soit +10 %. 10 % de 5 000 = 500 artilleurs.'],
    ['Un grossiste a déjà livré 1 897 barils de pommes à un camp. Il livre le reste de son stock à 37 cantines, qui reçoivent 54 barils chacune. Combien de barils a-t-il livrés en tout ?', ['3 895', '1 998', '3 985', '2 005'], '37 × 54 = 1 998 barils, plus 1 897 : 3 895 barils.'],
  ].forEach(([q, o, e]) => add(2, q, o, e));

  /* Épreuve 3 : jugement pratique (3 choix) */
  [
    ['Il est sage de mettre un peu d’argent de côté au lieu de tout dépenser, afin de…', ['se préparer à la vieillesse ou à la maladie', 'collectionner toutes les sortes de pièces', 'pouvoir jouer à des jeux d’argent quand on veut'], 'L’épargne sert à faire face aux besoins futurs.'],
    ['Les chaussures sont faites en cuir, parce que…', ['il est solide, souple et chaud', 'il est tanné', 'on peut le cirer en noir'], 'Ce sont ses qualités pratiques qui expliquent ce choix.'],
    ['Pourquoi les soldats portent-ils une montre-bracelet plutôt qu’une montre de poche ?', ['Elle est plus pratique', 'Elle est plus précise', 'Elle est plus difficile à casser'], 'On peut lire l’heure sans fouiller dans ses poches, même les mains occupées.'],
    ['La principale raison pour laquelle on construit en pierre, c’est que…', ['elle est solide et durable', 'elle a un bel aspect', 'elle est lourde'], 'On choisit la pierre surtout pour sa solidité.'],
    ['Pourquoi le bœuf est-il un meilleur aliment que le chou ?', ['Il est plus nourrissant', 'Il a meilleur goût', 'Il est plus difficile à obtenir'], 'La valeur d’un aliment tient à ce qu’il apporte au corps.'],
    ['Si quelqu’un te rend service, que dois-tu faire ?', ['Lui rendre la pareille', 'Essayer de l’oublier', 'Voler pour lui s’il te le demande'], 'Rendre service à son tour est la réponse raisonnable.'],
    ['Tu n’as pas reçu une lettre de chez toi, alors que tu sais qu’elle a été écrite. C’est peut-être parce que…', ['elle s’est perdue dans le courrier', 'tu as oublié de demander à ta famille d’écrire', 'la poste a été supprimée'], 'Puisque la lettre a bien été écrite, la cause la plus probable est une perte en route.'],
    ['Le rôle principal des agriculteurs est de…', ['nourrir le pays', 'produire des articles de luxe', 'donner du travail aux chômeurs'], 'L’agriculture sert d’abord à produire la nourriture.'],
    ['Pourquoi fixe-t-on les fils télégraphiques avec des isolateurs en verre ?', ['Le verre empêche le courant de s’échapper', 'Le verre empêche le poteau de brûler', 'Le verre est bon marché et joli'], 'Le verre ne conduit pas l’électricité : c’est un isolant.'],
    ['Si ta charrette de charbon s’embourbe, que dois-tu faire ?', ['Aller chercher plus de chevaux ou d’hommes pour la sortir', 'La laisser là', 'Jeter tout le chargement'], 'On cherche à sortir la charrette sans perdre la cargaison.'],
    ['Pourquoi enferme-t-on les criminels ?', ['Pour protéger la société', 'Pour se venger d’eux', 'Pour les faire travailler'], 'Le but principal est de protéger les autres.'],
    ['Pourquoi une personne mariée devrait-elle avoir une assurance-vie ?', ['Pour que sa famille ne soit pas dans le besoin si elle meurt', 'Parce que la mort peut arriver à tout moment', 'Parce que les assureurs sont en général honnêtes'], 'L’assurance-vie sert à protéger ceux qui restent.'],
    ['Les années bissextiles, février compte 29 jours parce que…', ['sinon le calendrier ne tomberait pas juste', 'février est un mois court', 'certaines personnes sont nées un 29 février'], 'Une année dure environ 365 jours et un quart : on rattrape ce quart tous les 4 ans.'],
    ['Si on te vole ton argent dans une ville que tu ne connais pas, tu devrais…', ['demander l’aide de la police', 'demander de l’argent au premier passant', 'emprunter de l’argent à une banque'], 'La police est là pour ce genre de situation.'],
    ['Pourquoi élit-on des députés ?', ['Parce que les citoyens sont trop nombreux pour se réunir et voter eux-mêmes les lois', 'Parce que le peuple doit être gouverné', 'Parce que cela garantit un gouvernement parfaitement représentatif'], 'Les députés représentent les citoyens, qui ne peuvent pas tous débattre ensemble.'],
  ].forEach(([q, o, e]) => add(3, q, o, e));

  /* Épreuve 4 : synonymes / antonymes (même sens ou sens contraire) */
  const SA = [
    ['non', 'oui', 0], ['jour', 'nuit', 0], ['partir', 's’en aller', 1], ['commencer', 'débuter', 1], ['amer', 'sucré', 0],
    ['supposer', 'présumer', 1], ['commander', 'obéir', 0], ['taquiner', 'tourmenter', 1], ['diligent', 'travailleur', 1], ['corrompu', 'honnête', 0],
    ['vers', 'depuis', 0], ['masculin', 'féminin', 0], ['complexe', 'simple', 0], ['sacré', 'saint', 1], ['souvent', 'rarement', 0],
    ['ancien', 'moderne', 0], ['énorme', 'gigantesque', 1], ['conférer', 'accorder', 1], ['acquérir', 'perdre', 0], ['calculer', 'compter', 1],
    ['souiller', 'purifier', 0], ['inquiet', 'craintif', 1], ['stérile', 'fertile', 0], ['gouffre', 'abîme', 1], ['sombre', 'lugubre', 1],
    ['vestige', 'trace', 1], ['dénigrer', 'louer', 0], ['fini', 'limité', 1], ['contredire', 'confirmer', 0], ['immunisé', 'vulnérable', 0],
    ['crédit', 'débit', 0], ['assidu', 'diligent', 1], ['passager', 'permanent', 0], ['pallier', 'atténuer', 1], ['exécrer', 'injurier', 1],
    ['éteint (une espèce)', 'existant', 0], ['pertinent', 'approprié', 1], ['synchrone', 'simultané', 1], ['hautain', 'dédaigneux', 1], ['abstrus', 'obscur', 1],
  ];
  SA.forEach(([a, b, same]) => add(4, 'Ces deux mots ont-ils le même sens ou un sens contraire ?',
    same ? ['Même sens', 'Sens contraire'] : ['Sens contraire', 'Même sens'],
    same ? `« ${a} » et « ${b} » veulent dire à peu près la même chose.` : `« ${a} » et « ${b} » ont des sens opposés.`, `${a} — ${b}`));

  /* Épreuve 5 : phrases en désordre (vrai ou faux) */
  let seed = 1918;
  const R = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const scramble = s => {
    const w = s.toLowerCase().replace(/[.,]/g, '').split(' ');
    let m;
    do { m = [...w]; for (let i = m.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [m[i], m[j]] = [m[j], m[i]]; } }
    while (m.join(' ') === w.join(' '));
    return m.join('  ');
  };
  [
    ['On entend avec les oreilles', 1], ['Un canon ne fait jamais de bruit', 0], ['Les oiseaux construisent des nids dans les arbres', 1],
    ['L’huile et l’eau ne se mélangent pas', 1], ['Tous les soldats sont de mauvais tireurs', 0], ['Le bois et le charbon servent de combustible', 1],
    ['La lune est à seulement vingt mètres de la terre', 0], ['L’eau est nécessaire à la vie', 1], ['Tous les vêtements sont faits de coton', 0],
    ['Les chevaux sont plus lents qu’une automobile', 1], ['Le caoutchouc est produit sous les tropiques', 1], ['Les arbres perdent leurs feuilles en automne', 1],
    ['Le pôle Nord est un endroit confortable', 0], ['Le pain est fait de sable et de poudre', 0], ['Un bateau à vapeur avance généralement à la voile', 0],
    ['L’eau de tous les lacs est salée', 0], ['On peut généralement juger une personne à ses actes', 1], ['Les gens bons n’ont jamais de malheur', 0],
    ['L’acier est précieux pour fabriquer des outils tranchants', 1], ['Les catastrophes sont parfois dues au hasard', 1],
    ['Les amis n’oublient jamais les petits reproches', 0], ['L’exaltation est un sentiment douloureux', 0],
    ['Les mots ananas, abricot et araignée commencent par un a', 1],
  ].forEach(([s, ok]) => add(5, 'Remets ces mots dans l’ordre. La phrase obtenue est-elle vraie ou fausse ?',
    ok ? ['Vraie', 'Fausse'] : ['Fausse', 'Vraie'], `Dans l’ordre : « ${s}. » C’est ${ok ? 'vrai' : 'faux'}.`, scramble(s)));

  /* Épreuve 6 : compléter une suite de nombres (les deux suivants) */
  [
    ['3 · 4 · 5 · 6 · 7 · 8', ['9 · 10', '8 · 9', '10 · 11', '9 · 11'], 'On ajoute 1 à chaque fois.'],
    ['8 · 7 · 6 · 5 · 4 · 3', ['2 · 1', '3 · 2', '2 · 0', '1 · 0'], 'On retire 1 à chaque fois.'],
    ['10 · 15 · 20 · 25 · 30 · 35', ['40 · 45', '40 · 50', '45 · 50', '36 · 37'], 'On ajoute 5 à chaque fois.'],
    ['9 · 9 · 7 · 7 · 5 · 5', ['3 · 3', '5 · 3', '3 · 1', '4 · 4'], 'Chaque nombre apparaît deux fois, et on descend de 2.'],
    ['3 · 6 · 9 · 12 · 15 · 18', ['21 · 24', '21 · 23', '20 · 22', '24 · 27'], 'On ajoute 3 à chaque fois.'],
    ['5 · 9 · 13 · 17 · 21 · 25', ['29 · 33', '29 · 32', '28 · 32', '30 · 34'], 'On ajoute 4 à chaque fois.'],
    ['8 · 9 · 12 · 13 · 16 · 17', ['20 · 21', '18 · 19', '20 · 23', '19 · 20'], 'On alterne +1 et +3.'],
    ['27 · 27 · 23 · 23 · 19 · 19', ['15 · 15', '17 · 17', '15 · 11', '19 · 15'], 'Chaque nombre apparaît deux fois, et on descend de 4.'],
    ['1 · 2 · 4 · 8 · 16 · 32', ['64 · 128', '48 · 64', '64 · 96', '34 · 36'], 'Chaque nombre est le double du précédent.'],
    ['19 · 16 · 14 · 11 · 9 · 6', ['4 · 1', '3 · 0', '3 · 1', '4 · 2'], 'On alterne −3 et −2.'],
    ['11 · 13 · 12 · 14 · 13 · 15', ['14 · 16', '16 · 18', '14 · 13', '16 · 15'], 'On alterne +2 et −1.'],
    ['2 · 3 · 5 · 8 · 12 · 17', ['23 · 30', '22 · 27', '23 · 29', '24 · 31'], 'Les écarts augmentent de 1 : +1, +2, +3, +4, +5, puis +6 et +7.'],
    ['18 · 14 · 17 · 13 · 16 · 12', ['15 · 11', '15 · 12', '11 · 15', '14 · 10'], 'On alterne −4 et +3.'],
    ['29 · 28 · 26 · 23 · 19 · 14', ['8 · 1', '9 · 4', '8 · 2', '7 · 0'], 'On retire 1, 2, 3, 4, 5, puis 6 et 7.'],
    ['20 · 17 · 15 · 14 · 11 · 9', ['8 · 5', '7 · 5', '8 · 6', '6 · 3'], 'Le motif −3, −2, −1 se répète : après −3, −2 viennent −1 puis −3.'],
    ['81 · 27 · 9 · 3 · 1 · 1/3', ['1/9 · 1/27', '1/6 · 1/9', '0 · 0', '1/3 · 1/9'], 'Chaque nombre est divisé par 3.'],
    ['1 · 4 · 9 · 16 · 25 · 36', ['49 · 64', '47 · 58', '49 · 81', '42 · 49'], 'Ce sont les carrés : 1², 2², 3²… puis 7² = 49 et 8² = 64.'],
    ['16 · 17 · 15 · 18 · 14 · 19', ['13 · 20', '20 · 13', '15 · 20', '13 · 18'], 'Deux suites alternent : 16, 15, 14, 13 (−1) et 17, 18, 19, 20 (+1).'],
    ['3 · 6 · 8 · 16 · 18 · 36', ['38 · 76', '72 · 74', '38 · 40', '54 · 56'], 'On alterne × 2 et + 2.'],
  ].forEach(([s, o, e]) => add(6, 'Quels sont les deux nombres suivants ?', o, e, `${s} · ? · ?`));

  /* Épreuve 7 : analogies */
  [
    ['Chaussure', 'pied', 'chapeau', ['tête', 'chaton', 'couteau', 'sou'], 'La chaussure se porte au pied, le chapeau sur la tête.'],
    ['Chiot', 'chien', 'agneau', ['mouton', 'rouge', 'porte', 'livre'], 'Le chiot devient chien, l’agneau devient mouton.'],
    ['Printemps', 'été', 'automne', ['hiver', 'chaud', 'moisson', 'lever'], 'L’été suit le printemps, l’hiver suit l’automne.'],
    ['Diable', 'ange', 'mauvais', ['bon', 'méchant', 'désobéissant', 'diffamé'], 'Ce sont des contraires.'],
    ['Doigt', 'main', 'orteil', ['pied', 'corps', 'peau', 'ongle'], 'Le doigt fait partie de la main, l’orteil du pied.'],
    ['Pattes', 'grenouille', 'ailes', ['oiseau', 'manger', 'nager', 'nid'], 'La grenouille a des pattes pour sauter, l’oiseau des ailes pour voler.'],
    ['Mâcher', 'dents', 'sentir', ['nez', 'doux', 'puer', 'odeur'], 'On mâche avec les dents, on sent avec le nez.'],
    ['Lion', 'rugir', 'chien', ['aboyer', 'conduire', 'poney', 'harnais'], 'C’est le cri de l’animal.'],
    ['Chat', 'tigre', 'chien', ['loup', 'aboyer', 'mordre', 'happer'], 'Le tigre est le cousin sauvage du chat, le loup celui du chien.'],
    ['Bon', 'mauvais', 'long', ['court', 'grand', 'gros', 'serpent'], 'Ce sont des contraires.'],
    ['Géant', 'grand', 'nain', ['petit', 'jungle', 'barbe', 'laid'], 'Le géant est grand, le nain est petit.'],
    ['Hiver', 'saison', 'janvier', ['mois', 'février', 'jour', 'Noël'], 'L’hiver est une saison, janvier est un mois.'],
    ['Patinage', 'hiver', 'natation', ['été', 'plongeon', 'flotter', 'trou'], 'On patine en hiver, on nage en été.'],
    ['Blond', 'clair', 'brun', ['foncé', 'cheveux', 'brillant', 'blond'], 'Les cheveux blonds sont clairs, les bruns sont foncés.'],
    ['Aimer', 'ami', 'haïr', ['ennemi', 'malveillance', 'saint', 'aversion'], 'On aime un ami, on hait un ennemi.'],
    ['Œuf', 'oiseau', 'graine', ['plante', 'pousser', 'fendre', 'germer'], 'L’oiseau naît d’un œuf, la plante d’une graine.'],
    ['Creuser', 'tranchée', 'construire', ['maison', 'courir', 'pelle', 'balle'], 'On creuse une tranchée, on construit une maison.'],
    ['S’entendre', 'se disputer', 'ami', ['ennemi', 'camarade', 'besoin', 'mère'], 'Ce sont des contraires.'],
    ['Palais', 'roi', 'cabane', ['paysan', 'chaumière', 'ferme', 'ville'], 'Le roi vit dans un palais, le paysan dans une cabane.'],
    ['Trombe d’eau', 'averse', 'cyclone', ['brise', 'bain', 'détruire', 'ouest'], 'L’averse est une trombe en petit, la brise est un cyclone en petit.'],
    ['Parents', 'commander', 'enfants', ['obéir', 'hommes', 'devoir', 'femmes'], 'Les parents commandent, les enfants obéissent.'],
    ['Diamant', 'rare', 'fer', ['commun', 'argent', 'minerai', 'acier'], 'Le diamant est rare, le fer est commun.'],
    ['Oui', 'affirmatif', 'non', ['négatif', 'penser', 'savoir', 'oui'], '« Oui » est une réponse affirmative, « non » une réponse négative.'],
    ['Heure', 'jour', 'jour', ['semaine', 'nuit', 'heure', 'midi'], 'Les heures forment un jour, les jours forment une semaine.'],
    ['Œil', 'tête', 'fenêtre', ['pièce', 'clé', 'sol', 'porte'], 'L’œil est une ouverture de la tête, la fenêtre une ouverture de la pièce.'],
    ['Vêtements', 'homme', 'poils', ['cheval', 'peigne', 'barbe', 'chapeau'], 'Les vêtements couvrent l’homme, les poils couvrent le cheval.'],
    ['Dessiner', 'dessin', 'fabriquer', ['table', 'détruire', 'casser', 'dur'], 'On dessine un dessin, on fabrique un objet comme une table.'],
    ['Automobile', 'charrette', 'moto', ['vélo', 'rouler', 'vitesse', 'voiture'], 'La moto est un vélo à moteur, comme l’automobile est une charrette à moteur.'],
    ['Grenier', 'blé', 'bibliothèque', ['livres', 'lire', 'papier', 'chaises'], 'Le grenier conserve le blé, la bibliothèque conserve les livres.'],
    ['Bretagne', 'France', 'partie', ['tout', 'cheveu', 'Chine', 'Normandie'], 'La Bretagne est une partie de la France : la partie est au tout.'],
    ['Estimer', 'mépriser', 'amis', ['ennemis', 'voisins', 'amoureux', 'hommes'], 'On estime ses amis, on méprise ses ennemis.'],
    ['Demeurer', 'rester', 'partir', ['s’en aller', 'venir', 'd’ici', 'tard'], 'Ce sont des synonymes.'],
    ['Abondant', 'rare', 'bon marché', ['coûteux', 'acheter', 'affaire', 'méchant'], 'Ce sont des contraires.'],
    ['Baleine', 'grande', 'tonnerre', ['bruyant', 'pluie', 'éclair', 'tuer'], 'La baleine est remarquable par sa taille, le tonnerre par son bruit.'],
    ['Récompenser', 'héros', 'punir', ['traître', 'Dieu', 'éternel', 'douleur'], 'On récompense un héros, on punit un traître.'],
    ['Musique', 'apaisante', 'bruit', ['dérangeant', 'entendre', 'son', 'rapport'], 'La musique apaise, le bruit dérange.'],
    ['Livre', 'écrivain', 'statue', ['sculpteur', 'liberté', 'tableau', 'État'], 'L’écrivain crée le livre, le sculpteur crée la statue.'],
    ['Blessure', 'douleur', 'santé', ['bien-être', 'maladie', 'affection', 'médecin'], 'La blessure provoque la douleur, la santé procure le bien-être.'],
  ].forEach(([a, b, c, o, e]) => add(7, `${a} est à ${b} ${/^[aeiouyàâéèêîôœ]/i.test(c) ? `ce qu’${c}` : `ce que ${c}`} est à…`, o, e));

  /* Épreuve 8 : culture générale (items restés compréhensibles aujourd'hui) */
  [
    ['La pomme pousse sur…', ['un arbre', 'un arbuste', 'une vigne', 'un buisson'], 'Les pommes poussent sur le pommier, qui est un arbre.'],
    ['Le percheron est une race de…', ['cheval', 'chèvre', 'vache', 'mouton'], 'Le percheron est un grand cheval de trait originaire du Perche, en France.'],
    ['Les saphirs sont le plus souvent…', ['bleus', 'rouges', 'verts', 'jaunes'], 'Le saphir est surtout connu pour sa couleur bleue.'],
    ['L’artichaut est…', ['un légume', 'un foin', 'une céréale', 'un fourrage'], 'L’artichaut est un légume.'],
    ['La blette est…', ['un légume', 'un poisson', 'un lézard', 'un serpent'], 'La blette (ou bette) est un légume à feuilles.'],
    ['Buenos Aires est une ville…', ['d’Argentine', 'd’Espagne', 'du Brésil', 'du Portugal'], 'Buenos Aires est la capitale de l’Argentine.'],
    ['L’ivoire provient…', ['des éléphants', 'des mines', 'des huîtres', 'des récifs'], 'L’ivoire vient des défenses d’éléphants.'],
    ['Le tatou est…', ['un animal', 'un arbuste décoratif', 'un instrument de musique', 'un poignard'], 'Le tatou est un petit mammifère couvert d’une carapace.'],
    ['Le tendon d’Achille se trouve…', ['au talon', 'à la tête', 'à l’épaule', 'au ventre'], 'Le tendon d’Achille relie le mollet au talon.'],
    ['Le tremble est…', ['un arbre', 'une machine', 'un tissu', 'une boisson'], 'Le tremble est un arbre, une sorte de peuplier.'],
    ['Le sabre est une sorte de…', ['épée', 'fusil', 'canon', 'pistolet'], 'Le sabre est une épée à lame courbe.'],
    ['La clarinette s’utilise en…', ['musique', 'sténographie', 'reliure', 'lithographie'], 'La clarinette est un instrument de musique à vent.'],
    ['Le denim est…', ['un tissu', 'une danse', 'un aliment', 'une boisson'], 'Le denim est la toile des jeans.'],
    ['L’auteur des « Aventures de Huckleberry Finn » est…', ['Mark Twain', 'Edgar Poe', 'Stevenson', 'Hawthorne'], 'Le roman a été écrit par Mark Twain.'],
    ['Faraday est surtout célèbre dans le domaine…', ['des sciences', 'de la littérature', 'de la guerre', 'de la religion'], 'Michael Faraday était un physicien et chimiste.'],
    ['Dans un moteur à essence, l’air et l’essence sont mélangés dans…', ['le carburateur', 'l’accélérateur', 'la boîte de vitesses', 'le différentiel'], 'Le carburateur prépare le mélange d’air et d’essence.'],
    ['Pasteur est surtout célèbre dans le domaine…', ['des sciences', 'de la politique', 'de la littérature', 'de la guerre'], 'Louis Pasteur est le savant du vaccin contre la rage.'],
    ['« Habeas corpus » est un terme de…', ['droit', 'médecine', 'théologie', 'pédagogie'], 'L’habeas corpus protège contre la détention arbitraire : c’est du droit.'],
    ['L’ensilage est un terme de…', ['agriculture', 'pêche', 'athlétisme', 'chasse'], 'L’ensilage est une façon de conserver le fourrage.'],
    ['Le watt sert à mesurer…', ['l’électricité', 'la force du vent', 'la pluie', 'la force de l’eau'], 'Le watt est l’unité de puissance, utilisée notamment en électricité.'],
    ['Napoléon a battu les Autrichiens à…', ['Wagram', 'Waterloo', 'Leipzig', 'Friedland'], 'Wagram (1809) est une victoire sur l’Autriche. Waterloo et Leipzig sont des défaites, et Friedland une victoire sur les Russes.'],
    ['Une figure irrégulière à quatre côtés s’appelle…', ['un quadrilatère', 'un triangle', 'un pentagone', 'une scolie'], 'Une figure à quatre côtés est un quadrilatère.'],
  ].forEach(([q, o, e]) => add(8, q, o, e));

  /* ================= Forme 5 ================= */
  // Source : R. M. Yerkes (dir.), « Psychological Examining in the United States Army »,
  // Memoirs of the National Academy of Sciences, vol. XV, 1921 (domaine public), p. 219-227.
  // Ajoutée APRÈS la forme 8 pour ne pas changer les questions existantes.
  const E5 = n => ` (Army Alpha forme 5, épreuve ${n})`;
  const add5 = (sub, q, options, explain, big) => qs.push({ q, options, answer: 0, explain: explain + E5(sub), ...(big ? { big } : {}) });

  [
    ['Combien font 30 hommes et 7 hommes ?', ['37', '23', '210', '47'], '30 + 7 = 37.'],
    ['Si tu économises 7 € par mois pendant 4 mois, combien auras-tu économisé ?', ['28 €', '11 €', '21 €', '32 €'], '7 × 4 = 28 €.'],
    ['Si 24 hommes sont répartis en escouades de 8, combien y aura-t-il d’escouades ?', ['3', '4', '16', '32'], '24 ÷ 8 = 3.'],
    ['Marc avait 12 cigares. Il en achète 3 de plus, puis en fume 6. Combien lui en reste-t-il ?', ['9', '3', '21', '15'], '12 + 3 − 6 = 9.'],
    ['Une compagnie avance de 5 km, puis recule de 3 km. À quelle distance est-elle de sa position de départ ?', ['2 km', '8 km', '3 km', '5 km'], '5 − 3 = 2 km.'],
    ['Combien d’heures faut-il à un camion pour parcourir 66 km à 6 km/h ?', ['11 h', '12 h', '60 h', '396 h'], '66 ÷ 6 = 11 heures.'],
    ['Combien de cigares peut-on acheter avec 50 centimes, à 2 cigares pour 5 centimes ?', ['20', '10', '25', '125'], '50 centimes, c’est 10 fois 5 centimes, donc 10 × 2 = 20 cigares.'],
    ['Un régiment parcourt 40 km en cinq jours : 9 km le 1er jour, 6 km le 2e, 10 km le 3e et 8 km le 4e. Combien de kilomètres le dernier jour ?', ['7 km', '8 km', '33 km', '9 km'], '9 + 6 + 10 + 8 = 33 km les 4 premiers jours, donc 40 − 33 = 7 km.'],
    ['Tu achètes 2 paquets de tabac à 7 centimes et une pipe à 65 centimes. Combien doit-on te rendre sur un billet de 2 € ?', ['1,21 €', '1,28 €', '0,79 €', '1,35 €'], '2 × 7 + 65 = 79 centimes. 2,00 € − 0,79 € = 1,21 €.'],
    ['S’il faut 3 jours à 6 hommes pour creuser une tranchée, combien d’hommes faut-il pour la creuser en une demi-journée ?', ['36', '18', '12', '9'], 'Le travail représente 6 × 3 = 18 journées de travail. En une demi-journée, il faut 18 ÷ 0,5 = 36 hommes.'],
    ['Un marchand achète des mulets pour 800 €. Il les revend 1 000 €, en gagnant 40 € sur chaque mulet. Combien y avait-il de mulets ?', ['5', '20', '25', '4'], 'Le bénéfice total est 200 €, soit 40 € par mulet : 200 ÷ 40 = 5 mulets.'],
    ['Un bac rectangulaire contient 400 m³ de chaux. S’il mesure 10 m de long et 5 m de large, quelle est sa profondeur ?', ['8 m', '40 m', '4 m', '50 m'], '10 × 5 = 50 m² de fond. 400 ÷ 50 = 8 m de profondeur.'],
    ['Une recrue dépense un huitième de son argent en cartes postales, et quatre fois plus pour du papier à lettres. Il lui reste 90 centimes. Combien avait-elle au départ ?', ['2,40 €', '1,44 €', '1,80 €', '7,20 €'], 'Elle dépense 1/8 + 4/8 = 5/8 de son argent. Il lui reste 3/8, qui valent 90 centimes. Au départ : 90 × 8 ÷ 3 = 240 centimes, soit 2,40 €.'],
    ['Si 3 tonnes et demie de charbon coûtent 21 €, combien coûtent 5 tonnes et demie ?', ['33 €', '30 €', '35 €', '27 €'], 'Une tonne coûte 21 ÷ 3,5 = 6 €. Donc 5,5 × 6 = 33 €.'],
    ['Un navire a des vivres pour nourrir 500 hommes pendant 6 mois. Combien de temps dureraient-ils pour 1 200 hommes ?', ['2 mois et demi', '14 mois', '3 mois', '2 mois'], 'Les vivres représentent 500 × 6 = 3 000 « mois-hommes ». Pour 1 200 hommes : 3 000 ÷ 1 200 = 2,5 mois.'],
    ['Un homme court 100 mètres en 10 secondes. Combien de mètres parcourt-il en un cinquième de seconde ?', ['2 m', '10 m', '5 m', '20 m'], 'Il fait 10 m par seconde, donc 10 ÷ 5 = 2 m en un cinquième de seconde.'],
    ['Un sous-marin fait 8 km/h sous l’eau et 15 km/h en surface. Combien de temps lui faut-il pour traverser un bras de mer de 100 km, s’il doit en faire les deux cinquièmes sous l’eau ?', ['9 h', '5 h', '4 h', '8 h'], 'Sous l’eau : 40 km à 8 km/h = 5 h. En surface : 60 km à 15 km/h = 4 h. Total : 9 h.'],
    ['Si 241 escouades doivent creuser 4 097 mètres de tranchée, combien de mètres chaque escouade doit-elle creuser ?', ['17', '16', '18', '27'], '4 097 ÷ 241 = 17 mètres.'],
    ['Une division compte 3 000 artilleurs, 15 000 fantassins et 1 000 cavaliers. Si chaque arme grandit dans la même proportion jusqu’à 20 900 hommes en tout, combien d’artilleurs seront ajoutés ?', ['300', '1 900', '633', '3 300'], 'La division passe de 19 000 à 20 900 hommes, soit +10 %. 10 % de 3 000 = 300 artilleurs.'],
    ['Un grossiste a déjà livré 1 897 barils de pommes à un camp. Il livre le reste de son stock à 29 cantines, qui reçoivent 54 barils chacune. Combien de barils a-t-il livrés en tout ?', ['3 463', '1 566', '3 436', '1 980'], '29 × 54 = 1 566 barils, plus 1 897 : 3 463 barils.'],
  ].forEach(([q, o, e]) => add5(2, q, o, e));

  [
    ['Les chats sont des animaux utiles, parce que…', ['ils attrapent les souris', 'ils sont doux', 'ils ont peur des chiens'], 'C’est leur utilité pratique.'],
    ['Pourquoi porte-t-on plus souvent un crayon qu’un stylo à plume ?', ['Parce qu’il est moins cher', 'Parce qu’il est de couleur vive', 'Parce qu’il est moins lourd'], 'Le prix est la vraie différence.'],
    ['Pourquoi utilise-t-on le cuir pour les chaussures ?', ['Parce qu’il s’use peu', 'Parce qu’on en produit dans tous les pays', 'Parce que c’est un produit animal'], 'Une chaussure doit durer : le cuir résiste bien à l’usure.'],
    ['Pourquoi juger quelqu’un sur ce qu’il fait plutôt que sur ce qu’il dit ?', ['Ce qu’on fait montre qui on est vraiment', 'Il est mal de mentir', 'Un sourd ne peut pas entendre ce qui est dit'], 'Les actes révèlent mieux une personne que ses paroles.'],
    ['On te demande ce que tu penses d’une personne que tu ne connais pas. Que devrais-tu répondre ?', ['Je ne la connais pas, je ne peux pas dire', 'Je vais aller faire sa connaissance', 'Je pense qu’elle est bien'], 'On ne peut pas juger quelqu’un qu’on ne connaît pas.'],
    ['Autrefois, on arrosait les rues en été…', ['pour empêcher la poussière de voler', 'pour rafraîchir l’air', 'pour éviter que les voitures dérapent'], 'Les rues en terre faisaient beaucoup de poussière en été.'],
    ['Pourquoi beaucoup de gens préfèrent-ils la voiture au tramway ?', ['La voiture est plus pratique', 'La voiture est faite de meilleurs matériaux', 'Le tramway est moins sûr'], 'La voiture permet d’aller où on veut, quand on veut.'],
    ['Les plumes des ailes aident l’oiseau à voler, parce qu’elles…', ['forment une surface large et légère', 'protègent son corps de l’air', 'empêchent ses ailes de refroidir'], 'Une grande surface légère prend appui sur l’air.'],
    ['Pourquoi toute la circulation qui va dans un sens reste-t-elle du même côté de la rue ?', ['Cela évite la confusion et les accidents', 'La plupart des gens sont droitiers', 'L’agent de police l’exige'], 'C’est la raison d’être de la règle.'],
    ['Pourquoi les inventeurs déposent-ils un brevet ?', ['Cela leur donne le contrôle de leur invention', 'Cela crée une plus forte demande', 'C’est la coutume'], 'Le brevet protège l’invention contre la copie.'],
    ['L’eau qui gèle fait éclater les tuyaux, parce que…', ['l’eau prend plus de place en gelant', 'le froid rend les tuyaux plus fragiles', 'la glace bloque l’écoulement de l’eau'], 'En gelant, l’eau augmente de volume et pousse sur les parois.'],
    ['Pourquoi les hautes montagnes sont-elles couvertes de neige ?', ['Parce que l’air y est froid', 'Parce qu’elles sont près des nuages', 'Parce que le soleil y brille rarement'], 'Plus on monte, plus l’air est froid.'],
    ['Si la Terre était plus proche du Soleil…', ['elle serait plus chaude', 'les étoiles disparaîtraient', 'nos mois seraient plus longs'], 'Plus près du Soleil, la Terre recevrait plus de chaleur.'],
    ['Pourquoi fait-il plus froid près des pôles qu’à l’équateur ?', ['Les rayons du soleil y arrivent de biais', 'Les pôles sont toujours plus loin du soleil', 'Il y a plus de glace aux pôles'], 'Arrivant de biais, la même lumière se répartit sur une plus grande surface : elle chauffe moins.'],
  ].forEach(([q, o, e]) => add5(3, q, o, e));

  [
    ['mouillé', 'sec', 0], ['dedans', 'dehors', 0], ['colline', 'vallée', 0], ['autoriser', 'permettre', 1], ['dilater', 'contracter', 0],
    ['classe', 'groupe', 1], ['le premier', 'le dernier', 0], ['avouer', 'admettre', 1], ['timide', 'craintif', 1], ['délicat', 'tendre', 1],
    ['éteindre', 'étouffer (un feu)', 1], ['joyeux', 'mélancolique', 0], ['accepter', 'rejeter', 0], ['concave', 'convexe', 0], ['laxiste', 'strict', 0],
    ['affirmer', 'soutenir', 1], ['champion (d’une cause)', 'défenseur', 1], ['s’adapter', 'se conformer', 1], ['avilir', 'exalter', 0], ['discorde', 'harmonie', 0],
    ['réprimer', 'contenir', 1], ['octroyer', 'conférer', 1], ['docile', 'malléable', 1], ['éviter', 'prévenir', 1], ['révérence', 'vénération', 1],
    ['erreur', 'vérité', 0], ['particulier', 'général', 0], ['pompeux', 'ostentatoire', 1], ['accumuler', 'dissiper', 0], ['apathie', 'indifférence', 1],
    ['péculat', 'détournement de fonds', 1], ['bénin', 'affable', 1], ['apogée', 'sommet', 1], ['largesse', 'don', 1], ['sous-entendu', 'insinuation', 1],
    ['vêpres', 'matines', 0], ['aphorisme', 'maxime', 1], ['abjurer', 'renoncer', 1], ['éloge', 'panégyrique', 1],
  ].forEach(([a, b, same]) => add5(4, 'Ces deux mots ont-ils le même sens ou un sens contraire ?',
    same ? ['Même sens', 'Sens contraire'] : ['Sens contraire', 'Même sens'],
    same ? `« ${a} » et « ${b} » veulent dire à peu près la même chose.` : `« ${a} » et « ${b} » ont des sens opposés.`, `${a} — ${b}`));

  [
    ['Les lions sont forts', 1], ['Les gens vivent dans des maisons', 1], ['Il y a huit jours dans une semaine', 0], ['Les mouches n’ont qu’une patte', 0],
    ['En France, les mois d’été sont les plus froids', 0], ['Le sucre est tiré de l’eau de mer', 0], ['Les abeilles récoltent le miel dans les fleurs', 1],
    ['L’or et l’argent sont bons à manger', 0], ['Christophe Colomb fut le premier président de l’Amérique', 0], ['Le blé est précieux pour faire du pain', 1],
    ['Le beurre et le fromage sont faits avec de l’eau', 0], ['Tout triangle a quatre côtés', 0], ['Tout le monde fait parfois des erreurs', 1],
    ['Les hommes ont autant d’orteils que de doigts', 1], ['La poudre à canon n’est pas bonne à manger', 1], ['Il est dangereux de vivre près d’un volcan', 1],
    ['La laine et le coton ne valent rien pour s’habiller', 0], ['On peut toujours faire confiance aux ivrognes', 0], ['Les orateurs n’emploient jamais l’ironie', 0],
    ['Certaines maladies entraînent une mort certaine', 1], ['L’envie et la malveillance sont de mauvais traits de caractère', 1],
    ['Les relations humaines demandent des politesses répétées', 1],
  ].forEach(([s, ok]) => add5(5, 'Remets ces mots dans l’ordre. La phrase obtenue est-elle vraie ou fausse ?',
    ok ? ['Vraie', 'Fausse'] : ['Fausse', 'Vraie'], `Dans l’ordre : « ${s}. » C’est ${ok ? 'vrai' : 'faux'}.`, scramble(s)));

  add5(6, 'Quels sont les deux nombres suivants ?', ['2 · 1', '3 · 1', '1 · 1', '2 · 0'], 'Deux suites alternent : 8, 6, 4, 2 (−2) et 1, 1, 1, 1 (toujours 1).', '8 · 1 · 6 · 1 · 4 · 1 · ? · ?');

  const que = c => (/^[aeiouyàâéèêîôœ]/i.test(c) ? `ce qu’${c}` : `ce que ${c}`);
  [
    ['Fusil', 'tirer', 'couteau', ['couper', 'courir', 'chapeau', 'oiseau'], 'Le fusil sert à tirer, le couteau sert à couper.'],
    ['Oreille', 'entendre', 'œil', ['voir', 'table', 'bande', 'jouer'], 'L’oreille sert à entendre, l’œil sert à voir.'],
    ['Robe', 'femme', 'plumes', ['oiseau', 'cou', 'pieds', 'bec'], 'La robe habille la femme, les plumes « habillent » l’oiseau.'],
    ['Manche', 'marteau', 'poignée', ['porte', 'clé', 'pièce', 'fermer'], 'On tient le marteau par le manche, on ouvre la porte par la poignée.'],
    ['Eau', 'boire', 'pain', ['manger', 'gâteau', 'café', 'tarte'], 'On boit l’eau, on mange le pain.'],
    ['Nourriture', 'homme', 'essence', ['automobile', 'gaz', 'huile', 'étincelle'], 'La nourriture fait marcher l’homme, l’essence fait rouler l’automobile.'],
    ['Manger', 'gros', 'jeûner', ['mince', 'nourriture', 'pain', 'assoiffé'], 'Trop manger rend gros, jeûner rend mince.'],
    ['Homme', 'maison', 'oiseau', ['nid', 'voler', 'insecte', 'ver'], 'L’homme vit dans une maison, l’oiseau dans un nid.'],
    ['Aller', 'venir', 'vendre', ['acheter', 'partir', 'argent', 'journaux'], 'Ce sont des contraires.'],
    ['Péninsule', 'terre', 'baie', ['océan', 'bateaux', 'payer', 'Bretagne'], 'La péninsule est un morceau de terre qui avance dans la mer ; la baie est un morceau d’océan qui entre dans les terres.'],
    ['Heure', 'minute', 'minute', ['seconde', 'homme', 'semaine', 'court'], 'L’heure se divise en minutes, la minute en secondes.'],
    ['Demeurer', 'partir', 'rester', ['s’en aller', 'dessus', 'maison', 'jouer'], 'Ce sont des contraires.'],
    ['Janvier', 'février', 'juin', ['juillet', 'mai', 'mois', 'année'], 'C’est le mois suivant.'],
    ['Audacieux', 'timide', 'avancer', ['reculer', 'procéder', 'campagne', 'soldat'], 'Ce sont des contraires.'],
    ['Au-dessus', 'au-dessous', 'haut', ['bas', 'toupie', 'surface', 'côté'], 'Ce sont des contraires.'],
    ['Lion', 'animal', 'rose', ['plante', 'odeur', 'feuille', 'épine'], 'Le lion est un animal, la rose est une plante.'],
    ['Tigre', 'carnivore', 'cheval', ['herbivore', 'vache', 'poney', 'carriole'], 'Le tigre mange de la viande, le cheval mange de l’herbe.'],
    ['Marin', 'marine', 'soldat', ['armée', 'fusil', 'casquette', 'colline'], 'Le marin sert dans la marine, le soldat dans l’armée.'],
    ['Image', 'voir', 'son', ['entendre', 'bruit', 'musique', 'aboyer'], 'On voit une image, on entend un son.'],
    ['Succès', 'joie', 'échec', ['tristesse', 'succès', 'échouer', 'travail'], 'Le succès apporte la joie, l’échec la tristesse.'],
    ['Espoir', 'désespoir', 'bonheur', ['tristesse', 'gaieté', 'amusement', 'joie'], 'Ce sont des contraires.'],
    ['Joli', 'laid', 'attirer', ['repousser', 'fin', 'gentil', 'tirer'], 'Ce sont des contraires.'],
    ['Élève', 'professeur', 'enfant', ['parent', 'poupée', 'jeune', 'obéir'], 'L’élève est guidé par le professeur, l’enfant par ses parents.'],
    ['Ville', 'maire', 'armée', ['général', 'marine', 'soldat', 'simple soldat'], 'Le maire dirige la ville, le général dirige l’armée.'],
    ['Établir', 'commencer', 'abolir', ['finir', 'esclavage', 'tort', 'abolition'], 'Établir, c’est faire commencer ; abolir, c’est faire finir.'],
    ['Décembre', 'janvier', 'dernier', ['premier', 'moindre', 'pire', 'mois'], 'Décembre est le dernier mois, janvier le premier.'],
    ['Géant', 'nain', 'grand', ['petit', 'gros', 'monstre', 'bizarre'], 'Ce sont des contraires.'],
    ['Locomotive', 'dernier wagon', 'début', ['fin', 'commencer', 'cabine', 'train'], 'La locomotive est au début du train, le dernier wagon à la fin.'],
    ['Lugubre', 'joyeux', 'sombre', ['lumineux', 'triste', 'étoiles', 'nuit'], 'Ce sont des contraires.'],
    ['Se disputer', 'ennemi', 's’entendre', ['ami', 'être en désaccord', 'agréable', 'adversaire'], 'On se dispute avec un ennemi, on s’entend avec un ami.'],
    ['Hiver', 'été', 'froid', ['chaud', 'geler', 'mouillé', 'janvier'], 'L’hiver est froid, l’été est chaud.'],
    ['Gouvernail', 'navire', 'queue', ['oiseau', 'voile', 'chien', 'chat'], 'Le gouvernail dirige le navire, la queue dirige l’oiseau en vol.'],
    ['Sable', 'verre', 'argile', ['briques', 'pierre', 'foin', 'terre'], 'On fabrique le verre avec du sable, les briques avec de l’argile.'],
    ['Lune', 'Terre', 'Terre', ['Soleil', 'sol', 'Mars', 'ciel'], 'La Lune tourne autour de la Terre, la Terre autour du Soleil.'],
    ['Larmes', 'chagrin', 'rire', ['joie', 'sourire', 'filles', 'grimace'], 'Les larmes expriment le chagrin, le rire exprime la joie.'],
    ['Froid', 'glace', 'chaleur', ['vapeur', 'éclair', 'chaud', 'manteau'], 'Le froid change l’eau en glace, la chaleur la change en vapeur.'],
  ].forEach(([a, b, c, o, e]) => add5(7, `${a} est à ${b} ${que(c)} est à…`, o, e));

  [
    ['L’Amérique a été découverte (par les Européens) par…', ['Christophe Colomb', 'Drake', 'Hudson', 'Cabot'], 'Christophe Colomb y est arrivé en 1492.'],
    ['La guernesey est une race de…', ['vache', 'cheval', 'chèvre', 'mouton'], 'La guernesey est une vache laitière venue de l’île de Guernesey.'],
    ['Le salsifis est…', ['un légume', 'un serpent', 'un poisson', 'un lézard'], 'Le salsifis est un légume-racine.'],
    ['Le corail provient…', ['des récifs', 'des mines', 'des éléphants', 'des huîtres'], 'Le corail est formé par de petits animaux marins, en récifs.'],
    ['Rosa Bonheur est célèbre comme…', ['peintre', 'poète', 'compositrice', 'sculptrice'], 'Rosa Bonheur est une peintre française du XIXe siècle, célèbre pour ses animaux.'],
    ['Le thon est…', ['un poisson', 'un oiseau', 'un reptile', 'un insecte'], 'Le thon est un grand poisson de mer.'],
    ['Les émeraudes sont le plus souvent…', ['vertes', 'rouges', 'bleues', 'jaunes'], 'L’émeraude est connue pour sa couleur verte.'],
    ['Le cyprès est…', ['un arbre', 'une machine', 'un aliment', 'un tissu'], 'Le cyprès est un conifère.'],
    ['Bombay (aujourd’hui Mumbai) est une ville…', ['d’Inde', 'de Chine', 'd’Égypte', 'du Japon'], 'Mumbai est une grande ville d’Inde.'],
    ['Le pancréas se trouve dans…', ['l’abdomen', 'la tête', 'l’épaule', 'le cou'], 'Le pancréas est un organe de l’abdomen.'],
    ['Le cheviotte est…', ['un tissu', 'une boisson', 'une danse', 'un aliment'], 'Le cheviotte est un tissu de laine.'],
    ['Le larcin est un terme de…', ['droit', 'médecine', 'théologie', 'pédagogie'], 'Le larcin est un petit vol : c’est un terme juridique.'],
    ['La bataille de Gettysburg (guerre de Sécession) a eu lieu en…', ['1863', '1813', '1778', '1812'], 'Elle a eu lieu en juillet 1863.'],
    ['Le basson s’utilise en…', ['musique', 'sténographie', 'reliure', 'lithographie'], 'Le basson est un instrument de musique à vent.'],
    ['La térébenthine provient…', ['des arbres', 'du pétrole', 'du minerai', 'des peaux'], 'La térébenthine est tirée de la résine des pins.'],
    ['Le cimeterre est une sorte de…', ['sabre', 'mousquet', 'canon', 'pistolet'], 'Le cimeterre est un sabre à lame recourbée.'],
    ['L’auteur du poème « Le Corbeau » est…', ['Edgar Poe', 'Stevenson', 'Kipling', 'Hawthorne'], '« Le Corbeau » est un poème d’Edgar Allan Poe.'],
    ['Une figure à six côtés s’appelle…', ['un hexagone', 'un parallélogramme', 'un trapèze', 'une scolie'], 'Hexa veut dire six : l’hexagone a six côtés.'],
    ['Isaac Pitman est surtout célèbre pour…', ['la sténographie', 'la physique', 'les chemins de fer', 'l’électricité'], 'Isaac Pitman a inventé une méthode de sténographie.'],
    ['L’ampère sert à mesurer…', ['l’électricité', 'la force du vent', 'la force de l’eau', 'la pluie'], 'L’ampère est l’unité d’intensité du courant électrique.'],
    ['Le mauve est…', ['une couleur', 'une boisson', 'un tissu', 'un aliment'], 'Le mauve est une couleur violet pâle.'],
    ['Le mica est…', ['un minéral', 'un légume', 'un gaz', 'un liquide'], 'Le mica est un minéral brillant qui se débite en feuilles.'],
    ['Scrooge est un personnage de…', ['« Un chant de Noël »', '« La Foire aux vanités »', '« Romola »', '« Henri IV »'], 'Ebenezer Scrooge est le héros d’« Un chant de Noël » de Charles Dickens.'],
  ].forEach(([q, o, e]) => add5(8, q, o, e));

  TESTS.alpha = {
    title: 'Army Alpha (1918)',
    icon: '🎖️',
    color: '#5f7a3a',
    desc: 'Le vrai test de l’armée américaine de 1918 (formes 8 et 5), traduit et adapté.',
    questions: qs,
  };
})();
