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
const wrongOption = ref<string | null>(null); // Track wrong option for shake effect

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
    wrongOption.value = null; // Clear any wrong state
    successSound.play().catch(() => {});
    
    // Train leaves
    setTimeout(() => {
      trainPosition.value = 150; // Drive off screen right
      setTimeout(generateLevel, 1500);
    }, 1000);
  } else {
    // Wrong answer - shake effect
    wrongOption.value = option;
    setTimeout(() => {
      wrongOption.value = null;
    }, 600);
  }
};

onMounted(() => {
  generateLevel();
});
</script>

<template>
  <div class="train-game">
    <div class="score-board">⭐ {{ score }}</div>

    <!-- The Train -->
    <div 
      class="train-container" 
      :style="{ transform: `translateX(${trainPosition}%)` }"
    >
      <div class="locomotive">
        <img src="/images/gametrainloco.png" alt="Locomotive" class="loco-img" />
      </div>
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
        :class="{ 'wrong': wrongOption === opt }"
        @click="handleOptionSelect(opt)"
        :aria-label="`${currentLanguage === 'fr' ? 'Choisir le nombre' : 
                        currentLanguage === 'ar' ? 'اختر الرقم' :
                        currentLanguage === 'nl' ? 'Kies nummer' :
                        'Select number'} ${opt}`"
        role="button"
        tabindex="0"
      >
        {{ opt }}
      </button>
    </div>
    
    <div v-else class="success-message">
      {{ currentLanguage === 'fr' ? 'Tchou ! Tchou !' : 
         currentLanguage === 'ar' ? 'شو شو !' :
         currentLanguage === 'nl' ? 'Tjoek Tjoek !' :
         'Choo ! Choo !' }} 💨
    </div>
  </div>
</template>

<style scoped>
.train-game {
  width: 100%;
  max-width: 800px;
  height: 60vh;
  margin: 0 auto;
  background-image: url('/images/gametrainback.png');
  background-size: cover;
  background-position: center bottom;
  background-repeat: no-repeat;
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
  background: rgba(255, 255, 255, 0.95);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  z-index: 20;
}

.train-container {
  display: flex;
  align-items: flex-end;
  gap: 0;
  transition: transform 1.5s cubic-bezier(0.25, 1, 0.5, 1);
  padding-left: 2rem;
  position: absolute;
  bottom: 35%;
  left: 0;
}

.locomotive {
  z-index: 2;
  display: flex;
  align-items: flex-end;
  margin-right: -10px;
}

.loco-img {
  height: 120px;
  width: auto;
  filter: drop-shadow(0 8px 6px rgba(0,0,0,0.3));
  object-fit: contain;
}

.wagon {
  width: 90px;
  height: 70px;
  background: linear-gradient(180deg, #8B4513 0%, #654321 100%);
  border-radius: 8px 8px 4px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 900;
  color: white;
  position: relative;
  box-shadow: 
    inset 0 -4px 0 rgba(0,0,0,0.3),
    inset 0 2px 0 rgba(255,255,255,0.2),
    0 6px 10px rgba(0,0,0,0.3);
  border: 3px solid #5D3A1A;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  margin-left: -5px;
}

.wagon::before {
  content: '';
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  height: 8px;
  background: rgba(255,255,255,0.15);
  border-radius: 4px;
}

.wagon.empty {
  background: linear-gradient(180deg, #A0A0A0 0%, #707070 100%);
  border: 3px dashed #505050;
  color: #404040;
}

.wagon.filled {
  background: linear-gradient(180deg, #4CAF50 0%, #2E7D32 100%);
  border-color: #1B5E20;
  animation: popIn 0.5s;
}

.wheels {
  position: absolute;
  bottom: -20px;
  display: flex;
  gap: 35px;
  font-size: 1.2rem;
  color: #2c2c2c;
  font-weight: 900;
}

.wheels span {
  width: 20px;
  height: 20px;
  background: linear-gradient(180deg, #555 0%, #333 100%);
  border-radius: 50%;
  border: 2px solid #222;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: spin 1s linear infinite;
  box-shadow: 0 2px 4px rgba(0,0,0,0.4);
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
  background: rgba(255,255,255,0.95);
  margin: 0 2rem;
  border-radius: 20px;
  z-index: 10;
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
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

.option-btn.wrong {
  animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
  background: #ffcdd2;
  border-color: #f44336;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-2px, 0, 0); }
  20%, 80% { transform: translate3d(4px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-8px, 0, 0); }
  40%, 60% { transform: translate3d(8px, 0, 0); }
}

.success-message {
  text-align: center;
  font-size: 3rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.4);
  padding: 2rem;
  animation: bounce 1s infinite;
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  background: rgba(76, 175, 80, 0.9);
  margin: 0 2rem;
  border-radius: 20px;
  z-index: 10;
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
  .train-game {
    height: auto;
    min-height: 70vh;
    padding: 1rem;
    padding-bottom: 8rem;
    background-position: center center;
  }
  
  .score-board {
    font-size: 1.5rem;
    padding: 0.4rem 0.8rem;
    top: 10px;
    right: 10px;
  }
  
  .train-container {
    transform-origin: left;
    scale: 0.55;
    bottom: 40%;
    padding-left: 0.5rem;
  }
  
  .loco-img {
    height: 100px;
  }
  
  .wagon {
    width: 65px;
    height: 55px;
    font-size: 1.8rem;
  }
  
  .wheels {
    bottom: -15px;
    gap: 25px;
  }
  
  .wheels span {
    width: 16px;
    height: 16px;
  }
  
  .options-container {
    position: absolute;
    bottom: 10px;
    left: 10px;
    right: 10px;
    margin: 0;
    border-radius: 20px;
    padding: 1.5rem 1rem;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .option-btn {
    width: 60px;
    height: 60px;
    font-size: 2rem;
    flex-shrink: 0;
  }
  
  .success-message {
    font-size: 2rem;
    padding: 1rem;
    bottom: 10px;
    left: 10px;
    right: 10px;
    margin: 0;
  }
}
</style>



