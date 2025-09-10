<template>
  <BModal ref="modal" :id="modalId" title="Eliminar Usuario" @ok="confirmDelete">
    <p>
      ¿Estás seguro de eliminar al usuario 
      <strong>{{ user?.nombre_usuario }}</strong>?
    </p>
  </BModal>
</template>

<script setup lang="ts">
import { ref, defineProps, defineExpose } from 'vue'
import { AuthService } from '../../../services/AuthService'
import { UserService } from '../../../services/UserService'
import type { Database } from '../../../entities/supabase'

type Users = Database['public']['Tables']['Users']['Row']

const props = defineProps<{
  user: Users | null
  modalId: string
}>()

const emit = defineEmits<{
  (emitElimina: 'deleted'): void
  (emitCierra: 'close'): void
}>()

const modal = ref<any>(null)

const userService = new UserService()

const confirmDelete = async () => {
  if (!props.user) return
  try {
    await AuthService.deleteAuthUser(props.user.id_usuario)
    await userService.delete(props.user.id_usuario)
    alert('Usuario eliminado!')
    emit('deleted')
  } catch (error: any) {
    console.error(error)
    alert('Error al eliminar usuario')
  }
}

function showModal() {
  modal.value?.show()
}

defineExpose({ showModal })
</script>

<style scoped>
.b-modal {
  border-radius: 0.8rem;
  padding: 1.5rem;
}

.b-modal .modal-title {
  font-weight: 600;
  font-size: 1.25rem;
  color: #e53e3e; /* Rojo suave para alerta */
}

.b-modal p {
  font-size: 1rem;
  color: #4a5568;
}

.b-modal .btn-danger {
  background-color: #e53e3e;
  border-color: #e53e3e;
  font-weight: 600;
}

.b-modal .btn-danger:hover {
  background-color: #c53030;
  border-color: #c53030;
}
</style>
