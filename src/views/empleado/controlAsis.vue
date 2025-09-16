<template>
  <BContainer fluid class="p-0" style="min-height: 100vh; background-color: #1c2430;">
    <!-- Navbar simple -->
    <BNavbar type="dark" variant="dark" class="px-3">
      <BNavbarBrand>
        Bienvenido {{ currentUser?.nombre_usuario || 'Usuario' }}
      </BNavbarBrand>
      <BNavbarNav class="ms-auto">
        <BButton v-if="currentUser?.rol_usuario === 'Admin'" variant="outline-light" @click="$router.push('/admin')">
          Panel Admin
        </BButton>
        <Logout class="ms-2"/>
      </BNavbarNav>
    </BNavbar>

    <!-- Reloj centrado -->
    <BCard class="mt-4 mx-auto" style="max-width: 400px; background: transparent; box-shadow: none; border: none;">
      <reloj />
    </BCard>

    <!-- Botón de asistencia / salida -->
    <div class="d-flex justify-content-center mt-5">
      <BButton
        :variant="botonAsistencia ? 'success' : 'danger'"
        @click="handleAsistenciaSalida"
        style="width: 200px; height: 60px; font-size: 1.2rem;"
      >
        {{ botonAsistencia ? 'Marcar Asistencia' : 'Marcar Salida' }}
      </BButton>
    </div>
  </BContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AsistenciaService from '../../services/AsistenciaService';
import { AuthService } from '../../services/AuthService';
import reloj from './components/reloj.vue';
import Logout from '../auth/logout.vue';


const currentUser = ref<{ id_usuario: string; nombre_usuario: string; rol_usuario: string } | null>(null);
const asistenciaService = new AsistenciaService();
const botonAsistencia = ref(true); // true = marcar asistencia, false = marcar salida

onMounted(async () => {
  currentUser.value = await AuthService.getCurrentUser();

  if (!currentUser.value) {
    console.log('No hay usuario logueado');
    return;
  }

  // Verificamos si ya existe asistencia para hoy
  const fechaHoy = new Date().toISOString().split('T')[0];
  const asistenciaHoy = await asistenciaService.getAsisByUsuario(currentUser.value.id_usuario, fechaHoy);

  if (asistenciaHoy && !asistenciaHoy.hora_salida) {
    botonAsistencia.value = false; // cambiar a marcar salida
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
      botonAsistencia.value = false;
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
      botonAsistencia.value = true; // listo para el próximo día
    }
  } catch (error: any) {
    console.error(error);
    alert(error.message || 'Error al registrar asistencia/salida');
  }
};
</script>

<style scoped>
body, html, #app {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
</style>

