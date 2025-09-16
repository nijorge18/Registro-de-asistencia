
import { defineStore } from 'pinia'
import { AuthService } from '../services/AuthService';

export const useStore = defineStore('storeUsers', {
  state: () => ({
    currentUser: null as null | { id_usuario: string; nombre_usuario: string; rol_usuario: string }
  }),
  actions: {
    async fetchUser() {
      this.currentUser = await AuthService.getCurrentUser()
    },
    logout() {
      this.currentUser = null
    }
  }
})
