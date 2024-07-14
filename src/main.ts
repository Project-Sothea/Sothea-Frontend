// import './assets/main.css'
import './index.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import axios from 'axios'

const app = createApp(App)

app.use(router)

app.mount('#app')

// export const BaseURL = 'http://192.168.0.100:9090' // Use in Prod!
export const BaseURL = 'http://localhost:9090' // Use in development!