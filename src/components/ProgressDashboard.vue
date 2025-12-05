<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getStats, loadProgress, type UserProgress } from '../services/progressService';
import { badges, getBadgeById } from '../data/badges';

const props = defineProps<{
  currentLanguage: string;
  childName: string;
}>();

const emit = defineEmits(['close']);

const progress = ref<UserProgress | null>(null);
const stats = ref<ReturnType<typeof getStats> | null>(null);

const translations = computed(() => {
  const isFr = props.currentLanguage === 'fr';
  const isAr = props.currentLanguage === 'ar';
  const isNl = props.currentLanguage === 'nl';
  
  return {
    title: isFr ? 'Ma Progression' : isAr ? 'تقدمي' : isNl ? 'Mijn Voortgang' : 'My Progress',
    stars: isFr ? 'Étoiles' : isAr ? 'نجوم' : isNl ? 'Sterren' : 'Stars',
    streak: isFr ? 'Jours de suite' : isAr ? 'أيام متتالية' : isNl ? 'Dagen op rij' : 'Day Streak',
    letters: isFr ? 'Lettres' : isAr ? 'حروف' : isNl ? 'Letters' : 'Letters',
    numbers: isFr ? 'Nombres' : isAr ? 'أرقام' : isNl ? 'Cijfers' : 'Numbers',
    mastered: isFr ? 'maîtrisées' : isAr ? 'متقنة' : isNl ? 'gemeesterd' : 'mastered',
    gamesPlayed: isFr ? 'Parties jouées' : isAr ? 'ألعاب لعبت' : isNl ? 'Spelletjes gespeeld' : 'Games Played',
    avgScore: isFr ? 'Score moyen' : isAr ? 'متوسط النتيجة' : isNl ? 'Gemiddelde score' : 'Average Score',
    badges: isFr ? 'Mes Badges' : isAr ? 'شاراتي' : isNl ? 'Mijn Badges' : 'My Badges',
    noBadges: isFr ? 'Continue à jouer pour débloquer des badges !' : isAr ? 'استمر في اللعب لفتح الشارات!' : isNl ? 'Blijf spelen om badges te ontgrendelen!' : 'Keep playing to unlock badges!',
    close: isFr ? 'Fermer' : isAr ? 'إغلاق' : isNl ? 'Sluiten' : 'Close'
  };
});

const unlockedBadges = computed(() => {
  if (!progress.value) return [];
  return progress.value.badges.map(id => getBadgeById(id)).filter(Boolean);
});

const lockedBadges = computed(() => {
  const unlocked = progress.value?.badges || [];
  return Object.values(badges).filter(b => !unlocked.includes(b.id));
});

onMounted(() => {
  progress.value = loadProgress();
  stats.value = getStats();
});
</script>

