import { supabase } from '../../utils/supabaseClient'
import { type Database } from '../entities/supabase'


type Users = Database['public']['Tables']['Users']['Row']
type UsersInsert = Database['public']['Tables']['Users']['Insert']
type UsersUpdate = Database['public']['Tables']['Users']['Update']


export default class UserService {


    public async getAll(): Promise<Users[]> {

        const { data, error } = await supabase
            .from('Users')
            .select('*')

            
        if (error) throw new Error(`Error al obtener los usuarios: ${error.message}`)
        return data as Users[]
    }

    public async getById(id_usuario: string): Promise<Users| null> {
        const { data, error } = await supabase
            .from('Users')
            .select('*')
            .eq('id_usuario', id_usuario)
            .single()

        if (error) throw new Error(`Error al obtener el usuario ${error.message}`)
        return data as Users
    }

    public async create(User: UsersInsert): Promise<Users> {
        const { data, error } = await supabase
            .from('Users')
            .insert(User)
            .select()
            .single()

        if (error) throw new Error(`Error al intentar crear usuario: ${error.message}`)
        return data as Users

    }

    public async update(Users: UsersUpdate): Promise<Users> {
        const { data, error } = await supabase
            .from('Users')
            .update(Users)
            .eq('id_usuario', Users.id_usuario)
            .select()
            .single()

        if (error) throw new Error(`Error al intentar actualizar usuario: ${error.message}`)
        return data as Users
    }

    public async delete(id: string): Promise<Boolean> {
        const { error } = await supabase
            .from('Users')
            .delete()
            .eq('id_Users', id)

        if (error) throw new Error(`Error al elimina el usuario: ${error.message}`)
        return true
    }
}
