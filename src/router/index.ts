import { createRouter, createWebHistory } from 'vue-router'

 const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/auth/login.vue'),
  },
  {
    path: '/asistencia',
    name: 'Asistencia',
    component: () => import('../views/empleado/controlAsis.vue'),
  },

   {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/admin/panelAdmin.vue'),
  },
     {
    path: '/admin/gestionarUsuarios',
    name: 'Admin - Gestionar Usuarios',
    component: () => import('../views/admin/gestionarUsuarios.vue'),
  },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router