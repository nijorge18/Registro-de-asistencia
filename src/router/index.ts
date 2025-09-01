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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router