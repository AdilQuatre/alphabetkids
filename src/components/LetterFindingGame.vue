<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{
  alphabetData: Array<{ letter: string; word: string; image: string }>;
  currentLanguage: string;
}>();

// Game Constants
const TARGET_COUNT = 5;
const DISTRACTION_COUNT = 15;

interface GameLetter {
  letter: string;
  isTarget: boolean;
  isFound: boolean;
  isWrong: boolean;
  id: number;
  x: number; // Random X position
  y: number; // Random Y position
  speed: number; // Float speed
  delay: number; // Animation delay
}

const letters = ref<GameLetter[]>([]);
const targetLetter = ref('');
const score = ref(0);
const gameCompleted = ref(false);
const audioLoaded = ref(false);

// Sounds
const popSound = ref(new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3')); // Pop sound
const winSound = ref(new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'));

const loadSounds = () => {
  popSound.value.volume = 0.4;
  winSound.value.volume = 0.4;
  audioLoaded.value = true;
};

const instructions = computed(() => {
  switch (props.currentLanguage) {
    case 'fr': return `Éclate les bulles "${targetLetter.value}"`;
    case 'ar': return `"${targetLetter.value}" فرقع الفقاعات`;
    case 'nl': return `Prik de "${targetLetter.value}" bubbels`;
    default: return `Pop the "${targetLetter.value}" bubbles`;
  }
});

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const initializeGame = () => {
  // Pick a random target
  const availableLetters = props.alphabetData.map(a => a.letter);
  const selectedTarget = availableLetters[Math.floor(Math.random() * availableLetters.length)];
  targetLetter.value = selectedTarget;

  // Create items
  let idCounter = 0;
  const targets = Array(TARGET_COUNT).fill(selectedTarget).map(l => createBubble(l, true, idCounter++));
  
  const distractions = shuffleArray(availableLetters.filter(l => l !== selectedTarget))
    .slice(0, DISTRACTION_COUNT)
    .map(l => createBubble(l, false, idCounter++));

  letters.value = shuffleArray([...targets, ...distractions]);
  score.value = 0;
  gameCompleted.value = false;
};

const createBubble = (letter: string, isTarget: boolean, id: number): GameLetter => {
  return {
    letter,
    isTarget,
    isFound: false,
    isWrong: false,
    id,
    x: Math.random() * 80 + 10, // 10% to 90%
    y: Math.random() * 20, // Variance in starting vertical pos
    speed: Math.random() * 3 + 5, // 5s to 8s duration (Slower)
    delay: Math.random() * 2 // 0s to 2s delay
  };
};

const handleBubbleClick = (item: GameLetter) => {
  if (item.isFound || item.isWrong || gameCompleted.value) return;

  if (item.isTarget) {
    item.isFound = true;
    score.value++;
    if (audioLoaded.value) {
      popSound.value.currentTime = 0;
      popSound.value.play().catch(() => {});
    }

    if (score.value === TARGET_COUNT) {
      gameCompleted.value = true;
      if (audioLoaded.value) {
        setTimeout(() => winSound.value.play().catch(() => {}), 500);
      }
    }
  } else {
    // Wiggle effect for wrong bubble
    item.isWrong = true;
    setTimeout(() => {
      item.isWrong = false;
    }, 500);
  }
};

const resetGame = () => {
  initializeGame();
};

onMounted(() => {
  loadSounds();
  initializeGame();
});
</script>

<template>
  <div class="game-container">
    <!-- Header / Score -->
    <div class="game-header">
      <div class="instructions">{{ instructions }}</div>
      <div class="stars">
        <span 
          v-for="n in TARGET_COUNT" 
          :key="n" 
          class="star"
          :class="{ filled: n <= score }"
        >
          ⭐
        </span>
      </div>
    </div>

    <!-- Aquarium / Sky Container -->
    <div v-if="!gameCompleted" class="bubbles-container">
      <button
        v-for="item in letters"
        :key="item.id"
        class="bubble"
        :class="{ 
          'popped': item.isFound, 
          'wrong': item.isWrong 
        }"
        :style="{
          left: `${item.x}%`,
          animationDuration: `${item.speed}s`,
          animationDelay: `${item.delay}s`
        }"
        @click="handleBubbleClick(item)"
        :disabled="item.isFound"
      >
        <span class="bubble-shine"></span>
        {{ item.letter }}
      </button>
    </div>

    <!-- Win Screen -->
    <div v-else class="completion-screen">
      <div class="trophy">🏆</div>
      <h2>
        {{ currentLanguage === 'fr' ? 'Bravo !' : 
           currentLanguage === 'ar' ? 'أحسنت!' : 
           'Great Job!' }}
      </h2>
      <button class="play-again-button" @click="resetGame">
        🔄
      </button>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  height: 80vh; /* Fixed height for the "aquarium" */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.game-header {
  text-align: center;
  z-index: 10;
  padding: 1rem;
  background: rgba(255,255,255,0.8);
  border-radius: 0 0 20px 20px;
}

.instructions {
  font-size: 2rem;
  color: #2c3e50;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.stars {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  font-size: 2rem;
}

.star {
  opacity: 0.3;
  transform: scale(0.8);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.star.filled {
  opacity: 1;
  transform: scale(1.2);
}

/* Bubble Container */
.bubbles-container {
  flex: 1;
  position: relative;
  background: linear-gradient(to bottom, #87CEEB, #E0F7FA); /* Sky/Water gradient */
  border-radius: 20px;
  overflow: hidden;
  margin-top: 1rem;
  box-shadow: inset 0 0 50px rgba(0,0,0,0.1);
}

.bubble {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.4) 20%, rgba(255, 255, 255, 0.1) 60%, rgba(255, 255, 255, 0.4) 100%);
  border: 2px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  cursor: pointer;
  bottom: -100px; /* Start below screen */
  animation-name: floatUp;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  backdrop-filter: blur(2px);
}

.bubble-shine {
  position: absolute;
  top: 15%;
  left: 20%;
  width: 20%;
  height: 10%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  transform: rotate(-45deg);
}

.bubble:active {
  transform: scale(0.95);
}

.bubble.popped {
  transform: scale(1.5);
  opacity: 0;
  transition: all 0.2s ease-out;
  pointer-events: none;
}

.bubble.wrong {
  background: radial-gradient(circle at 30% 30%, #ffcdd2, rgba(255, 0, 0, 0.1));
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes floatUp {
  0% { bottom: -100px; transform: translateX(0); }
  25% { transform: translateX(20px); }
  50% { transform: translateX(-20px); }
  75% { transform: translateX(10px); }
  100% { bottom: 120%; transform: translateX(0); }
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.completion-screen {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.9);
  z-index: 20;
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.trophy {
  font-size: 8rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

.play-again-button {
  font-size: 3rem;
  padding: 1rem 2rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 8px 0 #2E7D32;
  transition: all 0.2s;
}

.play-again-button:active {
  transform: translateY(8px);
  box-shadow: 0 0 0;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes popIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

@media (max-width: 600px) {
  .bubble {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }
}
</style>
