<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{
  numbersData: Array<{ number: string; word: string; image: string }>;
  currentLanguage: string;
}>();

const numbers = ref<Array<{ number: string; isTarget: boolean; isFound: boolean; isWrong: boolean }>>([]);
const targetNumber = ref('');
const score = ref(0);
const totalTargets = ref(0);
const gameCompleted = ref(false);

// Sons pour le feedback
const correctSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
const incorrectSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3');

correctSound.volume = 0.3;
incorrectSound.volume = 0.2;

const instructions = computed(() => {
  switch (props.currentLanguage) {
    case 'fr':
      return `Trouve tous les "${targetNumber.value}"`;
    case 'ar':
      return `"${targetNumber.value}" اضغط على كل رقم`;
    default:
      return `Find all "${targetNumber.value}"`;
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
  // On prend tous les nombres de 0 à 20
  const allNumbers = props.numbersData.map(item => item.number);
  const selectedTarget = allNumbers[Math.floor(Math.random() * allNumbers.length)];
  targetNumber.value = selectedTarget;

  // Créer un tableau avec 5 nombres cibles et 15 autres nombres
  const targetNumbers = Array(5).fill(selectedTarget);
  const otherNumbers = shuffleArray(allNumbers.filter(n => n !== selectedTarget))
    .slice(0, 15);
  
  numbers.value = shuffleArray([...targetNumbers, ...otherNumbers]).map(number => ({
    number,
    isTarget: number === selectedTarget,
    isFound: false,
    isWrong: false
  }));

  totalTargets.value = targetNumbers.length;
  score.value = 0;
  gameCompleted.value = false;
};

const handleNumberClick = (index: number) => {
  if (numbers.value[index].isFound || numbers.value[index].isWrong) return;

  if (numbers.value[index].isTarget) {
    correctSound.currentTime = 0;
    correctSound.play();
    numbers.value[index].isFound = true;
    score.value++;

    if (score.value === totalTargets.value) {
      gameCompleted.value = true;
    }
  } else {
    incorrectSound.currentTime = 0;
    incorrectSound.play();
    numbers.value[index].isWrong = true;
  }
};

const resetGame = () => {
  initializeGame();
};

onMounted(() => {
  initializeGame();
});

const congratsText = computed(() => {
  switch (props.currentLanguage) {
    case 'fr':
      return 'Félicitations ! 🎉';
    case 'ar':
      return '!مبروك 🎉';
    default:
      return 'Congratulations! 🎉';
  }
});

const playAgainText = computed(() => {
  switch (props.currentLanguage) {
    case 'fr':
      return 'Jouer à nouveau';
    case 'ar':
      return 'العب مرة أخرى';
    default:
      return 'Play Again';
  }
});
</script>

<template>
  <div class="game-container">
    <div v-if="gameCompleted" class="completion-screen">
      <h2>{{ congratsText }}</h2>
      <button class="play-again-button" @click="resetGame">
        {{ playAgainText }}
      </button>
    </div>
    <div v-else class="game-content">
      <div class="instructions">{{ instructions }}</div>
      <div class="score">{{ score }}/{{ totalTargets }}</div>
      
      <div class="numbers-grid">
        <button
          v-for="(item, index) in numbers"
          :key="index"
          :class="['number-button', { found: item.isFound, wrong: item.isWrong }]"
          @click="handleNumberClick(index)"
          :disabled="item.isFound || item.isWrong"
        >
          {{ item.number }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.game-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.instructions {
  font-size: 2rem;
  color: #2c3e50;
  text-align: center;
  font-weight: bold;
}

.score {
  font-size: 2rem;
  font-weight: bold;
  color: #4CAF50;
}

.numbers-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 600px;
}

.number-button {
  aspect-ratio: 1;
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  background: white;
  border: 2px solid #4CAF50;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 1rem;
}

.number-button:hover:not(:disabled) {
  transform: scale(1.05);
  background: #f0f9f0;
}

.number-button:disabled {
  cursor: default;
}

.number-button.found {
  background: #e8f5e9;
  border-color: #2e7d32;
  color: #2e7d32;
  opacity: 0.7;
}

.number-button.wrong {
  background: #ffebee;
  border-color: #c62828;
  color: #c62828;
  opacity: 0.7;
  cursor: not-allowed;
}

.completion-screen {
  text-align: center;
  padding: 2rem;
}

.completion-screen h2 {
  font-size: 3rem;
  color: #4CAF50;
  margin-bottom: 2rem;
}

.play-again-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.play-again-button:hover {
  background-color: #45a049;
}

@media (max-width: 600px) {
  .numbers-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .number-button {
    font-size: 2rem;
  }
}
</style>