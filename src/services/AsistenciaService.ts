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

    public async getAsisByUsuario(id_usuario: string, fecha: string): Promise<Asistencia | null> {
        const { data, error } = await supabase
            .from('Asistencia')
            .select('*')
            .eq('id_usuario', id_usuario)
            .eq('fecha', fecha)
            .maybeSingle();

        if (error) throw new Error(`Error al obtener asistencia del usuario: ${error.message}`);
        return data as Asistencia;
    }

    async marcarSalida(id_asistencia: number) {
        const horaSalida = new Date().toISOString().split('T')[1].split('.')[0];

        const actualizarSalida: AsistenciaUpdate = { hora_salida: horaSalida }; 

        const { error } = await supabase
            .from('Asistencia')
            .update(actualizarSalida)
            .eq('id_asistencia', id_asistencia);

        if (error) throw error;
        return true;
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


    public async delete(id: string): Promise<Boolean> {
        const { error } = await supabase
            .from('Asistencia')
            .delete()
            .eq('id_asistencia', id)

        if (error) throw new Error(`Error al eliminar la asistencia: ${error.message}`)
        return true
    }
}
