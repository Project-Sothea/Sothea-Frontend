// import './assets/main.css'
import '@/index.css'
import App from '@app/App.vue'
import router from '@app/router'
import { createApp } from 'vue'

const app = createApp(App)

app.use(router)

app.mount('#app')
