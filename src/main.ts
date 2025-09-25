import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


import { createPinia } from 'pinia'

import { createBootstrap } from 'bootstrap-vue-next/plugins/createBootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'


const app = createApp(App)
const pinia = createPinia()


app.use(pinia)
app.use(router)
app.use(createBootstrap())

app.mount('#app')