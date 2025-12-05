<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import AlphabetCard from './components/AlphabetCard.vue';
import GameMode from './components/GameMode.vue';
import LetterFindingGame from './components/LetterFindingGame.vue';
import MainMenu from './components/MainMenu.vue';
import NumberMatchingGame from './components/NumberMatchingGame.vue';
import NumberTrainGame from './components/NumberTrainGame.vue';
import Settings from './components/Settings.vue';
import NumberCard from './components/NumberCard.vue';
import WritingGame from './components/WritingGame.vue';
import ColoringGame from './components/ColoringGame.vue';
import PuzzleGame from './components/PuzzleGame.vue';
import ProgressDashboard from './components/ProgressDashboard.vue';
import Celebration from './components/Celebration.vue';
import { alphabetData, numbersData, type Language, type NumberItem } from './data/content';
import { getPhonetic } from './data/phonetics';
import { getBadgeById } from './data/badges';
import { 
  trackLetterViewed, 
  trackLetterCorrect, 
  trackNumberViewed,
  trackNumberCorrect,
  addStars, 
  addGameScore, 
  updateStreak,
  checkForNewBadges,
  loadProgress
} from './services/progressService';

// LocalStorage keys
const STORAGE_KEYS = {
  SETTINGS: 'alphabetKids_settings',
  LANGUAGE: 'alphabetKids_language',
  SELECTED_LANGUAGES: 'alphabetKids_selectedLanguages'
};

// Load from localStorage
const loadSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load settings from localStorage', e);
  }
  return null;
};

const loadLanguage = (): Language | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (saved) {
      return saved as Language;
    }
  } catch (e) {
    console.warn('Failed to load language from localStorage', e);
  }
  return null;
};

const loadSelectedLanguages = (): Language[] | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_LANGUAGES);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load selected languages from localStorage', e);
  }
  return null;
};

// 3D/Clay Icon URLs
const icons = {
  home: '/images/buttonhome.png',
  // Writing
  type: '/images/menuA.png', // Custom image for "A" writing menu
  hash: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Symbols/Keycap%201.png',
  user: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Child.png',
  // Recreation
  palette: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Artist%20Palette.png',
  puzzle: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Puzzle%20Piece.png',
  // Letters
  book: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Open%20Book.png',
  target: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Direct%20Hit.png',
  search: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Magnifying%20Glass%20Tilted%20Left.png',
  // Numbers
  abacus: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Abacus.png',
  gamepad: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Video%20Game.png',
  train: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel-and-places/Locomotive.png',
  // Navigation
  next: '/images/buttonnext.png'
};

// Types
type ViewMode = 'menu' | 'settings' | 'game' | 'progress';
type GameType = 'learning' | 'matching' | 'finding' | 'matching-numbers' | 'writing' | 'train' | 'coloring' | 'puzzle';
type LearningType = 'letters' | 'numbers' | 'writing' | 'recreation';
type Difficulty = 'easy' | 'medium' | 'hard';

interface VoiceConfig {
  [key: string]: string;
}

// Voice configurations
const voiceConfigs: VoiceConfig = {
  en: 'UK English Female',
  fr: 'French Female',
  ar: 'Arabic Female',
  nl: 'Dutch Female'
};

// State - Load from localStorage or use defaults
const savedSettings = loadSettings();
const savedLanguage = loadLanguage();
const savedSelectedLanguages = loadSelectedLanguages();

const currentLanguage = ref<Language>(savedLanguage || 'fr');
const viewMode = ref<ViewMode>('menu');
const gameType = ref<GameType>('learning');
const learningType = ref<LearningType>('letters');
const selectedLanguages = ref<Language[]>(savedSelectedLanguages || ['fr', 'en', 'ar']);

// Parent Gate State
const showParentGate = ref(false);
const pendingAction = ref<(() => void) | null>(null);
const gateQuestion = ref({ q: '', a: 0 });
const gateAnswer = ref('');
const gateError = ref(false);

