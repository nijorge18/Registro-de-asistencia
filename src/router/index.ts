import { createRouter, createWebHistory } from 'vue-router'
import { AuthService } from '../services/AuthService';

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
    meta: { role: 'Admin' },
  },
  {
    path: '/admin/crearUsuario',
    name: 'Admin - Gestionar Usuarios',
    component: () => import('../views/admin/components/crearUsuario.vue'),
    meta: { role: 'Admin' },
  },
  {
    path: '/reporteAtrasos',
    name: 'Admin - Reporte de Atrasos',
    component: () => import('../views/admin/components/reporteAtraso.vue'),
    meta: { role: 'Admin' },
  },
  {
    path: '/admin/modificarUsuario',
    name: 'Admin - modificar Usuarios',
    component: () => import('../views/admin/components/modificarUsuario.vue'),
    meta: { role: 'Admin' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard global
router.beforeEach(async (to, _from, next) => {
  // Solo proteger rutas con meta.role
  if (to.meta.role) {
    const user = await AuthService.getCurrentUser()

    if (!user) {
      return next('/') // si no está logeado, al login
    }

    if (user.rol_usuario !== to.meta.role) {
      return next('/asistencia') // si no tiene permiso, al panel empleado
    }
  }

  next()
})

export default router
