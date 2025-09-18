<template>
  <div class="app-container">
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

    <!-- Contenido centrado -->
    <div class="content d-flex flex-column align-items-center">
      <reloj />
   <div class="d-flex justify-content-center mt-4 w-100">
  <BRow class="asistencia-status g-4 mb-3" style="max-width: 600px; width: 100%;">
    <BCol cols="6">
      <div class="status-card">
        <div class="status-label">Entrada</div>
        <div class="status-value" :class="{ marcada: !botonAsistencia }">
          {{ !botonAsistencia ? 'Marcada' : 'Pendiente' }}
        </div>
      </div>
    </BCol>
    <BCol cols="6">
      <div class="status-card">
        <div class="status-label">Salida</div>
        <div class="status-value" :class="{ marcada: botonAsistencia }">
          {{ botonAsistencia ? 'Pendiente' : 'Marcada' }}
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

const store = useStore();
const currentUser = ref<{ id_usuario: string; nombre_usuario: string; rol_usuario: string } | null>(null);
const asistenciaService = new AsistenciaService();
const botonAsistencia = ref(true); // true = marcar asistencia, false = marcar salida


const entradaMarcada = ref(false);
const salidaMarcada = ref(false);

onMounted(async () => {
  currentUser.value = await AuthService.getCurrentUser();
  await store.fetchUser();

  if (!currentUser.value) return;

  const fechaHoy = new Date().toISOString().split('T')[0];
  const asistenciaHoy = await asistenciaService.getAsisByUsuario(currentUser.value.id_usuario, fechaHoy);

  if (asistenciaHoy) {
    entradaMarcada.value = !!asistenciaHoy.hora_ingreso;
    salidaMarcada.value = !!asistenciaHoy.hora_salida;
    botonAsistencia.value = !salidaMarcada.value; // botón: marcar salida si no hay salida
  }
});

const handleAsistenciaSalida = async () => {
  if (!currentUser.value) return;

  const fechaHoy = new Date().toISOString().split('T')[0];

  try {
    if (botonAsistencia.value) {
      // Marcar asistencia
      const asistencia = await asistenciaService.marcarAsistencia(currentUser.value.id_usuario);
      console.log('Asistencia marcada:', asistencia);
      alert('Asistencia marcada correctamente');
      entradaMarcada.value = true;  // actualizamos estado
      botonAsistencia.value = false; // ahora el botón será marcar salida
    } else {
      // Marcar salida
      const asistencia = await asistenciaService.getAsisByUsuario(currentUser.value.id_usuario, fechaHoy);
      if (!asistencia) {
        alert('No se encontró asistencia para hoy');
        return;
      }

      if (asistencia.hora_salida) {
        alert('Ya has marcado tu salida para hoy');
        return;
      }

      await asistenciaService.marcarSalida(asistencia.id_asistencia);
      alert('Salida marcada correctamente');
      salidaMarcada.value = true; // actualizamos estado
      botonAsistencia.value = true; // listo para el próximo día
    }
  } catch (error: any) {
    console.error(error);
    alert(error.message || 'Error al registrar asistencia/salida');
  }
};
</script>

<style >
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  /* asegura 100% ancho */
  overflow-x: hidden;
  /* elimina scroll horizontal */
}

.app-container {
  min-height: 100vh;
  width: 100vw;
  /* ocupa todo el ancho de la pantalla */
  display: flex;
  flex-direction: column;
  background-color: #1c2430;
  /* color de fondo */
}

.content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* centra vertical */
  align-items: center;
  /* centra horizontal */
}


.navbar,
.navbar>.container,
.navbar>.container-fluid {
  max-width: 100% !important;
  width: 100% !important;
}

.navbar .container,
.navbar .container-fluid {
  max-width: 100% !important;
  width: 100% !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>
<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background-color: #1c2430;
  /* aplica el fondo global */
  overflow-x: hidden;
  /* elimina scroll horizontal */

}
.asistencia-status {
  width: 100%;
}

.status-card {
  background-color: #2a3345;
  color: #fff;
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0,0,0,0.3);
}

.status-label {
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
  opacity: 0.7;
}

.status-value {
  font-size: 1.1rem;
  font-weight: bold;
  color: #ffc107; /* pendiente */
}

.status-value.marcada {
  color: #28a745; /* marcada */
}
</style>
