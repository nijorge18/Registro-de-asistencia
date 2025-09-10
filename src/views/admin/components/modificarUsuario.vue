<template>
  <div class="edit-user-container d-flex justify-content-center align-items-center">
    <BCol cols="12" md="10" lg="8">
      <BCard class="edit-user-card">
        <div class="text-center mb-4">
          <h3 class="fw-bold">Editar Usuario</h3>
          <p class="text-muted mb-0">Modifica los datos del usuario</p>
        </div>

        <BForm @submit.prevent="updateUser">
          <BFormGroup label="Nombre completo" label-for="nombreInput" class="mb-3">
            <BFormInput
              id="nombreInput"
              v-model="formData.nombre"
              placeholder="Ingresa el nombre completo"
              required
            />
          </BFormGroup>

          <BFormGroup label="Email" label-for="emailInput" class="mb-3">
            <BFormInput
              id="emailInput"
              type="email"
              v-model="formData.email"
              placeholder="Ingresa el email"
              required
            />
          </BFormGroup>

          <BFormGroup label="Rol" label-for="rolSelect" class="mb-4">
            <BFormSelect
              id="rolSelect"
              v-model="formData.rol"
              :options="roles.map(r => ({ value: r, text: r }))"
            />
          </BFormGroup>

          <div class="d-grid gap-2">
            <BButton type="submit" variant="warning" size="lg">Actualizar Usuario</BButton>
            <BButton type="button" variant="secondary" size="lg" @click="cancelEdit">Cancelar</BButton>
          </div>
        </BForm>
      </BCard>
    </BCol>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import { UserService } from '../../../services/UserService'
import type { Database } from '../../../entities/supabase'

type Users = Database['public']['Tables']['Users']['Row']
type UserRole = Database['public']['Enums']['rol']


const props = defineProps<{ user: Users | null }>()
const roles: UserRole[] = ['Empleado', 'Admin']


const emit = defineEmits<{
  (emitActu: 'updated'): void
  (emitCancela: 'cancel'): void
}>()

const formData = ref<{
  nombre: string
  email: string
  rol: UserRole
}>({
  nombre: '',
  email: '',
  rol: 'Empleado'
})


watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      formData.value.nombre = newUser.nombre_usuario || ''
      formData.value.email = newUser.correo_usuario || ''
      formData.value.rol = newUser.rol_usuario as UserRole
    }
  },
  { immediate: true }
)

const userService = new UserService()

const updateUser = async () => {
  if (!props.user) return
  try {
    await userService.update({
      id_usuario: props.user.id_usuario,
      nombre_usuario: formData.value.nombre,
      correo_usuario: formData.value.email,
      rol_usuario: formData.value.rol
    })
    alert('Usuario actualizado!')
    emit('updated')
  } catch (error: any) {
    console.error(error)
    alert('Error al actualizar usuario')
  }
}

const cancelEdit = () => {
  emit('cancel')
}
</script>

<style scoped>
.edit-user-container {
  background-color: #f0f2f5;
  min-height: 100vh;
  padding: 2rem;
}

.edit-user-card {
  border-radius: 1rem;
  padding: 2rem;
  background: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  max-width: 700px; 
  margin: 0 auto;
}
</style>
