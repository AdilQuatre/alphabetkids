<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{
  numbersData: Array<{ number: string; word: string; image: string }>;
  currentLanguage: string;
}>();

const targetNumber = ref('');
const score = ref(0);
const choices = ref<Array<{ number: string; images: string[]; isCorrect: boolean; isSelected: boolean }>>([]);
const gameCompleted = ref(false);
const rounds = ref(0);
const totalRounds = 5;

// Sounds
const correctSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
const incorrectSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3');
const winSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');

correctSound.volume = 0.3;
incorrectSound.volume = 0.2;
winSound.volume = 0.4;

const instructions = computed(() => {
  switch (props.currentLanguage) {
    case 'fr': return `Trouve ${targetNumber.value} objets`;
    case 'ar': return `جد ${targetNumber.value} عناصر`;
    case 'nl': return `Vind ${targetNumber.value} objecten`;
    default: return `Find ${targetNumber.value} objects`;
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

const generateRound = () => {
  const numberIndex = Math.floor(Math.random() * 9); // 0 to 9 (numbers 1-10 roughly)
  // Ensure we pick something reasonable to count visually
  const selectedNumber = props.numbersData[numberIndex + 1]; // +1 to skip 0 if needed, or adjust logic
  targetNumber.value = selectedNumber.number;

  const correctCount = parseInt(selectedNumber.number) || 1;
  let possibleCounts = [1, 2, 3, 4, 5, 6].filter(n => n !== correctCount);
  
  const otherCounts = shuffleArray(possibleCounts).slice(0, 2);
  const allCounts = shuffleArray([correctCount, ...otherCounts]);
  
  choices.value = allCounts.map(count => ({
    number: count.toString(),
    images: Array(count).fill(selectedNumber.image),
    isCorrect: count === correctCount,
    isSelected: false
  }));
};

const handleChoice = (index: number) => {
  if (choices.value[index].isSelected) return;

  if (choices.value[index].isCorrect) {
    correctSound.currentTime = 0;
    correctSound.play().catch(() => {});
    score.value++;
  } else {
    incorrectSound.currentTime = 0;
    incorrectSound.play().catch(() => {});
  }

  choices.value[index].isSelected = true;
  rounds.value++;

  setTimeout(() => {
    if (rounds.value >= totalRounds) {
      gameCompleted.value = true;
      winSound.play().catch(() => {});
    } else {
      generateRound();
    }
  }, 1000);
};

const resetGame = () => {
  score.value = 0;
  rounds.value = 0;
  gameCompleted.value = false;
  generateRound();
};

onMounted(() => {
  generateRound();
});

const congratsText = computed(() => {
  switch (props.currentLanguage) {
    case 'fr': return 'Bravo ! 🎉';
    case 'ar': return '!مبروك 🎉';
    default: return 'Great Job! 🎉';
  }
});
</script>

<template>
  <div class="game-container">
    <div v-if="gameCompleted" class="completion-screen">
      <div class="trophy">🏆</div>
      <h1 class="congrats-title">{{ congratsText }}</h1>
      <p class="final-score">{{ score }}/{{ totalRounds }}</p>
      <button class="play-again-button" @click="resetGame">
        🔄
      </button>
    </div>
    
    <div v-else class="game-content">
      <!-- Progress Bar -->
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: `${(rounds / totalRounds) * 100}%` }"
        ></div>
      </div>

      <div class="question-header">
        <span class="big-number">{{ targetNumber }}</span>
        <span class="question-text">{{ instructions }}</span>
      </div>
      
      <div class="cards-grid">
        <div
          v-for="(choice, index) in choices"
          :key="index"
          :class="['count-card', {
            'correct': choice.isSelected && choice.isCorrect,
            'wrong': choice.isSelected && !choice.isCorrect
          }]"
          @click="handleChoice(index)"
        >
          <div class="card-inner">
            <div class="images-grid">
              <img
                v-for="(image, imgIndex) in choice.images"
                :key="imgIndex"
                :src="image"
                alt="item"
                class="mini-image"
                :style="{ animationDelay: `${imgIndex * 0.1}s` }"
              >
            </div>
          </div>
          <div v-if="choice.isSelected && choice.isCorrect" class="checkmark">✅</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #e0e0e0;
  border-radius: 10px;
  margin-bottom: 2rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4CAF50;
  transition: width 0.5s ease-out;
}

.question-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.big-number {
  font-size: 6rem;
  font-weight: 900;
  color: #FF9800;
  text-shadow: 4px 4px 0px rgba(0,0,0,0.1);
  line-height: 1;
}

.question-text {
  font-size: 1.5rem;
  color: #666;
  font-weight: bold;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.count-card {
  background: white;
  border-radius: 20px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 4px solid #e0e0e0;
  min-height: 200px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.count-card:hover {
  transform: translateY(-5px);
  border-color: #4CAF50;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.count-card:active {
  transform: scale(0.95);
}

.count-card.correct {
  border-color: #4CAF50;
  background: #E8F5E9;
  animation: pulse 0.5s;
}

.count-card.wrong {
  border-color: #F44336;
  background: #FFEBEE;
  animation: shake 0.5s;
}

.images-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.mini-image {
  width: 40px;
  height: 40px;
  object-fit: contain;
  animation: popIn 0.3s backwards;
}

.checkmark {
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 2rem;
  background: white;
  border-radius: 50%;
}

@keyframes popIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.completion-screen {
  text-align: center;
  padding: 2rem;
}

.trophy { font-size: 6rem; margin-bottom: 1rem; animation: float 3s infinite; }

.play-again-button {
  font-size: 3rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}

.play-again-button:hover { transform: rotate(180deg); }

@media (max-width: 600px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
