
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
import { UserService } from '../../services/UserService';
import type { Database } from '../../entities/supabase';
import { supabase } from '../../../utils/supabaseClient';
import { onMounted, ref } from 'vue';
import reloj from './components/reloj.vue';





type Asistencia = Database['public']['Tables']['Asistencia']['Row']
type AsistenciaInsert = Database['public']['Tables']['Asistencia']['Insert']
type AsistenciaUpdate = Database['public']['Tables']['Asistencia']['Update']

const asistenciaService = new AsistenciaService();
const userId = ref<string | null>(null);


onMounted(async () => {
  const { data } = await supabase.auth.getUser();
  userId.value = data?.user?.id ?? null;
});
const marcarAsistencia = async () => {
  try {
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

  
    const { data: asistencia, error } = await supabase
      .from('Asistencia')
      .select('id')
      .eq('id_usuario', userId.value)
      .eq('fecha', fechaHoy)
      .single();

    if (error || !asistencia) {
      alert('No se encontró asistencia para hoy');
      return; 
    }


  
    const horaSalida = new Date().toISOString().split('T')[1].split('.')[0];

    const { error: updateError } = await supabase
      .from('Asistencia')
      .update({ hora_salida: horaSalida })
      .eq('id', asistencia.id);

    if (updateError) {
      alert('Error al marcar salida');
      return;
    }

    alert('Salida marcada correctamente');
  } catch (error) {
    console.error('Error al marcar salida:', error);
    alert('Error inesperado al marcar salida');
  }
};

</script>





<style >

body {
  margin: 0;
  padding: 0;
  background-color: #ff00bf; 

}
</style>