// User Settings - Load from localStorage or use defaults
const userSettings = ref({
  theme: savedSettings?.theme || 'default',
  voice: savedSettings?.voice || 'default',
  speed: savedSettings?.speed || 1,
  avatar: savedSettings?.avatar || '👧',
  childName: savedSettings?.childName || '',
  phoneticMode: savedSettings?.phoneticMode || false,
  difficulty: (savedSettings?.difficulty as Difficulty) || 'easy'
});

// Celebration State
const showCelebration = ref(false);
const celebrationType = ref<'confetti' | 'stars' | 'badge'>('confetti');
const celebrationBadge = ref<{ icon: string; name: string } | null>(null);

// Stars earned in current session
const sessionStars = ref(0);

const allLanguages: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
  nl: 'Nederlands'
};

const languages = computed<Record<Language, string>>(() => {
  // Cast as partial first then full record to satisfy TS, knowing we filter from allLanguages
  const result: Partial<Record<Language, string>> = {};
  selectedLanguages.value.forEach(lang => {
    result[lang] = allLanguages[lang];
  });
  return result as Record<Language, string>;
});

// Game State
const currentIndex = ref(0);
const showAll = ref(true);
const writingMode = ref<'letters' | 'numbers' | 'name'>('letters');
const selectedFriendlyWord = ref<{ word: string, image: string } | null>(null);

// Type declaration for window with ResponsiveVoice
declare global {
  interface Window {
    responsiveVoice: {
      speak: (text: string, voice: string, options?: {
        pitch?: number;
        rate?: number;
        volume?: number;
      }) => void;
      cancel: () => void;
    };
  }
}

// Helper Methods
const speak = (word: string): void => {
  if (window.responsiveVoice) {
    window.responsiveVoice.cancel();
    const voice = voiceConfigs[currentLanguage.value];
    window.responsiveVoice.speak(word, voice, {
      pitch: 1.1,
      rate: userSettings.value.speed,
      volume: 1
    });
  }
};

// Speak phonetic sound of a letter
const speakPhonetic = (letter: string): void => {
  const phonetic = getPhonetic(letter, currentLanguage.value);
  if (phonetic && window.responsiveVoice) {
    window.responsiveVoice.cancel();
    const voice = voiceConfigs[currentLanguage.value];
    // Speak the sound representation
    window.responsiveVoice.speak(phonetic.sound, voice, {
      pitch: 1.0,
      rate: 0.8, // Slower for phonetic sounds
      volume: 1
    });
  }
};

const selectLetter = (index: number): void => {
  showAll.value = false;
  currentIndex.value = index;
  selectedFriendlyWord.value = null;
  const item = alphabetData[currentLanguage.value][index];
  
  // Track progress
  trackLetterViewed(item.letter);
  
  // Speak word or phonetic sound based on mode
  if (userSettings.value.phoneticMode) {
    speakPhonetic(item.letter);
  } else {
  speak(item.word);
  }
  
  // Check for new badges
  checkAndCelebrateBadges();
};

const selectFriendlyWord = (word: string, image: string): void => {
  selectedFriendlyWord.value = { word, image };
  speak(word);
};

// Check for new badges and trigger celebration
const checkAndCelebrateBadges = (): void => {
  const newBadges = checkForNewBadges();
  if (newBadges.length > 0) {
    const badge = getBadgeById(newBadges[0]);
    if (badge) {
      celebrationBadge.value = {
        icon: badge.icon,
        name: badge.name[currentLanguage.value as keyof typeof badge.name] || badge.name.en
      };
      celebrationType.value = 'badge';
      showCelebration.value = true;
    }
  }
};

// Award stars and trigger celebration
const awardStars = (count: number): void => {
  addStars(count);
  sessionStars.value += count;
  
  // Trigger star celebration for significant amounts
  if (count >= 3) {
    celebrationType.value = 'stars';
    showCelebration.value = true;
  }
  
  checkAndCelebrateBadges();
};

