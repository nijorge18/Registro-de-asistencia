<template>
  
    <BCol cols="12" md="6" lg="4">
      <BCard class="login-card shadow-lg">
        <div class="text-center mb-4">
          <h3 class="fw-bold">Control de asistencia</h3>
          <p class="text-muted mb-0">Ingresa con tus credenciales de la empresa</p>
        </div>

        <BForm @submit.prevent="handleLogin">
          <BFormGroup label="Email" label-for="emailInput" class="mb-3">
            <BFormInput
              id="emailInput"
              type="email"
              v-model="email"
              placeholder="Ingresa tu email"
              required
            />
          </BFormGroup>

          <BFormGroup label="Contraseña" label-for="passwordInput" class="mb-4">
            <BFormInput
              id="passwordInput"
              type="password"
              v-model="password"
              placeholder="Ingresa tu contraseña"
              required
            />
          </BFormGroup>

          <div class="d-grid">
            <BButton
              type="submit"
              variant="primary"
              size="lg"
              :disabled="loading"
            >
              {{ loading ? 'Cargando...' : 'Iniciar sesión' }}
            </BButton>
          </div>
        </BForm>
      </BCard>
    </BCol>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../../../utils/supabaseClient'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if (error) throw error

    alert('Inicio exitoso')
    router.push('/admin')
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>

.login-card {
  border-radius: 1rem;
  padding: 2rem;
  min-width: 380px;
  max-width: 500px;
}
body {
  margin: 0;
  padding: 0;
  background-color: #1c2430; 

}

</style>


