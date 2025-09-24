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
  const horas = String(ahora.getHours()).padStart(2, '0')
  const minutos = String(ahora.getMinutes()).padStart(2, '0')
  const segundos = String(ahora.getSeconds()).padStart(2, '0')
  horaActual.value = `${horas}:${minutos}:${segundos}`
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
  height: auto;
  padding: 1.5rem;
  background: linear-gradient(145deg, #0d1117, #161b22);
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.6);
  max-width: 350px;
  margin: auto;
}

.reloj-display {
  background: #0a0f14;
  padding: 1.5rem 2.5rem;
  border-radius: 16px;
  border: 2px solid #00ff9d;
  box-shadow: inset 0 0 20px #00ff9d, 0 0 10px #00ff9d;
}

.hora {
  font-family: 'Courier New', monospace;
  font-size: 2.8rem;
  font-weight: bold;
  color: #00ff9d;
  letter-spacing: 3px;
  text-shadow: 0 0 10px #00ff9d, 0 0 20px #00ff9d;
  animation: brillo 1.5s infinite alternate;
}

@keyframes brillo {
  from { text-shadow: 0 0 5px #00ff9d, 0 0 10px #00ff9d; }
  to { text-shadow: 0 0 15px #00ff9d, 0 0 30px #00ff9d; }
}
</style>

