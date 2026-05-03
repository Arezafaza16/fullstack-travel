import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let _counter = 0;

// Global setter — populated by ToastContainer
let _setToasts: React.Dispatch<React.SetStateAction<Toast[]>> | null = null;

export function registerToastSetter(setter: React.Dispatch<React.SetStateAction<Toast[]>>) {
  _setToasts = setter;
}

export function toast(message: string, type: ToastType = 'info') {
  if (!_setToasts) return;
  const id = ++_counter;
  _setToasts((prev) => [...prev, { id, message, type }]);
  setTimeout(() => {
    _setToasts?.((prev) => prev.filter((t) => t.id !== id));
  }, 4000);
}

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  registerToastSetter(setToasts);
  return toasts;
}
