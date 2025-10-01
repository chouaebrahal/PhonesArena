'use client';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
}

let toastTimeout: number;

export function showToast({ message, type = 'info', duration = 3000 }: ToastProps) {
  // Remove existing toast
  const existingToast = document.getElementById('toast');
  if (existingToast) {
    existingToast.remove();
  }
  clearTimeout(toastTimeout);

  // Create new toast
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg 
    ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'} 
    text-white transform transition-all duration-300 translate-y-0 opacity-100`;
  toast.textContent = message;

  document.body.appendChild(toast);

  // Animate out and remove
  toastTimeout = window.setTimeout(() => {
    toast.classList.add('translate-y-[-1rem]', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

export const toast = {
  success: (message: string) => showToast({ message, type: 'success' }),
  error: (message: string) => showToast({ message, type: 'error' }),
  info: (message: string) => showToast({ message, type: 'info' }),
};