// Handle game completion
const handleGameComplete = (game: string, score: number, maxScore: number): void => {
  addGameScore(game, score, maxScore, userSettings.value.difficulty);
  
  // Award stars based on score
  const percentage = score / maxScore;
  let stars = 0;
  if (percentage >= 0.8) stars = 3;
  else if (percentage >= 0.6) stars = 2;
  else if (percentage >= 0.4) stars = 1;
  
  if (stars > 0) {
    awardStars(stars);
  }
  
  // Confetti celebration for completing a game
  if (percentage >= 0.6) {
    celebrationType.value = 'confetti';
    showCelebration.value = true;
  }
};

const resetSelection = (): void => {
  selectedFriendlyWord.value = null;
  const item = alphabetData[currentLanguage.value][currentIndex.value];
  speak(item.word);
};

const selectNumber = (index: number): void => {
  showAll.value = false;
  currentIndex.value = index;
  const item = numbersData[currentLanguage.value][index];
  
  // Track progress
  trackNumberViewed(item.number);
  
  speakNumber(item);
  
  // Check for new badges
  checkAndCelebrateBadges();
};

const speakNumber = (item: NumberItem): void => {
  if (window.responsiveVoice) {
    window.responsiveVoice.cancel();
    const voice = voiceConfigs[currentLanguage.value];
    window.responsiveVoice.speak(item.word, voice, {
      pitch: 1.1,
      rate: userSettings.value.speed,
      volume: 1
    });
  }
};

// Navigation Logic
const goHome = () => {
  viewMode.value = 'menu';
  showAll.value = true;
  gameType.value = 'learning';
};

const goBack = () => {
  showAll.value = true;
};

const openProgress = () => {
  viewMode.value = 'progress';
};

const nextItem = () => {
  const max = learningType.value === 'letters' 
    ? alphabetData[currentLanguage.value].length 
    : numbersData[currentLanguage.value].length;
    
  if (currentIndex.value < max - 1) {
    currentIndex.value++;
    selectedFriendlyWord.value = null;
    // Play sound automatically
    if (learningType.value === 'letters') {
      speak(alphabetData[currentLanguage.value][currentIndex.value].word);
    } else {
      speakNumber(numbersData[currentLanguage.value][currentIndex.value]);
    }
  }
};

const prevItem = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    selectedFriendlyWord.value = null;
    // Play sound automatically
    if (learningType.value === 'letters') {
      speak(alphabetData[currentLanguage.value][currentIndex.value].word);
    } else {
      speakNumber(numbersData[currentLanguage.value][currentIndex.value]);
    }
  }
};

// Parent Gate Logic
const generateGateQuestion = () => {
  const a = Math.floor(Math.random() * 3) + 1;
  const b = Math.floor(Math.random() * 3) + 1;
  gateQuestion.value = { q: `${a} + ${b} = ?`, a: a + b };
  gateAnswer.value = '';
  gateError.value = false;
};

const checkGate = () => {
  if (parseInt(gateAnswer.value) === gateQuestion.value.a) {
    showParentGate.value = false;
    if (pendingAction.value) pendingAction.value();
    pendingAction.value = null;
  } else {
    gateError.value = true;
    setTimeout(() => { gateError.value = false; gateAnswer.value = ''; }, 500);
  }
};

const openProtectedSection = (action: () => void) => {
  pendingAction.value = action;
  generateGateQuestion();
  showParentGate.value = true;
};

// Menu Actions
const handleSelectType = (type: LearningType) => {
  learningType.value = type;
  viewMode.value = 'game';
  
  if (type === 'writing') {
    gameType.value = 'writing';
    writingMode.value = 'letters';
  } else if (type === 'recreation') {
    gameType.value = 'coloring'; // Default to coloring
  } else {
    gameType.value = 'learning';
  }
  showAll.value = true;
};

const handleOpenSettings = () => {
  openProtectedSection(() => {
    viewMode.value = 'settings';
  });
};

const updateSettings = (settings: any) => {
  userSettings.value = settings;
  // Save to localStorage
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings to localStorage', e);
  }
};

const updateLanguages = (selectedLangs: Language[], defaultLang: Language) => {
  selectedLanguages.value = selectedLangs;
  currentLanguage.value = defaultLang;
  // Save to localStorage
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, defaultLang);
    localStorage.setItem(STORAGE_KEYS.SELECTED_LANGUAGES, JSON.stringify(selectedLangs));
  } catch (e) {
    console.warn('Failed to save languages to localStorage', e);
  }
};

