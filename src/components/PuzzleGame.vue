<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  currentLanguage: string;
}>();

interface PuzzlePiece {
  id: number;
  correctIndex: number; // 0-8
  currentX: number;
  currentY: number;
  isPlaced: boolean;
  image: string;
}

// State
const pieces = ref<PuzzlePiece[]>([]);
const isComplete = ref(false);
const isDragging = ref(false);
const draggedPieceId = ref<number | null>(null);
// Keep track of offset from top-left of piece to mouse pointer
const dragOffset = ref({ x: 0, y: 0 });

// Constants
const GRID_SIZE = 3;
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;
const IMAGES = [
  'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=500&q=80', // Puppy
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&q=80', // Dog
  'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=500&q=80',  // Cat
  'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=500&q=80', // Monkey
  'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=500&q=80'   // Kitten
];
const currentImage = ref(IMAGES[0]);

// Game Logic
const initGame = () => {
  isComplete.value = false;
  const newPieces: PuzzlePiece[] = [];
  
  // Determine positions: 4 on left, 5 on right
  // Left column: x=5%
  // Right column: x=85%
  const piecesPerSide = Math.ceil(TOTAL_PIECES / 2); // 5
  const spacingY = 80 / piecesPerSide; // Vertical spacing

  for (let i = 0; i < TOTAL_PIECES; i++) {
    // Distribute pieces between left and right columns
    const isLeft = i < (TOTAL_PIECES / 2); // First 4 on left, next 5 on right
    const sideIndex = isLeft ? i : i - Math.floor(TOTAL_PIECES / 2);
    
    const startX = isLeft ? 2 : 82; // 2% or 82%
    const startY = 10 + (sideIndex * 16); // Even vertical spacing (16% gap)

    newPieces.push({
      id: i,
      correctIndex: i,
      currentX: startX,
      currentY: startY,
      isPlaced: false,
      image: currentImage.value
    });
  }
  
  // Randomize the pieces but keep the positions structured
  // We want random pieces in these orderly slots, not random slots
  // So we shuffle the logical pieces first, then assign them to these calculated positions?
  // Actually, dragging logic uses currentX/Y.
  // Let's shuffle the array of created pieces so the 'id' (correct index) is not sequential in visual order
  
  // Fisher-Yates shuffle positions
  const positions = newPieces.map(p => ({ x: p.currentX, y: p.currentY }));
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  
  // Assign shuffled positions back to pieces
  newPieces.forEach((p, idx) => {
    p.currentX = positions[idx].x;
    p.currentY = positions[idx].y;
  });

  pieces.value = newPieces;
};

const getPieceStyle = (piece: PuzzlePiece) => {
  // Calculate background position based on correct index
  const col = piece.correctIndex % GRID_SIZE;
  const row = Math.floor(piece.correctIndex / GRID_SIZE);
  
  // For pieces that are placed, we align them perfectly relative to the board container
  if (piece.isPlaced) {
    // Calculate position relative to the board wrapper (centered)
    // Since board-wrapper is centered, we need to be careful with absolute positioning inside game-area
    // Better approach: "isPlaced" pieces snap to the slot coordinates exactly
    // But here we are using a single list of pieces. 
    // Let's say: if placed, we use the coordinates of the slot.
    // We'll handle this by updating currentX/Y to the slot's position on drop.
  }

  return {
    left: `${piece.currentX}%`,
    top: `${piece.currentY}%`,
    backgroundImage: `url(${piece.image})`,
    backgroundPosition: `${col * 50}% ${row * 50}%`, 
    backgroundSize: '300% 300%',
    position: 'absolute' as const,
    zIndex: isDragging.value && draggedPieceId.value === piece.id ? 100 : (piece.isPlaced ? 5 : 10)
  };
};

