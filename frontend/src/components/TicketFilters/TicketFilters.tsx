import { FormEvent, useEffect, useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { Button, InputAdornment, TextField } from "@mui/material";
import { SelectField, type SelectOption } from "../SelectField/SelectField";
import type { TicketFilters as Filters } from "../../types/ticket";
import { priorityOptions, statusOptions } from "../../types/ticket";
import "./style.scss";

interface TicketFiltersProps {
  filters: Filters;
  onSubmit: (filters: Filters) => void;
  loading: boolean;
}

type StatusFilterValue = "ALL_STATUSES" | Exclude<Filters["status"], "">;
type PriorityFilterValue = "ALL_PRIORITIES" | Exclude<Filters["priority"], "">;

const statusFilterOptions: Array<SelectOption<StatusFilterValue>> = [
  { value: "ALL_STATUSES", label: "Todos os status" },
  ...statusOptions
];

const priorityFilterOptions: Array<SelectOption<PriorityFilterValue>> = [
  { value: "ALL_PRIORITIES", label: "Todas prioridades" },
  ...priorityOptions
];

export function TicketFilters({ filters, onSubmit, loading }: TicketFiltersProps) {
  const [draftFilters, setDraftFilters] = useState<Filters>(filters);

  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      ...draftFilters,
      search: draftFilters.search.trim()
    });
  }

  return (
    <form className="filtersBar" aria-label="Filtros de chamados" onSubmit={handleSubmit}>
      <TextField
        value={draftFilters.search}
        onChange={(event) => setDraftFilters({ ...draftFilters, search: event.target.value })}
        placeholder="Buscar por unidade, título ou solicitante"
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )
          }
        }}
      />

      <div className="filtersActions">
        <SelectField
          value={draftFilters.status || "ALL_STATUSES"}
          options={statusFilterOptions}
          onChange={(status) => setDraftFilters({ ...draftFilters, status: status === "ALL_STATUSES" ? "" : status })}
          ariaLabel="Filtrar por status"
        />

        <SelectField
          value={draftFilters.priority || "ALL_PRIORITIES"}
          options={priorityFilterOptions}
          onChange={(priority) => setDraftFilters({ ...draftFilters, priority: priority === "ALL_PRIORITIES" ? "" : priority })}
          ariaLabel="Filtrar por prioridade"
        />

        <Button
          type="submit"
          variant="outlined"
          startIcon={<RefreshIcon />}
          disabled={loading}
          sx={{ minWidth: 130 }}
        >
          Atualizar
        </Button>
      </div>
    </form>
  );
}
