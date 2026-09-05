import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import './assets/styles/main.css'
import router from './router'
import { InitializationService } from './services/InitializationService'

InitializationService.initialize()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')