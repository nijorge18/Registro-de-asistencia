<template>
  <transition name="slide-fade">
    <div v-if="visible" :class="['toast-message', tipo]" >
      {{ mensaje }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

interface Props {
  mensaje: string;
  tipo?: 'success' | 'error' | 'info';
  duracion?: number;
}

const props = defineProps<Props>();
const visible = ref(false);

const tipo = props.tipo || 'info';
const duracion = props.duracion || 3000; // 3 segundos

onMounted(() => {
  visible.value = true;
  setTimeout(() => {
    visible.value = false;
  }, duracion);
});
</script>

<style scoped>
.toast-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 9999;
  min-width: 200px;
  text-align: center;
}

.toast-message.success {
  background-color: #28a745;
}

.toast-message.error {
  background-color: #dc3545;
}

.toast-message.info {
  background-color: #007bff;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
