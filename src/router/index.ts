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
    path: '/admin/crearUsuario',
    name: 'Admin - Gestionar Usuarios',
    component: () => import('../views/admin/components/crearUsuario.vue'),
  },
  
    {
    path: '/admin/eliminarUsuario',
    name: 'Admin - Eliminar Usuario',
    component: () => import('../views/admin/components/eliminarUsuario.vue'),
  },


    {
    path: '/admin/modificarUsuario',
    name: 'Admin - modificar Usuarios',
    component: () => import('../views/admin/components/modificarUsuario.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router