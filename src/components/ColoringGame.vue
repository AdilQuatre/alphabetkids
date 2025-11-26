<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps<{
  currentLanguage: string;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const isDrawing = ref(false);
const currentColor = ref('#FF5252');
const brushSize = ref(10);
const currentTool = ref<'brush' | 'eraser'>('brush');

const colors = [
  '#FF5252', '#FF4081', '#E040FB', '#7C4DFF',
  '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
  '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41',
  '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40',
  '#8D6E63', '#BDBDBD', '#78909C', '#000000'
];

// Canvas Logic
const initCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
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
    ctx?.beginPath();
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
    e.preventDefault();
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  const x = clientX - rect.left;
  const y = clientY - rect.top;

  ctx.lineWidth = brushSize.value;
  ctx.strokeStyle = currentTool.value === 'eraser' ? '#ffffff' : currentColor.value;

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
  
  const rect = canvas.getBoundingClientRect();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, rect.width, rect.height);
  ctx.beginPath();
};

const downloadDrawing = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  const link = document.createElement('a');
  link.download = `mon-dessin-${new Date().toISOString().slice(0,10)}.png`;
  link.href = canvas.toDataURL();
  link.click();
};

const handleImageUpload = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.value;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Draw image centered and scaled to fit (Contain ratio)
        const rect = canvas.getBoundingClientRect();
        
        // Use intrinsic aspect ratio of the image vs the canvas
        const imgRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;
        
        let drawWidth, drawHeight;
        
        if (imgRatio > canvasRatio) {
          // Image is wider than canvas (relative to aspect), constrain by width
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgRatio;
        } else {
          // Image is taller, constrain by height
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgRatio;
        }
        
        const x = (canvas.width - drawWidth) / 2;
        const y = (canvas.height - drawHeight) / 2;
        
        // Clear first
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(input.files[0]);
  }
};

// Lifecycle
onMounted(() => {
  initCanvas();
  window.addEventListener('resize', initCanvas);
});

</script>

<template>
  <div class="coloring-game">
    <div class="tools-panel">
      <!-- Colors -->
      <div class="colors-grid">
        <button
          v-for="color in colors"
          :key="color"
          class="color-btn"
          :style="{ backgroundColor: color }"
          :class="{ active: currentColor === color && currentTool === 'brush' }"
          @click="currentColor = color; currentTool = 'brush'"
        ></button>
      </div>

      <!-- Tools -->
      <div class="main-tools">
        <button 
          class="tool-btn"
          :class="{ active: currentTool === 'brush' }"
          @click="currentTool = 'brush'"
        >
          🖌️
        </button>
        <button 
          class="tool-btn"
          :class="{ active: currentTool === 'eraser' }"
          @click="currentTool = 'eraser'"
        >
          🧼
        </button>
        
        <div class="size-control">
          <div class="size-preview" :style="{ width: brushSize + 'px', height: brushSize + 'px', background: currentTool === 'eraser' ? '#ccc' : currentColor }"></div>
          <input type="range" v-model="brushSize" min="5" max="50">
        </div>

        <label class="action-btn upload-btn">
          📂
          <input type="file" accept="image/*" @change="handleImageUpload" style="display: none;">
        </label>

        <button class="action-btn download" @click="downloadDrawing">
          💾
        </button>
        <button class="action-btn clear" @click="clearCanvas">
          🗑️
        </button>
      </div>
    </div>

    <div class="canvas-wrapper">
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
    </div>
  </div>
</template>

<style scoped>
.coloring-game {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.tools-panel {
  background: white;
  padding: 1rem;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.colors-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.color-btn {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.color-btn.active {
  transform: scale(1.2);
  border-color: #333;
}

.main-tools {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.tool-btn {
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  border-radius: 12px;
  border: 2px solid #eee;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.tool-btn.active {
  background: #E3F2FD;
  border-color: #2196F3;
  transform: translateY(-2px);
}

.size-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f5f5f5;
  padding: 0.5rem 1rem;
  border-radius: 50px;
}

.size-preview {
  border-radius: 50%;
  transition: all 0.2s;
}

.action-btn {
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}

.upload-btn {
  background: #FFF9C4;
  color: #FBC02D;
  display: flex;
  align-items: center;
  justify-content: center;
}

.download {
  background: #E8F5E9;
  color: #2E7D32;
}

.clear {
  background: #FFEBEE;
  color: #C62828;
}

.action-btn:hover {
  transform: scale(1.1);
}

.canvas-wrapper {
  flex: 1;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  overflow: hidden;
  position: relative;
  min-height: 60vh; /* Bigger canvas area */
  border: 4px solid #42A5F5;
}

canvas {
  width: 100%;
  height: 100%;
  touch-action: none;
  cursor: crosshair;
}

@media (max-width: 600px) {
  .color-btn {
    width: 30px;
    height: 30px;
  }
  
  .main-tools {
    gap: 0.5rem;
  }
  
  .tool-btn, .action-btn {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}
</style>
