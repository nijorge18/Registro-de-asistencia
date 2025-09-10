<template>
  <div class="auth-box d-flex align-items-center min-vh-100 bg-light">
    <BContainer class="mt-3" fluid="xxl">
      <BCard no-body class="rounded-4 shadow p-4">
        <!-- Título -->
        <BRow class="justify-content-center mb-4">
          <h2 class="text-center w-100">Panel de administración</h2>
        </BRow>

        <!-- Botones de acción -->
        <BRow class="justify-content-center mb-4 g-2">
          <BCol cols="4">
            <BButton
              variant="success"
              @click="showCreate = true"
              class="w-100"
            >
              Crear usuario
            </BButton>
          </BCol>
          <BCol cols="4">
            <BButton
              variant="warning"
              @click="showEdit = true"
              class="w-100"
              :disabled="!selectedUser"
            >
              Modificar usuario
            </BButton>
          </BCol>
          <BCol cols="4">
            <BButton
              variant="danger"
              class="w-100"
              :disabled="!selectedUser"
              @click="openDeleteModal"
            >
              Eliminar usuario
            </BButton>
          </BCol>
        </BRow>


        <BCard>
          <BListGroup>
            <BListGroupItem
              v-for="user in users"
              :key="user.id_usuario"
              :active="selectedUser?.id_usuario === user.id_usuario"
              @click="selectedUser = user"
              class="d-flex justify-content-between align-items-center"
            >
              <div>
                {{ user.nombre_usuario }} - {{ user.correo_usuario }}
                ({{ user.rol_usuario }})
              </div>
            </BListGroupItem>
          </BListGroup>
        </BCard>
      </BCard>

      <CreateUser
        v-if="showCreate"
        @created="refreshUsers"
        @close="showCreate = false"
      />
      <EditUser
        v-if="showEdit"
        :user="selectedUser"
        @updated="refreshUsers"
        @cancel="showEdit = false"
      />
      <DeleteUser
        ref="deleteUserModalRef"
        :user="selectedUser"
        modal-id="deleteUserModal"
        @deleted="refreshUsers"
      />
    </BContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { UserService } from '../../services/UserService'
import CreateUser from './components/crearUsuario.vue'
import EditUser from './components/modificarUsuario.vue'
import DeleteUser from './components/eliminarUsuario.vue'
import type { Database } from '../../entities/supabase'

type Users = Database['public']['Tables']['Users']['Row']


const users = ref<Users[]>([])
const selectedUser = ref<Users | null>(null)
const userService = new UserService()

const showCreate = ref(false)
const showEdit = ref(false)

const deleteUserModalRef = ref<InstanceType<typeof DeleteUser> | null>(null)
const openDeleteModal = () => {
  if (selectedUser.value) {
    deleteUserModalRef.value?.showModal()
  }
}

const refreshUsers = async () => {
  users.value = await userService.getAll()
  selectedUser.value = null
  showCreate.value = false
  showEdit.value = false
}
onMounted(refreshUsers)
</script>

<style scoped>
.auth-box {
  background-color: #f0f2f5;
  min-height: 100vh;
  padding: 2rem;
}
</style>
