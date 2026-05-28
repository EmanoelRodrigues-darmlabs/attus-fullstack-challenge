import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LightModeIcon from "@mui/icons-material/LightMode";
import {
  Button,
  CssBaseline,
  IconButton,
  ThemeProvider,
  Tooltip
} from "@mui/material";
import { ticketsApi } from "../api/ticketsApi";
import { AppToaster, toast } from "../components/AppToaster/AppToaster";
import { ChallengeInfoModal } from "../components/ChallengeInfoModal/ChallengeInfoModal";
import { ConfirmationModal } from "../components/ConfirmationModal/ConfirmationModal";
import { TicketList } from "../components/TicketList/TicketList";
import { TicketStatsBar } from "../components/TicketStatsBar/TicketStatsBar";
import { TicketFilters } from "../components/TicketFilters/TicketFilters";
import { TicketForm } from "../components/TicketForm/TicketForm";
import { createAppTheme, type AppTheme } from "../theme/appTheme";
import type { StoreTicket, TicketFilters as Filters, TicketFormValues, TicketStats, TicketStatus } from "../types/ticket";
import "./style.scss";

const initialFilters: Filters = {
  search: "",
  status: "",
  priority: ""
};

type ScreenMode = "tracking" | "create" | "edit";

interface PendingStatusChange {
  ticket: StoreTicket;
  status: TicketStatus;
}

const themeStorageKey = "attus-operational-theme";

