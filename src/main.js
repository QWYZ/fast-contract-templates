import './assets/main.css';
import 'pdfh5/css/pdfh5.css';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
