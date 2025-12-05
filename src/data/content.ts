// Types
export type Language = 'en' | 'fr' | 'ar' | 'nl';

export interface AlphabetItem {
  letter: string;
  word: string;
  image: string;
  additionalWords?: (string | { word: string; image: string })[];
  svgPath?: string;
}

export interface NumberItem {
  number: string;
  word: string;
  image: string;
  count: number;
}

export const alphabetData: Record<Language, AlphabetItem[]> = {
  nl: [
    {
      letter: 'A',
      word: 'Appel',
      image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f34e.svg',
      additionalWords: ['Aap', 'Auto', 'Ananas'],
      svgPath: '/letters/nl/A.svg'
    },
    {
      letter: 'B',
      word: 'Bal',
      image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/26bd.svg',
      additionalWords: ['Boek', 'Boot', 'Beer'],
      svgPath: '/letters/nl/B.svg'
    },
    { letter: 'C', word: 'Citroen', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f34b.svg', additionalWords: ['Clown', 'Cactus', 'Camera'], svgPath: '/letters/nl/C.svg' },
    { letter: 'D', word: 'Dolfijn', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f42c.svg', additionalWords: ['Deur', 'Doos', 'Draak'], svgPath: '/letters/nl/D.svg' },
    { letter: 'E', word: 'Eekhoorn', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f43f.svg', additionalWords: ['Eend', 'Emmer', 'Ezel'], svgPath: '/letters/nl/E.svg' },
    { letter: 'F', word: 'Fiets', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f6b2.svg', additionalWords: ['Fles', 'Fruit', 'Foto'], svgPath: '/letters/nl/F.svg' },
    { letter: 'G', word: 'Giraffe', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f992.svg', additionalWords: ['Gras', 'Geit', 'Goud'], svgPath: '/letters/nl/G.svg' },
    { letter: 'H', word: 'Hond', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f415.svg', additionalWords: ['Huis', 'Hand', 'Hoed'], svgPath: '/letters/nl/H.svg' },
    { letter: 'I', word: 'IJs', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f368.svg', additionalWords: ['Inkt', 'Iglo', 'Insect'], svgPath: '/letters/nl/I.svg' },
    { letter: 'J', word: 'Jas', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f9e5.svg', additionalWords: ['Jojo', 'Jurk', 'Jarig'], svgPath: '/letters/nl/J.svg' },
    { letter: 'K', word: 'Kat', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f408.svg', additionalWords: ['Kip', 'Kaas', 'Klok'] },
    { letter: 'L', word: 'Leeuw', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f981.svg', additionalWords: ['Lamp', 'Lippen', 'Ladders'] },
    { letter: 'M', word: 'Maan', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f319.svg', additionalWords: ['Muis', 'Meloen', 'Mond'] },
    { letter: 'N', word: 'Neus', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f443.svg', additionalWords: ['Noot', 'Nest', 'Naald'] },
    { letter: 'O', word: 'Olifant', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f418.svg', additionalWords: ['Oog', 'Oor', 'Opa'] },
    { letter: 'P', word: 'Paard', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f434.svg', additionalWords: ['Pop', 'Pet', 'Peer'] },
    { letter: 'Q', word: 'Quiz', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2753.svg', additionalWords: ['Quilt'] },
    { letter: 'R', word: 'Robot', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f916.svg', additionalWords: ['Roos', 'Riem', 'Rok'] },
    { letter: 'S', word: 'Ster', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2b50.svg', additionalWords: ['Slang', 'Sok', 'Schaap'] },
    { letter: 'T', word: 'Trein', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f686.svg', additionalWords: ['Trommel', 'Tijger', 'Tafel'] },
    { letter: 'U', word: 'Uil', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f989.svg', additionalWords: ['Ui', 'Uur'] },
    { letter: 'V', word: 'Vis', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f41f.svg', additionalWords: ['Vos', 'Vlag', 'Vuur'] },
    { letter: 'W', word: 'Water', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4a7.svg', additionalWords: ['Wolk', 'Worm', 'Wiel'] },
    { letter: 'X', word: 'Xylofoon', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b9.svg', additionalWords: [] },
    { letter: 'Y', word: 'Yoghurt', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f95b.svg', additionalWords: ['Yoga'] },
    { letter: 'Z', word: 'Zebra', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f993.svg', additionalWords: ['Zee', 'Zeep', 'Zon'] }
  ],
  en: [
    {
      letter: 'A',
      word: 'Apple',
      image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f34e.svg',
      additionalWords: ['Ant', 'Airplane', 'Alligator'],
      svgPath: '/letters/en/A.svg'
    },
    {
      letter: 'B',
      word: 'Ball',
      image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/26bd.svg',
      additionalWords: ['Book', 'Bear', 'Boat'],
      svgPath: '/letters/en/B.svg'
    },
    { letter: 'C', word: 'Cat', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f408.svg', additionalWords: ['Car', 'Cake', 'Cow'] },
    { letter: 'D', word: 'Dog', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f415.svg', additionalWords: ['Duck', 'Door', 'Doll'] },
    { letter: 'E', word: 'Eye', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f441.svg', additionalWords: ['Egg', 'Elephant', 'Ear'] },
    { letter: 'F', word: 'Fish', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f41f.svg', additionalWords: ['Frog', 'Flower', 'Fan'] },
    { letter: 'G', word: 'Gift', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f381.svg', additionalWords: ['Goat', 'Grape', 'Glass'] },
    { letter: 'H', word: 'Hat', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3a9.svg', additionalWords: ['House', 'Horse', 'Hand'] },
    { letter: 'I', word: 'Ice', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f9ca.svg', additionalWords: ['Igloo', 'Insect', 'Ink'] },
    { letter: 'J', word: 'Jam', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f96b.svg', additionalWords: ['Jet', 'Jelly', 'Jug'] },
    { letter: 'K', word: 'Key', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f511.svg', additionalWords: ['Kite', 'King', 'Koala'] },
    { letter: 'L', word: 'Lion', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f981.svg', additionalWords: ['Lamp', 'Leaf', 'Lemon'] },
    { letter: 'M', word: 'Moon', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f319.svg', additionalWords: ['Mouse', 'Milk', 'Monkey'] },
    { letter: 'N', word: 'Nose', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f443.svg', additionalWords: ['Net', 'Nest', 'Nut'] },
    { letter: 'O', word: 'Orange', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f34a.svg', additionalWords: ['Owl', 'Octopus', 'Onion'] },
    { letter: 'P', word: 'Pig', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f437.svg', additionalWords: ['Pen', 'Pan', 'Pizza'] },
    { letter: 'Q', word: 'Queen', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f478.svg', additionalWords: ['Quilt', 'Quiz'] },
    { letter: 'R', word: 'Ring', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f48d.svg', additionalWords: ['Rabbit', 'Robot', 'Rose'] },
    { letter: 'S', word: 'Star', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2b50.svg', additionalWords: ['Sun', 'Snake', 'Spoon'] },
    { letter: 'T', word: 'Tree', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f333.svg', additionalWords: ['Tiger', 'Table', 'Tomato'] },
    { letter: 'U', word: 'Up', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2b06.svg', additionalWords: ['Umbrella', 'Unicorn'] },
    { letter: 'V', word: 'Van', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f69b.svg', additionalWords: ['Violin', 'Vase', 'Vest'] },
    { letter: 'W', word: 'Water', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4a7.svg', additionalWords: ['Whale', 'Watch', 'Wolf'] },
    { letter: 'X', word: 'X-mas', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f384.svg', additionalWords: ['Xylophone'] },
    { letter: 'Y', word: 'Yum', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f60b.svg', additionalWords: ['Yo-yo', 'Yellow', 'Yak'] },
    { letter: 'Z', word: 'Zebra', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f993.svg', additionalWords: ['Zoo', 'Zip', 'Zero'] }
  ],
  fr: [
    {
      letter: 'A',
      word: 'Avion',
      image: '/images/avion.png',
      additionalWords: [
        { word: 'Arbre', image: '/images/arbre.png' },
        { word: 'Abeille', image: '/images/abeille.png' },
        { word: 'Ananas', image: '/images/ananas.png' }
      ],
      svgPath: '/letters/fr/A.svg'
    },
    {
      letter: 'B',
      word: 'Ballon',
      image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Balloon.png',
      additionalWords: [
        { word: 'Bateau', image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel-and-places/Speedboat.png' },
        { word: 'Banane', image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food-and-drink/Banana.png' },
        { word: 'Baleine', image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Natural-and-animals/Spouting%20Whale.png' }
      ],
      svgPath: '/letters/fr/B.svg'
    },
    { 
      letter: 'C', 
      word: 'Crocodile', 
      image: '/images/crocodile.png', 
      additionalWords: [
        { word: 'Citron', image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food-and-drink/Lemon.png' },
        { word: 'Chat', image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Natural-and-animals/Cat%20Face.png' },
        { word: 'Cadeau', image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Wrapped%20Gift.png' }
      ], 
      svgPath: '/letters/fr/C.svg' 
    },
    { letter: 'D', word: 'Dauphin', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f42c.svg', additionalWords: ['Dinosaure', 'Dent', 'Domino'] },
    { letter: 'E', word: 'Étoile', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2b50.svg', additionalWords: ['Éléphant', 'École', 'Escargot'] },
    { letter: 'F', word: 'Fraise', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f353.svg', additionalWords: ['Fleur', 'Fourmi', 'Feu'] },
    { letter: 'G', word: 'Girafe', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f992.svg', additionalWords: ['Gâteau', 'Grenouille', 'Garçon'] },
    { letter: 'H', word: 'Hélicoptère', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f681.svg', additionalWords: ['Hibou', 'Hérisson', 'Hache'] },
    { letter: 'I', word: 'Iguane', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98e.svg', additionalWords: ['Igloo', 'Île', 'Iris'] },
    { letter: 'J', word: 'Jus', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f379.svg', additionalWords: ['Jardin', 'Jambe', 'Jupe'] },
    { letter: 'K', word: 'Kangourou', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f998.svg', additionalWords: ['Kiwi', 'Koala', 'Képi'] },
    { letter: 'L', word: 'Lune', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f319.svg', additionalWords: ['Lion', 'Loup', 'Lapin'] },
    { letter: 'M', word: 'Maison', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3e0.svg', additionalWords: ['Mouton', 'Main', 'Moto'] },
    { letter: 'N', word: 'Neige', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2744.svg', additionalWords: ['Nuage', 'Nez', 'Nid'] },
    { letter: 'O', word: 'Ours', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f43b.svg', additionalWords: ['Oiseau', 'Orange', 'Oeuf'] },
    { letter: 'P', word: 'Papillon', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98b.svg', additionalWords: ['Pomme', 'Poire', 'Poule'] },
    { letter: 'Q', word: 'Quille', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b3.svg', additionalWords: ['Quatre', 'Queue'] },
    { letter: 'R', word: 'Robot', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f916.svg', additionalWords: ['Renard', 'Rose', 'Raisin'] },
    { letter: 'S', word: 'Soleil', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2600.svg', additionalWords: ['Souris', 'Sapin', 'Sac'] },
    { letter: 'T', word: 'Train', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f686.svg', additionalWords: ['Tortue', 'Tomate', 'Tente'] },
    { letter: 'U', word: 'Usine', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3ed.svg', additionalWords: ['Un', 'Urne'] },
    { letter: 'V', word: 'Voiture', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f697.svg', additionalWords: ['Vache', 'Vélo', 'Valise'] },
    { letter: 'W', word: 'Wagon', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f683.svg', additionalWords: ['Wapiti', 'Wifi'] },
    { letter: 'X', word: 'Xylophone', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b9.svg', additionalWords: [] },
    { letter: 'Y', word: 'Yaourt', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f95b.svg', additionalWords: ['Yoyo', 'Yeux'] },
    { letter: 'Z', word: 'Zèbre', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f993.svg', additionalWords: ['Zoo', 'Zéro', 'Zigzag'] }
  ],
  ar: [
    { letter: 'أ', word: 'أَسَدٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f981.svg' },
    { letter: 'ب', word: 'بَطَّةٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f986.svg' },
    { letter: 'ت', word: 'تُفَّاحَةٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f34e.svg' },
    { letter: 'ث', word: 'ثَعْلَبٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98a.svg' },
    { letter: 'ج', word: 'جَمَلٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f42b.svg' },
    { letter: 'ح', word: 'حِصَانٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f434.svg' },
    { letter: 'خ', word: 'خَرُوفٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f411.svg' },
    { letter: 'د', word: 'دَجَاجَةٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f414.svg' },
    { letter: 'ذ', word: 'ذِئْبٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f43a.svg' },
    { letter: 'ر', word: 'رَاعِي', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f9cd.svg' },
    { letter: 'ز', word: 'زَرَافَةٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f992.svg' },
    { letter: 'س', word: 'سَمَكَةٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f41f.svg' },
    { letter: 'ش', word: 'شَمْسٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2600.svg' },
    { letter: 'ص', word: 'صَقْرٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f985.svg' },
    { letter: 'ض', word: 'ضِفْدَعٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f438.svg' },
    { letter: 'ط', word: 'طَائِرٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f426.svg' },
    { letter: 'ظ', word: 'ظَبْيٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98c.svg' },
    { letter: 'ع', word: 'عُصْفُورٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f426.svg' },
    { letter: 'غ', word: 'غَزَالٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98c.svg' },
    { letter: 'ف', word: 'فِيلٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f418.svg' },
    { letter: 'ق', word: 'قِطَّةٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f408.svg' },
    { letter: 'ك', word: 'كَلْبٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f415.svg' },
    { letter: 'ل', word: 'لَيْمُونٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f34b.svg' },
    { letter: 'م', word: 'مَوْزٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f34c.svg' },
    { letter: 'ن', word: 'نَمِرٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f405.svg' },
    { letter: 'ه', word: 'هُدْهُدٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f426.svg' },
    { letter: 'و', word: 'وَرْدَةٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f339.svg' },
    { letter: 'ي', word: 'يَمَامَةٌ', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f54a.svg' }
  ]
};

export const numbersData: Record<Language, NumberItem[]> = {
  nl: [
    { number: '0', word: 'Nul', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f412.svg', count: 0 },
    { number: '1', word: 'Een', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f431.svg', count: 1 },
    { number: '2', word: 'Twee', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f436.svg', count: 2 },
    { number: '3', word: 'Drie', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f981.svg', count: 3 }, 
    { number: '4', word: 'Vier', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f984.svg', count: 4 },
    { number: '5', word: 'Vijf', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98a.svg', count: 5 },
    { number: '6', word: 'Zes', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f989.svg', count: 6 },
    { number: '7', word: 'Zeven', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f427.svg', count: 7 },
    { number: '8', word: 'Acht', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f438.svg', count: 8 },
    { number: '9', word: 'Negen', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98e.svg', count: 9 },
    { number: '10', word: 'Tien', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98d.svg', count: 10 },
    { number: '11', word: 'Elf', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f437.svg', count: 11 },
    { number: '12', word: 'Twaalf', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f416.svg', count: 12 },
    { number: '13', word: 'Dertien', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f413.svg', count: 13 },
    { number: '14', word: 'Veertien', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f983.svg', count: 14 },
    { number: '15', word: 'Vijftien', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f414.svg', count: 15 },
    { number: '16', word: 'Zestien', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f426.svg', count: 16 },
    { number: '17', word: 'Zeventien', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f985.svg', count: 17 },
    { number: '18', word: 'Achttien', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f986.svg', count: 18 },
    { number: '19', word: 'Negentien', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f989.svg', count: 19 },
    { number: '20', word: 'Twintig', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f988.svg', count: 20 }
  ],
  en: [
    { number: '0', word: 'Zero', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f412.svg', count: 0 },
    { number: '1', word: 'One', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f431.svg', count: 1 },
    { number: '2', word: 'Two', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f436.svg', count: 2 },
    { number: '3', word: 'Three', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f981.svg', count: 3 },
    { number: '4', word: 'Four', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f984.svg', count: 4 },
    { number: '5', word: 'Five', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98a.svg', count: 5 },
    { number: '6', word: 'Six', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f989.svg', count: 6 },
    { number: '7', word: 'Seven', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f427.svg', count: 7 },
    { number: '8', word: 'Eight', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f438.svg', count: 8 },
    { number: '9', word: 'Nine', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98e.svg', count: 9 },
    { number: '10', word: 'Ten', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98d.svg', count: 10 },
    { number: '11', word: 'Eleven', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f437.svg', count: 11 },
    { number: '12', word: 'Twelve', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f416.svg', count: 12 },
    { number: '13', word: 'Thirteen', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f413.svg', count: 13 },
    { number: '14', word: 'Fourteen', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f983.svg', count: 14 },
    { number: '15', word: 'Fifteen', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f414.svg', count: 15 },
    { number: '16', word: 'Sixteen', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f426.svg', count: 16 },
    { number: '17', word: 'Seventeen', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f985.svg', count: 17 },
    { number: '18', word: 'Eighteen', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f986.svg', count: 18 },
    { number: '19', word: 'Nineteen', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f989.svg', count: 19 },
    { number: '20', word: 'Twenty', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f988.svg', count: 20 }
  ],
  fr: [
    { number: '0', word: 'Zéro', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f412.svg', count: 0 },
    { number: '1', word: 'Un', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f431.svg', count: 1 },
    { number: '2', word: 'Deux', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f436.svg', count: 2 },
    { number: '3', word: 'Trois', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f981.svg', count: 3 },
    { number: '4', word: 'Quatre', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f984.svg', count: 4 },
    { number: '5', word: 'Cinq', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98a.svg', count: 5 },
    { number: '6', word: 'Six', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f989.svg', count: 6 },
    { number: '7', word: 'Sept', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f427.svg', count: 7 },
    { number: '8', word: 'Huit', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f438.svg', count: 8 },
    { number: '9', word: 'Neuf', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98e.svg', count: 9 },
    { number: '10', word: 'Dix', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98d.svg', count: 10 },
    { number: '11', word: 'Onze', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f437.svg', count: 11 },
    { number: '12', word: 'Douze', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f416.svg', count: 12 },
    { number: '13', word: 'Treize', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f413.svg', count: 13 },
    { number: '14', word: 'Quatorze', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f983.svg', count: 14 },
    { number: '15', word: 'Quinze', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f414.svg', count: 15 },
    { number: '16', word: 'Seize', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f426.svg', count: 16 },
    { number: '17', word: 'Dix-sept', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f985.svg', count: 17 },
    { number: '18', word: 'Dix-huit', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f986.svg', count: 18 },
    { number: '19', word: 'Dix-neuf', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f989.svg', count: 19 },
    { number: '20', word: 'Vingt', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f988.svg', count: 20 }
  ],
  ar: [
    { number: '٠', word: 'صفر', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f412.svg', count: 0 },
    { number: '١', word: 'واحد', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f431.svg', count: 1 },
    { number: '٢', word: 'اثنان', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f436.svg', count: 2 },
    { number: '٣', word: 'ثلاثة', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f981.svg', count: 3 },
    { number: '٤', word: 'أربعة', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f984.svg', count: 4 },
    { number: '٥', word: 'خمسة', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98a.svg', count: 5 },
    { number: '٦', word: 'ستة', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f989.svg', count: 6 },
    { number: '٧', word: 'سبعة', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f427.svg', count: 7 },
    { number: '٨', word: 'ثمانية', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f438.svg', count: 8 },
    { number: '٩', word: 'تسعة', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98e.svg', count: 9 },
    { number: '١٠', word: 'عشرة', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98d.svg', count: 10 },
    { number: '١١', word: 'أحد عشر', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f437.svg', count: 11 },
    { number: '١٢', word: 'اثنا عشر', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f416.svg', count: 12 },
    { number: '١٣', word: 'ثلاثة عشر', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f413.svg', count: 13 },
    { number: '١٤', word: 'أربعة عشر', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f983.svg', count: 14 },
    { number: '١٥', word: 'خمسة عشر', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f414.svg', count: 15 },
    { number: '١٦', word: 'ستة عشر', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f426.svg', count: 16 },
    { number: '١٧', word: 'سبعة عشر', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f985.svg', count: 17 },
    { number: '١٨', word: 'ثمانية عشر', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f986.svg', count: 18 },
    { number: '١٩', word: 'تسعة عشر', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f989.svg', count: 19 },
    { number: '٢٠', word: 'عشرون', image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f988.svg', count: 20 }
  ]
};
