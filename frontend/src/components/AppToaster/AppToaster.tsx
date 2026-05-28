import { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

type ToastSeverity = "success" | "error" | "info" | "warning";

interface ToastPayload {
  id?: string;
  message: string;
  severity: ToastSeverity;
}

interface ToastOptions {
  id?: string;
}

type ToastListener = (payload: ToastPayload) => void;

const listeners = new Set<ToastListener>();

function emit(severity: ToastSeverity, message: string, options?: ToastOptions) {
  listeners.forEach((listener) => listener({ id: options?.id, message, severity }));
}

export const toast = {
  success: (message: string, options?: ToastOptions) => emit("success", message, options),
  error: (message: string, options?: ToastOptions) => emit("error", message, options),
  info: (message: string, options?: ToastOptions) => emit("info", message, options),
  warning: (message: string, options?: ToastOptions) => emit("warning", message, options)
};

export function AppToaster() {
  const [currentToast, setCurrentToast] = useState<ToastPayload | null>(null);

  useEffect(() => {
    function handleToast(payload: ToastPayload) {
      setCurrentToast(payload);
    }

    listeners.add(handleToast);
    return () => {
      listeners.delete(handleToast);
    };
  }, []);

  return (
    <Snackbar
      open={Boolean(currentToast)}
      autoHideDuration={3800}
      onClose={() => setCurrentToast(null)}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      {currentToast ? (
        <Alert
          variant="filled"
          severity={currentToast.severity}
          onClose={() => setCurrentToast(null)}
          sx={{ width: "100%", fontWeight: 700 }}
        >
          {currentToast.message}
        </Alert>
      ) : undefined}
    </Snackbar>
  );
}
