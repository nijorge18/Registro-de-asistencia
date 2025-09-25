import { supabase } from '../../utils/supabaseClient';
import { type Database } from '../entities/supabase';

type Users = Database['public']['Tables']['Users']['Row'];
type UsersUpdate = Database['public']['Tables']['Users']['Update'];

export class UserService {
  public async getAll(): Promise<Users[]> {
    const { data, error } = await supabase.from('Users').select('*');
    if (error) throw new Error(`Error al obtener los usuarios: ${error.message}`);
    return data as Users[];
  }

  static async crearUsuario(
    userId: string,
    email: string,
    nombre: string,
    rol: string = 'Empleado' 
  ) {
    const { data, error } = await supabase
      .from('Users')
      .insert({
        id_usuario: userId,
        correo_usuario: email,
        nombre_usuario: nombre,
        rol_usuario: rol
      })
      .select()
      .single();

    if (error) throw new Error(`Error creando usuario en tabla: ${error.message}`);
    return data;
  }

  public async getById(id_usuario: string): Promise<Users | null> {
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('id_usuario', id_usuario)
      .single();

    if (error) throw new Error(`Error al obtener el usuario ${error.message}`);
    return data as Users;
  }

  public async update(user: UsersUpdate): Promise<Users> {
    const { data, error } = await supabase
      .from('Users')
      .update(user)
      .eq('id_usuario', user.id_usuario)
      .select()
      .single();

    if (error) throw new Error(`Error al actualizar usuario: ${error.message}`);
    return data as Users;
  }

  public async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('Users')
      .delete()
      .eq('id_usuario', id);

    if (error) throw new Error(`Error al eliminar el usuario: ${error.message}`);
    return true;
  }
}