<template>
  <div class="progress-dashboard">
    <div class="dashboard-header">
      <h1>{{ translations.title }}</h1>
      <button class="close-btn" @click="emit('close')">✕</button>
    </div>
    
    <div class="greeting" v-if="childName">
      {{ currentLanguage === 'fr' ? `Bravo ${childName} !` : `Great job ${childName}!` }}
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid" v-if="stats">
      <div class="stat-card stars">
        <div class="stat-icon">⭐</div>
        <div class="stat-value">{{ stats.totalStars }}</div>
        <div class="stat-label">{{ translations.stars }}</div>
      </div>
      
      <div class="stat-card streak">
        <div class="stat-icon">🔥</div>
        <div class="stat-value">{{ stats.streak }}</div>
        <div class="stat-label">{{ translations.streak }}</div>
      </div>
      
      <div class="stat-card letters">
        <div class="stat-icon">🔤</div>
        <div class="stat-value">{{ stats.masteredLetters }}/26</div>
        <div class="stat-label">{{ translations.letters }} {{ translations.mastered }}</div>
        <div class="progress-bar-small">
          <div class="progress-fill" :style="{ width: `${stats.letterProgress}%` }"></div>
        </div>
      </div>
      
      <div class="stat-card numbers">
        <div class="stat-icon">🔢</div>
        <div class="stat-value">{{ stats.masteredNumbers }}/20</div>
        <div class="stat-label">{{ translations.numbers }} {{ translations.mastered }}</div>
        <div class="progress-bar-small">
          <div class="progress-fill" :style="{ width: `${stats.numberProgress}%` }"></div>
        </div>
      </div>
      
      <div class="stat-card games">
        <div class="stat-icon">🎮</div>
        <div class="stat-value">{{ stats.gamesPlayed }}</div>
        <div class="stat-label">{{ translations.gamesPlayed }}</div>
      </div>
      
      <div class="stat-card score">
        <div class="stat-icon">📊</div>
        <div class="stat-value">{{ stats.avgScore }}%</div>
        <div class="stat-label">{{ translations.avgScore }}</div>
      </div>
    </div>

    <!-- Badges Section -->
    <div class="badges-section">
      <h2>{{ translations.badges }}</h2>
      
      <div class="badges-grid" v-if="unlockedBadges.length > 0">
        <div 
          v-for="badge in unlockedBadges" 
          :key="badge?.id"
          class="badge-card unlocked"
          :style="{ '--badge-color': badge?.color }"
        >
          <div class="badge-icon">{{ badge?.icon }}</div>
          <div class="badge-name">{{ badge?.name[currentLanguage as keyof typeof badge.name] || badge?.name.en }}</div>
        </div>
      </div>
      
      <p v-else class="no-badges">{{ translations.noBadges }}</p>

      <!-- Locked Badges Preview -->
      <div class="locked-badges" v-if="lockedBadges.length > 0">
        <div 
          v-for="badge in lockedBadges.slice(0, 6)" 
          :key="badge.id"
          class="badge-card locked"
        >
          <div class="badge-icon">🔒</div>
          <div class="badge-name">???</div>
        </div>
      </div>
    </div>

    <button class="back-btn" @click="emit('close')">
      {{ translations.close }}
    </button>
  </div>
</template>

<style scoped>
.progress-dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0;
}

.close-btn {
  background: #f0f0f0;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e0e0e0;
  transform: scale(1.1);
}

.greeting {
  font-size: 1.5rem;
  color: #4CAF50;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card.stars { border-top: 4px solid #FFD700; }
.stat-card.streak { border-top: 4px solid #FF6B6B; }
.stat-card.letters { border-top: 4px solid #4ECDC4; }
.stat-card.numbers { border-top: 4px solid #9B59B6; }
.stat-card.games { border-top: 4px solid #3498DB; }
.stat-card.score { border-top: 4px solid #2ECC71; }

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 900;
  color: #2c3e50;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-top: 0.25rem;
}

.progress-bar-small {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-top: 0.5rem;
  overflow: hidden;
}

.progress-bar-small .progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  border-radius: 4px;
  transition: width 0.5s ease-out;
}

.badges-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.badges-section h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
}

.badges-grid, .locked-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.locked-badges {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px dashed #e0e0e0;
}

.badge-card {
  width: 100px;
  padding: 1rem;
  border-radius: 15px;
  text-align: center;
  transition: all 0.3s;
}

.badge-card.unlocked {
  background: linear-gradient(135deg, var(--badge-color), color-mix(in srgb, var(--badge-color) 70%, white));
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  animation: badgePop 0.5s ease-out;
}

.badge-card.unlocked:hover {
  transform: scale(1.1) rotate(5deg);
}

.badge-card.locked {
  background: #f0f0f0;
  opacity: 0.6;
}

@keyframes badgePop {
  0% { transform: scale(0); }
  70% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.badge-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.badge-name {
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
}

.badge-card.locked .badge-name {
  color: #999;
}

.no-badges {
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
  padding: 2rem;
}

.back-btn {
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background: #4CAF50;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 0 #2E7D32;
  transition: all 0.2s;
}

.back-btn:active {
  transform: translateY(4px);
  box-shadow: 0 0 0;
}

@media (max-width: 600px) {
  .progress-dashboard {
    padding: 1rem;
  }
  
  .dashboard-header h1 {
    font-size: 1.8rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-icon {
    font-size: 2rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .badge-card {
    width: 80px;
    padding: 0.8rem;
  }
  
  .badge-icon {
    font-size: 2rem;
  }
}
</style>

