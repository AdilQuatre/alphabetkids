// Badge definitions

export interface Badge {
  id: string;
  icon: string;
  name: {
    en: string;
    fr: string;
    ar: string;
    nl: string;
  };
  description: {
    en: string;
    fr: string;
    ar: string;
    nl: string;
  };
  color: string;
}

export const badges: Record<string, Badge> = {
  first_letter: {
    id: 'first_letter',
    icon: '🅰️',
    name: {
      en: 'First Letter',
      fr: 'Première Lettre',
      ar: 'الحرف الأول',
      nl: 'Eerste Letter'
    },
    description: {
      en: 'Learned your first letter!',
      fr: 'Tu as appris ta première lettre !',
      ar: 'تعلمت حرفك الأول!',
      nl: 'Je eerste letter geleerd!'
    },
    color: '#FF6B6B'
  },
  alphabet_explorer: {
    id: 'alphabet_explorer',
    icon: '🔤',
    name: {
      en: 'Alphabet Explorer',
      fr: 'Explorateur de l\'Alphabet',
      ar: 'مستكشف الأبجدية',
      nl: 'Alfabet Ontdekker'
    },
    description: {
      en: 'Explored 10 different letters!',
      fr: 'Tu as exploré 10 lettres différentes !',
      ar: 'استكشفت 10 أحرف مختلفة!',
      nl: '10 verschillende letters verkend!'
    },
    color: '#4ECDC4'
  },
  alphabet_master: {
    id: 'alphabet_master',
    icon: '👑',
    name: {
      en: 'Alphabet Master',
      fr: 'Maître de l\'Alphabet',
      ar: 'سيد الأبجدية',
      nl: 'Alfabet Meester'
    },
    description: {
      en: 'Mastered all 26 letters!',
      fr: 'Tu maîtrises les 26 lettres !',
      ar: 'أتقنت جميع الحروف الـ 26!',
      nl: 'Alle 26 letters gemeesterd!'
    },
    color: '#FFD93D'
  },
  number_starter: {
    id: 'number_starter',
    icon: '🔢',
    name: {
      en: 'Number Starter',
      fr: 'Apprenti des Nombres',
      ar: 'مبتدئ الأرقام',
      nl: 'Cijfer Starter'
    },
    description: {
      en: 'Started learning numbers!',
      fr: 'Tu as commencé les nombres !',
      ar: 'بدأت تعلم الأرقام!',
      nl: 'Begonnen met cijfers leren!'
    },
    color: '#9B59B6'
  },
  counter: {
    id: 'counter',
    icon: '🧮',
    name: {
      en: 'Super Counter',
      fr: 'Super Compteur',
      ar: 'العداد الخارق',
      nl: 'Super Teller'
    },
    description: {
      en: 'Mastered 10 numbers!',
      fr: 'Tu maîtrises 10 nombres !',
      ar: 'أتقنت 10 أرقام!',
      nl: '10 cijfers gemeesterd!'
    },
    color: '#3498DB'
  },
  game_player: {
    id: 'game_player',
    icon: '🎮',
    name: {
      en: 'Game Player',
      fr: 'Joueur',
      ar: 'لاعب',
      nl: 'Speler'
    },
    description: {
      en: 'Played 5 games!',
      fr: 'Tu as joué 5 parties !',
      ar: 'لعبت 5 ألعاب!',
      nl: '5 spelletjes gespeeld!'
    },
    color: '#E74C3C'
  },
  game_champion: {
    id: 'game_champion',
    icon: '🏆',
    name: {
      en: 'Game Champion',
      fr: 'Champion des Jeux',
      ar: 'بطل الألعاب',
      nl: 'Spel Kampioen'
    },
    description: {
      en: 'Played 25 games!',
      fr: 'Tu as joué 25 parties !',
      ar: 'لعبت 25 لعبة!',
      nl: '25 spelletjes gespeeld!'
    },
    color: '#F39C12'
  },
  star_collector: {
    id: 'star_collector',
    icon: '⭐',
    name: {
      en: 'Star Collector',
      fr: 'Collectionneur d\'Étoiles',
      ar: 'جامع النجوم',
      nl: 'Sterren Verzamelaar'
    },
    description: {
      en: 'Collected 50 stars!',
      fr: 'Tu as collecté 50 étoiles !',
      ar: 'جمعت 50 نجمة!',
      nl: '50 sterren verzameld!'
    },
    color: '#F1C40F'
  },
  super_star: {
    id: 'super_star',
    icon: '🌟',
    name: {
      en: 'Super Star',
      fr: 'Super Star',
      ar: 'نجم خارق',
      nl: 'Super Ster'
    },
    description: {
      en: 'Collected 200 stars!',
      fr: 'Tu as collecté 200 étoiles !',
      ar: 'جمعت 200 نجمة!',
      nl: '200 sterren verzameld!'
    },
    color: '#9B59B6'
  },
  streak_3: {
    id: 'streak_3',
    icon: '🔥',
    name: {
      en: '3 Day Streak',
      fr: 'Série de 3 Jours',
      ar: 'سلسلة 3 أيام',
      nl: '3 Dagen Reeks'
    },
    description: {
      en: 'Played 3 days in a row!',
      fr: 'Tu as joué 3 jours de suite !',
      ar: 'لعبت 3 أيام متتالية!',
      nl: '3 dagen achter elkaar gespeeld!'
    },
    color: '#E67E22'
  },
  streak_7: {
    id: 'streak_7',
    icon: '💪',
    name: {
      en: 'Week Warrior',
      fr: 'Guerrier de la Semaine',
      ar: 'محارب الأسبوع',
      nl: 'Week Krijger'
    },
    description: {
      en: 'Played 7 days in a row!',
      fr: 'Tu as joué 7 jours de suite !',
      ar: 'لعبت 7 أيام متتالية!',
      nl: '7 dagen achter elkaar gespeeld!'
    },
    color: '#1ABC9C'
  }
};

export const getBadgeById = (id: string): Badge | undefined => badges[id];

