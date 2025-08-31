import { createRouter, createWebHistory } from 'vue-router'

export const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/auth/login.vue'),
  },
  {
    path: '/asistencia',
    name: 'Asistencia',
    component: () => import('../views/asistencia/controlAsis.vue'),
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router