// Watch for language changes and save
watch(currentLanguage, (newLang) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, newLang);
  } catch (e) {
    console.warn('Failed to save language to localStorage', e);
  }
});

// Initialize on mount
onMounted(() => {
  // Ensure currentLanguage is set from saved value
  if (savedLanguage) {
    currentLanguage.value = savedLanguage;
  }
  
  // Update streak on app start
  updateStreak();
});

const switchLanguage = (lang: Language) => {
  currentLanguage.value = lang;
};
</script>

<template>
  <div class="app-container" :class="[
    { 'rtl': currentLanguage === 'ar' },
    `theme-${userSettings.theme}`
  ]">
    
    <!-- Celebration Overlay -->
    <Celebration
      v-if="showCelebration"
      :type="celebrationType"
      :badge-icon="celebrationBadge?.icon"
      :badge-name="celebrationBadge?.name"
      @complete="showCelebration = false"
    />
    
    <!-- Persistent Home Button (only show when not in menu) -->
    <button 
      v-if="viewMode !== 'menu' && viewMode !== 'progress'" 
      class="floating-home-btn"
      @click="goHome"
      :aria-label="currentLanguage === 'fr' ? 'Retour au menu principal' : 'Return to main menu'"
      role="button"
      tabindex="0"
    >
      <img :src="icons.home" class="home-icon-img" alt="" aria-hidden="true" />
    </button>
    
    <!-- Progress Button (only in Menu) -->
    <button
      v-if="viewMode === 'menu'"
      class="floating-progress-btn"
      @click="openProgress"
      :aria-label="currentLanguage === 'fr' ? 'Ma progression' : 'My progress'"
    >
      <span class="progress-stars">⭐</span>
      <span class="progress-count">{{ loadProgress().totalStars }}</span>
    </button>

    <!-- Language Quick Switcher (only in Menu) -->
    <div v-if="viewMode === 'menu'" class="language-switcher">
      <button
        v-for="(name, lang) in languages"
        :key="lang"
        @click="switchLanguage(lang)"
        :class="{ active: currentLanguage === lang }"
        class="lang-button"
      >
        {{ name }}
      </button>
    </div>

    <!-- Parent Gate Modal -->
    <div v-if="showParentGate" class="modal-overlay">
      <div class="modal-content gate-modal">
        <h3>🔒 Parents Only</h3>
        <p>{{ gateQuestion.q }}</p>
        <div class="gate-input-group">
          <input 
            v-model="gateAnswer" 
            type="tel" 
            maxlength="2" 
            :class="{ error: gateError }"
            @keyup.enter="checkGate"
          >
          <button @click="checkGate">OK</button>
        </div>
        <button class="cancel-btn" @click="showParentGate = false">Cancel</button>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="main-content">
    <MainMenu
        v-if="viewMode === 'menu'"
      :current-language="currentLanguage"
        @select-type="handleSelectType"
        @open-settings="handleOpenSettings"
    />

    <Settings
        v-else-if="viewMode === 'settings'"
      :current-language="currentLanguage"
      :available-languages="allLanguages"
      :selected-languages="selectedLanguages"
        :settings="userSettings"
      @update-languages="updateLanguages"
      @update-settings="updateSettings"
        @close="goHome"
    />

      <!-- Progress Dashboard -->
      <ProgressDashboard
        v-else-if="viewMode === 'progress'"
      :current-language="currentLanguage"
        :child-name="userSettings.childName"
        @close="goHome"
      />

      <!-- Game Views -->
      <template v-else-if="viewMode === 'game'">
        
        <!-- Writing Game Mode -->
        <template v-if="gameType === 'writing'">
          <div class="game-mode-nav">
          <button
              @click="writingMode = 'letters'" 
              :class="{ active: writingMode === 'letters' }"
          >
              <img :src="icons.type" width="40" height="40" />
          </button>
          <button
              @click="writingMode = 'numbers'" 
              :class="{ active: writingMode === 'numbers' }"
          >
              <img :src="icons.hash" width="40" height="40" />
          </button>
          <button
              @click="writingMode = 'name'" 
              :class="{ active: writingMode === 'name' }"
          >
              <img :src="icons.user" width="40" height="40" />
          </button>
          </div>

          <WritingGame
            :items="writingMode === 'letters' ? alphabetData[currentLanguage] : numbersData[currentLanguage]"
            :type="writingMode"
            :current-language="currentLanguage"
            :child-name="userSettings.childName"
            @open-settings="handleOpenSettings"
          />
        </template>

        <!-- Other Game Modes -->
        <template v-else>
          <!-- Game Mode Switcher -->
          <div class="game-mode-nav">
            <template v-if="learningType === 'recreation'">
              <button @click="gameType = 'coloring'" :class="{ active: gameType === 'coloring' }">
                <img :src="icons.palette" width="40" height="40" />
          </button>
              <button @click="gameType = 'puzzle'" :class="{ active: gameType === 'puzzle' }">
                <img :src="icons.puzzle" width="40" height="40" />
          </button>
        </template>

            <template v-else-if="learningType === 'letters'">
              <button @click="gameType = 'learning'" :class="{ active: gameType === 'learning' }">
                <img :src="icons.book" width="40" height="40" />
        </button>
              <button @click="gameType = 'matching'" :class="{ active: gameType === 'matching' }">
                <img :src="icons.target" width="40" height="40" />
          </button>
              <button @click="gameType = 'finding'" :class="{ active: gameType === 'finding' }">
                <img :src="icons.search" width="40" height="40" />
          </button>
        </template>
            <template v-else-if="learningType === 'numbers'">
              <button @click="gameType = 'learning'" :class="{ active: gameType === 'learning' }">
                <img :src="icons.abacus" width="40" height="40" />
              </button>
              <button @click="gameType = 'matching-numbers'" :class="{ active: gameType === 'matching-numbers' }">
                <img :src="icons.gamepad" width="40" height="40" />
              </button>
              <button @click="gameType = 'train'" :class="{ active: gameType === 'train' }">
                <img :src="icons.train" width="40" height="40" />
        </button>
            </template>
          </div>
          
          <!-- Difficulty Selector (for applicable games) -->
          <div 
            v-if="gameType === 'finding' || gameType === 'matching-numbers' || gameType === 'train'"
            class="difficulty-selector"
          >
            <span class="difficulty-label">
              {{ currentLanguage === 'fr' ? 'Niveau :' : 'Level:' }}
            </span>
        <button
              v-for="level in (['easy', 'medium', 'hard'] as Difficulty[])"
              :key="level"
              :class="['difficulty-btn', { active: userSettings.difficulty === level }]"
              @click="userSettings.difficulty = level"
            >
              <span class="difficulty-icon">
                {{ level === 'easy' ? '🌟' : level === 'medium' ? '⭐⭐' : '🌟🌟🌟' }}
              </span>
              <span class="difficulty-text">
                {{ level === 'easy' 
                  ? (currentLanguage === 'fr' ? 'Facile' : 'Easy')
                  : level === 'medium'
                    ? (currentLanguage === 'fr' ? 'Moyen' : 'Medium')
                    : (currentLanguage === 'fr' ? 'Difficile' : 'Hard')
                }}
              </span>
        </button>
      </div>

          <!-- Learning Mode (Updated Carousel) -->
          <div v-if="gameType === 'learning'" class="learning-container">
            <div v-if="showAll" class="grid-view">
          <template v-if="learningType === 'letters'">
            <AlphabetCard
              v-for="(item, index) in alphabetData[currentLanguage]"
              :key="item.letter"
                  v-bind="item"
              @select="selectLetter(index)"
            />
          </template>
          <template v-else>
            <NumberCard
              v-for="(item, index) in numbersData[currentLanguage]"
              :key="item.number"
                  v-bind="item"
              @select="selectNumber(index)"
            />
          </template>
        </div>
        
            <!-- Focused Carousel View -->
            <div v-else class="carousel-view">
              <!-- Phonetic Mode Toggle (only for letters) -->
              <div v-if="learningType === 'letters'" class="mode-toggle">
                <button 
                  class="phonetic-toggle"
                  :class="{ active: userSettings.phoneticMode }"
                  @click="userSettings.phoneticMode = !userSettings.phoneticMode"
                >
                  <span class="toggle-icon">{{ userSettings.phoneticMode ? '🔊' : '🔤' }}</span>
                  <span class="toggle-text">
                    {{ userSettings.phoneticMode 
                      ? (currentLanguage === 'fr' ? 'Mode Sons' : 'Sound Mode')
                      : (currentLanguage === 'fr' ? 'Mode Mots' : 'Word Mode')
                    }}
                  </span>
          </button>
              </div>
              
              <div class="carousel-main-area">
                <button 
                  class="nav-arrow prev" 
                  @click="prevItem" 
                  :disabled="currentIndex === 0"
                  :aria-label="currentLanguage === 'fr' ? 'Précédent' : 'Previous'"
                  role="button"
                  tabindex="0"
                >
                  <img :src="icons.next" class="arrow-icon prev-icon" alt="" aria-hidden="true" />
          </button>
                
                <div class="carousel-content-wrapper">
                  <!-- Main Card -->
                  <div class="card-wrapper">
          <template v-if="learningType === 'letters'">
            <AlphabetCard
              v-if="!selectedFriendlyWord"
              v-bind="alphabetData[currentLanguage][currentIndex]"
              @select="speak(alphabetData[currentLanguage][currentIndex].word)"
              class="large-card"
            />
            <!-- Display Selected Friendly Word as a Card -->
            <AlphabetCard
              v-else
              :letter="alphabetData[currentLanguage][currentIndex].letter"
              :word="selectedFriendlyWord.word"
              :image="selectedFriendlyWord.image"
              @select="resetSelection"
              class="large-card friendly-word-display"
            />
          </template>
          <template v-else>
            <NumberCard
              v-bind="numbersData[currentLanguage][currentIndex]"
              @select="speakNumber(numbersData[currentLanguage][currentIndex])"
              class="large-card"
            />
          </template>
        </div>

                  <!-- Friendly Words Panel (Only for Letters) -->
                  <div 
                    v-if="learningType === 'letters' && alphabetData[currentLanguage][currentIndex].additionalWords?.length" 
                    class="friendly-words-panel"
                  >
                    <div 
                      v-for="wordItem in alphabetData[currentLanguage][currentIndex].additionalWords" 
                      :key="typeof wordItem === 'string' ? wordItem : wordItem.word"
                      class="friendly-card"
                      :class="{ active: selectedFriendlyWord && (typeof wordItem === 'string' ? selectedFriendlyWord.word === wordItem : selectedFriendlyWord.word === wordItem.word) }"
                      @click="typeof wordItem === 'string' 
                        ? speak(wordItem) 
                        : selectFriendlyWord(wordItem.word, wordItem.image)"
                    >
                      <img 
                        v-if="typeof wordItem !== 'string'" 
                        :src="wordItem.image" 
                        class="friendly-icon-img"
                        width="40" 
                        height="40"
                        @error="(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2UwZTBlMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn5CgPC90ZXh0Pjwvc3ZnPg==' }"
                      />
                      <span v-else class="friendly-icon">🌟</span>
                      <span class="friendly-text">{{ typeof wordItem === 'string' ? wordItem : wordItem.word }}</span>
                    </div>
                  </div>
                </div>

                <button 
                  class="nav-arrow next" 
                  @click="nextItem"
                  :disabled="currentIndex === (learningType === 'letters' ? alphabetData[currentLanguage].length : numbersData[currentLanguage].length) - 1"
                  :aria-label="currentLanguage === 'fr' ? 'Suivant' : 'Next'"
                  role="button"
                  tabindex="0"
                >
                  <img :src="icons.next" class="arrow-icon" alt="" aria-hidden="true" />
                </button>
              </div>
              
              <button class="back-button-text" @click="goBack">
                {{ currentLanguage === 'fr' ? 'Retour à la liste' : 'Back to list' }}
              </button>
            </div>
          </div>

          <!-- Other Game Modes -->
      <GameMode
            v-else-if="gameType === 'matching'"
        :alphabet-data="alphabetData[currentLanguage]"
        :current-language="currentLanguage"
        @speak="speak"
      />

      <LetterFindingGame
            v-else-if="gameType === 'finding'"
        :alphabet-data="alphabetData[currentLanguage]"
        :current-language="currentLanguage"
      />

      <NumberMatchingGame
            v-else-if="gameType === 'matching-numbers'"
        :numbers-data="numbersData[currentLanguage]"
        :current-language="currentLanguage"
      />

          <NumberTrainGame
            v-else-if="gameType === 'train'"
        :numbers-data="numbersData[currentLanguage]"
        :current-language="currentLanguage"
      />

          <ColoringGame
            v-else-if="gameType === 'coloring'"
            :current-language="currentLanguage"
          />

          <PuzzleGame
            v-else-if="gameType === 'puzzle'"
        :current-language="currentLanguage"
      />
    </template>
    </template>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  padding: 1rem;
  position: relative;
}

