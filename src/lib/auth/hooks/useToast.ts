'use client';

import { useState, useCallback, useEffect } from 'react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }>;
}

interface ToastState {
  toasts: Toast[];
}

let toastCount = 0;

export function useToast() {
  const [state, setState] = useState<ToastState>({ toasts: [] });

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastCount}`;
    const newToast: Toast = {
      id,
      duration: 5000, // Default 5 seconds
      ...toast,
    };

    setState(prev => ({
      toasts: [...prev.toasts, newToast]
    }));

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setState(prev => ({
      toasts: prev.toasts.filter(toast => toast.id !== id)
    }));
  }, []);

  const removeAllToasts = useCallback(() => {
    setState({ toasts: [] });
  }, []);

  // Convenience methods
  const success = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'success', title, message, ...options });
  }, [addToast]);

  const error = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'error', title, message, duration: 8000, ...options }); // Errors last longer
  }, [addToast]);

  const warning = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'warning', title, message, ...options });
  }, [addToast]);

  const info = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'info', title, message, ...options });
  }, [addToast]);

  return {
    toasts: state.toasts,
    addToast,
    removeToast,
    removeAllToasts,
    success,
    error,
    warning,
    info,
  };
}

// Global toast context for app-wide toasts
let globalToastHandler: ReturnType<typeof useToast> | null = null;

export function setGlobalToastHandler(handler: ReturnType<typeof useToast>) {
  globalToastHandler = handler;
}

export function toast(message: string, type: Toast['type'] = 'info') {
  if (globalToastHandler) {
    return globalToastHandler.addToast({ type, title: message });
  }
  console.warn('Global toast handler not set');
  return null;
}

toast.success = (message: string, description?: string) => {
  if (globalToastHandler) {
    return globalToastHandler.success(message, description);
  }
  console.warn('Global toast handler not set');
  return null;
};

toast.error = (message: string, description?: string) => {
  if (globalToastHandler) {
    return globalToastHandler.error(message, description);
  }
  console.warn('Global toast handler not set');
  return null;
};

toast.warning = (message: string, description?: string) => {
  if (globalToastHandler) {
    return globalToastHandler.warning(message, description);
  }
  console.warn('Global toast handler not set');
  return null;
};

toast.info = (message: string, description?: string) => {
  if (globalToastHandler) {
    return globalToastHandler.info(message, description);
  }
  console.warn('Global toast handler not set');
  return null;
};
