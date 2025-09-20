<template>
  <b-card title="Reportes de Asistencia" class="h-100">
    <!-- Botones de filtros -->
    <div class="mb-3 d-flex gap-2">
      <b-button variant="primary" @click="cargarAtrasos">Atrasos</b-button>
      <b-button variant="warning" @click="cargarSalidasAdelantadas">Salidas Adelantadas</b-button>
      <b-button variant="danger" @click="cargarInasistencias">Inasistencias</b-button>
    </div>

    <!-- Lista de usuarios -->
    <b-list-group>
      <b-list-group-item
        v-for="usuario in resumenUsuarios"
        :key="usuario.id_usuario"
        class="d-flex justify-content-between align-items-center"
      >
        <div>
          {{ usuario.nombre_usuario }}
        </div>
        <b-button size="sm" @click="abrirModal(usuario)">Ver detalles</b-button>
      </b-list-group-item>
    </b-list-group>

    <!-- Modal con detalles -->
    <b-modal v-model="showModal" title="Detalle de asistencias" size="lg">
      <b-list-group>
        <b-list-group-item
          v-for="item in usuarioSeleccionado?.detalles || []"
          :key="String(item.id_asistencia ?? item.fecha)"
        >
          {{ formatDate(item.fecha) }} -
          Ingreso: {{ formatTime(item.hora_ingreso, item.fecha) || '-' }},
          Salida: {{ formatTime(item.hora_salida, item.fecha) || '-' }}
        </b-list-group-item>
      </b-list-group>
    </b-modal>
  </b-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type AsistenciaUsuario from '../../../entities/AsistenciaUsuario'
import AsistenciaService from '../../../services/AsistenciaService'
import { UserService } from '../../../services/UserService'

interface ResumenUsuario {
  id_usuario: string
  nombre_usuario: string
  detalles: AsistenciaUsuario[]
}

const asistencias = ref<AsistenciaUsuario[]>([])
const resumenUsuarios = ref<ResumenUsuario[]>([])

const showModal = ref(false)
const usuarioSeleccionado = ref<ResumenUsuario | null>(null)

const asistenciaService = new AsistenciaService()
const userService = new UserService()

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

// Convierte fecha a formato local
const formatDate = (fecha: string) => new Date(fecha).toLocaleDateString()

// Abrir modal
const abrirModal = (usuario: ResumenUsuario) => {
  usuarioSeleccionado.value = usuario
  showModal.value = true
}

// Agrupar asistencias por usuario
const agruparPorUsuario = (lista: AsistenciaUsuario[]): ResumenUsuario[] => {
  const mapa = new Map<string, ResumenUsuario>()
  lista.forEach(item => {
    const id = item.id_usuario || 'desconocido'
    if (!mapa.has(id)) {
      mapa.set(id, {
        id_usuario: id,
        nombre_usuario: item.usuario?.nombre_usuario || 'Sin usuario',
        detalles: []
      })
    }
    mapa.get(id)!.detalles.push(item)
  })
  return Array.from(mapa.values())
}

// =============================
// Helpers para inasistencias
// =============================

// Genera todas las fechas de un rango
function generarRangoFechas(inicio: string, fin: string): string[] {
  const fechas: string[] = []
  let actual = new Date(inicio)
  const ultima = new Date(fin)

  while (actual <= ultima) {
    fechas.push(actual.toISOString().split('T')[0])
    actual.setDate(actual.getDate() + 1)
  }
  return fechas
}

// =============================
// Acciones de carga
// =============================

// Cargar atrasos
const cargarAtrasos = async () => {
  asistencias.value = await asistenciaService.getAtrasos()
  resumenUsuarios.value = agruparPorUsuario(asistencias.value)
}

// Cargar salidas adelantadas
const cargarSalidasAdelantadas = async () => {
  asistencias.value = await asistenciaService.getSalidasAdelantadas()
  resumenUsuarios.value = agruparPorUsuario(asistencias.value)
}

// Cargar inasistencias hasta el día presente incluyendo usuarios sin asistencias
const cargarInasistencias = async () => {
  const hoy = new Date()
  const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)

  const rangoInicio = primerDiaMes.toISOString().split('T')[0]
  const rangoFin = hoy.toISOString().split('T')[0]

  // Traemos todas las asistencias reales
  const todas = await asistenciaService.getAll()

  // Traemos todos los usuarios
  const usuarios = await userService.getAll()

  const inasistencias: AsistenciaUsuario[] = []
  const inasistenciasSet = new Set<string>() // <-- evita duplicados

  usuarios.forEach(u => {
    // normalizamos fechas de asistencias solo a yyyy-mm-dd
    const fechasAsistidas = new Set(
      todas
        .filter(a => a.id_usuario === u.id_usuario)
        .map(a => a.fecha.split('T')[0])
    )

    generarRangoFechas(rangoInicio, rangoFin).forEach(fecha => {
      const key = `${u.id_usuario}-${fecha}`
      if (!fechasAsistidas.has(fecha) && !inasistenciasSet.has(key)) {
        inasistencias.push({
          id_asistencia: 0,
          fecha,
          hora_ingreso: null,
          hora_salida: null,
          id_usuario: u.id_usuario,
          usuario: { nombre_usuario: u.nombre_usuario }
        })
        inasistenciasSet.add(key)
      }
    })
  })

  asistencias.value = inasistencias
  resumenUsuarios.value = agruparPorUsuario(asistencias.value)
}
</script>

<style scoped>
b-card {
  min-height: 100vh; /* ocupa toda la pantalla */
}
</style>