.rtl { direction: rtl; }

/* Floating Home Button */
.floating-home-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  font-size: 2rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  background: white;
  border: 4px solid #FFB74D;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  padding: 10px;
}

.floating-home-btn:active { transform: scale(0.9); }
.rtl .floating-home-btn { left: auto; right: 20px; }

/* Floating Progress Button */
.floating-progress-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-size: 1.2rem;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border: 3px solid #FFF;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  animation: pulse-gold 2s infinite;
}

.floating-progress-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
}

.floating-progress-btn:active {
  transform: scale(0.95);
}

.progress-stars {
  font-size: 1.5rem;
  animation: spin-star 3s linear infinite;
}

.progress-count {
  font-weight: 900;
  color: white;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

@keyframes pulse-gold {
  0%, 100% { box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4); }
  50% { box-shadow: 0 4px 25px rgba(255, 215, 0, 0.7); }
}

@keyframes spin-star {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-10deg); }
  100% { transform: rotate(0deg); }
}

.rtl .floating-progress-btn { right: auto; left: 20px; }

/* Language Switcher */
.language-switcher {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0 2rem;
}

.lang-button {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 2px solid transparent;
  background: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.lang-button.active {
  border-color: #4CAF50;
  background: #E8F5E9;
  font-weight: bold;
}

/* Game Mode Navigation */
.game-mode-nav {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 15px 25px;
  background: linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7));
  border-radius: 30px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255,255,255,0.5);
}