// Drag Logic
const startDrag = (e: MouseEvent | TouchEvent, piece: PuzzlePiece) => {
  // Prevent dragging if already placed (locked)
  if (piece.isPlaced) return;

  e.preventDefault(); 
  isDragging.value = true;
  draggedPieceId.value = piece.id;
  
  // Calculate offset to avoid snapping center to mouse immediately
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
  
  // We need the piece element's current screen rect
  const target = e.target as HTMLElement;
  const rect = target.getBoundingClientRect();
  
  dragOffset.value = {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
};

const onDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value || draggedPieceId.value === null) return;
  e.preventDefault();

  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

  const container = document.querySelector('.puzzle-game-area');
  if (!container) return;

  const rect = container.getBoundingClientRect();
  
  // Calculate new position relative to container, considering offset
  // Pos = (Mouse - ContainerOffset - DragOffset)
  let newX = ((clientX - rect.left - dragOffset.value.x) / rect.width) * 100;
  let newY = ((clientY - rect.top - dragOffset.value.y) / rect.height) * 100;

  // Clamp to container (keep somewhat inside)
  // Assuming piece is approx 10-15% width/height depending on screen
  newX = Math.max(0, Math.min(90, newX)); 
  newY = Math.max(0, Math.min(90, newY));

  const piece = pieces.value.find(p => p.id === draggedPieceId.value);
  if (piece) {
    piece.currentX = newX;
    piece.currentY = newY;
  }
};

const endDrag = () => {
  if (!isDragging.value || draggedPieceId.value === null) return;

  const piece = pieces.value.find(p => p.id === draggedPieceId.value);
  if (piece) {
    checkPlacement(piece);
  }

  isDragging.value = false;
  draggedPieceId.value = null;
};

const checkPlacement = (piece: PuzzlePiece) => {
  const slotId = piece.correctIndex;
  const slots = document.querySelectorAll('.drop-slot');
  const targetSlot = slots[slotId] as HTMLElement;
  
  if (!targetSlot) return;

  const container = document.querySelector('.puzzle-game-area');
  if (!container) return;
  
  const containerRect = container.getBoundingClientRect();
  const slotRect = targetSlot.getBoundingClientRect();
  
  // Calculate Piece Center relative to container
  const pieceXPx = (piece.currentX / 100) * containerRect.width;
  const pieceYPx = (piece.currentY / 100) * containerRect.height;
  const pieceWidth = (containerRect.width * 0.15); // Approx or get from element? Better to use center logic
  
  // Center of the current piece position
  // Note: visual size of piece matches slot size (100px or 80px)
  // Slot position relative to container
  const slotLeftRel = slotRect.left - containerRect.left;
  const slotTopRel = slotRect.top - containerRect.top;
  
  // Distance between top-left corners (easier than centers if same size)
  const pieceLeftPx = (piece.currentX / 100) * containerRect.width;
  const pieceTopPx = (piece.currentY / 100) * containerRect.height;
  
  const dist = Math.hypot(pieceLeftPx - slotLeftRel, pieceTopPx - slotTopRel);
  
  // Threshold: 50px
  if (dist < 50) {
    // Snap to slot
    piece.currentX = (slotLeftRel / containerRect.width) * 100;
    piece.currentY = (slotTopRel / containerRect.height) * 100;
    piece.isPlaced = true;
    
    // Sound feedback
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
    
    checkWin();
  }
};

const checkWin = () => {
  if (pieces.value.every(p => p.isPlaced)) {
    isComplete.value = true;
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }
};

const nextImage = () => {
  const idx = IMAGES.indexOf(currentImage.value);
  currentImage.value = IMAGES[(idx + 1) % IMAGES.length];
  initGame();
};

onMounted(() => {
  initGame();
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchend', endDrag);
});
</script>

