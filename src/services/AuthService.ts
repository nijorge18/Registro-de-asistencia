import { supabase } from '../../utils/supabaseClient'
import { UserService } from './UserService';

export class AuthService {

  static async createAuthUser(
    email: string, 
    password: string, 
    metadata: { nombre: string; rol: string } = { nombre: '', rol: 'Empleado' }
  ) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })
    
    if (error) throw new Error(`Error creando usuario auth: ${error.message}`)

     const user = await UserService.crearUsuario(
      data.user.id,
      email,
        metadata.nombre
    )

    return {
      authUser: data.user,
      user: user
  }
}

  static async deleteAuthUser(userId: string) {
    const { error } = await supabase.auth.admin.deleteUser(userId)
    if (error) throw new Error(`Error eliminando usuario auth: ${error.message}`)
  }
}