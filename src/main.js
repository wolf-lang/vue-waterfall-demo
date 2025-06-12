import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import('./mock/browser').then(async ({ worker }) => {
  await worker.start()
  createApp(App).mount('#app')
})
