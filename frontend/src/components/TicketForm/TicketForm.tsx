import { FormEvent, useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField
} from "@mui/material";
import { toast } from "../AppToaster/AppToaster";
import { SelectField } from "../SelectField/SelectField";
import type { StoreTicket, TicketFormValues } from "../../types/ticket";
import { categoryOptions, priorityOptions } from "../../types/ticket";
import {
  emptyTicketForm,
  getFirstInvalidField,
  getFirstValidationMessage,
  hasValidationErrors,
  validateBusinessRules,
  validateRequiredFields,
  type ValidationErrors
} from "../../utils/validation";
import "./style.scss";

interface TicketFormProps {
  editingTicket: StoreTicket | null;
  submitting: boolean;
  onSubmit: (values: TicketFormValues) => Promise<void>;
  onBack: () => void;
}

function toFormValues(ticket: StoreTicket | null): TicketFormValues {
  if (!ticket) {
    return emptyTicketForm;
  }

  return {
    title: ticket.title,
    storeCode: ticket.storeCode,
    requesterName: ticket.requesterName,
    category: ticket.category,
    priority: ticket.priority,
    description: ticket.description,
    customerImpact: ticket.customerImpact
  };
}

export function TicketForm({ editingTicket, submitting, onSubmit, onBack }: TicketFormProps) {
  const [values, setValues] = useState<TicketFormValues>(toFormValues(editingTicket));
  const [errors, setErrors] = useState<ValidationErrors>({});
  const fieldRefs = useRef<Partial<Record<keyof TicketFormValues, HTMLInputElement | HTMLTextAreaElement>>>({});
  const SubmitIcon = editingTicket ? EditOutlinedIcon : SaveOutlinedIcon;
  const submitText = submitting
    ? editingTicket
      ? "Editando..."
      : "Criando..."
    : editingTicket
      ? "Editar"
      : "Criar chamado";

  useEffect(() => {
    setValues(toFormValues(editingTicket));
    setErrors({});
  }, [editingTicket]);

  function showValidationToast(message: string) {
    toast.error(message, { id: "ticket-form-validation" });
  }

  function focusFirstInvalidField(nextErrors: ValidationErrors) {
    const firstInvalidField = getFirstInvalidField(nextErrors);
    if (!firstInvalidField) {
      return;
    }

    fieldRefs.current[firstInvalidField]?.scrollIntoView({ behavior: "smooth", block: "center" });
    fieldRefs.current[firstInvalidField]?.focus({ preventScroll: true });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const requiredErrors = validateRequiredFields(values);

    if (hasValidationErrors(requiredErrors)) {
      setErrors(requiredErrors);
      showValidationToast("Campos obrigatórios não preenchidos.");
      focusFirstInvalidField(requiredErrors);
      return;
    }

    const businessRuleErrors = validateBusinessRules(values);
    if (hasValidationErrors(businessRuleErrors)) {
      setErrors(businessRuleErrors);
      showValidationToast(getFirstValidationMessage(businessRuleErrors) ?? "Revise os campos destacados.");
      focusFirstInvalidField(businessRuleErrors);
      return;
    }

    setErrors({});
    await onSubmit(values);
    if (!editingTicket) {
      setValues(emptyTicketForm);
    }
  }

  function update<K extends keyof TicketFormValues>(field: K, value: TicketFormValues[K]) {
    const nextValues = { ...values, [field]: value } as TicketFormValues;
    setValues(nextValues);

    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const nextRequiredErrors = validateRequiredFields(nextValues);
      const nextFieldError = hasValidationErrors(nextRequiredErrors)
        ? nextRequiredErrors[field]
        : validateBusinessRules(nextValues)[field];
      if (nextFieldError) {
        return { ...current, [field]: nextFieldError };
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function markFieldRef(field: keyof TicketFormValues) {
    return (element: HTMLInputElement | HTMLTextAreaElement | null) => {
      if (element) {
        fieldRefs.current[field] = element;
      }
    };
  }

  return (
    <section className="panel ticketForm">
      <div className="ticketFormHeader">
        <div>
          <small className="textEyebrow">Fluxo completo</small>
          <h2 className="sectionTitle">{editingTicket ? "Editar chamado" : "Novo chamado operacional"}</h2>
          <p className="sectionText">
            Preencha as informações necessárias para registrar o chamado e facilitar o diagnóstico da operação.
          </p>
        </div>

        <Button variant="outlined" startIcon={<CloseIcon />} onClick={onBack}>
          Cancelar
        </Button>
      </div>

      <form className="ticketFormBody" onSubmit={handleSubmit} noValidate>
        <div className="ticketFormGrid">
          <TextField
            className="ticketFormFieldFull"
            label="Título"
            required
            fullWidth
            value={values.title}
            onChange={(event) => update("title", event.target.value)}
            placeholder="Ex.: Falha na consulta de processo"
            error={Boolean(errors.title)}
            inputRef={markFieldRef("title")}
          />

          <TextField
            label="Código da unidade"
            required
            fullWidth
            value={values.storeCode}
            onChange={(event) => update("storeCode", event.target.value)}
            placeholder="Ex.: UN-1024"
            error={Boolean(errors.storeCode)}
            inputRef={markFieldRef("storeCode")}
          />

          <TextField
            label="Solicitante"
            required
            fullWidth
            value={values.requesterName}
            onChange={(event) => update("requesterName", event.target.value)}
            placeholder="Nome de quem abriu o chamado"
            error={Boolean(errors.requesterName)}
            inputRef={markFieldRef("requesterName")}
          />

          <SelectField
            id="category"
            label="Categoria"
            value={values.category}
            options={categoryOptions}
            onChange={(category) => update("category", category)}
          />

          <SelectField
            id="priority"
            label="Prioridade"
            value={values.priority}
            options={priorityOptions}
            onChange={(priority) => update("priority", priority)}
          />

          <TextField
            className="ticketFormFieldFull"
            label="Descrição"
            required
            fullWidth
            multiline
            minRows={5}
            value={values.description}
            onChange={(event) => update("description", event.target.value)}
            placeholder="Descreva o problema, impacto e contexto para diagnóstico."
            error={Boolean(errors.description)}
            inputRef={markFieldRef("description")}
          />

          <FormControlLabel
            className="ticketFormFieldFull"
            control={
              <Checkbox
                checked={values.customerImpact}
                onChange={(event) => update("customerImpact", event.target.checked)}
              />
            }
            label="Impacta diretamente o atendimento ao cliente"
          />

          <div className="ticketFormActions">
            <Button variant="contained" type="submit" startIcon={<SubmitIcon />} disabled={submitting}>
              {submitText}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
