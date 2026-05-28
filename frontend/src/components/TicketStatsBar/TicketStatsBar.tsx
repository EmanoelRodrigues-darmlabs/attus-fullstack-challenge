import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ComponentType } from "react";
import type { TicketStats } from "../../types/ticket";
import "./style.scss";

interface TicketStatsBarProps {
  stats: TicketStats | null;
}

type StatTone = "primary" | "warning" | "success" | "error";

interface StatItem {
  label: string;
  value: number;
  icon: ComponentType<SvgIconProps>;
  tone: StatTone;
}

export function TicketStatsBar({ stats }: TicketStatsBarProps) {
  const items: StatItem[] = [
    { label: "Total", value: stats?.total ?? 0, icon: AssignmentTurnedInOutlinedIcon, tone: "primary" },
    { label: "Abertos", value: stats?.open ?? 0, icon: PendingActionsOutlinedIcon, tone: "warning" },
    { label: "Resolvidos", value: stats?.resolved ?? 0, icon: CheckCircleOutlinedIcon, tone: "success" },
    { label: "Críticos", value: stats?.critical ?? 0, icon: ErrorOutlinedIcon, tone: "error" }
  ];

  return (
    <section className="ticketStatsGrid" aria-label="Indicadores dos chamados">
      {items.map((item) => {
        const Icon = item.icon;
        const toneClass = item.tone.charAt(0).toUpperCase() + item.tone.slice(1);

        return (
          <article key={item.label} className={`ticketStatCard ticketStatCard${toneClass}`}>
            <div className="ticketStatCardContent">
              <div className={`ticketStatIcon ticketStatIcon${toneClass}`}>
                <Icon fontSize="small" />
              </div>

              <div>
                <strong className="ticketStatValue">{item.value}</strong>
                <span className="ticketStatLabel">{item.label}</span>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
