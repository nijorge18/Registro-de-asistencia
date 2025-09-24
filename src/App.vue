<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useStore } from './store/storeUsers' 

onMounted(async () => {
  await AuthService.initUserSession();
});

</script>

<style scoped>

</style>
