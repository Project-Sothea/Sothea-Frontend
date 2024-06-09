// import './assets/main.css'
import './index.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import axios from 'axios'

const app = createApp(App)

app.use(router)

app.mount('#app')

axios.defaults.baseURL = 'http://localhost:9090'
