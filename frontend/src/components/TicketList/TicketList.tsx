import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Button, Chip, CircularProgress } from "@mui/material";
import { SelectField } from "../SelectField/SelectField";
import type { StoreTicket, TicketPriority, TicketStatus } from "../../types/ticket";
import { labels, statusOptions } from "../../types/ticket";
import "./style.scss";

interface TicketListProps {
  tickets: StoreTicket[];
  loading: boolean;
  onEdit: (ticket: StoreTicket) => void;
  onStatusChange: (ticket: StoreTicket, status: TicketStatus) => void;
  onDelete: (ticket: StoreTicket) => void;
}

function priorityColor(priority: TicketPriority): "default" | "success" | "warning" | "error" {
  if (priority === "LOW") {
    return "success";
  }

  if (priority === "HIGH") {
    return "warning";
  }

  if (priority === "CRITICAL") {
    return "error";
  }

  return "default";
}

export function TicketList({ tickets, loading, onEdit, onStatusChange, onDelete }: TicketListProps) {
  if (loading && tickets.length === 0) {
    return (
      <div className="ticketListLoadingState">
        <CircularProgress size={28} />
        <p className="ticketListEmptyText">Carregando chamados...</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="ticketListEmptyState">
        <p className="ticketListEmptyTitle">Nenhum chamado encontrado</p>
        <p className="ticketListEmptyText">Ajuste os filtros ou cadastre o primeiro chamado operacional.</p>
      </div>
    );
  }

  return (
    <section className="ticketList" aria-label="Lista de chamados">
      {tickets.map((ticket) => (
        <article key={ticket.id} className="ticketCard">
          <div className="ticketCardInner">
            <div className="ticketContent">
              <div className="ticketHeadingRow">
                <div className="ticketHeading">
                  <small className="ticketCode">{ticket.storeCode}</small>
                  <h3 className="ticketTitle">{ticket.title}</h3>
                </div>

                <Chip
                  size="small"
                  color={priorityColor(ticket.priority)}
                  label={labels.priority[ticket.priority]}
                  sx={{ fontWeight: 800 }}
                />
              </div>

              <p className="ticketDescription">{ticket.description}</p>

              <div className="ticketTags">
                <Chip size="small" label={labels.category[ticket.category]} />
                <Chip size="small" label={labels.status[ticket.status]} />
                <Chip size="small" label={`Solicitante: ${ticket.requesterName}`} />
                {ticket.customerImpact && <Chip size="small" color="warning" label="Impacta cliente" />}
              </div>
            </div>

            <div className="ticketActions">
              <SelectField
                value={ticket.status}
                options={statusOptions}
                onChange={(status: TicketStatus) => onStatusChange(ticket, status)}
                ariaLabel={`Alterar status do chamado ${ticket.id}`}
              />

              <Button variant="outlined" startIcon={<EditOutlinedIcon />} onClick={() => onEdit(ticket)}>
                Editar
              </Button>

              <Button color="error" variant="outlined" startIcon={<DeleteOutlinedIcon />} onClick={() => onDelete(ticket)}>
                Remover
              </Button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
