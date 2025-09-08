
<template>
 <BContainer>
  <BCard class="mb-4" style="max-width: 400px; margin: auto; background: transparent; box-shadow: none; border: none;">
    <reloj/>
  </BCard>
    <div class="d-flex flex-column  align-items-center justify-content-between" style="height: 80vh;">
      <BRow>
        <BCol cols="6"  class="d-flex justify-content-center">
          <BButton @click="marcarAsistencia" variant="success">Marcar asistencia</BButton>
        </BCol>
        <BCol cols="6" class="d-flex justify-content-center">
          <BButton @click="marcarSalida" variant="danger">Marcar Salida</BButton>
        </BCol>
      
      </BRow>
    </div>
 </BContainer>
</template>


<script setup lang="ts">


import AsistenciaService from '../../services/AsistenciaService';
import type { Database } from '../../entities/supabase';
import { supabase } from '../../../utils/supabaseClient';
import { onMounted, ref } from 'vue';
import reloj from './components/reloj.vue';



type AsistenciaInsert = Database['public']['Tables']['Asistencia']['Insert']

const asistenciaService = new AsistenciaService();
const userId = ref<string | null>(null);


onMounted(async () => {
  const { data } = await supabase.auth.getUser();
  userId.value = data?.user?.id ?? null;
});



const marcarAsistencia = async () => {
  try {
    if (!userId.value) {
      alert('No se pudo obtener el ID del usuario');
      return;
    }
    const fechaHoy = new Date().toISOString().split('T')[0];
    const yaHayAsistencia = await asistenciaService.getAsisByUsuario(userId.value, fechaHoy);

    if (yaHayAsistencia) {
      alert('Ya has marcado tu asistencia para hoy');
      return;
    }

    const nuevaAsistencia: AsistenciaInsert = {
      id_usuario: userId.value!, 
      fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
      hora_ingreso: new Date().toISOString().split('T')[1].split('.')[0], // Hora actual en formato HH:MM:SS
      hora_salida: null,
    };
    const asistencia = await asistenciaService.create(nuevaAsistencia);
    console.log('Asistencia marcada:', asistencia);
    alert('Asistencia marcada correctamente');
  } catch (error) {
    console.error('Error al marcar asistencia:', error);
    alert('Error al marcar asistencia');
  }
};


const marcarSalida = async () => {
  try {
    if (!userId.value) {
      alert('No se pudo obtener el ID del usuario');
      return;
    }

    const fechaHoy = new Date().toISOString().split('T')[0];
    const asistencia = await asistenciaService.getAsisByUsuario(userId.value, fechaHoy);

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
  } catch (error: any) {
    console.error('Error al marcar salida:', error);
    alert(`Error al marcar salida: ${error.message || error}`);
  }
};

</script>


<style >

body {
  margin: 0;
  padding: 0;
  background-color: #1c2430; 

}
</style>




