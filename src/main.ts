import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// ✅ Importa Pinia correctamente
import { createPinia } from 'pinia'

// ✅ Bootstrap Vue Next
import { createBootstrap } from 'bootstrap-vue-next/plugins/createBootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

// ✅ Tus estilos personalizados


// 🔧 Crea la app y registra los plugins
const app = createApp(App)
const pinia = createPinia()


app.use(pinia)
app.use(router)
app.use(createBootstrap())

app.mount('#app')