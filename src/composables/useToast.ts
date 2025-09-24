import { ref } from 'vue';

export interface ToastOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export const useToast = () => {
  const toastRef = ref<any>(null);

  const showToast = (options: ToastOptions) => {
    if (toastRef.value) {
      toastRef.value.addToast(options);
    }
  };

  const success = (message: string, title: string = 'Éxito') => {
    showToast({ type: 'success', title, message });
  };

  const error = (message: string, title: string = 'Error') => {
    showToast({ type: 'error', title, message });
  };

  const warning = (message: string, title: string = 'Advertencia') => {
    showToast({ type: 'warning', title, message });
  };

  const info = (message: string, title: string = 'Información') => {
    showToast({ type: 'info', title, message });
  };

  return {
    toastRef,
    success,
    error,
    warning,
    info,
    showToast
  };
};