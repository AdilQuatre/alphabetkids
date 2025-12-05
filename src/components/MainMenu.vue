<script setup lang="ts">
import type { Language } from '../data/content';

const props = defineProps<{
  currentLanguage: Language;
}>();

const emit = defineEmits(['selectType', 'openSettings']);

// URLs for 3D/Clay Icons (Microsoft Fluent 3D style)
const icons = {
  letters: '/images/mainmenualphabet.png',
  numbers: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Symbols/Input%20Numbers.png',
  writing: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Pencil.png',
  recreation: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Artist%20Palette.png',
  settings: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gear.png'
};

type MenuItem = {
  [key in Language]: { title: string; description: string };
} & { icon: string; color: string };

const menuItems: Record<string, MenuItem> = {
  letters: {
    en: { title: 'Letters', description: 'Learn ABCs' },
    fr: { title: 'Lettres', description: 'Apprendre l\'alphabet' },
    ar: { title: 'الحروف', description: 'تعلم الحروف' },
    nl: { title: 'Letters', description: 'Leer het alfabet' },
    icon: icons.letters,
    color: '#FF6B6B' // Red/Coral
  },
  numbers: {
    en: { title: 'Numbers', description: '1, 2, 3...' },
    fr: { title: 'Nombres', description: '1, 2, 3...' },
    ar: { title: 'الأرقام', description: '١، ٢، ٣...' },
    nl: { title: 'Getallen', description: '1, 2, 3...' },
    icon: icons.numbers,
    color: '#4ECDC4' // Teal
  },
  writing: {
    en: { title: 'Writing', description: 'Trace letters' },
    fr: { title: 'Écrire', description: 'Tracer les lettres' },
    ar: { title: 'كتابة', description: 'تتبع الحروف' },
    nl: { title: 'Schrijven', description: 'Letters overtrekken' },
    icon: icons.writing,
    color: '#9B59B6' // Purple
  },
  recreation: {
    en: { title: 'Play', description: 'Games & Fun' },
    fr: { title: 'Récréation', description: 'Jeux & Fun' },
    ar: { title: 'لعب', description: 'ألعاب ومرح' },
    nl: { title: 'Spelen', description: 'Spelletjes & Plezier' },
    icon: icons.recreation,
    color: '#FFD93D' // Yellow
  },
  settings: {
    en: { title: 'Parents', description: 'Settings' },
    fr: { title: 'Parents', description: 'Paramètres' },
    ar: { title: 'الأهل', description: 'الإعدادات' },
    nl: { title: 'Ouders', description: 'Instellingen' },
    icon: icons.settings,
    color: '#95A5A6' // Gray
  }
};
</script>

<template>
  <div class="main-menu">
    <div class="menu-background"></div>
    <div class="content-overlay">
      <h1 class="menu-title">
        {{ currentLanguage === 'fr' ? 'Bonjour ! 👋'
           : currentLanguage === 'ar' ? '👋 !مرحباً'
           : 'Hello! 👋' }}
      </h1>
      
      <div class="menu-grid">
      <button
        v-for="(item, key) in menuItems"
        :key="key"
        class="menu-item"
        :class="`item-${key}`"
        @click="key === 'settings' ? emit('openSettings') : 
               emit('selectType', key as 'letters' | 'numbers' | 'writing' | 'recreation')"
      >
        <div class="card-bg" :style="{ background: `linear-gradient(135deg, ${item.color}20, ${item.color}05)` }"></div>
        <div class="content-wrapper">
          <div class="icon-wrapper">
            <img :src="item.icon" alt="icon" width="80" height="80" class="clay-icon" />
          </div>
          <div class="text-wrapper">
            <h2>{{ item[props.currentLanguage].title }}</h2>
            <p>{{ item[props.currentLanguage].description }}</p>
          </div>
        </div>
        <div class="shine"></div>
      </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-menu {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  animation: fadeIn 0.5s ease-out;
  min-height: 100vh;
  position: relative;
}

.menu-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/images/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
  opacity: 0.4; /* Transparency to keep text readable */
  /* Alternative: use a white overlay instead of opacity if you want full opacity image but faded */
}

.main-menu::before {
  /* White overlay to improve contrast */
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6); /* White tint */
  z-index: -1;
  backdrop-filter: blur(5px); /* Optional: blurs the background slightly */
}

.content-overlay {
  position: relative;
  z-index: 1;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.menu-title {
  font-size: 3.5rem;
  color: #2c3e50;
  margin-bottom: 3rem;
  font-weight: 900;
  letter-spacing: -1px;
  text-shadow: 2px 2px 0px rgba(0,0,0,0.05);
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

/* Parents button spans 2 columns on large screens if possible */
@media (min-width: 1024px) {
  .item-settings {
    grid-column: span 2;
  }
}

.menu-item {
  position: relative;
  background: white; /* Fallback */
  border-radius: 32px;
  padding: 0; /* Inner padding handled by wrappers */
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 
    0 10px 30px -10px rgba(0,0,0,0.1),
    0 4px 10px -5px rgba(0,0,0,0.05);
  overflow: hidden;
  height: 100%;
  min-height: 180px;
  text-align: left;
  display: flex;
  align-items: stretch;
}

.card-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  width: 100%;
}

.icon-wrapper {
  background: white;
  border-radius: 24px;
  padding: 1rem;
  box-shadow: 
    0 8px 20px rgba(0,0,0,0.08),
    inset 0 0 0 1px rgba(0,0,0,0.02);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.menu-item:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 
    0 20px 40px -10px rgba(0,0,0,0.15),
    0 10px 20px -5px rgba(0,0,0,0.1);
}

.menu-item:hover .icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.menu-item:active {
  transform: scale(0.98);
}

.clay-icon {
  width: 70px;
  height: 70px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}

.text-wrapper {
  flex: 1;
}

.menu-item h2 {
  font-size: 2rem;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
  font-weight: 800;
  line-height: 1.1;
}

.menu-item p {
  color: #64748b;
  margin: 0;
  font-size: 1.15rem;
  font-weight: 500;
  line-height: 1.4;
}

.shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transition: 0.6s;
  z-index: 2;
  pointer-events: none;
}

.menu-item:hover .shine {
  left: 100%;
}

@media (max-width: 600px) {
  .menu-grid {
    grid-template-columns: 1fr;
  }
  
  .menu-title {
    font-size: 2.5rem;
  }
  
  .content-wrapper {
    padding: 1.5rem;
    gap: 1rem;
  }
  
  .icon-wrapper {
    width: 80px;
    height: 80px;
    padding: 0.8rem;
  }
  
  .clay-icon {
    width: 50px;
    height: 50px;
  }
  
  .menu-item h2 {
    font-size: 1.6rem;
  }
  
  .menu-item p {
    font-size: 1rem;
  }
}
</style>
