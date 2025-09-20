import { supabase } from '../../utils/supabaseClient'

export default class InasistenciaService {
  /**
   * Obtiene asistencias e inasistencias de todos los usuarios en un rango de fechas
   */
     async getInasistencias(rangoInicio: string, rangoFin: string) {
    // 1. Obtener usuarios
    const { data: users, error: userError } = await supabase
      .from('Users')
      .select('id_usuario, nombre_usuario')

    if (userError) throw userError

    // 2. Obtener asistencias reales en el rango
    const { data: asistencias, error: asisError } = await supabase
      .from('Asistencia')
      .select('id_usuario, fecha')
      .gte('fecha', rangoInicio)
      .lte('fecha', rangoFin)

    if (asisError) throw asisError

    // 3. Generar todas las fechas del rango
    const fechas: string[] = []
    let f = new Date(rangoInicio)
    const end = new Date(rangoFin)
    while (f <= end) {
      fechas.push(f.toISOString().split('T')[0])
      f.setDate(f.getDate() + 1)
    }

    // 4. Armar resultado (asistencia vs inasistencia)
    const resultado: {
      id_usuario: string
      nombre_usuario: string
      fecha: string
      estado: 'Asistencia' | 'Inasistencia'
    }[] = []

    for (const u of users ?? []) {
      for (const fecha of fechas) {
        const asistio = asistencias?.some(
          (a) => a.id_usuario === u.id_usuario && a.fecha === fecha
        )
        resultado.push({
          id_usuario: u.id_usuario,
          nombre_usuario: u.nombre_usuario,
          fecha,
          estado: asistio ? 'Asistencia' : 'Inasistencia',
        })
      }
    }

    return resultado
  }
}
