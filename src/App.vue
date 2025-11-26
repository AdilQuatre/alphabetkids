<script setup lang="ts">
import { ref, computed } from 'vue';
import AlphabetCard from './components/AlphabetCard.vue';
import GameMode from './components/GameMode.vue';
import LetterFindingGame from './components/LetterFindingGame.vue';
import MainMenu from './components/MainMenu.vue';
import NumberMatchingGame from './components/NumberMatchingGame.vue';
import Settings from './components/Settings.vue';
import NumberCard from './components/NumberCard.vue';
import WritingGame from './components/WritingGame.vue';
import ColoringGame from './components/ColoringGame.vue';
import PuzzleGame from './components/PuzzleGame.vue';
import { alphabetData, numbersData, type Language, type NumberItem } from './data/content';

// 3D/Clay Icon URLs
const icons = {
  home: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel-and-places/House.png',
  // Writing
  type: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Symbols/Input%20Latin%20Uppercase.png',
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
  train: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel-and-places/Locomotive.png'
};

// Types
type ViewMode = 'menu' | 'settings' | 'game';
type GameType = 'learning' | 'matching' | 'finding' | 'matching-numbers' | 'writing' | 'train' | 'coloring' | 'puzzle';
type LearningType = 'letters' | 'numbers' | 'writing' | 'recreation';

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

// State
const currentLanguage = ref<Language>('fr');
const viewMode = ref<ViewMode>('menu');
const gameType = ref<GameType>('learning');
const learningType = ref<LearningType>('letters');
const selectedLanguages = ref<Language[]>(['fr', 'en', 'ar']);

// Parent Gate State
const showParentGate = ref(false);
const pendingAction = ref<(() => void) | null>(null);
const gateQuestion = ref({ q: '', a: 0 });
const gateAnswer = ref('');
const gateError = ref(false);

// User Settings
const userSettings = ref({
  theme: 'default',
  voice: 'default',
  speed: 1,
  avatar: '👧',
  childName: ''
});

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

const selectLetter = (index: number): void => {
  showAll.value = false;
  currentIndex.value = index;
  selectedFriendlyWord.value = null;
  const item = alphabetData[currentLanguage.value][index];
  speak(item.word);
};

const selectFriendlyWord = (word: string, image: string): void => {
  selectedFriendlyWord.value = { word, image };
  speak(word);
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
  speakNumber(item);
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
  // Settings are saved, but we don't necessarily need to go home immediately if we use the close event
};

const updateLanguages = (selectedLangs: Language[], defaultLang: Language) => {
  selectedLanguages.value = selectedLangs;
  currentLanguage.value = defaultLang;
};

const switchLanguage = (lang: Language) => {
  currentLanguage.value = lang;
};
</script>

<template>
  <div class="app-container" :class="[
    { 'rtl': currentLanguage === 'ar' },
    `theme-${userSettings.theme}`
  ]">
    
    <!-- Persistent Home Button (only show when not in menu) -->
    <button 
      v-if="viewMode !== 'menu'" 
      class="floating-home-btn"
      @click="goHome"
      aria-label="Home"
    >
      <img :src="icons.home" width="40" height="40" />
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
              <div class="carousel-main-area">
                <button 
                  class="nav-arrow prev" 
                  @click="prevItem" 
                  :disabled="currentIndex === 0"
                >
                  ⬅️
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
                >
                  ➡️
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
  width: 60px;
  height: 60px;
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
}

.floating-home-btn:active { transform: scale(0.9); }
.rtl .floating-home-btn { left: auto; right: 20px; }

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
  background: white;
  border: 3px solid #4CAF50;
  color: #4CAF50;
  font-size: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 0 #2E7D32;
  flex-shrink: 0;
}

.nav-arrow:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0;
}

.nav-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  border-color: #ccc;
  color: #ccc;
  box-shadow: none;
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