<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{
  numbersData: Array<{ number: string; word: string; image: string }>;
  currentLanguage: string;
}>();

// State
const sequence = ref<(string | null)[]>([]);
const missingIndex = ref(-1);
const options = ref<string[]>([]);
const trainPosition = ref(-100); // Start off screen
const isCorrect = ref(false);
const showSuccess = ref(false);
const score = ref(0);

// Sounds
const trainSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'); // Placeholder
const successSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');

// Logic
const generateLevel = () => {
  // Choose a start number (1-15)
  const startNum = Math.floor(Math.random() * 15) + 1;
  
  // Create sequence of 4 numbers
  const nums = [startNum, startNum + 1, startNum + 2, startNum + 3];
  
  // Pick one to hide (avoid first one sometimes for variety, but keep simple for now)
  missingIndex.value = Math.floor(Math.random() * 2) + 1; // Index 1 or 2 (middle ones)
  
  const missingNum = nums[missingIndex.value];
  sequence.value = nums.map((n, i) => i === missingIndex.value ? null : n.toString());
  
  // Generate options
  const correctOption = missingNum.toString();
  const wrong1 = (missingNum - 1).toString(); // StartNum might duplicate, simple logic for now
  const wrong2 = (missingNum + (Math.random() > 0.5 ? 2 : -2)).toString();
  
  // Ensure unique options
  const opts = new Set([correctOption]);
  while (opts.size < 3) {
    opts.add((Math.floor(Math.random() * 20) + 1).toString());
  }
  
  options.value = Array.from(opts).sort(() => Math.random() - 0.5);
  
  // Reset animation
  trainPosition.value = -100;
  isCorrect.value = false;
  showSuccess.value = false;
  
  // Animate in
  setTimeout(() => {
    trainPosition.value = 0;
  }, 100);
};

const handleOptionSelect = (option: string) => {
  if (isCorrect.value) return; // Already solved
  
  const correctNum = parseInt(sequence.value[missingIndex.value - 1]!) + 1;
  
  if (parseInt(option) === correctNum) {
    // Success
    sequence.value[missingIndex.value] = option;
    isCorrect.value = true;
    showSuccess.value = true;
    score.value++;
    successSound.play().catch(() => {});
    
    // Train leaves
    setTimeout(() => {
      trainPosition.value = 150; // Drive off screen right
      setTimeout(generateLevel, 1500);
    }, 1000);
  } else {
    // Shake effect or sound
    // TODO: Add wiggle
  }
};

onMounted(() => {
  generateLevel();
});
</script>

<template>
  <div class="train-game">
    <div class="sky">
      <div class="cloud" style="top: 20px; left: 10%">☁️</div>
      <div class="cloud" style="top: 50px; left: 60%">☁️</div>
    </div>
    
    <div class="score-board">⭐ {{ score }}</div>

    <!-- The Train -->
    <div 
      class="train-container" 
      :style="{ transform: `translateX(${trainPosition}%)` }"
    >
      <div class="locomotive">🚂</div>
      <div 
        v-for="(num, index) in sequence" 
        :key="index" 
        class="wagon"
        :class="{ 'empty': num === null, 'filled': num !== null && index === missingIndex }"
      >
        <span v-if="num">{{ num }}</span>
        <span v-else>?</span>
        <div class="wheels">
          <span>O</span><span>O</span>
        </div>
      </div>
    </div>

    <!-- Options -->
    <div class="options-container" v-if="!isCorrect">
      <button 
        v-for="opt in options" 
        :key="opt"
        class="option-btn"
        @click="handleOptionSelect(opt)"
      >
        {{ opt }}
      </button>
    </div>
    
    <div v-else class="success-message">
      {{ currentLanguage === 'fr' ? 'Tchou ! Tchou !' : 'Choo ! Choo !' }} 💨
    </div>
  </div>
</template>

<style scoped>
.train-game {
  width: 100%;
  max-width: 800px;
  height: 60vh;
  margin: 0 auto;
  background: linear-gradient(#87CEEB 60%, #8BC34A 60%);
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 2rem;
}

.score-board {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 2rem;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  box-shadow: 0 4px 0 rgba(0,0,0,0.1);
}

.cloud {
  position: absolute;
  font-size: 4rem;
  opacity: 0.8;
  animation: float 20s linear infinite;
}

@keyframes float {
  from { transform: translateX(0); }
  to { transform: translateX(50px); }
}

.train-container {
  display: flex;
  align-items: flex-end;
  gap: 5px;
  transition: transform 1.5s cubic-bezier(0.25, 1, 0.5, 1);
  padding-left: 2rem;
  margin-bottom: 10%; /* Position on the "grass" */
}

.locomotive {
  font-size: 6rem;
  filter: drop-shadow(0 10px 5px rgba(0,0,0,0.2));
  z-index: 2;
}

.wagon {
  width: 100px;
  height: 80px;
  background: #FF5722;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  color: white;
  position: relative;
  box-shadow: inset 0 -5px 0 rgba(0,0,0,0.2);
  border: 2px solid #E64A19;
}

.wagon.empty {
  background: #e0e0e0;
  border-style: dashed;
  color: #999;
}

.wagon.filled {
  background: #4CAF50;
  animation: popIn 0.5s;
}

.wheels {
  position: absolute;
  bottom: -25px;
  display: flex;
  gap: 40px;
  font-size: 1.5rem;
  color: #333;
  font-weight: 900;
}

.wheels span {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

.options-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
  background: rgba(255,255,255,0.9);
  margin: 0 2rem;
  border-radius: 20px;
  z-index: 10;
}

.option-btn {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  border: 4px solid #2196F3;
  font-size: 2.5rem;
  font-weight: bold;
  color: #2196F3;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 5px 0 #1976D2;
}

.option-btn:hover {
  transform: translateY(-5px);
}

.option-btn:active {
  transform: translateY(2px);
  box-shadow: 0 0 0;
}

.success-message {
  text-align: center;
  font-size: 3rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 0 rgba(0,0,0,0.2);
  padding: 2rem;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes popIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

@media (max-width: 600px) {
  .train-container {
    transform-origin: left;
    scale: 0.7;
  }
  
  .option-btn {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }
}
</style>

