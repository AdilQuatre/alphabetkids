<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  currentLanguage: string;
  availableLanguages: Record<string, string>;
  selectedLanguages: string[];
    settings: {
    theme: string;
    voice: string;
    speed: number;
    avatar: string;
    childName: string;
  };
}>();

const emit = defineEmits<{
  (e: 'updateLanguages', languages: string[], defaultLang: string): void;
  (e: 'updateSettings', settings: any): void;
  (e: 'close'): void;
}>();

// Tabs state
const activeTab = ref<'general' | 'appearance' | 'sound'>('general');

// Language State
const selectedLangs = ref([...props.selectedLanguages]);
const defaultLanguage = ref(props.selectedLanguages[0]);

// Settings State
const selectedTheme = ref(props.settings.theme);
const selectedVoice = ref(props.settings.voice);
const selectedSpeed = ref(props.settings.speed);
const selectedAvatar = ref(props.settings.avatar);
const childName = ref(props.settings.childName || '');

// Constants
const themes = {
  default: '🎨 Default',
  space: '🚀 Space',
  jungle: '🌴 Jungle',
  ocean: '🌊 Ocean'
};

const voices = {
  default: 'Default',
  child: 'Child',
  robot: 'Robot',
  funny: 'Funny'
};

const avatars = [
  '👧', '👦', '🐱', '🐶', '🐼', '🦊', '🐸', '🦁', '🐯', '🦄',
  '🤖', '👾', '👽', '👻', '🧚', '🧜', '🧞', '🧟', '🧛', '🧙'
];

// Computed Translations
const translations = computed(() => {
  const isFr = props.currentLanguage === 'fr';
  return {
    title: isFr ? 'Paramètres' : 'Settings',
    tabs: {
      general: isFr ? 'Général' : 'General',
      appearance: isFr ? 'Apparence' : 'Appearance',
      sound: isFr ? 'Son' : 'Sound'
    },
    languages: {
      title: isFr ? 'Langues activées' : 'Active Languages',
      subtitle: isFr ? 'Choisissez jusqu\'à 3 langues' : 'Choose up to 3 languages',
      default: isFr ? 'Langue par défaut' : 'Default Language'
    },
    childName: {
      title: isFr ? 'Prénom de l\'enfant' : 'Child\'s Name',
      placeholder: isFr ? 'Entrez le prénom...' : 'Enter name...'
    },
    appearance: {
      theme: isFr ? 'Thème visuel' : 'Visual Theme',
      avatar: isFr ? 'Ton Avatar' : 'Your Avatar'
    },
    sound: {
      voice: isFr ? 'Type de voix' : 'Voice Type',
      speed: isFr ? 'Vitesse de lecture' : 'Reading Speed',
      speedLabels: isFr ? ['Lent', 'Normal', 'Rapide'] : ['Slow', 'Normal', 'Fast']
    },
    save: isFr ? 'Enregistrer et Quitter' : 'Save & Exit'
  };
});

// Actions
const handleLanguageToggle = (lang: string) => {
  const index = selectedLangs.value.indexOf(lang);
  if (index === -1 && selectedLangs.value.length < 3) {
    selectedLangs.value.push(lang);
    if (selectedLangs.value.length === 1) {
      defaultLanguage.value = lang;
    }
  } else if (index !== -1) {
    if (lang === defaultLanguage.value && selectedLangs.value.length > 1) {
      defaultLanguage.value = selectedLangs.value.find(l => l !== lang) || selectedLangs.value[0];
    }
    selectedLangs.value.splice(index, 1);
  }
};

const saveAll = () => {
  // Emit language updates
  emit('updateLanguages', selectedLangs.value, defaultLanguage.value);
  
  // Emit other settings updates
  emit('updateSettings', {
    theme: selectedTheme.value,
    voice: selectedVoice.value,
    speed: selectedSpeed.value,
    avatar: selectedAvatar.value,
    childName: childName.value
  });

  emit('close');
};
</script>

