// Phonetic sounds for letters
// These are the sounds letters make, not their names

export interface PhoneticSound {
  letter: string;
  sound: string; // Phonetic representation
  example: string; // Word starting with this sound
}

export const phoneticsFr: PhoneticSound[] = [
  { letter: 'A', sound: 'aaa', example: 'avion' },
  { letter: 'B', sound: 'beu', example: 'ballon' },
  { letter: 'C', sound: 'keu', example: 'chat' },
  { letter: 'D', sound: 'deu', example: 'dent' },
  { letter: 'E', sound: 'euh', example: 'éléphant' },
  { letter: 'F', sound: 'fff', example: 'fleur' },
  { letter: 'G', sound: 'geu', example: 'gâteau' },
  { letter: 'H', sound: 'ash', example: 'hibou' },
  { letter: 'I', sound: 'iii', example: 'île' },
  { letter: 'J', sound: 'jeu', example: 'jardin' },
  { letter: 'K', sound: 'keu', example: 'koala' },
  { letter: 'L', sound: 'leu', example: 'lune' },
  { letter: 'M', sound: 'mmm', example: 'maison' },
  { letter: 'N', sound: 'nnn', example: 'nez' },
  { letter: 'O', sound: 'ooo', example: 'orange' },
  { letter: 'P', sound: 'peu', example: 'pomme' },
  { letter: 'Q', sound: 'ku', example: 'quatre' },
  { letter: 'R', sound: 'rrr', example: 'robe' },
  { letter: 'S', sound: 'sss', example: 'soleil' },
  { letter: 'T', sound: 'teu', example: 'table' },
  { letter: 'U', sound: 'uuu', example: 'usine' },
  { letter: 'V', sound: 'vvv', example: 'vélo' },
  { letter: 'W', sound: 'weu', example: 'wagon' },
  { letter: 'X', sound: 'ks', example: 'xylophone' },
  { letter: 'Y', sound: 'i grec', example: 'yaourt' },
  { letter: 'Z', sound: 'zzz', example: 'zèbre' }
];

export const phoneticsEn: PhoneticSound[] = [
  { letter: 'A', sound: 'aah', example: 'apple' },
  { letter: 'B', sound: 'buh', example: 'ball' },
  { letter: 'C', sound: 'kuh', example: 'cat' },
  { letter: 'D', sound: 'duh', example: 'dog' },
  { letter: 'E', sound: 'eh', example: 'elephant' },
  { letter: 'F', sound: 'fff', example: 'fish' },
  { letter: 'G', sound: 'guh', example: 'goat' },
  { letter: 'H', sound: 'huh', example: 'hat' },
  { letter: 'I', sound: 'ih', example: 'igloo' },
  { letter: 'J', sound: 'juh', example: 'jump' },
  { letter: 'K', sound: 'kuh', example: 'kite' },
  { letter: 'L', sound: 'lll', example: 'lion' },
  { letter: 'M', sound: 'mmm', example: 'moon' },
  { letter: 'N', sound: 'nnn', example: 'nest' },
  { letter: 'O', sound: 'oh', example: 'octopus' },
  { letter: 'P', sound: 'puh', example: 'pig' },
  { letter: 'Q', sound: 'kwuh', example: 'queen' },
  { letter: 'R', sound: 'rrr', example: 'rabbit' },
  { letter: 'S', sound: 'sss', example: 'sun' },
  { letter: 'T', sound: 'tuh', example: 'tree' },
  { letter: 'U', sound: 'uh', example: 'umbrella' },
  { letter: 'V', sound: 'vvv', example: 'van' },
  { letter: 'W', sound: 'wuh', example: 'water' },
  { letter: 'X', sound: 'ks', example: 'x-ray' },
  { letter: 'Y', sound: 'yuh', example: 'yellow' },
  { letter: 'Z', sound: 'zzz', example: 'zebra' }
];

export const getPhonetic = (letter: string, language: string): PhoneticSound | undefined => {
  const phonetics = language === 'fr' ? phoneticsFr : phoneticsEn;
  return phonetics.find(p => p.letter.toUpperCase() === letter.toUpperCase());
};

