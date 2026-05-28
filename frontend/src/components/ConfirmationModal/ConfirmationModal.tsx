import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { Button, Dialog } from "@mui/material";
import "./style.scss";

interface ConfirmationModalProps {
  open: boolean;
  eyebrow: string;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmationModal({
  open,
  eyebrow,
  title,
  description,
  confirmLabel,
  cancelLabel = "Voltar",
  loading = false,
  onConfirm,
  onClose
}: ConfirmationModalProps) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      disableScrollLock
      aria-labelledby="confirmation-title"
    >
      <header className="confirmationHeader">
        <div className="confirmationIcon">
          <WarningAmberOutlinedIcon />
        </div>
        <div>
          <small className="textEyebrow errorEyebrow">{eyebrow}</small>
          <h2 id="confirmation-title" className="confirmationTitle">{title}</h2>
        </div>
      </header>

      <div className="confirmationContent">
        <p className="confirmationText">{description}</p>
      </div>

      <footer className="confirmationActions">
        <Button variant="outlined" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button color="error" variant="contained" onClick={onConfirm} disabled={loading}>
          {loading ? "Processando..." : confirmLabel}
        </Button>
      </footer>
    </Dialog>
  );
}