<template>
  <div class="settings-wrapper">
    <div class="settings-header">
      <h2>⚙️ {{ translations.title }}</h2>
      <div class="tabs">
        <button 
          v-for="tab in ['general', 'appearance', 'sound'] as const" 
          :key="tab"
          :class="['tab-btn', { active: activeTab === tab }]"
          @click="activeTab = tab"
        >
          {{ translations.tabs[tab] }}
        </button>
      </div>
    </div>

    <div class="settings-content">
      <!-- General / Languages Tab -->
      <div v-if="activeTab === 'general'" class="tab-content">
        <section class="setting-section">
          <h3>{{ translations.languages.title }}</h3>
          <p class="section-hint">{{ translations.languages.subtitle }}</p>
          <div class="options-grid">
            <button
              v-for="(name, lang) in availableLanguages"
              :key="lang"
              :class="['option-card', { selected: selectedLangs.includes(lang) }]"
              @click="handleLanguageToggle(lang)"
              :disabled="!selectedLangs.includes(lang) && selectedLangs.length >= 3"
            >
              <span class="check-icon" v-if="selectedLangs.includes(lang)">✓</span>
              {{ name }}
            </button>
          </div>
        </section>

        <section class="setting-section">
          <h3>{{ translations.childName.title }}</h3>
          <div class="input-group">
            <input 
              v-model="childName" 
              type="text" 
              :placeholder="translations.childName.placeholder"
              class="name-input"
            >
          </div>
        </section>

        <section class="setting-section">
          <h3>{{ translations.languages.default }}</h3>
          <div class="options-grid">
            <button
              v-for="lang in selectedLangs"
              :key="lang"
              :class="['option-card', { selected: defaultLanguage === lang }]"
              @click="defaultLanguage = lang"
            >
              <span class="radio-icon">{{ defaultLanguage === lang ? '●' : '○' }}</span>
              {{ availableLanguages[lang] }}
            </button>
          </div>
        </section>
      </div>

      <!-- Appearance Tab -->
      <div v-if="activeTab === 'appearance'" class="tab-content">
        <section class="setting-section">
          <h3>{{ translations.appearance.theme }}</h3>
          <div class="options-grid">
            <button
              v-for="(name, theme) in themes"
              :key="theme"
              :class="['option-card', { selected: selectedTheme === theme }]"
              @click="selectedTheme = theme"
            >
              {{ name }}
            </button>
          </div>
        </section>

        <section class="setting-section">
          <h3>{{ translations.appearance.avatar }}</h3>
          <div class="avatars-grid">
            <button
              v-for="avatar in avatars"
              :key="avatar"
              :class="['avatar-btn', { selected: selectedAvatar === avatar }]"
              @click="selectedAvatar = avatar"
            >
              {{ avatar }}
            </button>
          </div>
        </section>
      </div>

      <!-- Sound Tab -->
      <div v-if="activeTab === 'sound'" class="tab-content">
        <section class="setting-section">
          <h3>{{ translations.sound.voice }}</h3>
          <div class="options-grid">
            <button
              v-for="(name, voice) in voices"
              :key="voice"
              :class="['option-card', { selected: selectedVoice === voice }]"
              @click="selectedVoice = voice"
            >
              {{ name }}
            </button>
          </div>
        </section>

        <section class="setting-section">
          <h3>{{ translations.sound.speed }}</h3>
          <div class="speed-control">
            <div class="slider-container">
              <span>🐢</span>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                v-model="selectedSpeed"
                class="speed-slider"
              />
              <span>🐇</span>
            </div>
            <div class="speed-value">{{ selectedSpeed }}x</div>
          </div>
        </section>
      </div>
    </div>

    <div class="settings-footer">
      <button class="save-btn" @click="saveAll" :disabled="selectedLangs.length < 1">
        {{ translations.save }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.settings-wrapper {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 80vh;
}

.settings-header {
  background: #f8f9fa;
  padding: 1.5rem 2rem 0;
  border-bottom: 1px solid #eee;
}

.settings-header h2 {
  margin: 0 0 1.5rem;
  color: #2c3e50;
  font-size: 2rem;
  text-align: center;
}

.tabs {
  display: flex;
  gap: 1rem;
  padding-bottom: 0;
}

.tab-btn {
  padding: 1rem 2rem;
  background: transparent;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  color: #7f8c8d;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tab-btn.active {
  color: #4CAF50;
  border-bottom-color: #4CAF50;
  background: white;
  border-radius: 10px 10px 0 0;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: #fff;
}

.tab-content {
  animation: fadeIn 0.3s ease-out;
}

.setting-section {
  margin-bottom: 3rem;
}

.setting-section h3 {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-hint {
  color: #95a5a6;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.option-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid #eee;
  border-radius: 15px;
  background: white;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
  color: #2c3e50;
}

.option-card:hover:not(:disabled) {
  border-color: #4CAF50;
  background: #f0f9f0;
  transform: translateY(-2px);
}

.option-card.selected {
  border-color: #4CAF50;
  background: #4CAF50;
  color: white;
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.2);
}

.option-card:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.name-input {
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  border: 2px solid #eee;
  border-radius: 15px;
  outline: none;
  transition: border-color 0.3s;
}

.name-input:focus {
  border-color: #4CAF50;
}

.avatars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 1rem;
}

.avatar-btn {
  font-size: 2rem;
  padding: 0.5rem;
  border: 2px solid transparent;
  border-radius: 50%;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s;
}

.avatar-btn:hover {
  transform: scale(1.1);
  background: #e8f5e9;
}

.avatar-btn.selected {
  border-color: #4CAF50;
  background: #e8f5e9;
  transform: scale(1.1);
}

.speed-control {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 15px;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.5rem;
}

.speed-slider {
  flex: 1;
  height: 8px;
  -webkit-appearance: none;
  background: #ddd;
  border-radius: 4px;
  outline: none;
}

.speed-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  background: #4CAF50;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.speed-value {
  text-align: center;
  margin-top: 1rem;
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.2rem;
}

.settings-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #eee;
  background: #f8f9fa;
  text-align: center;
}

.save-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 1rem 3rem;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 600px) {
  .settings-wrapper {
    height: 100vh;
    border-radius: 0;
  }
  
  .tabs {
    overflow-x: auto;
  }
  
  .tab-btn {
    padding: 1rem;
    white-space: nowrap;
  }
}
</style>