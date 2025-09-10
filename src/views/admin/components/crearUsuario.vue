<template>
  <div class="create-user-container d-flex justify-content-center align-items-center">
    <BCol cols="12" md="10" lg="8">
      <BCard class="create-user-card">
        <div class="text-center mb-4">
          <h3 class="fw-bold">Crear Usuario</h3>
          <p class="text-muted mb-0">Completa los datos para registrar un nuevo usuario</p>
        </div>

        <BForm @submit.prevent="createAuthUser">
          <BFormGroup label="Email" label-for="emailInput" class="mb-3">
            <BFormInput
              id="emailInput"
              type="email"
              v-model="formData.email"
              placeholder="Ingresa el email"
              required
            />
          </BFormGroup>

          <BFormGroup label="Contraseña" label-for="passwordInput" class="mb-3">
            <BFormInput
              id="passwordInput"
              type="password"
              v-model="formData.password"
              placeholder="Ingresa la contraseña"
              required
            />
          </BFormGroup>

          <BFormGroup label="Nombre completo" label-for="nombreInput" class="mb-3">
            <BFormInput
              id="nombreInput"
              v-model="formData.nombre"
              placeholder="Ingresa el nombre completo"
              required
            />
          </BFormGroup>

          <BFormGroup label="Rol" label-for="rolSelect" class="mb-4">
            <BFormSelect
              id="rolSelect"
              v-model="formData.rol"
              :options="roles"
            />
          </BFormGroup>

          <div class="d-grid">
            <BButton type="submit" variant="primary" size="lg">Crear Usuario</BButton>
          </div>
        </BForm>
      </BCard>
    </BCol>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AuthService } from '../../../services/AuthService'

const formData = ref({
  email: '',
  password: '',
  nombre: '',
  rol: 'Empleado'
})

const roles = [
  { value: 'Empleado', text: 'Empleado' },
  { value: 'Admin', text: 'Administrador' }
]

const createAuthUser = async () => {
  try {
    await AuthService.createAuthUser(
      formData.value.email,
      formData.value.password,
      {
        nombre: formData.value.nombre,
        rol: formData.value.rol
      }
    )
    alert('Usuario creado!')

    formData.value = {
      email: '',
      password: '',
      nombre: '',
      rol: 'Empleado'
    }
  } catch (error) {
    console.error(error)
    alert('Error al crear usuario')
  }
}
</script>

<style scoped>
.create-user-container {
  background: linear-gradient(135deg, #f5f7fa, #e4ebf5);
  min-height: 100vh;
  padding: 3rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-user-card {
  border-radius: 1rem;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  padding: 2.5rem 2rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.create-user-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.15);
}

h2 {
  font-size: 1.75rem;
  color: #1a202c;
}

p {
  font-size: 0.95rem;
  color: #718096;
}

.b-form-input,
.b-form-select {
  border-radius: 0.5rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid #cbd5e0;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.b-form-input:focus,
.b-form-select:focus {
  border-color: #3182ce;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
}

.b-button-primary {
  background-color: #3182ce;
  border-color: #3182ce;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.b-button-primary:hover {
  background-color: #2c5282;
  border-color: #2c5282;
}
</style>
