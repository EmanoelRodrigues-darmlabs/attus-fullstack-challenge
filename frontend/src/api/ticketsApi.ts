import type {
  ApiError,
  StoreTicket,
  TicketFilters,
  TicketFormValues,
  TicketStats,
  TicketStatus
} from "../types/ticket";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const apiError = data as ApiError | null;
    throw new Error(apiError?.message ?? "Não foi possível concluir a operação.");
  }

  return data as T;
}

function buildQuery(filters: TicketFilters): string {
  const params = new URLSearchParams();
  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }
  if (filters.status) {
    params.set("status", filters.status);
  }
  if (filters.priority) {
    params.set("priority", filters.priority);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

export const ticketsApi = {
  search(filters: TicketFilters): Promise<StoreTicket[]> {
    return request<StoreTicket[]>(`/tickets${buildQuery(filters)}`);
  },

  stats(): Promise<TicketStats> {
    return request<TicketStats>("/tickets/stats");
  },

  create(values: TicketFormValues): Promise<StoreTicket> {
    return request<StoreTicket>("/tickets", {
      method: "POST",
      body: JSON.stringify(values)
    });
  },

  update(id: number, values: TicketFormValues): Promise<StoreTicket> {
    return request<StoreTicket>(`/tickets/${id}`, {
      method: "PUT",
      body: JSON.stringify(values)
    });
  },

  updateStatus(id: number, status: TicketStatus): Promise<StoreTicket> {
    return request<StoreTicket>(`/tickets/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
  },

  remove(id: number): Promise<void> {
    return request<void>(`/tickets/${id}`, {
      method: "DELETE"
    });
  }
};
