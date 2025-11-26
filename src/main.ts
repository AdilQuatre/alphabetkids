import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'

// Enregistrement du Service Worker avec Workbox
registerSW({
  onNeedRefresh() {
    // Une nouvelle version est disponible
  },
  onOfflineReady() {
    console.log('L\'application est prête pour le mode hors ligne');
  }
})

createApp(App).mount('#app')
