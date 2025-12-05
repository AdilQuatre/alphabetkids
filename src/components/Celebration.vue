<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  type: 'confetti' | 'stars' | 'badge';
  badgeIcon?: string;
  badgeName?: string;
  duration?: number;
}>();

const emit = defineEmits(['complete']);

const particles = ref<Array<{
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  delay: number;
}>>([]);

const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#9B59B6', '#3498DB', '#2ECC71', '#E74C3C', '#F39C12'];

const generateParticles = () => {
  const count = props.type === 'confetti' ? 100 : props.type === 'stars' ? 30 : 50;
  particles.value = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 10 + 5,
    rotation: Math.random() * 360,
    delay: Math.random() * 0.5
  }));
};

let timeout: number;

onMounted(() => {
  generateParticles();
  
  // Play celebration sound
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
  audio.volume = 0.4;
  audio.play().catch(() => {});
  
  timeout = window.setTimeout(() => {
    emit('complete');
  }, props.duration || 3000);
});

onUnmounted(() => {
  clearTimeout(timeout);
});
</script>

<template>
  <div class="celebration-overlay" @click="emit('complete')">
    <!-- Confetti particles -->
    <template v-if="type === 'confetti'">
      <div
        v-for="particle in particles"
        :key="particle.id"
        class="confetti-particle"
        :style="{
          left: `${particle.x}%`,
          '--color': particle.color,
          '--size': `${particle.size}px`,
          '--rotation': `${particle.rotation}deg`,
          '--delay': `${particle.delay}s`
        }"
      ></div>
    </template>
    
    <!-- Stars -->
    <template v-if="type === 'stars'">
      <div
        v-for="particle in particles"
        :key="particle.id"
        class="star-particle"
        :style="{
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          '--color': particle.color,
          '--size': `${particle.size * 2}px`,
          '--delay': `${particle.delay}s`
        }"
      >⭐</div>
    </template>
    
    <!-- Badge unlock -->
    <template v-if="type === 'badge'">
      <div class="badge-unlock">
        <div class="badge-glow"></div>
        <div class="badge-icon-large">{{ badgeIcon }}</div>
        <div class="badge-text">{{ badgeName }}</div>
        <div class="badge-subtitle">Badge débloqué !</div>
      </div>
      <div
        v-for="particle in particles"
        :key="particle.id"
        class="confetti-particle"
        :style="{
          left: `${particle.x}%`,
          '--color': particle.color,
          '--size': `${particle.size}px`,
          '--rotation': `${particle.rotation}deg`,
          '--delay': `${particle.delay}s`
        }"
      ></div>
    </template>
    
    <div class="tap-hint">
      Tap to continue
    </div>
  </div>
</template>

<style scoped>
.celebration-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.confetti-particle {
  position: absolute;
  top: -20px;
  width: var(--size);
  height: var(--size);
  background: var(--color);
  border-radius: 2px;
  animation: fall 3s ease-out var(--delay) forwards;
  transform: rotate(var(--rotation));
}

@keyframes fall {
  0% {
    top: -20px;
    opacity: 1;
    transform: rotate(0deg) translateX(0);
  }
  100% {
    top: 110%;
    opacity: 0;
    transform: rotate(720deg) translateX(calc(var(--rotation) - 180deg));
  }
}

.star-particle {
  position: absolute;
  font-size: var(--size);
  animation: starPop 1s ease-out var(--delay) forwards;
  opacity: 0;
  filter: drop-shadow(0 0 10px var(--color));
}

@keyframes starPop {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.5) rotate(180deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 0;
  }
}

.badge-unlock {
  position: relative;
  z-index: 10;
  text-align: center;
  animation: badgeAppear 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes badgeAppear {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.badge-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255,215,0,0.6) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.3; }
}

.badge-icon-large {
  font-size: 8rem;
  position: relative;
  z-index: 1;
  animation: bounce 1s ease-in-out infinite;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.badge-text {
  font-size: 2rem;
  font-weight: 900;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  margin-top: 1rem;
}

.badge-subtitle {
  font-size: 1.2rem;
  color: #FFD700;
  font-weight: bold;
  margin-top: 0.5rem;
  animation: fadeInUp 0.5s ease-out 0.3s forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tap-hint {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255,255,255,0.7);
  font-size: 1rem;
  animation: blink 2s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
</style>

