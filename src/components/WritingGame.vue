<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';

const props = defineProps<{
  items: Array<{ letter?: string; number?: string; word: string }>;
  type: 'letters' | 'numbers' | 'name';
  currentLanguage: string;
  childName?: string;
}>();

// State
const currentIndex = ref(0);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const isDrawing = ref(false);
const currentColor = ref('#FF5252'); // Default red
const brushSize = ref(15);
const showCelebration = ref(false);

// Colors palette
const colors = [
  '#FF5252', // Red
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#FFC107', // Amber
  '#9C27B0', // Purple
  '#3F51B5'  // Indigo
];

// Audio
const scribbleSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'); // Placeholder, strictly speaking we'd want a scratch noise
const successSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
successSound.volume = 0.3;

const emit = defineEmits(['openSettings']);

// Helper to get display character
const currentCharacter = computed(() => {
  if (props.type === 'name') {
    if (props.childName) {
      return props.childName.toUpperCase();
    }
    return '';
  }
  const item = props.items[currentIndex.value];
  return props.type === 'letters' ? item.letter : item.number;
});

const maxIndex = computed(() => {
  if (props.type === 'name') {
    return 1; // Only 1 page for name
  }
  return props.items.length;
});

// Canvas Logic
const initCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  // Handle high DPI displays
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }
};

const startDrawing = (e: MouseEvent | TouchEvent) => {
  isDrawing.value = true;
  draw(e);
};

const stopDrawing = () => {
  isDrawing.value = false;
  const canvas = canvasRef.value;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx?.beginPath(); // Reset path
  }
};

const draw = (e: MouseEvent | TouchEvent) => {
  if (!isDrawing.value || !canvasRef.value) return;

  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const rect = canvas.getBoundingClientRect();
  let clientX, clientY;

  if (e instanceof TouchEvent) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
    e.preventDefault(); // Prevent scrolling
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  const x = clientX - rect.left;
  const y = clientY - rect.top;

  ctx.lineWidth = brushSize.value;
  ctx.strokeStyle = currentColor.value;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
};

const clearCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
};

// Navigation
const nextItem = () => {
  const limit = maxIndex.value - 1;
  if (currentIndex.value < limit) {
    showCelebration.value = true;
    successSound.play().catch(() => {});
    
    setTimeout(() => {
      currentIndex.value++;
      clearCanvas();
      showCelebration.value = false;
    }, 800);
  }
};

const prevItem = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    clearCanvas();
  }
};

// Lifecycle
onMounted(() => {
  initCanvas();
  window.addEventListener('resize', initCanvas);
});

watch(currentIndex, () => {
  nextTick(() => initCanvas());
});
</script>

<template>
  <div class="writing-game">
    <div class="game-header">
      <button class="nav-btn" @click="prevItem" :disabled="currentIndex === 0">
        ←
      </button>
      
      <div class="color-palette">
        <button
          v-for="color in colors"
          :key="color"
          class="color-btn"
          :style="{ backgroundColor: color }"
          :class="{ active: currentColor === color }"
          @click="currentColor = color"
        ></button>
      </div>

      <button class="nav-btn" @click="nextItem" :disabled="currentIndex === maxIndex - 1">
        →
      </button>
    </div>

    <div class="canvas-container">
      <!-- Empty Name State -->
      <div v-if="type === 'name' && !childName" class="empty-state">
        <p>Quel est ton prénom ?</p>
        <button class="config-btn" @click="$emit('openSettings')">
          ⚙️ Configurer
        </button>
      </div>

      <!-- Guide Layer -->
      <div v-else class="guide-layer">
        {{ currentCharacter }}
      </div>
      
      <!-- Drawing Layer -->
      <canvas
        ref="canvasRef"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart="startDrawing"
        @touchmove="draw"
        @touchend="stopDrawing"
      ></canvas>

      <!-- Celebration Overlay -->
      <div v-if="showCelebration" class="celebration">
        ✨
      </div>
    </div>

    <div class="controls">
      <button class="action-btn clear-btn" @click="clearCanvas">
        🗑️ {{ currentLanguage === 'fr' ? 'Effacer' : 'Clear' }}
      </button>
      <button class="action-btn finish-btn" @click="nextItem">
        ✅ {{ currentLanguage === 'fr' ? 'Fini !' : 'Done!' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.writing-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.game-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  width: 100%;
  justify-content: center;
}

.color-palette {
  display: flex;
  gap: 0.5rem;
  background: white;
  padding: 0.5rem;
  border-radius: 50px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.color-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid white;
  cursor: pointer;
  transition: transform 0.2s;
  padding: 0;
}

.color-btn.active {
  transform: scale(1.2);
  border-color: #333;
}

.nav-btn {
  background: white;
  border: 2px solid var(--theme-border-color);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.canvas-container {
  position: relative;
  width: 100%; /* Responsive width */
  max-width: 800px; /* Wider for name */
  min-height: 400px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  overflow: hidden;
  border: 4px solid var(--theme-border-color);
}

.guide-layer {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 120px; /* Default big font */
  font-family: 'Arial Rounded MT Bold', 'Segoe UI', sans-serif;
  color: #e0e0e0; /* Very light gray */
  user-select: none;
  pointer-events: none;
  z-index: 1;
  letter-spacing: 10px; /* Space between letters for name */
}

/* Add dashed outline for the guide */
.guide-layer::after {
  content: attr(data-char);
  position: absolute;
  -webkit-text-stroke: 2px #ccc;
  color: transparent;
  z-index: 2;
}

canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  touch-action: none;
  cursor: crosshair;
}

.controls {
  display: flex;
  gap: 1rem;
}

.action-btn {
  padding: 0.8rem 2rem;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}

.clear-btn {
  background: #ffebee;
  color: #c62828;
}

.finish-btn {
  background: #e8f5e9;
  color: #2e7d32;
}

.action-btn:active {
  transform: scale(0.95);
}

.celebration {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10rem;
  background: rgba(255,255,255,0.8);
  z-index: 20;
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.empty-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  z-index: 30;
  gap: 1rem;
}

.empty-state p {
  font-size: 1.5rem;
  color: #2c3e50;
  font-weight: bold;
}

.config-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);
  transition: transform 0.2s;
}

.config-btn:hover {
  transform: translateY(-2px);
}

@keyframes popIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@media (max-width: 600px) {
  .canvas-container {
    max-width: 90vw;
  }
  .guide-layer {
    font-size: 80px; /* Smaller on mobile */
  }
  .color-btn {
    width: 30px;
    height: 30px;
  }
}
</style>

