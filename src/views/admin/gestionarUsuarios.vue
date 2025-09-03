<template>
  <form @submit.prevent="createAuthUser">
    <input v-model="formData.email" placeholder="Email" required>
    <input v-model="formData.password" placeholder="Password" required>
    <input v-model="formData.nombre" placeholder="Nombre completo" required>
    <select v-model="formData.rol">
      <option value="Empleado">Empleado</option>
      <option value="Admin">Administrador</option>
    </select>
    <button type="submit">Crear Usuario</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AuthService } from '../../services/AuthService'

const formData = ref({
  email: '',
  password: '',
  nombre: '',
  rol: 'Empleado'
})

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