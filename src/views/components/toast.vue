<template>
  <div class="toast-container">
    <div 
      v-for="toast in toasts" 
      :key="toast.id"
      :class="['toast', `toast-${toast.type}`]"
      @click="removeToast(toast.id)"
    >
      <div class="toast-icon">
        <span v-if="toast.type === 'success'">✅</span>
        <span v-else-if="toast.type === 'error'">❌</span>
        <span v-else-if="toast.type === 'warning'">⚠️</span>
        <span v-else>ℹ️</span>
      </div>
      <div class="toast-content">
        <div class="toast-title">{{ toast.title }}</div>
        <div class="toast-message">{{ toast.message }}</div>
      </div>
      <button class="toast-close" @click.stop="removeToast(toast.id)">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

const toasts = ref<Toast[]>([]);
let toastId = 0;

const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = toastId++;
  const newToast: Toast = { id, ...toast };
  
  toasts.value.push(newToast);
  
  // Auto-remove después de 3 segundos
  setTimeout(() => {
    removeToast(id);
  }, 3000);
};

const removeToast = (id: number) => {
  const index = toasts.value.findIndex(toast => toast.id === id);
  if (index !== -1) {
    toasts.value.splice(index, 1);
  }
};

defineExpose({ addToast, removeToast });
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  animation: slideIn 0.3s ease-out;
  transition: transform 0.2s ease, opacity 0.2s ease;
  min-width: 300px;
}

.toast:hover {
  transform: translateX(-5px);
}

.toast-success {
  background: #28a745;
  color: white;
  border-left: 4px solid #1e7e34;
}

.toast-error {
  background: #dc3545;
  color: white;
  border-left: 4px solid #c82333;
}

.toast-warning {
  background: #ffc107;
  color: #212529;
  border-left: 4px solid #e0a800;
}

.toast-info {
  background: #17a2b8;
  color: white;
  border-left: 4px solid #138496;
}

.toast-icon {
  font-size: 1.2rem;
  margin-right: 12px;
  flex-shrink: 0;
}

.toast-content {
  flex-grow: 1;
}

.toast-title {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 2px;
}

.toast-message {
  font-size: 0.85rem;
  opacity: 0.9;
}

.toast-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
}

.toast-close:hover {
  opacity: 1;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .toast-container {
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .toast {
    min-width: auto;
  }
}
</style>