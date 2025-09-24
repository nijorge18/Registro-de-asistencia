<template>
  <BModal
    v-model="showModal"
    :no-header="true"
    :no-footer="true"
    centered
    size="md"
    @hidden="onHidden"
  >
    <div class="p-4">
      <h3 class="fw-bold text-center mb-2">Editar Usuario</h3>
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
            :options="roles"
          />
        </BFormGroup>

        <div class="d-flex gap-2 justify-content-end">
          <BButton type="submit" variant="warning">Actualizar</BButton>
          <BButton type="button" variant="secondary" @click="closeModal">Cancelar</BButton>
        </div>
      </BForm>
    </div>
  </BModal>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import { UserService } from '../../../services/UserService'
import type { Database } from '../../../entities/supabase'

type Users = Database['public']['Tables']['Users']['Row']
type UserRole = Database['public']['Enums']['rol']

const props = defineProps<{ user: Users | null; show: boolean }>()
const emit = defineEmits<{
  (e: 'updated'): void
  (e: 'close'): void
}>()

const showModal = ref(false)
const formData = ref({ nombre: '', email: '', rol: 'Empleado' as UserRole })
const roles: UserRole[] = ['Empleado', 'Admin']
const userService = new UserService()

watch(() => props.show, (val) => {
  showModal.value = val
  if (val && props.user) {
    formData.value = {
      nombre: props.user.nombre_usuario || '',
      email: props.user.correo_usuario || '',
      rol: props.user.rol_usuario as UserRole
    }
  }
})

const updateUser = async () => {
  if (!props.user) return
  try {
    await userService.update({
      id_usuario: props.user.id_usuario,
      nombre_usuario: formData.value.nombre,
      correo_usuario: formData.value.email,
      rol_usuario: formData.value.rol
    })
    emit('updated')
    closeModal()
  } catch (error: any) {
    console.error(error)
    alert('Error al actualizar usuario')
  }
}

const closeModal = () => {
  showModal.value = false
}

const onHidden = () => {
  emit('close')
}
</script>
