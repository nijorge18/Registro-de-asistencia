<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useStore } from './store/storeUsers' // ajusta la ruta si es necesario

onMounted(async () => {
  await AuthService.initUserSession();
});

</script>

<style scoped>

</style>
