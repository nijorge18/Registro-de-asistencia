import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from '../store/storeUsers';

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
    meta: { requiresAuth: true },

  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/admin/panelAdmin.vue'),
    meta: { requiresAuth: true, role: 'Admin' },
  },
  {
    path: '/admin/crearUsuario',
    name: 'Admin - Gestionar Usuarios',
    component: () => import('../views/admin/components/crearUsuario.vue'),
    meta: { requiresAuth: true, role: 'Admin' },
  },
  {
    path: '/reporteAtrasos',
    name: 'Admin - Reporte de Atrasos',
    component: () => import('../views/admin/components/reporteAtraso.vue'),
    meta: { requiresAuth: true, role: 'Admin' },
  },
  {
    path: '/admin/modificarUsuario',
    name: 'Admin - modificar Usuarios',
    component: () => import('../views/admin/components/modificarUsuario.vue'),
    meta: { requiresAuth: true, role: 'Admin' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard global
router.beforeEach(async (to, _from, next) => {
  const store = useStore();

  // Solo intenta cargar el usuario si la ruta requiere autenticación
  if (to.meta.requiresAuth && !store.currentUser) {
    try {
      await store.fetchUser();
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
  }

  const isLoggedIn = !!store.currentUser;
  const userRole = store.currentUser?.rol_usuario;

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'Login' });
  }
  if (to.meta.role && userRole !== to.meta.role) {
    return next({ name: 'Asistencia' });
  }


  next();
});



export default router