function getInitialTheme(): AppTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(themeStorageKey);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function App() {
  const [tickets, setTickets] = useState<StoreTicket[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [editingTicket, setEditingTicket] = useState<StoreTicket | null>(null);
  const [ticketToDelete, setTicketToDelete] = useState<StoreTicket | null>(null);
  const [statusChangeToConfirm, setStatusChangeToConfirm] = useState<PendingStatusChange | null>(null);
  const [screen, setScreen] = useState<ScreenMode>("tracking");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmingAction, setConfirmingAction] = useState(false);
  const [themeMode, setThemeMode] = useState<AppTheme>(getInitialTheme);
  const [challengeInfoOpen, setChallengeInfoOpen] = useState(false);
  const loadRequestIdRef = useRef(0);
  const trackingPanelRef = useRef<HTMLElement | null>(null);

  const muiTheme = useMemo(() => createAppTheme(themeMode), [themeMode]);

  const loadData = useCallback(async () => {
    const requestId = loadRequestIdRef.current + 1;
    loadRequestIdRef.current = requestId;
    setLoading(true);

    try {
      const [ticketsResponse, statsResponse] = await Promise.all([
        ticketsApi.search(filters),
        ticketsApi.stats()
      ]);

      if (loadRequestIdRef.current !== requestId) {
        return;
      }

      setTickets(ticketsResponse);
      setStats(statsResponse);
    } catch (apiError) {
      if (loadRequestIdRef.current !== requestId) {
        return;
      }

      toast.error(apiError instanceof Error ? apiError.message : "Falha ao carregar chamados.", {
        id: "load-tickets-error"
      });
    } finally {
      if (loadRequestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    document.documentElement.style.colorScheme = themeMode;
    window.localStorage.setItem(themeStorageKey, themeMode);
  }, [themeMode]);

  function scrollToTrackingPanel() {
    window.setTimeout(() => {
      trackingPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  async function handleSubmit(values: TicketFormValues) {
    setSubmitting(true);

    try {
      if (editingTicket) {
        await ticketsApi.update(editingTicket.id, values);
        toast.success("Chamado editado com sucesso.");
      } else {
        await ticketsApi.create(values);
        toast.success("Chamado criado com sucesso.");
      }

      setEditingTicket(null);
      setScreen("tracking");
      await loadData();
      scrollToTrackingPanel();
    } catch (apiError) {
      toast.error(apiError instanceof Error ? apiError.message : "Não foi possível salvar o chamado.", {
        id: "save-ticket-error"
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function updateTicketStatus(ticket: StoreTicket, status: TicketStatus) {
    try {
      await ticketsApi.updateStatus(ticket.id, status);
      toast.success("Status atualizado.");
      await loadData();
      scrollToTrackingPanel();
      return true;
    } catch (apiError) {
      toast.error(apiError instanceof Error ? apiError.message : "Não foi possível atualizar o status.", {
        id: "update-status-error"
      });
      return false;
    }
  }

  async function handleStatusChange(ticket: StoreTicket, status: TicketStatus) {
    if (ticket.status === status) {
      return;
    }

    if (status === "CANCELED") {
      setStatusChangeToConfirm({ ticket, status });
      return;
    }

    await updateTicketStatus(ticket, status);
  }

  function handleDelete(ticket: StoreTicket) {
    setTicketToDelete(ticket);
  }

  async function handleConfirmStatusChange() {
    if (!statusChangeToConfirm) {
      return;
    }

    setConfirmingAction(true);
    try {
      const updated = await updateTicketStatus(statusChangeToConfirm.ticket, statusChangeToConfirm.status);
      if (updated) {
        setStatusChangeToConfirm(null);
      }
    } finally {
      setConfirmingAction(false);
    }
  }

  async function handleConfirmDelete() {
    if (!ticketToDelete) {
      return;
    }

    setConfirmingAction(true);
    try {
      await ticketsApi.remove(ticketToDelete.id);
      toast.success("Chamado removido.");
      if (editingTicket?.id === ticketToDelete.id) {
        setEditingTicket(null);
        setScreen("tracking");
      }
      await loadData();
      setTicketToDelete(null);
    } catch (apiError) {
      toast.error(apiError instanceof Error ? apiError.message : "Não foi possível remover o chamado.", {
        id: "delete-ticket-error"
      });
    } finally {
      setConfirmingAction(false);
    }
  }

  function handleCloseConfirmation() {
    if (confirmingAction) {
      return;
    }

    setTicketToDelete(null);
    setStatusChangeToConfirm(null);
  }

  function handleCreate() {
    setEditingTicket(null);
    setScreen("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleEdit(ticket: StoreTicket) {
    setEditingTicket(ticket);
    setScreen("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBackToTracking() {
    setEditingTicket(null);
    setScreen("tracking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleApplyFilters(nextFilters: Filters) {
    setFilters({ ...nextFilters });
  }

  function toggleTheme() {
    setThemeMode((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }

  const isFormScreen = screen === "create" || screen === "edit";
  const isAnyModalOpen = challengeInfoOpen || Boolean(ticketToDelete) || Boolean(statusChangeToConfirm);
  const ThemeIcon = themeMode === "dark" ? LightModeIcon : DarkModeIcon;
  const themeToggleLabel = themeMode === "dark" ? "Ativar tema claro" : "Ativar tema escuro";

  useLayoutEffect(() => {
    if (!isAnyModalOpen) {
      return;
    }

    const html = document.documentElement;
    const body = document.body;
    const originalBodyPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    html.classList.add("modal-scroll-locked");
    body.classList.add("modal-scroll-locked");

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      html.classList.remove("modal-scroll-locked");
      body.classList.remove("modal-scroll-locked");
      body.style.paddingRight = originalBodyPaddingRight;
    };
  }, [isAnyModalOpen]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AppToaster />

      <main className="appShell">
        <div className="appContainer">
          <div className="pageStack">
            <header className="pageHeader">
              <div>
                <small className="textEyebrow">Attus Procuradoria Digital</small>
                <h1 className="pageTitle">Demandas operacionais</h1>
                <p className="pageDescription">
                  Fluxo ponta a ponta para registrar, acompanhar e diagnosticar ocorrências que impactam
                  atendimento, execução fiscal, cobrança e sistemas internos.
                </p>
              </div>

              <div className="headerActions">
                <Button variant="outlined" startIcon={<InfoOutlinedIcon />} onClick={() => setChallengeInfoOpen(true)}>
                  Sobre o desafio
                </Button>
                <Tooltip title={themeToggleLabel}>
                  <IconButton onClick={toggleTheme} aria-label={themeToggleLabel} color="inherit">
                    <ThemeIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </header>

            {isFormScreen ? (
              <div className="formScreen">
                <Button
                  className="backButton"
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleBackToTracking}
                >
                  Voltar para acompanhamento
                </Button>

                <TicketForm
                  editingTicket={editingTicket}
                  submitting={submitting}
                  onSubmit={handleSubmit}
                  onBack={handleBackToTracking}
                />
              </div>
            ) : (
              <>
                <TicketStatsBar stats={stats} />

                <section className="panel" ref={trackingPanelRef}>
                  <div className="panelHeader">
                    <div>
                      <small className="textEyebrow">Acompanhamento</small>
                      <h2 className="sectionTitle">Fila de chamados</h2>
                      <p className="sectionText">
                        Acompanhe os chamados já registrados, atualize status e edite informações quando necessário.
                      </p>
                    </div>

                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
                      Novo chamado
                    </Button>
                  </div>

                  <TicketFilters
                    filters={filters}
                    onSubmit={handleApplyFilters}
                    loading={loading}
                  />

                  <TicketList
                    tickets={tickets}
                    loading={loading}
                    onEdit={handleEdit}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                </section>
              </>
            )}
          </div>
        </div>
      </main>

      <ChallengeInfoModal open={challengeInfoOpen} onClose={() => setChallengeInfoOpen(false)} />
      <ConfirmationModal
        open={Boolean(ticketToDelete)}
        eyebrow="Ação crítica"
        title="Remover chamado?"
        description={
          ticketToDelete
            ? `O chamado "${ticketToDelete.title}" será removido da fila de acompanhamento.`
            : ""
        }
        confirmLabel="Remover chamado"
        cancelLabel="Manter chamado"
        loading={confirmingAction}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseConfirmation}
      />
      <ConfirmationModal
        open={Boolean(statusChangeToConfirm)}
        eyebrow="Mudança de status"
        title="Cancelar chamado?"
        description={
          statusChangeToConfirm
            ? `O chamado "${statusChangeToConfirm.ticket.title}" será marcado como cancelado e sairá do fluxo ativo de acompanhamento.`
            : ""
        }
        confirmLabel="Cancelar chamado"
        cancelLabel="Voltar"
        loading={confirmingAction}
        onConfirm={handleConfirmStatusChange}
        onClose={handleCloseConfirmation}
      />
    </ThemeProvider>
  );
}

export default App;
