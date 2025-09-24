<template>
  <BModal
    v-model:show="showModal"
    id="crear-usuario-modal"
    :no-header="true"
    :no-footer="true"
    centered
    size="md"
    @hide="closeModal"
  >
    <div class="d-flex justify-content-center align-items-center" style="height: 80px;">
      <Icon icon="streamline-sharp:profile-add-solid" :style="{ fontSize: '60px' }" class="text-primary"/>
    </div>

    <p class="my-3 fs-4 text-center fw-bold">Crear Usuario</p>

    <BForm @submit.prevent="createAuthUser">
      <BFormGroup label="Correo electrónico" label-for="emailInput" class="mb-3">
        <BFormInput
          id="emailInput"
          type="email"
          v-model="formData.email"
          placeholder="Ingresa el correo electrónico"
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
        <BFormSelect id="rolSelect" v-model="formData.rol" :options="roles" />
      </BFormGroup>

      <div class="d-flex gap-2 justify-content-center">
        <BButton type="submit" variant="primary">Crear</BButton>
        <BButton type="button" variant="light" @click="closeModal">Cancelar</BButton>
      </div>
    </BForm>
  </BModal>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps, watch } from 'vue'
import { AuthService } from '../../../services/AuthService'
import { useToast } from '../../../composables/useToast'

const emit = defineEmits<{
  (e: 'created'): void
  (e: 'close'): void
}>()
  
const props = defineProps<{ show: boolean }>()

const showModal = ref(false)

watch(() => props.show, (val) => {
  showModal.value = val
  if (val) resetForm()
})

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
      { nombre: formData.value.nombre, rol: formData.value.rol }
    )
    emit('created')
    closeModal()
  } catch (error) {
    console.error(error)
  }
}

const closeModal = () => {
  showModal.value = false
  emit('close')
}

const resetForm = () => {
  formData.value = { email: '', password: '', nombre: '', rol: 'Empleado' }
}
</script>

<style scoped>
.text-primary {
  color: #0d6efd;
}
</style>
