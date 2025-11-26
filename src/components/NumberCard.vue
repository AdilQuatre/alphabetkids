<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  number: string;
  word: string;
  image: string;
  count: number;
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
    class="number-card" 
    :class="{ 'flipping': isFlipping }"
    @click="handleSelect"
  >
    <div class="card-content">
      <div class="number">{{ number }}</div>
      <div class="dots-container">
        <span v-for="n in count" :key="n" class="dot">●</span>
      </div>
      <div class="word">{{ word }}</div>
      <div class="sparkles" aria-hidden="true">
        <span v-for="n in 6" :key="n" class="sparkle"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.number-card {
  background: var(--theme-card-background);
  border-radius: 24px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  border: 4px solid var(--theme-border-color);
  box-shadow: 0 8px 0 rgba(0,0,0,0.15);
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.number-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 0 rgba(0,0,0,0.15);
}

.number-card:active {
  transform: translateY(4px);
  box-shadow: 0 4px 0 rgba(0,0,0,0.15);
}

.number {
  font-size: 5rem;
  font-weight: 900;
  color: var(--theme-text-color);
  text-shadow: 2px 2px 0px rgba(0,0,0,0.1);
  line-height: 1;
}

.dots-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  max-width: 120px;
  min-height: 40px;
}

.dot {
  color: var(--primary-color);
  font-size: 1.2rem;
}

.word {
  font-size: 1.5rem;
  color: var(--text-primary);
  text-transform: capitalize;
  font-weight: 800;
  margin-top: 0.5rem;
}

/* Sparkles */
.sparkles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: 20px;
}

.sparkle {
  position: absolute;
  width: 15px;
  height: 15px;
  background: radial-gradient(circle, gold 20%, transparent 70%);
  opacity: 0;
}

.number-card:hover .sparkle {
  animation: sparkle 1s ease-in-out infinite;
}

.sparkle:nth-child(1) { top: 20%; left: 20%; animation-delay: 0s; }
.sparkle:nth-child(2) { top: 20%; right: 20%; animation-delay: 0.2s; }
.sparkle:nth-child(3) { bottom: 20%; left: 20%; animation-delay: 0.4s; }
.sparkle:nth-child(4) { bottom: 20%; right: 20%; animation-delay: 0.6s; }

@keyframes sparkle {
  0% { transform: scale(0) rotate(0deg); opacity: 0; }
  50% { transform: scale(1) rotate(180deg); opacity: 1; }
  100% { transform: scale(0) rotate(360deg); opacity: 0; }
}

/* Flip Animation */
@keyframes flip {
  0% { transform: scale(1) rotateY(0); }
  50% { transform: scale(1.1) rotateY(180deg); }
  100% { transform: scale(1) rotateY(360deg); }
}

.flipping {
  animation: flip 0.6s cubic-bezier(0.455, 0.03, 0.515, 0.955);
  pointer-events: none;
}

@media (max-width: 768px) {
  .number-card {
    min-height: 200px;
  }
  .number { font-size: 4rem; }
  .word { font-size: 1.2rem; }
}
</style>
