"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ModalContext = React.createContext({ onClose: () => {} });

export function Modal({
  isOpen,
  onClose,
  children,
  closeOnOutsideClick = true,
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <ModalContext.Provider value={{ onClose }}>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={closeOnOutsideClick ? onClose : undefined}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm -z-10"
              aria-hidden="true"
            />
            {children}
          </div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>,
    document.body
  );
}

export function ModalContent({ className, children, maxWidth = "max-w-lg", ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "relative w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 overflow-hidden my-auto max-h-[90vh] flex flex-col",
        maxWidth,
        className
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ModalHeader({ className, children, ...props }) {
  const { onClose } = React.useContext(ModalContext);

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80 shrink-0",
        className
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

export function ModalTitle({ className, children, ...props }) {
  return (
    <h2
      className={cn(
        "text-lg font-display font-semibold text-foreground tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function ModalDescription({ className, children, ...props }) {
  return (
    <p
      className={cn("text-xs text-slate-500 dark:text-slate-400 mt-1", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function ModalBody({ className, children, ...props }) {
  return (
    <div className={cn("py-4 overflow-y-auto flex-1 space-y-4", className)} {...props}>
      {children}
    </div>
  );
}

export function ModalFooter({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800/80 shrink-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ModalClose({ children, onClick, ...props }) {
  const { onClose } = React.useContext(ModalContext);
  return (
    <div
      onClick={(e) => {
        onClick?.(e);
        onClose?.();
      }}
      {...props}
    >
      {children}
    </div>
  );
}