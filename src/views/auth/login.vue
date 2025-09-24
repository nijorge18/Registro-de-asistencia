<template>
  <div class="login-container d-flex">
    <!-- Toast Component -->
    <Toast ref="toastRef" />
    
    <!-- Sección izquierda -->
    <div class="login-left text-black d-flex flex-column justify-content-center p-5">
      <h1 class="fw-bold mb-3">Welcome Back</h1>
      <p class="mb-4">
        Es un hecho establecido que un lector se distraerá con el contenido legible
        de una página al mirar su diseño.
      </p>
      <div class="social-icons">
        <i class="bi bi-facebook me-3"></i>
        <i class="bi bi-twitter me-3"></i>
        <i class="bi bi-instagram me-3"></i>
        <i class="bi bi-youtube"></i>
      </div>
    </div>

    <!-- Sección derecha -->
    <div class="login-right d-flex justify-content-center align-items-center">
      <div class="login-form p-5 bg-dark bg-opacity-75 rounded shadow-lg">
        <div class="text-center mb-4 text-white">
          <h3 class="fw-bold">Sign in</h3>
        </div>

        <BForm @submit.prevent="handleLogin">
          <BFormGroup label="Email Address" label-for="emailInput" class="mb-3 text-white">
            <BFormInput
              id="emailInput"
              type="email"
              v-model="email"
              placeholder="Enter your email"
              required
            />
          </BFormGroup>

          <BFormGroup label="Password" label-for="passwordInput" class="mb-4 text-white">
            <BFormInput
              id="passwordInput"
              type="password"
              v-model="password"
              placeholder="Enter your password"
              required
            />
          </BFormGroup>

          <div class="d-grid">
            <BButton
              type="submit"
              variant="danger"
              size="lg"
              :disabled="loading"
            >
              {{ loading ? 'Cargando...' : 'Sign in now' }}
            </BButton>
          </div>
        </BForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../../../utils/supabaseClient'
import { useRouter } from 'vue-router'
import Toast from '../components/toast.vue'
import { useToast } from '../../composables/useToast' // Asegúrate de esta ruta

const router = useRouter()
const loading = ref(false)
const email = ref('')
const password = ref('')
const { toastRef, success, error } = useToast() // ✅ Correcto

const handleLogin = async () => {
  try {
    loading.value = true
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    
    if (authError) throw authError

    success('Inicio de sesión exitoso')
    
    // Pequeño delay para que se vea el toast antes de redirigir
    setTimeout(() => {
      router.push('/asistencia')
    }, 1000)
    
  } catch (err: any) {
    error(err.message || 'Error al iniciar sesión')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.login-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  background: url('https://negotiantis.com/wp-content/uploads/2021/07/rol-de-la-asistente-a-direccion.jpg')
    no-repeat center center;
  background-size: cover;
  color: #ffffff;
}

.login-left {
  flex: 1;
  font-weight: bold; 
}

.login-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  width: 100%;
  max-width: 400px;
}

.social-icons i {
  font-size: 1.5rem;
  cursor: pointer;
}
</style>