.game-mode-nav button {
  width: 70px;
  height: 70px;
  font-size: 2.5rem;
  border-radius: 20px;
  background: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 
    0 6px 0 #E0E0E0,
    0 10px 10px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
}

.game-mode-nav button:active {
  transform: translateY(6px);
  box-shadow: 
    0 0 0 #E0E0E0,
    inset 0 2px 5px rgba(0,0,0,0.1);
}

.game-mode-nav button.active {
  transform: translateY(2px);
  box-shadow: 0 4px 0 rgba(0,0,0,0.2);
}

/* Specific Colors for Tabs */
/* Letters (Red) */
.game-mode-nav button:nth-child(1).active {
  background: linear-gradient(145deg, #FF6B6B, #FF8E8E);
  box-shadow: 0 4px 0 #D64545;
  color: white;
}

/* Numbers (Blue) */
.game-mode-nav button:nth-child(2).active {
  background: linear-gradient(145deg, #4ECDC4, #6EE7E0);
  box-shadow: 0 4px 0 #36AC9F;
  color: white;
}

/* Name/Misc (Green/Yellow) */
.game-mode-nav button:nth-child(3).active {
  background: linear-gradient(145deg, #96CEB4, #B8E6D1);
  box-shadow: 0 4px 0 #75AA91;
  color: white;
}

/* Hover effects */
.game-mode-nav button:hover:not(.active) {
  transform: translateY(-4px);
  box-shadow: 
    0 10px 0 #E0E0E0,
    0 15px 20px rgba(0,0,0,0.1);
}

/* Grid Views */
.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

/* Mode Toggle (Phonetic) */
.mode-toggle {
  margin-bottom: 1.5rem;
}

.phonetic-toggle {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  border: 3px solid #e0e0e0;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.1rem;
  box-shadow: 0 4px 0 #ccc;
}

.phonetic-toggle:hover {
  transform: translateY(-2px);
  border-color: #4ECDC4;
}

.phonetic-toggle.active {
  background: linear-gradient(135deg, #4ECDC4, #44A08D);
  border-color: #44A08D;
  color: white;
  box-shadow: 0 4px 0 #2d7a6f;
}

.toggle-icon {
  font-size: 1.5rem;
}

.toggle-text {
  font-weight: bold;
}

/* Difficulty Selector */
.difficulty-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(255,255,255,0.8);
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.difficulty-label {
  font-weight: bold;
  color: #666;
  font-size: 1.1rem;
}

.difficulty-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.6rem 1.2rem;
  border-radius: 15px;
  border: 2px solid #e0e0e0;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.difficulty-btn:hover {
  border-color: #FFD93D;
  transform: translateY(-2px);
}

.difficulty-btn.active {
  background: linear-gradient(135deg, #FFD93D, #FFA500);
  border-color: #FFA500;
  color: white;
  box-shadow: 0 4px 0 #e68a00;
}

.difficulty-icon {
  font-size: 1rem;
}

.difficulty-text {
  font-size: 0.85rem;
  font-weight: bold;
}

/* Carousel View */
.carousel-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  width: 100%;
}

.carousel-main-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  max-width: 1000px;
}

.carousel-content-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  perspective: 1000px;
}

.nav-arrow {
  background: none;
  border: none;
  padding: 0;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  flex-shrink: 0;
}

.arrow-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 4px rgba(0,0,0,0.2));
}

