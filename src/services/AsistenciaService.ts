import { supabase } from '../../utils/supabaseClient'
import { type Database } from '../entities/supabase'
import type AsistenciaUsuario from '../entities/AsistenciaUsuario'

type Asistencia = Database['public']['Tables']['Asistencia']['Row']
type AsistenciaInsert = Database['public']['Tables']['Asistencia']['Insert']
type AsistenciaUpdate = Database['public']['Tables']['Asistencia']['Update']
export default class AsistenciaService {

  public async getAll(): Promise<AsistenciaUsuario[]> {
    const { data, error } = await supabase
      .from('Asistencia')
      .select(`
        id_asistencia,
        fecha,
        hora_ingreso,
        hora_salida,
        id_usuario,
        usuario:Users(nombre_usuario)
      `)

    if (error) throw new Error(error.message)

    return (data || []).map((row: any) => ({
      id_asistencia: row.id_asistencia,
      fecha: row.fecha,
      hora_ingreso: row.hora_ingreso,
      hora_salida: row.hora_salida,
      id_usuario: row.id_usuario,
      usuario: row.usuario ? { nombre_usuario: row.usuario.nombre_usuario } : null
    }))
  }

  public async getAsisByUsuario(id_usuario: string, fecha: string): Promise<Asistencia | null> {
    const { data, error } = await supabase
      .from('Asistencia')
      .select('*')
      .eq('id_usuario', id_usuario)
      .eq('fecha', fecha)
      .maybeSingle()

    if (error) throw new Error(`Error al obtener asistencia del usuario: ${error.message}`)
    return data as Asistencia | null
  }

  public async create(asistencia: AsistenciaInsert): Promise<Asistencia> {
    const { data, error } = await supabase
      .from('Asistencia')
      .insert(asistencia)
      .select()
      .single()

    if (error) throw new Error(`Error al intentar registrar la asistencia: ${error.message}`)
    return data as Asistencia
  }

  public async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('Asistencia')
      .delete()
      .eq('id_asistencia', id)

    if (error) throw new Error(`Error al eliminar la asistencia: ${error.message}`)
    return true
  }

  public async marcarAsistencia(id_usuario: string): Promise<AsistenciaUsuario> {
    const fechaHoy = new Date().toISOString().split('T')[0]
    const yaHayAsistencia = await this.getAsisByUsuario(id_usuario, fechaHoy)
    if (yaHayAsistencia) throw new Error('Ya has marcado tu asistencia para hoy')

    const nuevaAsistencia: AsistenciaInsert = {
      id_usuario,
      fecha: fechaHoy,
      hora_ingreso: new Date().toISOString().split('T')[1].split('.')[0],
      hora_salida: null
    }

    const asistencia = await this.create(nuevaAsistencia)
    return {
      ...asistencia,
      usuario: null
    }
  }

  public async marcarSalida(id_asistencia: number) {
    const horaSalida = new Date().toISOString().split('T')[1].split('.')[0]
    const actualizarSalida: AsistenciaUpdate = { hora_salida: horaSalida }

    const { error } = await supabase
      .from('Asistencia')
      .update(actualizarSalida)
      .eq('id_asistencia', id_asistencia)

    if (error) throw error
    return true
  }


  private horaEnChile(fecha: string, hora: string | null): string | null {
    if (!hora) return null
    try {
      const dt = new Date(`${fecha}T${hora}Z`)
      return dt.toLocaleTimeString('en-GB', { timeZone: 'America/Santiago', hour12: false })
    } catch {
      return null
    }
  }


  public async getAtrasos(): Promise<AsistenciaUsuario[]> {
    const all = await this.getAll()
    return all.filter(a => {
      const hora = this.horaEnChile(a.fecha, a.hora_ingreso)
      return hora !== null && hora > '09:30:00'
    })
  }

  public async getSalidasAdelantadas(): Promise<AsistenciaUsuario[]> {
    const all = await this.getAll()
    return all.filter(a => {
      const hora = this.horaEnChile(a.fecha, a.hora_salida)
      return hora !== null && hora < '17:30:00'
    })
  }
}
