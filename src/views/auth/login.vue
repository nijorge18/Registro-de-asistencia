<template>
  <BContainer class="bv-example-row">
    <form class="row flex-center flex" @submit.prevent="handleLogin">
    <div class="col-6 form-widget">
      <h1 class="header">Control de asistencia</h1>
      <p class="description">Ingresa con tus credenciales de la empresa</p>
      <div>
        <input class="inputField" required type="email" placeholder="Ingresa tu email" v-model="email" />
      </div>
      <div>
        <input class="inputField" required type="password" placeholder="Ingresa tu contraseña" v-model="password" />
      </div>
      <div>
        <input
          type="submit"
          class="button block"
          :value="loading ? 'Cargando' : 'iniciar sesión'"
          :disabled="loading"
        />
      </div>
    </div>
  </form>
  </BContainer>
  
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../../../utils/supabaseClient'
import { useRouter } from 'vue-router'
import { BContainer } from 'bootstrap-vue-next'
const router = useRouter()
const loading = ref(false)
const email = ref('')
const password = ref('')
const handleLogin = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value, password: password.value,
      
    })
    
    if (error) throw error
    router.push('/admin')
    alert('Inicio exitoso')
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  } finally {
    loading.value = false
  }
}
</script>