<template>
  <div 
    class="puzzle-game-container"
    @mousemove="onDrag"
    @touchmove="onDrag"
  >
    <div class="header">
      <button class="btn-icon" @click="nextImage">
        <span class="btn-emoji">🖼️</span>
        <span class="btn-text">{{ currentLanguage === 'fr' ? 'Changer' : 'Change' }}</span>
      </button>
      <button class="btn-icon" @click="initGame">
        <span class="btn-emoji">🔄</span>
        <span class="btn-text">{{ currentLanguage === 'fr' ? 'Recommencer' : 'Restart' }}</span>
      </button>
    </div>

    <div class="puzzle-game-area">
      <!-- Board (Drop Zones) -->
      <div class="board-wrapper">
        <div class="board">
          <div 
            v-for="i in TOTAL_PIECES" 
            :key="i-1" 
            class="drop-slot"
          >
            <span class="slot-hint">{{ i }}</span>
          </div>
        </div>
        
        <!-- Success Overlay -->
        <div v-if="isComplete" class="success-overlay">
          <h1>🎉 Bravo! 🎉</h1>
          <button class="btn-primary" @click="nextImage">Next</button>
        </div>
      </div>

      <!-- Pieces -->
      <template v-for="piece in pieces" :key="piece.id">
        <div
          class="draggable-piece"
          :class="{ 'placed': piece.isPlaced }"
          :style="getPieceStyle(piece)"
          @mousedown="startDrag($event, piece)"
          @touchstart="startDrag($event, piece)"
        ></div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.puzzle-game-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 1000px;
  margin: 0 auto;
  overflow: hidden;
  user-select: none;
  touch-action: none;
}

.header {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 0.5rem;
}

.btn-icon {
  background: white;
  border: 3px solid #4CAF50;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 0 #2E7D32;
  transition: all 0.2s;
  color: #2E7D32;
  font-weight: bold;
}

.btn-icon:active {
  transform: translateY(4px);
  box-shadow: 0 0 0;
}

.btn-emoji {
  font-size: 1.5rem;
}

.btn-text {
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-primary {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  margin-top: 1rem;
  animation: pulse 1s infinite;
}

.puzzle-game-area {
  flex: 1;
  position: relative;
  background: #f0f4f8;
  border-radius: 20px;
  margin: 0 1rem 1rem;
  overflow: hidden;
  min-height: 60vh;
}

.board-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  z-index: 1;
}

.board {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  gap: 2px;
  background: #eee;
  border: 2px solid #ddd;
}

.drop-slot {
  background: rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
}

.slot-hint {
  font-size: 2rem;
  color: rgba(0,0,0,0.1);
  font-weight: bold;
}

.draggable-piece {
  width: 100px;
  height: 100px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  cursor: grab;
  border-radius: 4px;
  /* Important for touch dragging */
  touch-action: none; 
  /* Simple puzzle shape effect using clip-path (optional, remove if too complex) */
  /* This is a simplified visual trick, real puzzle shapes require unique SVGs per piece */
  /* clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%); */
}

/* Apply a "jigsaw" feel with mask or border-radius trick */
.draggable-piece, .drop-slot {
  border-radius: 15px; /* Rounded corners for friendlier look */
  box-shadow: inset 0 0 0 2px rgba(255,255,255,0.5), 0 4px 6px rgba(0,0,0,0.2);
}

.draggable-piece.placed {
  box-shadow: none;
  border-radius: 0;
  z-index: 5;
  cursor: default; /* Not grab */
  animation: popInPlace 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  filter: brightness(1.1);
}

@keyframes popInPlace {
  0% { transform: scale(1.2); filter: brightness(1.5); }
  100% { transform: scale(1); filter: brightness(1); }
}

.draggable-piece:active {
  cursor: grabbing;
  transform: scale(1.05);
  box-shadow: 0 15px 30px rgba(0,0,0,0.3);
  z-index: 100;
}

.success-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
  border-radius: 15px;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@media (max-width: 600px) {
  .board {
    grid-template-columns: repeat(3, 80px);
    grid-template-rows: repeat(3, 80px);
  }
  
  .drop-slot, .draggable-piece {
    width: 80px;
    height: 80px;
  }
}
</style>