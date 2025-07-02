// import './assets/main.css'
import './index.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')

// export const BaseURL = 'http://192.168.0.100:9090' // Use in Prod! Primary Macbook
// export const BaseURL = 'http://192.168.0.101:9090' // Use in Prod! Secondary MiniPC
export const BaseURL = 'http://localhost:9090' // Use in development!
