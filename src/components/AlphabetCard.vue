<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  letter: string;
  word: string;
  image: string;
}>();

const isFlipping = ref(false);
const emit = defineEmits(['select']);

const handleSelect = () => {
  isFlipping.value = true;
  setTimeout(() => {
    isFlipping.value = false;
    emit('select');
  }, 500);
};
</script>

<template>
  <div 
    class="alphabet-card" 
    :class="{ 'flipping': isFlipping }"
    @click="handleSelect"
  >
    <div class="card-content">
      <div class="letter">{{ letter }}</div>
      <img :src="image" :alt="word" class="word-image">
      <div class="word">{{ word }}</div>
      
      <div class="confetti" aria-hidden="true">
        <span v-for="n in 12" :key="n" class="confetti-piece"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alphabet-card {
  background: var(--theme-card-background);
  border-radius: 24px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  border: 4px solid var(--theme-border-color);
  box-shadow: 0 8px 0 rgba(0,0,0,0.15);
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.alphabet-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 0 rgba(0,0,0,0.15);
}

.alphabet-card:active {
  transform: translateY(4px);
  box-shadow: 0 4px 0 rgba(0,0,0,0.15);
}

.letter {
  font-size: 4rem;
  font-weight: 900;
  color: var(--theme-text-color);
  text-shadow: 2px 2px 0px rgba(0,0,0,0.1);
  line-height: 1;
}

.word-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 4px 4px rgba(0,0,0,0.1));
}

.alphabet-card:hover .word-image {
  transform: scale(1.1) rotate(5deg);
}

.word {
  font-size: 1.8rem;
  color: var(--text-primary);
  text-transform: capitalize;
  font-weight: 800;
  margin-top: 0.5rem;
}

/* Confetti */
.confetti {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: 20px;
}

.confetti-piece {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--primary-color);
  opacity: 0;
}

.alphabet-card:hover .confetti-piece {
  animation: confetti 0.6s ease-out forwards;
}

/* Random positioning handled by nth-child */
.confetti-piece:nth-child(1) { top: 50%; left: 50%; --tx: -30px; --ty: -40px; --r: 45deg; background: #FFD700; }
.confetti-piece:nth-child(2) { top: 50%; left: 50%; --tx: 30px; --ty: -40px; --r: -45deg; background: #FF6B6B; }
.confetti-piece:nth-child(3) { top: 50%; left: 50%; --tx: -40px; --ty: 0px; --r: 90deg; background: #4ECDC4; }
.confetti-piece:nth-child(4) { top: 50%; left: 50%; --tx: 40px; --ty: 0px; --r: -90deg; background: #45B7D1; }
.confetti-piece:nth-child(5) { top: 50%; left: 50%; --tx: -30px; --ty: 40px; --r: 135deg; background: #96CEB4; }
.confetti-piece:nth-child(6) { top: 50%; left: 50%; --tx: 30px; --ty: 40px; --r: -135deg; background: #FFEEAD; }

@keyframes confetti {
  0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) rotate(var(--r)); opacity: 0; }
}

/* Flip Animation */
@keyframes flip {
  0% { transform: scale(1) rotateY(0); }
  50% { transform: scale(1.1) rotateY(180deg); }
  100% { transform: scale(1) rotateY(360deg); }
}

.flipping {
  animation: flip 0.6s cubic-bezier(0.455, 0.03, 0.515, 0.955);
  pointer-events: none; /* Prevent clicks during animation */
}

@media (max-width: 768px) {
  .alphabet-card {
    min-height: 200px;
    padding: 1rem;
  }
  .letter { font-size: 3rem; }
  .word-image { width: 70px; height: 70px; }
  .word { font-size: 1.5rem; }
}
</style>