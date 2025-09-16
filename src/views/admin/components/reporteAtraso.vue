<template>
  <BCard title="Reportes de Asistencia">
    <div class="mb-3 d-flex gap-2">
      <BButton variant="primary" @click="cargarAtrasos">Atrasos</BButton>
      <BButton variant="warning" @click="cargarSalidasAdelantadas">Salidas Adelantadas</BButton>
      <BButton variant="danger" @click="cargarInasistencias">Inasistencias</BButton>
    </div>

    <BListGroup>
      <BListGroupItem
        v-for="asistencia in asistencias"
        :key="String(asistencia.id_asistencia ?? asistencia.id_usuario + asistencia.fecha)"
        class="d-flex justify-content-between align-items-center"
      >
        <div>
          {{ asistencia.usuario?.nombre_usuario || 'Sin usuario' }}
          - {{ formatDate(asistencia.fecha) }}
          (Ingreso: {{ formatTime(asistencia.hora_ingreso, asistencia.fecha) || '-' }},
           Salida: {{ formatTime(asistencia.hora_salida, asistencia.fecha) || '-' }})
        </div>
      </BListGroupItem>
    </BListGroup>
  </BCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type AsistenciaUsuario from '../../../entities/AsistenciaUsuario'
import AsistenciaService from '../../../services/AsistenciaService'

const asistencias = ref<AsistenciaUsuario[]>([])
const asistenciaService = new AsistenciaService()

// Convierte hora UTC a hora Chile
const formatTime = (hora: string | null, fecha: string): string | null => {
  if (!hora) return null
  try {
    const dt = new Date(`${fecha}T${hora}Z`)
    return dt.toLocaleTimeString('en-GB', { timeZone: 'America/Santiago', hour12: false })
  } catch {
    return hora
  }
}

const formatDate = (fecha: string) => new Date(fecha).toLocaleDateString()


const cargarAtrasos = async () => {
  asistencias.value = await asistenciaService.getAtrasos()
}

const cargarSalidasAdelantadas = async () => {
  asistencias.value = await asistenciaService.getSalidasAdelantadas()
}


const cargarInasistencias = async () => {
  asistencias.value = await asistenciaService.getInasistencias(5)
}

</script>

