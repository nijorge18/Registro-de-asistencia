<template>
  <div class="admin-container">
    <Toast ref="toastRef" />
    

    <aside class="sidebar">
      <div class="sidebar-header">
        <h3 class="logo">Admin</h3>
      </div>
      <nav class="menu">
        <ul>
          <BButton variant="secondary" class="mb-4" @click="goBack">
            🔙 Volver a Asistencia
          </BButton>
        </ul>
      </nav>
    </aside>

    <div class="main-content">

      <header class="topbar">
        <div class="welcome"></div>
        <Logout />
      </header>


      <div class="dashboard">
        <h2 class="title">Administración</h2>

        <div class="cards-grid">
          <div class="card" @click="toggleUserList">
            <div class="icon">👥</div>
            <div class="label">Gestionar Usuarios</div>
          </div>

          <div class="card" @click="toggleReports">
            <div class="icon">📈</div>
            <div class="label">Reportes</div>
          </div>
        </div>

        <BCard v-if="showUserList" class="mt-4">
          <BButton variant="success" class="w-100 mb-3" @click="showCreateUserModal = true">
            ➕ Crear Usuario
          </BButton>

          <BListGroup>
            <BListGroupItem v-for="user in users" :key="user.id_usuario"
              class="d-flex justify-content-between align-items-center">
              <div>{{ user.nombre_usuario }} - {{ user.correo_usuario }} ({{ user.rol_usuario }})</div>
              <div class="d-flex gap-2">
                <BButton size="sm" variant="warning" @click="editUser(user)">Modificar</BButton>
                <BButton size="sm" variant="danger" @click="openDeleteModal(user)">Eliminar</BButton>
              </div>
            </BListGroupItem>
          </BListGroup>
        </BCard>

        <div v-if="showReports" class="mt-4">
          <Reportes />
        </div>
      </div>
    </div>

    
    <CrearUsuario :show="showCreateUserModal" @created="handleUserCreated" @close="showCreateUserModal = false" />
    <ModificarUsuario :user="selectedUser" :show="showEditUserModal" @updated="handleUserUpdated" @close="closeEditModal" />
    <EliminarUsuario 
      :user="userToDelete" 
      :show="showDeleteModal" 
      @deleted="handleUserDeleted"
      @close="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { UserService } from '../../services/UserService'
import CrearUsuario from './components/crearUsuario.vue'
import ModificarUsuario from './components/modificarUsuario.vue'
import EliminarUsuario from './components/eliminarUsuario.vue' 
import Reportes from './components/reporteAtraso.vue'
import type { Database } from '../../entities/supabase'
import Logout from '../auth/logout.vue'
import { useRouter } from 'vue-router'
import Toast from '../components/toast.vue'
import { useToast } from '../../composables/useToast'

type Users = Database['public']['Tables']['Users']['Row']

const { toastRef, success, error} = useToast()
const users = ref<Users[]>([])
const selectedUser = ref<Users | null>(null)
const userToDelete = ref<Users | null>(null) 
const userService = new UserService()
const router = useRouter()

const showCreateUserModal = ref(false)
const showEditUserModal = ref(false)
const showDeleteModal = ref(false) 
const showUserList = ref(false)
const showReports = ref(false)

const goBack = () => {
  router.push('/asistencia')
}

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


const openDeleteModal = (user: Users) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const handleUserDeleted = async () => {
  try {
    await refreshUsers()
    success('Usuario eliminado correctamente')
  } catch (err: any) {
    error('Error al refrescar la lista: ' + err.message)
  }
}

const refreshUsers = async () => {
  try {
    users.value = await userService.getAll()
  } catch (err: any) {
    error('Error al cargar usuarios: ' + err.message)
  }
}

const handleUserCreated = () => {
  refreshUsers()
  success('Usuario creado exitosamente')
}

const handleUserUpdated = () => {
  refreshUsers()
  success('Usuario actualizado correctamente')
}

onMounted(() => {
  refreshUsers()
})

const closeEditModal = () => {
  showEditUserModal.value = false
  selectedUser.value = null
}
</script>

<style scoped>
/* Asegurar que toda la app use 100% */
:global(html, body, #app) {
  height: 100%;
  width: 100%;
  margin: 0;
}

/* Admin Panel */
.admin-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #f4f6f9;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  overflow: hidden;
}

.sidebar {
  width: 220px;
  background: #1c2430;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
}

.sidebar-header {
  padding: 0 1.5rem;
  margin-bottom: 1.5rem;
}

.sidebar-header .logo {
  font-size: 1.3rem;
  font-weight: bold;
  color: #0d6efd;
}

.menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  /* empuja menú para que crezca */
}

.menu li {
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.menu li:hover,
.menu li.active {
  background: #0d6efd;
  color: #fff;
}

/* Main */
.main-content {
  flex: 1;
  /* que ocupe todo el espacio restante */
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  /* evita doble scroll */
}

/* Topbar */
.topbar {
  background: #fff;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  flex-shrink: 0;
}

.topbar .welcome {
  font-weight: 500;
  color: #2c3e50;
}


.dashboard {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;

}

.title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #34495e;
}


.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 2rem 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  /* Flexbox centering */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.card .icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.card .label {
  font-size: 1rem;
  font-weight: 500;
  color: #2c3e50;
}
</style>
