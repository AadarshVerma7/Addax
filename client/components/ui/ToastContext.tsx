"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
} from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastConfig = {
  success: {
    icon: CheckCircle2,
    color: "text-emerald-500",
  },
  error: {
    icon: XCircle,
    color: "text-red-500",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-500",
  },
  info: {
    icon: Info,
    color: "text-gray-300",
  },
};

export const ToastProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = crypto.randomUUID();

      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => {
            const config = toastConfig[toast.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{
                  opacity: 0,
                  x: 40,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  x: 40,
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.22,
                }}
                className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-[#111113] px-4 py-3 shadow-xl min-w-[320px] max-w-md"
              >
                <Icon
                  className={`h-5 w-5 flex-shrink-0 ${config.color}`}
                />

                <p className="flex-1 text-[15px] font-medium text-white">
                  {toast.message}
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};