// Catégorie « Raisonnement verbal mixte » : vocabulaire, logique en mots et culture générale mélangés,
// avec 6 à 8 propositions, sur le modèle du raisonnement verbal de l'ICAR. Questions originales.
(function () {
  let seed = 1616;
  const R = () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const ri = (a, b) => a + Math.floor(R() * (b - a + 1));
  const pick = a => a[Math.floor(R() * a.length)];
  const mix = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const sample = (a, n) => mix(a).slice(0, n);
  const cap = s => s[0].toUpperCase() + s.slice(1);

  /* ---------- Vocabulaire : [définition, bonne réponse, 5 pièges] ---------- */
  const DEF = [
    ['Personne qui ne mange pas de viande', 'végétarien', 'carnivore', 'omnivore', 'gourmet', 'cuisinier', 'boulimique'],
    ['Personne qui parle couramment deux langues', 'bilingue', 'traducteur', 'interprète', 'linguiste', 'monolingue', 'orateur'],
    ['Peur des espaces fermés', 'claustrophobie', 'agoraphobie', 'vertige', 'arachnophobie', 'insomnie', 'timidité'],
    ['Peur des araignées', 'arachnophobie', 'claustrophobie', 'agoraphobie', 'xénophobie', 'acrophobie', 'hydrophobie'],
    ['Mot qui a le même sens qu’un autre', 'synonyme', 'antonyme', 'homonyme', 'paronyme', 'pseudonyme', 'acronyme'],
    ['Mot de sens contraire à un autre', 'antonyme', 'synonyme', 'homonyme', 'anagramme', 'palindrome', 'acronyme'],
    ['Mot qui se lit de la même façon dans les deux sens, comme « kayak »', 'palindrome', 'anagramme', 'acronyme', 'homonyme', 'rébus', 'onomatopée'],
    ['Mot formé des initiales d’autres mots et qui se prononce comme un mot, comme « ONU »', 'acronyme', 'anagramme', 'palindrome', 'pseudonyme', 'homonyme', 'néologisme'],
    ['Nom d’emprunt choisi par un écrivain', 'pseudonyme', 'patronyme', 'anonyme', 'homonyme', 'synonyme', 'acronyme'],
    ['Mot nouvellement inventé', 'néologisme', 'archaïsme', 'barbarisme', 'pléonasme', 'euphémisme', 'anglicisme'],
    ['Répétition inutile d’une idée, comme « monter en haut »', 'pléonasme', 'euphémisme', 'oxymore', 'métaphore', 'litote', 'hyperbole'],
    ['Façon adoucie de dire une chose pénible, comme « il nous a quittés »', 'euphémisme', 'hyperbole', 'pléonasme', 'oxymore', 'ironie', 'métaphore'],
    ['Association de deux mots de sens contraires, comme « une obscure clarté »', 'oxymore', 'pléonasme', 'euphémisme', 'hyperbole', 'métaphore', 'allitération'],
    ['Exagération volontaire, comme « je meurs de faim »', 'hyperbole', 'litote', 'euphémisme', 'oxymore', 'métonymie', 'pléonasme'],
    ['Animal qui mange de tout', 'omnivore', 'herbivore', 'carnivore', 'insectivore', 'frugivore', 'granivore'],
    ['Animal qui se nourrit d’insectes', 'insectivore', 'herbivore', 'carnivore', 'omnivore', 'frugivore', 'granivore'],
    ['Animal qui se nourrit de graines', 'granivore', 'herbivore', 'carnivore', 'omnivore', 'frugivore', 'insectivore'],
    ['Animal surtout actif la nuit', 'nocturne', 'diurne', 'migrateur', 'hibernant', 'sédentaire', 'domestique'],
    ['Science qui étudie les êtres vivants', 'biologie', 'géologie', 'astronomie', 'chimie', 'physique', 'sociologie'],
    ['Science qui étudie les roches et la formation de la Terre', 'géologie', 'biologie', 'astronomie', 'géographie', 'botanique', 'météorologie'],
    ['Science qui étudie les astres', 'astronomie', 'astrologie', 'géologie', 'météorologie', 'physique', 'géographie'],
    ['Science qui étudie les fossiles', 'paléontologie', 'archéologie', 'géologie', 'biologie', 'anthropologie', 'zoologie'],
    ['Science qui étudie les insectes', 'entomologie', 'ornithologie', 'ichtyologie', 'botanique', 'herpétologie', 'mycologie'],
    ['Science qui étudie les oiseaux', 'ornithologie', 'entomologie', 'ichtyologie', 'botanique', 'herpétologie', 'mycologie'],
    ['Science qui étudie les plantes', 'botanique', 'entomologie', 'ornithologie', 'zoologie', 'géologie', 'mycologie'],
    ['Science qui étudie les champignons', 'mycologie', 'botanique', 'entomologie', 'ornithologie', 'zoologie', 'ichtyologie'],
    ['Médecin spécialiste des enfants', 'pédiatre', 'gériatre', 'dermatologue', 'ophtalmologue', 'cardiologue', 'orthopédiste'],
    ['Médecin spécialiste des yeux', 'ophtalmologue', 'pédiatre', 'dermatologue', 'cardiologue', 'orthophoniste', 'otorhinolaryngologiste'],
    ['Médecin spécialiste de la peau', 'dermatologue', 'pédiatre', 'ophtalmologue', 'cardiologue', 'gériatre', 'rhumatologue'],
    ['Médecin spécialiste du cœur', 'cardiologue', 'pédiatre', 'dermatologue', 'ophtalmologue', 'neurologue', 'pneumologue'],
    ['Médecin spécialiste des personnes âgées', 'gériatre', 'pédiatre', 'dermatologue', 'cardiologue', 'neurologue', 'orthopédiste'],
    ['Artisan qui transforme le blé en farine', 'meunier', 'boulanger', 'pâtissier', 'fermier', 'épicier', 'brasseur'],
    ['Artisan qui pose les fers aux sabots des chevaux', 'maréchal-ferrant', 'palefrenier', 'cavalier', 'sellier', 'jockey', 'éleveur'],
    ['Personne qui soigne les animaux malades', 'vétérinaire', 'zoologiste', 'éleveur', 'dresseur', 'soigneur', 'berger'],
    ['Recueil de cartes géographiques', 'atlas', 'dictionnaire', 'encyclopédie', 'almanach', 'annuaire', 'glossaire'],
    ['Liste des abonnés au téléphone avec leur numéro', 'annuaire', 'atlas', 'almanach', 'répertoire de chansons', 'catalogue de mode', 'calendrier'],
    ['Récit de la vie d’une personne, écrit par quelqu’un d’autre', 'biographie', 'autobiographie', 'roman', 'chronique', 'nouvelle', 'fable'],
    ['Récit de sa propre vie, écrit par soi-même', 'autobiographie', 'biographie', 'chronique', 'roman', 'nouvelle', 'fable'],
    ['Courte histoire, souvent avec des animaux, qui se termine par une morale', 'fable', 'conte', 'nouvelle', 'légende', 'roman', 'épopée'],
    ['Période de dix ans', 'décennie', 'siècle', 'millénaire', 'lustre', 'trimestre', 'semestre'],
    ['Période de cent ans', 'siècle', 'décennie', 'millénaire', 'lustre', 'génération', 'semestre'],
    ['Période de mille ans', 'millénaire', 'siècle', 'décennie', 'lustre', 'ère', 'centenaire'],
    ['Période de trois mois', 'trimestre', 'semestre', 'bimestre', 'saison', 'quinzaine', 'lustre'],
    ['Polygone à huit côtés', 'octogone', 'hexagone', 'pentagone', 'décagone', 'heptagone', 'losange'],
    ['Polygone à six côtés', 'hexagone', 'octogone', 'pentagone', 'décagone', 'heptagone', 'trapèze'],
    ['Angle de plus de 90° et de moins de 180°', 'obtus', 'aigu', 'droit', 'plat', 'rentrant', 'nul'],
    ['Angle de moins de 90°', 'aigu', 'obtus', 'droit', 'plat', 'rentrant', 'plein'],
    ['Endroit où l’on élève des abeilles', 'rucher', 'poulailler', 'haras', 'vivier', 'chenil', 'clapier'],
    ['Endroit où l’on élève des chevaux de race', 'haras', 'rucher', 'poulailler', 'vivier', 'chenil', 'clapier'],
    ['Cage ou abri où l’on élève des lapins', 'clapier', 'rucher', 'poulailler', 'haras', 'chenil', 'vivier'],
    ['Lieu où l’on élève ou garde des chiens', 'chenil', 'clapier', 'haras', 'rucher', 'vivier', 'poulailler'],
    ['Bassin où l’on garde des poissons vivants', 'vivier', 'chenil', 'clapier', 'haras', 'rucher', 'étable'],
    ['Plante qui vit plusieurs années', 'vivace', 'annuelle', 'bisannuelle', 'saisonnière', 'éphémère', 'grimpante'],
    ['Qui a lieu chaque semaine', 'hebdomadaire', 'quotidien', 'mensuel', 'annuel', 'trimestriel', 'semestriel'],
    ['Qui a lieu chaque mois', 'mensuel', 'hebdomadaire', 'quotidien', 'annuel', 'trimestriel', 'semestriel'],
    ['Qui a lieu tous les deux ans', 'biennal', 'annuel', 'semestriel', 'mensuel', 'trimestriel', 'centenaire'],
    ['Personne âgée de cent ans ou plus', 'centenaire', 'quinquagénaire', 'octogénaire', 'nonagénaire', 'sexagénaire', 'septuagénaire'],
    ['Personne âgée de 80 à 89 ans', 'octogénaire', 'centenaire', 'quinquagénaire', 'nonagénaire', 'sexagénaire', 'septuagénaire'],
    ['Instrument qui mesure la pression de l’air', 'baromètre', 'thermomètre', 'anémomètre', 'hygromètre', 'sismographe', 'altimètre'],
    ['Instrument qui mesure la vitesse du vent', 'anémomètre', 'baromètre', 'thermomètre', 'hygromètre', 'sismographe', 'compteur'],
    ['Instrument qui mesure l’humidité de l’air', 'hygromètre', 'baromètre', 'thermomètre', 'anémomètre', 'sismographe', 'pluviomètre'],
    ['Appareil qui enregistre les tremblements de terre', 'sismographe', 'baromètre', 'anémomètre', 'hygromètre', 'thermomètre', 'radar'],
    ['Qui ne peut pas être lu', 'illisible', 'illégal', 'invisible', 'inaudible', 'indélébile', 'inédit'],
    ['Qui ne peut pas être effacé', 'indélébile', 'illisible', 'invisible', 'inaudible', 'inédit', 'inusable'],
    ['Qu’on ne peut pas entendre', 'inaudible', 'illisible', 'invisible', 'indélébile', 'inédit', 'muet'],
    ['Qui n’a encore jamais été publié', 'inédit', 'illisible', 'inaudible', 'indélébile', 'invisible', 'anonyme'],
    ['Qui ne peut pas être évité', 'inévitable', 'invincible', 'irréversible', 'insoluble', 'interminable', 'inutile'],
    ['Qui ne peut pas être vaincu', 'invincible', 'inévitable', 'invisible', 'infaillible', 'insolent', 'inutile'],
    ['Qui ne se trompe jamais', 'infaillible', 'invincible', 'inévitable', 'irréprochable', 'insoluble', 'intrépide'],
    ['Sur quoi on ne peut pas revenir', 'irréversible', 'invincible', 'infaillible', 'inévitable', 'interminable', 'irréel'],
    ['Qui sait tout', 'omniscient', 'omnipotent', 'omniprésent', 'ignorant', 'naïf', 'prudent'],
    ['Qui est présent partout à la fois', 'omniprésent', 'omniscient', 'omnipotent', 'ubuesque', 'absent', 'invisible'],
    ['Qui a tous les pouvoirs', 'omnipotent', 'omniscient', 'omniprésent', 'impuissant', 'autoritaire', 'souverain'],
    ['Étude du passé de l’humanité à partir des documents', 'histoire', 'géographie', 'sociologie', 'philosophie', 'économie', 'géologie'],
    ['Lieu où l’on range et protège les avions', 'hangar', 'garage', 'entrepôt', 'aérogare', 'tarmac', 'cockpit'],
    ['Personne qui collectionne les timbres', 'philatéliste', 'numismate', 'bibliophile', 'cartophile', 'archiviste', 'antiquaire'],
    ['Personne qui collectionne les pièces de monnaie', 'numismate', 'philatéliste', 'bibliophile', 'cartophile', 'archiviste', 'banquier'],
  ];

  /* ---------- Culture générale : [question, bonne réponse, 5 pièges] ---------- */
  const CG = [
    ['Quelle est la capitale de l’Australie ?', 'Canberra', 'Sydney', 'Melbourne', 'Perth', 'Brisbane', 'Adélaïde'],
    ['Quelle est la capitale du Canada ?', 'Ottawa', 'Toronto', 'Montréal', 'Vancouver', 'Québec', 'Calgary'],
    ['Quelle est la capitale du Brésil ?', 'Brasília', 'Rio de Janeiro', 'São Paulo', 'Salvador', 'Recife', 'Buenos Aires'],
    ['Quelle est la capitale de la Turquie ?', 'Ankara', 'Istanbul', 'Izmir', 'Antalya', 'Bursa', 'Athènes'],
    ['Dans quelle ville siègent le gouvernement et le parlement suisses ?', 'Berne', 'Genève', 'Zurich', 'Lausanne', 'Bâle', 'Lucerne'],
    ['Quelle est la capitale du Maroc ?', 'Rabat', 'Casablanca', 'Marrakech', 'Fès', 'Tanger', 'Agadir'],
    ['Quelle est la capitale des États-Unis ?', 'Washington', 'New York', 'Los Angeles', 'Chicago', 'Boston', 'Philadelphie'],
    ['Quelle est la capitale du Japon ?', 'Tokyo', 'Kyoto', 'Osaka', 'Séoul', 'Pékin', 'Hiroshima'],
    ['Quelle est la capitale de la Norvège ?', 'Oslo', 'Stockholm', 'Copenhague', 'Helsinki', 'Bergen', 'Reykjavik'],
    ['Quel est le plus long fleuve de France ?', 'La Loire', 'La Seine', 'Le Rhône', 'La Garonne', 'La Dordogne', 'La Meuse'],
    ['Quelle est la plus haute montagne du monde ?', 'L’Everest', 'Le K2', 'Le mont Blanc', 'Le Kilimandjaro', 'L’Aconcagua', 'Le Denali'],
    ['Quel est le plus haut sommet des Alpes ?', 'Le mont Blanc', 'Le Cervin', 'Le mont Rose', 'L’Eiger', 'Le Grand Paradis', 'La barre des Écrins'],
    ['Quel est le plus grand océan du monde ?', 'Le Pacifique', 'L’Atlantique', 'L’océan Indien', 'L’océan Arctique', 'L’océan Austral', 'La Méditerranée'],
    ['Quel est le plus grand désert chaud du monde ?', 'Le Sahara', 'Le Gobi', 'Le Kalahari', 'L’Atacama', 'Le Namib', 'Le désert de Sonora'],
    ['Quel fleuve traverse Paris ?', 'La Seine', 'La Loire', 'Le Rhône', 'La Marne', 'L’Oise', 'La Garonne'],
    ['Quel pays a la forme d’une botte ?', 'L’Italie', 'La Grèce', 'L’Espagne', 'Le Portugal', 'La Croatie', 'Le Chili'],
    ['Quelle ville est surnommée la « Ville Lumière » ?', 'Paris', 'Lyon', 'Rome', 'Londres', 'New York', 'Vienne'],
    ['Quel est le plus petit pays du monde ?', 'Le Vatican', 'Monaco', 'Saint-Marin', 'Le Liechtenstein', 'Malte', 'Andorre'],
    ['Quel est le plus grand pays du monde par sa superficie ?', 'La Russie', 'Le Canada', 'La Chine', 'Les États-Unis', 'Le Brésil', 'L’Australie'],
    ['Quel est le plus long fleuve d’Afrique ?', 'Le Nil', 'Le Congo', 'Le Niger', 'Le Zambèze', 'Le fleuve Orange', 'Le Sénégal'],
    ['Quelle mer borde Marseille ?', 'La Méditerranée', 'La Manche', 'La mer du Nord', 'L’Atlantique', 'La mer Noire', 'La mer Baltique'],
    ['Quelle est la formule chimique de l’eau ?', 'H₂O', 'CO₂', 'O₂', 'NaCl', 'H₂O₂', 'CH₄'],
    ['Quel est le symbole chimique de l’or ?', 'Au', 'Or', 'Ag', 'Fe', 'Cu', 'Pb'],
    ['Quel est le symbole chimique du fer ?', 'Fe', 'Fr', 'Ir', 'F', 'Au', 'Pb'],
    ['Quelle est la planète la plus proche du Soleil ?', 'Mercure', 'Vénus', 'Mars', 'La Terre', 'Jupiter', 'Neptune'],
    ['Quelle est la plus grande planète du système solaire ?', 'Jupiter', 'Saturne', 'Neptune', 'Uranus', 'La Terre', 'Mars'],
    ['Quelle planète est surnommée la « planète rouge » ?', 'Mars', 'Vénus', 'Jupiter', 'Mercure', 'Saturne', 'Neptune'],
    ['Quel gaz les plantes absorbent-elles pour faire la photosynthèse ?', 'Le dioxyde de carbone', 'L’oxygène', 'L’azote', 'L’hydrogène', 'L’hélium', 'Le méthane'],
    ['Quel gaz est le plus abondant dans l’air que nous respirons ?', 'L’azote', 'L’oxygène', 'Le dioxyde de carbone', 'L’argon', 'L’hydrogène', 'La vapeur d’eau'],
    ['Quel est l’os le plus long du corps humain ?', 'Le fémur', 'Le tibia', 'L’humérus', 'Le péroné', 'Le radius', 'Le cubitus'],
    ['Combien de paires de chromosomes possède habituellement un être humain ?', '23', '21', '22', '24', '26', '32'],
    ['Quelle est, environ, la vitesse de la lumière ?', '300 000 km/s', '30 000 km/s', '3 000 km/s', '300 km/s', '3 000 000 km/s', '340 m/s'],
    ['À quelle température l’eau bout-elle au niveau de la mer ?', '100 °C', '90 °C', '80 °C', '120 °C', '110 °C', '212 °C'],
    ['Quelle est l’unité de la résistance électrique ?', 'L’ohm', 'Le volt', 'L’ampère', 'Le watt', 'Le joule', 'Le newton'],
    ['Quelle est l’unité de la force ?', 'Le newton', 'Le joule', 'Le watt', 'Le pascal', 'Le volt', 'L’ohm'],
    ['Quelle est l’unité de l’énergie ?', 'Le joule', 'Le newton', 'Le watt', 'Le pascal', 'Le volt', 'Le hertz'],
    ['Quel est le seul mammifère capable de vraiment voler ?', 'La chauve-souris', 'Le colibri', 'Le pingouin', 'Le poisson volant', 'Le hibou', 'L’autruche'],
    ['Quel est le plus grand animal du monde ?', 'La baleine bleue', 'L’éléphant d’Afrique', 'Le requin-baleine', 'La girafe', 'Le cachalot', 'L’orque'],
    ['Quel est l’animal terrestre le plus rapide ?', 'Le guépard', 'Le lion', 'Le cheval', 'Le lévrier', 'Le lièvre', 'Le zèbre'],
    ['Combien de pattes a une araignée ?', '8', '6', '10', '4', '12', '7'],
    ['Combien de pattes a un insecte ?', '6', '8', '4', '10', '12', '5'],
    ['En quelle année a eu lieu la prise de la Bastille ?', '1789', '1792', '1799', '1776', '1815', '1848'],
    ['Qui a été le premier homme à marcher sur la Lune ?', 'Neil Armstrong', 'Buzz Aldrin', 'Youri Gagarine', 'Michael Collins', 'John Glenn', 'Thomas Pesquet'],
    ['Qui a été le premier homme à voyager dans l’espace ?', 'Youri Gagarine', 'Neil Armstrong', 'Buzz Aldrin', 'John Glenn', 'Alexeï Leonov', 'Thomas Pesquet'],
    ['En quelle année le mur de Berlin est-il tombé ?', '1989', '1991', '1985', '1961', '1945', '1990'],
    ['En quelle année s’est terminée la Seconde Guerre mondiale ?', '1945', '1944', '1946', '1918', '1939', '1950'],
    ['En quelle année a commencé la Première Guerre mondiale ?', '1914', '1918', '1912', '1916', '1870', '1939'],
    ['Qui a peint La Joconde ?', 'Léonard de Vinci', 'Michel-Ange', 'Raphaël', 'Botticelli', 'Titien', 'Rembrandt'],
    ['Qui a peint « Les Tournesols » ?', 'Vincent van Gogh', 'Claude Monet', 'Paul Gauguin', 'Paul Cézanne', 'Auguste Renoir', 'Pablo Picasso'],
    ['Qui a écrit « Les Misérables » ?', 'Victor Hugo', 'Émile Zola', 'Honoré de Balzac', 'Alexandre Dumas', 'Gustave Flaubert', 'Guy de Maupassant'],
    ['Qui a écrit « Le Petit Prince » ?', 'Antoine de Saint-Exupéry', 'Jules Verne', 'Albert Camus', 'Jacques Prévert', 'Marcel Pagnol', 'Jean-Paul Sartre'],
    ['Qui a écrit « Vingt mille lieues sous les mers » ?', 'Jules Verne', 'Victor Hugo', 'Alexandre Dumas', 'H. G. Wells', 'Antoine de Saint-Exupéry', 'Émile Zola'],
    ['Qui a écrit « Roméo et Juliette » ?', 'William Shakespeare', 'Molière', 'Jean Racine', 'Pierre Corneille', 'Victor Hugo', 'Charles Dickens'],
    ['Qui a composé « La Flûte enchantée » ?', 'Mozart', 'Beethoven', 'Bach', 'Vivaldi', 'Chopin', 'Verdi'],
    ['Qui a composé « Les Quatre Saisons » ?', 'Vivaldi', 'Mozart', 'Bach', 'Beethoven', 'Haendel', 'Chopin'],
    ['Qui a formulé la théorie de la relativité ?', 'Albert Einstein', 'Isaac Newton', 'Galilée', 'Marie Curie', 'Niels Bohr', 'Charles Darwin'],
    ['Qui a proposé la théorie de l’évolution par la sélection naturelle ?', 'Charles Darwin', 'Albert Einstein', 'Louis Pasteur', 'Gregor Mendel', 'Isaac Newton', 'Jean-Baptiste Lamarck'],
    ['Qui a découvert la pénicilline ?', 'Alexander Fleming', 'Louis Pasteur', 'Marie Curie', 'Robert Koch', 'Edward Jenner', 'Claude Bernard'],
    ['Qui a été le premier président de la Ve République française ?', 'Charles de Gaulle', 'Georges Pompidou', 'François Mitterrand', 'Valéry Giscard d’Estaing', 'René Coty', 'Jacques Chirac'],
    ['En quelle année les pièces et billets en euros sont-ils entrés en circulation ?', '2002', '1999', '2000', '2001', '2003', '1995'],
    ['Dans quel pays se trouvent les pyramides de Gizeh ?', 'L’Égypte', 'Le Mexique', 'Le Soudan', 'La Libye', 'L’Irak', 'La Jordanie'],
    ['Quelle est la langue la plus parlée au Brésil ?', 'Le portugais', 'L’espagnol', 'L’anglais', 'Le français', 'L’italien', 'Le guarani'],
    ['Quelle est la langue officielle du Mexique, dans les faits ?', 'L’espagnol', 'Le portugais', 'L’anglais', 'Le nahuatl', 'Le français', 'Le maya'],
    ['Quel instrument a habituellement 88 touches ?', 'Le piano', 'L’orgue', 'L’accordéon', 'Le clavecin', 'Le xylophone', 'Le synthétiseur'],
    ['Combien de joueurs une équipe de football a-t-elle sur le terrain ?', '11', '9', '10', '12', '15', '7'],
    ['Combien de joueurs une équipe de basket-ball a-t-elle sur le terrain ?', '5', '6', '7', '9', '11', '4'],
    ['Qui a relancé les Jeux olympiques modernes en 1896 ?', 'Pierre de Coubertin', 'Jules Ferry', 'Gustave Eiffel', 'Jules Rimet', 'Louis Pasteur', 'Victor Hugo'],
    ['Combien d’anneaux compte le drapeau olympique ?', '5', '4', '6', '7', '3', '8'],
    ['Quelles sont les couleurs du drapeau italien ?', 'Vert, blanc, rouge', 'Bleu, blanc, rouge', 'Rouge, blanc, vert, jaune', 'Vert, jaune, rouge', 'Noir, rouge, or', 'Rouge, blanc'],
    ['Quelle est la monnaie du Royaume-Uni ?', 'La livre sterling', 'L’euro', 'Le dollar', 'Le franc', 'La couronne', 'Le mark'],
    ['Quelle est la monnaie du Japon ?', 'Le yen', 'Le yuan', 'Le won', 'Le dollar', 'La roupie', 'Le baht'],
    ['Combien de jours compte une année bissextile ?', '366', '365', '364', '360', '367', '368'],
    ['Combien de minutes y a-t-il dans une journée ?', '1 440', '1 240', '1 400', '3 600', '720', '1 600'],
    ['Combien de secondes y a-t-il dans une heure ?', '3 600', '360', '6 000', '1 440', '600', '36 000'],
    ['Combien d’os compte le squelette d’un adulte ?', '206', '186', '196', '212', '256', '306'],
    ['Combien de dents possède un adulte, dents de sagesse comprises ?', '32', '28', '30', '36', '24', '34'],
    ['Qui a écrit la fable « Le Corbeau et le Renard » ?', 'Jean de La Fontaine', 'Charles Perrault', 'Molière', 'Jean Racine', 'Voltaire', 'Nicolas Boileau'],
    ['Qui a écrit le conte « La Petite Sirène » ?', 'Hans Christian Andersen', 'Charles Perrault', 'Les frères Grimm', 'Lewis Carroll', 'Carlo Collodi', 'Jean de La Fontaine'],
    ['Qui a écrit « Alice au pays des merveilles » ?', 'Lewis Carroll', 'Hans Christian Andersen', 'J. M. Barrie', 'Charles Dickens', 'Roald Dahl', 'Jules Verne'],
    ['Qui a écrit « Les Aventures de Pinocchio » ?', 'Carlo Collodi', 'Lewis Carroll', 'Hans Christian Andersen', 'Charles Perrault', 'Les frères Grimm', 'Italo Calvino'],
    ['Pour quelle Exposition universelle la tour Eiffel a-t-elle été construite ?', 'Celle de 1889', 'Celle de 1789', 'Celle de 1900', 'Celle de 1855', 'Celle de 1878', 'Celle de 1925'],
    ['Quelle couleur obtient-on en mélangeant du bleu et du jaune ?', 'Vert', 'Violet', 'Orange', 'Marron', 'Gris', 'Turquoise'],
    ['Combien de couleurs compte-t-on traditionnellement dans l’arc-en-ciel ?', '7', '5', '6', '8', '9', '12'],
    ['Combien de cordes a une guitare classique ?', '6', '4', '5', '7', '8', '12'],
    ['Quelle ville a accueilli les Jeux olympiques d’été de 2024 ?', 'Paris', 'Los Angeles', 'Tokyo', 'Londres', 'Rome', 'Madrid'],
    ['Quels organes permettent de respirer ?', 'Les poumons', 'Les reins', 'Le foie', 'L’estomac', 'Le cœur', 'La rate'],
    ['Quel est le premier élément du tableau périodique ?', 'L’hydrogène', 'L’hélium', 'Le lithium', 'L’oxygène', 'Le carbone', 'L’azote'],
    ['Quel est le satellite naturel de la Terre ?', 'La Lune', 'Le Soleil', 'Phobos', 'Titan', 'Europe', 'Io'],
    ['Quel organe filtre le sang pour fabriquer l’urine ?', 'Les reins', 'Le foie', 'Le cœur', 'Les poumons', 'La rate', 'Le pancréas'],
    ['Quel est le plus grand organe du corps humain ?', 'La peau', 'Le foie', 'Le cerveau', 'Les poumons', 'L’intestin', 'Le cœur'],
    ['Quelle est la capitale de l’Égypte ?', 'Le Caire', 'Alexandrie', 'Louxor', 'Assouan', 'Gizeh', 'Tunis'],
    ['Quelle est la capitale de l’Argentine ?', 'Buenos Aires', 'Santiago', 'Montevideo', 'Lima', 'Córdoba', 'Rosario'],
    ['Sur quel continent se trouve le Kenya ?', 'L’Afrique', 'L’Asie', 'L’Amérique du Sud', 'L’Océanie', 'L’Europe', 'L’Antarctique'],
  ];

  /* ---------- Liens de parenté ---------- */
  const PAR_WORDS = ['grand-père', 'grand-mère', 'oncle', 'tante', 'cousin', 'cousine', 'neveu', 'nièce', 'beau-frère', 'belle-sœur', 'frère', 'sœur', 'père', 'mère', 'petit-fils', 'petite-fille'];
  const PAR = [
    ['le père de mon père', 'grand-père'], ['la mère de ma mère', 'grand-mère'], ['le frère de ma mère', 'oncle'], ['la sœur de mon père', 'tante'],
    ['le fils de mon oncle', 'cousin'], ['la fille de ma tante', 'cousine'], ['le fils de ma sœur', 'neveu'], ['la fille de mon frère', 'nièce'],
    ['le mari de ma sœur', 'beau-frère'], ['la femme de mon frère', 'belle-sœur'], ['le mari de ma tante', 'oncle'], ['la fille de la sœur de ma mère', 'cousine'],
    ['le fils du seul fils de mes grands-parents paternels, si ce n’est pas moi', 'frère'], ['le père de mon cousin, qui est le frère de mon père', 'oncle'],
    ['la mère de ma nièce, qui est la femme de mon frère', 'belle-sœur'], ['le fils de mon fils', 'petit-fils'], ['la fille de ma fille', 'petite-fille'],
    ['le père de ma mère', 'grand-père'], ['la seule fille de ma grand-mère maternelle', 'mère'], ['le frère de ma femme', 'beau-frère'],
  ];

  /* ---------- Générateurs de logique en mots ---------- */
  const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  const OUT = []; // questions générées
  const add = (q, options, answer, explain, keepOrder = false) => OUT.push({ q, options, answer, explain, keepOrder });

  // a) jours de la semaine
  const repere = [['avant-hier', -2], ['hier', -1], ['demain', 1], ['après-demain', 2]];
  for (let k = 0; k < 90; k++) {
    const [w, off] = pick(repere), d = ri(0, 6), n = ri(2, 12), before = R() < 0.4;
    const today = ((d - off) % 7 + 7) % 7, target = ((today + (before ? -n : n)) % 7 + 7) % 7;
    const verbe = off < 0 ? 'était' : 'est';
    add(`Si ${w} ${verbe} ${JOURS[d]}, quel jour ${before ? `était-on il y a ${n} jours` : `serons-nous dans ${n} jours`} ?`,
      JOURS.map(cap), target,
      `Si ${w} ${verbe} ${JOURS[d]}, aujourd’hui on est ${JOURS[today]}. ${before ? `${n} jours plus tôt` : `${n} jours plus tard`}, on ${before ? 'était' : 'sera'} ${JOURS[target]}.`, true);
  }
  // b) fractions enchaînées
  const FR = [['la moitié', 2, 1], ['un tiers', 3, 1], ['un quart', 4, 1], ['un cinquième', 5, 1], ['un dixième', 10, 1], ['deux tiers', 3, 2], ['trois quarts', 4, 3]];
  for (let k = 0; k < 80; k++) {
    const [a, b] = sample(FR, 2), unit = ri(1, 9) * pick([1, 2, 3, 5]);
    const N = unit * a[1] * b[1], ans = N / a[1] * a[2] / b[1] * b[2];
    const vals = [ans, N / a[1] * a[2], N / b[1] * b[2], ans * 2, ans / 2, ans + unit, N - ans].filter(x => Number.isInteger(x) && x > 0);
    const opts = [...new Set(vals)].slice(0, 6);
    if (opts.length < 6) continue;
    add(`Combien font ${a[0]} ${b[0].startsWith('un') ? 'd’' : 'de '}${b[0]} de ${N} ?`, opts.map(String), 0,
      `${cap(b[0])} de ${N}, c’est ${N / b[1] * b[2]}. Puis ${a[0]} de ${N / b[1] * b[2]}, c’est ${ans}.`);
  }
  // c) alphabet
  const AL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let k = 0; k < 60; k++) {
    const m = ri(1, 4), p = ri(1, 5), L = ri(m, 25), mid = L - m, ans = mid + p;
    if (ans > 25 || ans === L) continue;
    const near = [...new Set([ans, ans - 1, ans + 1, L + p, L - m - p, ans + 2, mid, L].filter(i => i >= 0 && i <= 25))].slice(0, 6);
    if (near.length < 6) continue;
    add(`Dans l’alphabet, quelle lettre vient ${p} rang${p > 1 ? 's' : ''} après la lettre qui se trouve ${m} rang${m > 1 ? 's' : ''} avant ${AL[L]} ?`,
      near.map(i => AL[i]), 0, `${m} rang${m > 1 ? 's' : ''} avant ${AL[L]}, c’est ${AL[mid]}. ${p} rang${p > 1 ? 's' : ''} après ${AL[mid]}, c’est ${AL[ans]}.`);
  }
  // d) ordre alphabétique
  const GROUPES = [
    ['maison', 'marché', 'matin', 'magie', 'manteau', 'mardi', 'marin', 'masque', 'maçon', 'malle'],
    ['cheval', 'chemin', 'cheminée', 'chêne', 'cher', 'chef', 'chenille', 'chèvre', 'chercheur', 'chemise'],
    ['parapluie', 'parfum', 'pari', 'parc', 'parole', 'partage', 'parent', 'paresse', 'parquet', 'parking'],
    ['tableau', 'table', 'tablier', 'tabouret', 'tabac', 'tache', 'taille', 'tailleur', 'talon'],
    ['bateau', 'bâton', 'batterie', 'bataille', 'battement', 'batte', 'bâtiment', 'baignoire', 'balai', 'bandeau'],
    ['soleil', 'sol', 'soldat', 'sole', 'solide', 'solution', 'sommeil', 'sombre', 'somme', 'sonnette'],
  ];
  const ORDS = ['premier', 'deuxième', 'troisième', 'quatrième', 'cinquième', 'sixième'];
  for (let k = 0; k < 60; k++) {
    const words = sample(pick(GROUPES), 6), sorted = [...words].sort((x, y) => x.localeCompare(y, 'fr'));
    const pos = ri(1, 4);
    add(`Si l’on range ces mots dans l’ordre alphabétique, lequel arrive en ${ORDS[pos]} ? ${words.join(', ')}.`,
      words, words.indexOf(sorted[pos]), `Dans l’ordre alphabétique : ${sorted.join(', ')}. Le ${ORDS[pos]} est « ${sorted[pos]} ».`);
  }
  // e) classements (avec parfois une information qui manque)
  const NOMS = ['Alix', 'Basile', 'Céline', 'Dorian', 'Élise', 'Fabien', 'Gaëlle', 'Hugo', 'Inès', 'Jules'];
  const perms = a => a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map(p => [x, ...p]));
  const P5 = perms([0, 1, 2, 3, 4]);
  for (let k = 0; k < 70; k++) {
    const N = sample(NOMS, 5); // N[0] le plus âgé … N[4] le plus jeune
    let facts = [[0, 1], [1, 2], [2, 3], [3, 4]];
    if (R() < 0.3) { facts.splice(ri(0, 3), 1); facts.push([0, 4]); }
    // ordres compatibles (pos[x] < pos[y] si x est plus âgé que y)
    const ok = P5.filter(p => facts.every(([x, y]) => p.indexOf(x) < p.indexOf(y)));
    const rank = ri(0, 4), who = new Set(ok.map(p => p[rank]));
    const RK = ['le plus âgé', 'le deuxième plus âgé', 'le troisième plus âgé', 'le quatrième plus âgé', 'le plus jeune'];
    const que = n => (/^[AEIOUÉÈÊ]/.test(n) ? `qu’${n}` : `que ${n}`);
    const sentences = mix(facts).map(([x, y]) => R() < 0.5 ? `${N[x]} est plus âgé·e ${que(N[y])}.` : `${N[y]} est plus jeune ${que(N[x])}.`).join(' ');
    // prénoms proposés dans un ordre mélangé (sinon l'ordre d'âge donnerait la réponse), « On ne peut pas savoir » en dernier
    const shown = mix(N), options = [...shown, 'On ne peut pas savoir'];
    const sure = who.size === 1;
    add(`${sentences} Qui est ${RK[rank]} ?`, options, sure ? shown.indexOf(N[[...who][0]]) : 5,
      sure ? `Du plus âgé au plus jeune : ${ok[0].map(i => N[i]).join(', ')}. ${cap(RK[rank])} est donc ${N[[...who][0]]}.`
        : `Les informations ne suffisent pas : plusieurs ordres sont possibles, et ${RK[rank]} peut être ${[...who].map(i => N[i]).join(' ou ')}.`, true);
  }

  // Assemblage : vocabulaire, culture générale, parenté, puis la logique générée, le tout mélangé
  const qs = [
    ...DEF.map(([d, a, ...w]) => ({ q: `Quel mot correspond à cette définition : « ${d} » ?`, options: [a, ...w], answer: 0, explain: `« ${cap(a)} » : ${d.toLowerCase()}.` })),
    ...CG.map(([q, a, ...w]) => ({ q, options: [a, ...w], answer: 0, explain: `La bonne réponse est : ${a}.` })),
    ...PAR.map(([d, a]) => {
      const opts = [a, ...sample(PAR_WORDS.filter(x => x !== a), 7)];
      return { q: `Pour moi, ${d}, c’est mon ou ma…`, options: opts, answer: 0, explain: `${cap(d)}, c’est mon ou ma ${a}.` };
    }),
    ...OUT,
  ];
  // une seule question par énoncé
  const seen = new Set(), uniq = qs.filter(q => !seen.has(q.q) && seen.add(q.q) && new Set(q.options).size === q.options.length);
  TESTS.verbalmix = { title: 'Raisonnement verbal mixte', icon: '🗣️', color: '#b45309',
    desc: 'Vocabulaire, logique en mots et culture générale mélangés, avec 6 à 8 propositions.', questions: mix(uniq).slice(0, 400) };
})();
