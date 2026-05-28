export type TicketCategory =
  | "SYSTEM_ACCESS"
  | "BILLING_AND_VALUES"
  | "DOCUMENTS_AND_DEADLINES"
  | "INTERNAL_SERVICE"
  | "OTHER";

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CANCELED";

export interface StoreTicket {
  id: number;
  title: string;
  storeCode: string;
  requesterName: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  description: string;
  customerImpact: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TicketFormValues {
  title: string;
  storeCode: string;
  requesterName: string;
  category: TicketCategory;
  priority: TicketPriority;
  description: string;
  customerImpact: boolean;
}

export interface TicketFilters {
  search: string;
  status: "" | TicketStatus;
  priority: "" | TicketPriority;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  critical: number;
}

export interface ApiError {
  message: string;
  requestId?: string;
  timestamp?: string;
  fieldErrors?: Record<string, string>;
}

export const categoryOptions: Array<{ value: TicketCategory; label: string }> = [
  { value: "SYSTEM_ACCESS", label: "Acesso a sistema" },
  { value: "BILLING_AND_VALUES", label: "Cobrança e valores" },
  { value: "DOCUMENTS_AND_DEADLINES", label: "Documentos e prazos" },
  { value: "INTERNAL_SERVICE", label: "Atendimento interno" },
  { value: "OTHER", label: "Outro" }
];

export const priorityOptions: Array<{ value: TicketPriority; label: string }> = [
  { value: "LOW", label: "Baixa" },
  { value: "MEDIUM", label: "Média" },
  { value: "HIGH", label: "Alta" },
  { value: "CRITICAL", label: "Crítica" }
];

export const statusOptions: Array<{ value: TicketStatus; label: string }> = [
  { value: "OPEN", label: "Aberto" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "RESOLVED", label: "Resolvido" },
  { value: "CANCELED", label: "Cancelado" }
];

export const labels = {
  category: Object.fromEntries(categoryOptions.map((item) => [item.value, item.label])) as Record<TicketCategory, string>,
  priority: Object.fromEntries(priorityOptions.map((item) => [item.value, item.label])) as Record<TicketPriority, string>,
  status: Object.fromEntries(statusOptions.map((item) => [item.value, item.label])) as Record<TicketStatus, string>
};