.prev-icon {
  transform: scaleX(-1);
}

.nav-arrow:active:not(:disabled) {
  transform: scale(0.9);
  box-shadow: none;
}

.nav-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  filter: grayscale(100%);
}

.home-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.large-card {
  transform: scale(1.2);
  animation: float 6s ease-in-out infinite;
}

/* Friendly Words Panel */
.friendly-words-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: fadeIn 0.5s ease-out;
}

.friendly-card {
  background: white;
  border-radius: 15px;
  padding: 0.8rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  box-shadow: 0 4px 0 rgba(0,0,0,0.1);
  border: 2px solid #eee;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 150px;
}

.friendly-card:hover, .friendly-card.active {
  transform: translateX(5px);
  border-color: #4CAF50;
  background: #f9f9f9;
}

.friendly-card.active {
  background: #E8F5E9;
  border-width: 3px;
}

.friendly-icon {
  font-size: 1.5rem;
}

.friendly-icon-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.friendly-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
  text-transform: capitalize;
}

@keyframes float {
  0%, 100% { transform: scale(1.2) translateY(0); }
  50% { transform: scale(1.2) translateY(-10px); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

.back-button-text {
  margin-top: 3rem;
  background: none;
  border: none;
  color: #666;
  font-size: 1.2rem;
  text-decoration: underline;
  cursor: pointer;
}

/* Parent Gate Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
}

.gate-modal {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.gate-input-group {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 1.5rem 0;
}

.gate-input-group input {
  width: 60px;
  height: 60px;
  font-size: 2rem;
  text-align: center;
  border: 3px solid #ccc;
  border-radius: 10px;
}

.gate-input-group input.error {
  border-color: red;
  animation: shake 0.5s;
}

@keyframes popIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Responsive */
@media (max-width: 768px) {
  .grid-view {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .carousel-content-wrapper {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .large-card {
    transform: scale(1);
    animation: none;
  }
  
  .friendly-words-panel {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .friendly-card {
    min-width: auto;
    padding: 0.5rem 1rem;
  }
  
  .carousel-main-area {
    gap: 0.5rem;
  }
  
  .nav-arrow {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
  
  .floating-home-btn {
    top: 10px;
    left: 10px;
    width: 50px;
    height: 50px;
  }
}
</style>