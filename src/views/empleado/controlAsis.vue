<template>
  <div class="app-container">
    <Toast ref="toastRef" />
    
    <BNavbar type="dark" variant="primary" fixed="top" container="fluid" class="m-0 p-2">
      <BNavbarBrand>
        Bienvenido
        <span v-if="!currentUser">Cargando<span class="dots">...</span></span>
        <span v-else>{{ currentUser.nombre_usuario }}</span>
      </BNavbarBrand>

      <div class="d-flex ms-auto align-items-center">
        <BButton v-if="currentUser?.rol_usuario === 'Admin'" variant="outline-light" class="me-2"
          @click="$router.push('/admin')">
          Panel Admin
        </BButton>
        <Logout />
      </div>
    </BNavbar>

    <div class="content d-flex flex-column align-items-center m-5">
      <reloj />

      <div class="d-flex justify-content-center mt-4 w-100">
        <BRow class="asistencia-status g-4 mb-3" style="max-width: 600px; width: 100%;">
          <BCol cols="6">
            <div class="status-card">
              <div class="status-label">Entrada</div>
              <div class="status-value" :class="{ marcada: !!entradaMarcada }">
                {{ entradaMarcada ? new Date('1970-01-01T' + entradaMarcada + 'Z').toLocaleTimeString('es-ES') : 'Pendiente' }}
              </div>
            </div>
          </BCol>
          <BCol cols="6">
            <div class="status-card">
              <div class="status-label">Salida</div>
              <div class="status-value" :class="{ marcada: !!salidaMarcada }">
                {{ salidaMarcada ? new Date('1970-01-01T' + salidaMarcada + 'Z').toLocaleTimeString('es-ES') : 'Pendiente' }}
              </div>
            </div>
          </BCol>
        </BRow>
      </div>

      <BButton class="mt-5 mb-5" :variant="botonAsistencia ? 'success' : 'danger'" @click="handleAsistenciaSalida"
        style="width: 200px; height: 60px; font-size: 1.2rem;">
        {{ botonAsistencia ? 'Marcar Asistencia' : 'Marcar Salida' }}
      </BButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AsistenciaService from '../../services/AsistenciaService';
import { AuthService } from '../../services/AuthService';
import reloj from './components/reloj.vue';
import Logout from '../auth/logout.vue';
import { useStore } from '../../store/storeUsers';
import Toast from '../components/toast.vue';
import { useToast } from '../../composables/useToast';

const store = useStore();
const { toastRef, success, error, warning, info } = useToast();
const currentUser = ref<{ id_usuario: string; nombre_usuario: string; rol_usuario: string } | null>(null);
const asistenciaService = new AsistenciaService();
const botonAsistencia = ref(true);

const entradaMarcada = ref<string | null>(null);
const salidaMarcada = ref<string | null>(null);

const updateAsistenciaStatus = async () => {
  if (!currentUser.value) return;

  const fechaHoy = new Date().toISOString().split('T')[0];
  const asistenciaHoy = await asistenciaService.getAsisByUsuario(currentUser.value.id_usuario, fechaHoy);

  if (asistenciaHoy) {
    entradaMarcada.value = asistenciaHoy.hora_ingreso || null;
    salidaMarcada.value = asistenciaHoy.hora_salida || null;

    if (entradaMarcada.value && !salidaMarcada.value) {
      botonAsistencia.value = false;
    } else {
      botonAsistencia.value = true;
    }
  } else {
    botonAsistencia.value = true;
  }
};

onMounted(async () => {
  currentUser.value = await AuthService.getCurrentUser();
  await store.fetchUser();
  await updateAsistenciaStatus();
});

const handleAsistenciaSalida = async () => {
  if (!currentUser.value) return;

  try {
    if (botonAsistencia.value) {
      const asistencia = await asistenciaService.marcarAsistencia(currentUser.value.id_usuario);
      entradaMarcada.value = asistencia.hora_ingreso;
      botonAsistencia.value = false;
      success('Entrada marcada correctamente');
    } else {
      const fechaHoy = new Date().toISOString().split('T')[0];
      const asistencia = await asistenciaService.getAsisByUsuario(currentUser.value.id_usuario, fechaHoy);

      if (!asistencia) {
        warning('No se encontró asistencia para hoy');
        return;
      }

      if (asistencia.hora_salida) {
        botonAsistencia.value = true;
        info('Ya has marcado tu salida para hoy');
        return;
      }

      await asistenciaService.marcarSalida(asistencia.id_asistencia);
      salidaMarcada.value = new Date().toISOString().split('T')[1].split('.')[0];
      botonAsistencia.value = true;
      success('Salida marcada correctamente');
    }
  } catch (err: any) {
    console.error(err);
    error(err.message || 'Error al registrar asistencia/salida');
  }
};
</script>

<style scoped>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background-color: #121821;
  font-family: 'Segoe UI', Roboto, sans-serif;
  color: #e0e6ed;
  overflow-x: hidden;
}

.navbar {
  background: linear-gradient(90deg, #0d6efd, #0b5ed7);
  box-shadow: 0 2px 10px rgba(0,0,0,0.4);
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.1rem;
  color: #fff !important;
}

.navbar .btn {
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

.content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 70px;
}

.asistencia-status {
  width: 100%;
  max-width: 600px;
}

.status-card {
  background: #1f2735;
  color: #fff;
  text-align: center;
  padding: 1.5rem;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}

.status-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.5);
}

.status-label {
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  letter-spacing: 0.5px;
  opacity: 0.75;
}

.status-value {
  font-size: 1.3rem;
  font-weight: bold;
  color: #ffc107;
  transition: color 0.3s ease;
}

.status-value.marcada {
  color: #28a745;
}

.action-btn {
  width: 220px;
  height: 65px;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.5);
}
</style>