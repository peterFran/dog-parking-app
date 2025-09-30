import React, { createContext, useContext, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { Button } from './button';

interface Toast {
  id: string;
  type: 'success' | 'error';
  title: string;
  description?: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useToast();

  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px]">
      <div className="flex items-start gap-3">
        {toast.type === 'success' ? (
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
        )}
        <div className="flex-1">
          <h4 className="font-medium text-sm">{toast.title}</h4>
          {toast.description && (
            <p className="text-sm text-muted-foreground mt-1">{toast.description}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => removeToast(toast.id)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}