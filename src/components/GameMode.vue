<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{
  alphabetData: Array<{ letter: string; word: string; image: string }>;
  currentLanguage: string;
}>();

const emit = defineEmits<{
  speak: [word: string];
}>();

const letters = ref<Array<{ letter: string; isMatched: boolean }>>([]);
const images = ref<Array<{ image: string; word: string; isMatched: boolean }>>([]);
const draggedItem = ref<string | null>(null);
const score = ref(0);
const totalPairs = ref(6);
const gameCompleted = ref(false);

// Audio
const matchSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
matchSound.volume = 0.3;

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const initializeGame = () => {
  const shuffledData = shuffleArray(props.alphabetData);
  const selectedPairs = shuffledData.slice(0, totalPairs.value);
  
  letters.value = shuffleArray(selectedPairs).map(item => ({
    letter: item.letter,
    isMatched: false
  }));
  
  images.value = shuffleArray(selectedPairs).map(item => ({
    image: item.image,
    word: item.word,
    isMatched: false
  }));

  score.value = 0;
  gameCompleted.value = false;
};

const handleDragStart = (letter: string) => {
  draggedItem.value = letter;
};

const handleTouchStart = (event: TouchEvent, letter: string) => {
  draggedItem.value = letter;
  // Visual feedback could be added here
};

const handleDrop = (imageIndex: number) => {
  if (!draggedItem.value || images.value[imageIndex].isMatched) return;
  checkMatch(imageIndex);
  draggedItem.value = null;
};

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
};

const checkMatch = (imageIndex: number) => {
  const letterIndex = letters.value.findIndex(l => l.letter === draggedItem.value && !l.isMatched);
  if (letterIndex === -1) return;

  const correctLetter = props.alphabetData.find(
    item => item.image === images.value[imageIndex].image
  )?.letter;

  if (draggedItem.value === correctLetter) {
    letters.value[letterIndex].isMatched = true;
    images.value[imageIndex].isMatched = true;
    score.value++;
    emit('speak', images.value[imageIndex].word);
    
    // Play Sound
    matchSound.currentTime = 0;
    matchSound.play().catch(() => {});

    if (score.value === totalPairs.value) {
      setTimeout(() => {
        gameCompleted.value = true;
      }, 500);
    }
  }
};

const resetGame = () => {
  initializeGame();
};

onMounted(() => {
  initializeGame();
});

// Helper to get the index of a letter in the original letters array for the click handler (if we added click-to-match later)
</script>

<template>
  <div class="game-container">
    <div v-if="gameCompleted" class="completion-screen">
      <div class="trophy">🏆</div>
      <h2>
        {{ currentLanguage === 'fr' ? 'Excellent !' : 
           currentLanguage === 'ar' ? 'ممتاز!' : 
           'Excellent!' }}
      </h2>
      <button class="play-again-button" @click="resetGame">
        🔄
      </button>
    </div>
    
    <div v-else class="game-content">
      <div class="score-board">
        <span v-for="n in totalPairs" :key="n" class="star" :class="{ filled: n <= score }">⭐</span>
      </div>
      
      <div class="game-area">
        <!-- Draggable Letters -->
        <div class="letters-column">
          <div
            v-for="(item, index) in letters"
            :key="`l-${index}`"
            class="letter-card"
            :class="{ 'matched': item.isMatched, 'invisible': item.isMatched }"
            draggable="true"
            @dragstart="handleDragStart(item.letter)"
            @touchstart="(e) => handleTouchStart(e, item.letter)"
          >
            {{ item.letter }}
          </div>
        </div>

        <!-- Drop Targets (Images) -->
        <div class="images-column">
          <div
            v-for="(item, index) in images"
            :key="`i-${index}`"
            class="image-card"
            :class="{ 'matched': item.isMatched }"
            @dragover="handleDragOver"
            @drop="handleDrop(index)"
          >
            <img :src="item.image" :alt="item.word">
            <div v-if="item.isMatched" class="check-mark">✅</div>
          </div>
        </div>
      </div>
      
      <p class="hint">
        {{ currentLanguage === 'fr' ? 'Glisse les lettres vers les images !' : 'Drag the letters to the images!' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
}

.score-board {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.star { opacity: 0.3; transform: scale(0.8); transition: 0.3s; }
.star.filled { opacity: 1; transform: scale(1.2); }

.game-area {
  display: flex;
  justify-content: center;
  gap: 4rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

.letters-column, .images-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Letters */
.letter-card {
  width: 80px;
  height: 80px;
  background: white;
  border: 3px solid #FFB74D;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #E65100;
  cursor: grab;
  box-shadow: 0 6px 0 #FF9800;
  transition: all 0.2s;
  z-index: 10;
}

.letter-card:active {
  transform: translateY(6px);
  box-shadow: 0 0 0;
  cursor: grabbing;
}

.letter-card.invisible {
  opacity: 0;
  pointer-events: none;
}

/* Images */
.image-card {
  width: 100px;
  height: 100px;
  background: white;
  border: 3px dashed #4CAF50;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s;
}

.image-card img {
  width: 70%;
  height: 70%;
  object-fit: contain;
  filter: grayscale(100%);
  opacity: 0.6;
  transition: 0.3s;
}

.image-card.matched {
  border-style: solid;
  background: #E8F5E9;
  box-shadow: 0 6px 0 #2E7D32;
}

.image-card.matched img {
  filter: grayscale(0);
  opacity: 1;
  transform: scale(1.1);
}

.check-mark {
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 1.5rem;
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.hint {
  text-align: center;
  color: #7f8c8d;
  margin-top: 2rem;
  font-style: italic;
}

.completion-screen {
  text-align: center;
  padding: 3rem;
}

.trophy { font-size: 6rem; margin-bottom: 1rem; animation: bounce 2s infinite; }

.play-again-button {
  font-size: 2.5rem;
  padding: 0.5rem 2rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 6px 0 #2E7D32;
}

.play-again-button:active { transform: translateY(6px); box-shadow: 0 0 0; }

@keyframes popIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@media (max-width: 600px) {
  .game-area {
    gap: 1rem;
  }
  .letter-card { width: 60px; height: 60px; font-size: 2rem; }
  .image-card { width: 80px; height: 80px; }
}
</style>
