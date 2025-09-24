<template>
  <BModal 
    v-model="showModalValue"
    title="Eliminar Usuario" 
    @ok="confirmDelete" 
    @hidden="handleClose"
    ok-variant="danger" 
    ok-title="Eliminar" 
    cancel-title="Cancelar"
  >
    <p>
      ¿Estás seguro de eliminar a {{ user?.nombre_usuario }}
    </p>
  </BModal>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import { BModal } from 'bootstrap-vue-next'
import { AuthService } from '../../../services/AuthService'
import { UserService } from '../../../services/UserService'
import type { Database } from '../../../entities/supabase'

type Users = Database['public']['Tables']['Users']['Row']

const props = defineProps<{
  user: Users | null
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'deleted'): void
  (e: 'close'): void
}>()

const showModalValue = ref(false)
const userService = new UserService()

// Sincronizar el prop show con el estado interno
watch(() => props.show, (newVal) => {
  showModalValue.value = newVal
})

watch(showModalValue, (newVal) => {
  if (!newVal) {
    emit('close')
  }
})

const confirmDelete = async () => {
  if (!props.user) return
  try {
    // 1. Eliminar primero de la tabla Users
    await userService.delete(props.user.id_usuario)
    
    // 2. Luego eliminar de Auth
    await AuthService.deleteAuthUser(props.user.id_usuario)
    
    emit('deleted')
    showModalValue.value = false
  } catch (error: any) {
    console.error(error)
    alert('Error al eliminar usuario: ' + error.message)
  }
}

const handleClose = () => {
  showModalValue.value = false
  emit('close')
}
</script>

<style scoped>

</style>