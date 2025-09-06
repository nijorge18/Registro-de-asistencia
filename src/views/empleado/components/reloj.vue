<template>
  <div class="reloj-container">
    <div class="reloj-display">
      <span class="hora">{{ horaActual }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

const horaActual = ref<string>('')

const actualizarHora = () => {
  const ahora = new Date()
  horaActual.value = ahora.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

let intervalo: ReturnType<typeof setInterval>

onMounted(() => {
  actualizarHora()
  intervalo = setInterval(actualizarHora, 1000)
})

onUnmounted(() => {
  clearInterval(intervalo)
})
</script>

<style scoped>
.reloj-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 2rem;
  background-color: #000;
  border-radius: 16px;
  box-shadow: 0 0 20px #00ff00;
  max-width: 300px;
  margin: auto;
}

.reloj-display {
  background-color: #000;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  border: 2px solid #00ff00;
  box-shadow: inset 0 0 10px #00ff00;
}

.hora {
  font-family: 'Courier New', monospace;
  font-size: 2.5rem;
  color: #00ff00;
  letter-spacing: 2px;
  text-shadow: 0 0 5px #00ff00;
  animation: parpadeo 1s infinite;
}

@keyframes parpadeo {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>