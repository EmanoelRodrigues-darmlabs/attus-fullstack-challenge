import type { TicketFormValues } from "../types/ticket";

export type ValidationErrors = Partial<Record<keyof TicketFormValues, string>>;

const validationFieldOrder: ReadonlyArray<keyof TicketFormValues> = [
  "title",
  "storeCode",
  "requesterName",
  "description"
];

const requiredMessages: ValidationErrors = {
  title: "Informe o título.",
  storeCode: "Informe o código da unidade.",
  requesterName: "Informe o solicitante.",
  description: "Informe a descrição do chamado."
};

export const emptyTicketForm: TicketFormValues = {
  title: "",
  storeCode: "",
  requesterName: "",
  category: "SYSTEM_ACCESS",
  priority: "MEDIUM",
  description: "",
  customerImpact: false
};

export function hasValidationErrors(errors: ValidationErrors): boolean {
  return validationFieldOrder.some((field) => Boolean(errors[field]));
}

export function getFirstInvalidField(errors: ValidationErrors): keyof TicketFormValues | undefined {
  return validationFieldOrder.find((field) => Boolean(errors[field]));
}

export function getFirstValidationMessage(errors: ValidationErrors): string | undefined {
  const firstInvalidField = getFirstInvalidField(errors);
  return firstInvalidField ? errors[firstInvalidField] : undefined;
}

export function validateRequiredFields(values: TicketFormValues): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const field of validationFieldOrder) {
    const value = values[field];
    if (typeof value === "string" && !value.trim()) {
      errors[field] = requiredMessages[field];
    }
  }

  return errors;
}

export function validateBusinessRules(values: TicketFormValues): ValidationErrors {
  const errors: ValidationErrors = {};
  const titleLength = values.title.trim().length;
  const storeCodeLength = values.storeCode.trim().length;
  const requesterNameLength = values.requesterName.trim().length;
  const descriptionLength = values.description.trim().length;

  if (titleLength < 5) {
    errors.title = "O título deve ter pelo menos 5 caracteres.";
  } else if (titleLength > 120) {
    errors.title = "O título deve ter no máximo 120 caracteres.";
  }

  if (storeCodeLength > 20) {
    errors.storeCode = "O código da unidade deve ter no máximo 20 caracteres.";
  }

  if (requesterNameLength > 90) {
    errors.requesterName = "O solicitante deve ter no máximo 90 caracteres.";
  }

  if (descriptionLength < 15) {
    errors.description = "A descrição deve ter pelo menos 15 caracteres.";
  } else if (descriptionLength > 2000) {
    errors.description = "A descrição deve ter no máximo 2000 caracteres.";
  }

  return errors;
}

export function validateTicket(values: TicketFormValues): ValidationErrors {
  const requiredErrors = validateRequiredFields(values);
  return hasValidationErrors(requiredErrors) ? requiredErrors : validateBusinessRules(values);
}
