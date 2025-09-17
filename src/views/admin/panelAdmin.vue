<template>
  <div class="auth-box d-flex align-items-center min-vh-100 bg-light">
    <BContainer class="mt-3" fluid="xxl">
      <BCard no-body class="rounded-4 shadow p-4">
        <Logout/>

        <BRow class="justify-content-center mb-4">
          <h2 class="text-center w-100">Panel de administración</h2>
        </BRow>

        <BRow class="justify-content-center mb-4 g-2">
          <BCol cols="4">
            <BButton variant="success" class="w-100" @click="showCreateUserModal = true">
              Crear Usuario
            </BButton>
          </BCol>

          <BCol cols="4">
            <BButton variant="info" class="w-100" @click="toggleUserList">
              Lista de Usuarios
            </BButton>
          </BCol>

          <BCol cols="4">
            <BButton variant="warning" class="w-100" @click="toggleReports">
              Reportes
            </BButton>
          </BCol>
        </BRow>

        <!-- Lista de Usuarios (desplegable) -->
        <BCard v-if="showUserList" class="mb-3">
          <BListGroup>
            <BListGroupItem v-for="user in users" :key="user.id_usuario"
              class="d-flex justify-content-between align-items-center">
              <div>{{ user.nombre_usuario }} - {{ user.correo_usuario }} ({{ user.rol_usuario }})</div>
              <div class="d-flex gap-2">
                <BButton size="sm" variant="warning" @click="editUser(user)">Modificar</BButton>
                <BButton size="sm" variant="danger" @click="deleteUser(user)">Eliminar</BButton>
              </div>
            </BListGroupItem>
          </BListGroup>
        </BCard>

        <!-- Reportes -->
        <div v-if="showReports">
          <Reportes />
        </div>

        <!-- Modales flotantes -->
        <CrearUsuario :show="showCreateUserModal" @created="refreshUsers" @close="showCreateUserModal = false" />

        <ModificarUsuario :user="selectedUser" :show="showEditUserModal" @updated="refreshUsers"
          @close="closeEditModal"  />

      </BCard>
    </BContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { UserService } from '../../services/UserService'
import CrearUsuario from './components/crearUsuario.vue'
import ModificarUsuario from './components/modificarUsuario.vue'
import Reportes from './components/reporteAtraso.vue'
import type { Database } from '../../entities/supabase'
import Logout from '../auth/logout.vue'

type Users = Database['public']['Tables']['Users']['Row']

const users = ref<Users[]>([])
const selectedUser = ref<Users | null>(null)
const userService = new UserService()

const showCreateUserModal = ref(false)
const showEditUserModal = ref(false)
const showUserList = ref(false)
const showReports = ref(false)

const toggleUserList = () => {
  showUserList.value = !showUserList.value
  showReports.value = false
}

const toggleReports = () => {
  showReports.value = !showReports.value
  showUserList.value = false
}

const editUser = (user: Users) => {
  selectedUser.value = user
  showEditUserModal.value = true
}

const deleteUser = async (user: Users) => {
  if (!confirm(`¿Eliminar usuario ${user.nombre_usuario}?`)) return
  await userService.delete(user.id_usuario)
  refreshUsers()
}

const refreshUsers = async () => {
  users.value = await userService.getAll()
}

onMounted(refreshUsers)

const closeEditModal = () => {
  showEditUserModal.value = false
  selectedUser.value = null
}
</script>

<style scoped>
.auth-box {
  background-color: #f0f2f5;
  min-height: 100vh;
  padding: 2rem;
}
</style>
