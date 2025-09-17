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
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
