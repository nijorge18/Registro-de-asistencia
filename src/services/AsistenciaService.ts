import { supabase } from '../../utils/supabaseClient'
import { type Database } from '../entities/supabase'


type Asistencia = Database['public']['Tables']['Asistencia']['Row']
type AsistenciaInsert = Database['public']['Tables']['Asistencia']['Insert']
type AsistenciaUpdate = Database['public']['Tables']['Asistencia']['Update']


export default class AsistenciaService {


    public async getAll(): Promise<Asistencia[]> {

        const { data, error } = await supabase
            .from('Asistencia')
            .select('*')
            
        if (error) throw new Error(`Error al obtener las asistencias: ${error.message}`)
        return data as Asistencia[]
    }

    public async getById(id_asistencia: string): Promise<Asistencia| null> {
        const { data, error } = await supabase
            .from('Asistencia')
            .select('*')
            .eq('id_asistencia', id_asistencia)
            .single()

        if (error) throw new Error(`Error al obtener la asistencia: ${error.message}`)
        return data as Asistencia
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

    public async update(asistencia: AsistenciaUpdate): Promise<Asistencia> {
        const { data, error } = await supabase
            .from('Asistencia')
            .update(asistencia)
            .eq('id_asistencia', asistencia.id_asistencia)
            .select()
            .single()

        if (error) throw new Error(`Error al actualizar la asistencia: ${error.message}`)
        return data as Asistencia
    }

    public async delete(id: string): Promise<Boolean> {
        const { error } = await supabase
            .from('Asistencia')
            .delete()
            .eq('id_asistencia', id)

        if (error) throw new Error(`Error al eliminar la asistencia: ${error.message}`)
        return true
    }
}
