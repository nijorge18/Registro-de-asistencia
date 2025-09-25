import { supabase } from '../../utils/supabaseClient';
import { UserService } from './UserService';
import { useStore } from '../store/storeUsers';

export class AuthService {
  static async createAuthUser(
    email: string,
    password: string,
    metadata: { nombre: string; rol: string }
  ) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true 
    });

    if (error) throw new Error(`Error creando usuario auth: ${error.message}`);
    if (!data.user) throw new Error('No se pudo crear el usuario');

    const user = await UserService.crearUsuario(
      data.user.id,
      email,
      metadata.nombre,
      metadata.rol 
    );

    return {
      authUser: data.user,
      user
    };
  }

  static async deleteAuthUser(userId: string) {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw new Error(`Error eliminando usuario auth: ${error.message}`);
  }

  static async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;

    const { data: userData, error: userError } = await supabase
      .from('Users')
      .select('id_usuario, nombre_usuario, rol_usuario')
      .eq('id_usuario', data.user.id)
      .single();

    if (userError) return null;
    return userData;
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(`Error cerrando sesión: ${error.message}`);
    return true;
  }

  static async initUserSession() {
    const store = useStore();
    const userData = await AuthService.getCurrentUser();
    if (userData) store.currentUser = userData;
    else store.logout();
  }
}
