<script setup lang="ts">
import type { Language } from '../data/content';

const props = defineProps<{
  currentLanguage: Language;
}>();

const emit = defineEmits(['selectType', 'openSettings']);

// URLs for 3D/Clay Icons (Microsoft Fluent 3D style)
const icons = {
  letters: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Open%20Book.png',
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
        :style="{ '--card-color': item.color }"
        @click="key === 'settings' ? emit('openSettings') : 
               emit('selectType', key as 'letters' | 'numbers' | 'writing' | 'recreation')"
      >
        <div class="menu-icon">
          <img :src="item.icon" alt="icon" width="80" height="80" class="clay-icon" />
        </div>
        <h2>{{ item[props.currentLanguage].title }}</h2>
        <p>{{ item[props.currentLanguage].description }}</p>
        <div class="shine"></div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.main-menu {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.menu-title {
  font-size: 3rem;
  color: #2c3e50;
  margin-bottom: 3rem;
  font-weight: 800;
  text-shadow: 2px 2px 0px rgba(0,0,0,0.1);
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  padding: 1rem;
}

.menu-item {
  position: relative;
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  border: 4px solid var(--card-color);
  box-shadow: 0 10px 0 var(--card-color);
  overflow: hidden;
}

.menu-item:active {
  transform: translateY(10px);
  box-shadow: 0 0 0 var(--card-color);
}

.menu-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 0 var(--card-color);
}

.menu-icon {
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 8px 16px rgba(0,0,0,0.15));
  transition: transform 0.3s;
}

.clay-icon {
  width: 90px;
  height: 90px;
  object-fit: contain;
}

.menu-item:hover .menu-icon {
  transform: scale(1.2) rotate(5deg);
}

.menu-item h2 {
  font-size: 2.2rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 800;
}

.menu-item p {
  color: #7f8c8d;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 500;
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
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: 0.5s;
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
  
  .menu-item {
    padding: 2rem;
  }
}
</style>
