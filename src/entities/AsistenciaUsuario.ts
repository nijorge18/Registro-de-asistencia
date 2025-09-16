export default interface AsistenciaUsuario {
  id_asistencia: number
  fecha: string
  hora_ingreso: string | null
  hora_salida: string | null
  id_usuario: string | null
  usuario?: { nombre_usuario: string } | null
}