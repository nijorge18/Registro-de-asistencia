<template>
  <BButton variant="danger" @click="logout">Cerrar Sesión</BButton>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { AuthService } from '../../services/AuthService'

const router = useRouter()

const logout = async () => {
  try {
    await AuthService.signOut()
    router.push('/') // te devuelve al login
  } catch (err) {
    console.error(err)
    alert('No se pudo cerrar sesión')
  }
}
</script>