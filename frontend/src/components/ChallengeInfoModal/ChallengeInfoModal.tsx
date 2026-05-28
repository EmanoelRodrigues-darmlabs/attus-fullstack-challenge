import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SchemaOutlinedIcon from "@mui/icons-material/SchemaOutlined";
import { Button, Dialog, IconButton } from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";
import "./style.scss";

interface ChallengeInfoModalProps {
  open: boolean;
  onClose: () => void;
}

interface ModalSection {
  title: string;
  description: string;
  icon: SvgIconComponent;
}

const sections: ModalSection[] = [
  {
    title: "Fluxo implementado",
    description:
      "A interface permite buscar chamados, filtrar por status e prioridade, criar novos registros, editar informações, atualizar status e remover chamados quando necessário.",
    icon: SchemaOutlinedIcon
  },
  {
    title: "Arquitetura da entrega",
    description:
      "Front-end em React com TypeScript, API em Java Spring Boot, persistência em MariaDB, versionamento de schema com Flyway e ambiente executável via Docker.",
    icon: ConstructionOutlinedIcon
  },
  {
    title: "Validações e qualidade",
    description:
      "O formulário valida campos obrigatórios e regras de negócio antes de enviar os dados. A API possui endpoints documentados, testes automatizados e logs mínimos para análise de falhas.",
    icon: ArticleOutlinedIcon
  },
  {
    title: "Análise de incidente",
    description:
      "A nota técnica do repositório descreve decisões, trade-offs, melhorias futuras e como os logs podem apoiar a investigação de erros recorrentes.",
    icon: AnalyticsOutlinedIcon
  }
];

export function ChallengeInfoModal({ open, onClose }: ChallengeInfoModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      disableScrollLock
      aria-labelledby="challenge-info-title"
    >
      <header className="challengeModalHeader">
        <small className="textEyebrow">Entrega do desafio</small>
        <h2 id="challenge-info-title" className="challengeModalTitle">
          Visão geral da solução
        </h2>
        <IconButton
          className="challengeModalCloseButton"
          aria-label="Fechar modal"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </header>

      <div className="challengeModalContent">
        <p className="challengeModalIntro">
          Este módulo simula o fluxo de demandas operacionais de procuradoria digital, com cadastro, edição,
          acompanhamento de status, persistência em banco e logs para apoio ao diagnóstico.
        </p>

        <div className="challengeModalSections">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <section key={section.title} className="challengeModalSection">
                <div className="challengeModalSectionIcon">
                  <Icon fontSize="small" />
                </div>
                <div>
                  <h3 className="challengeModalSectionTitle">{section.title}</h3>
                  <p className="challengeModalSectionDescription">{section.description}</p>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <footer className="challengeModalActions">
        <Button
          variant="outlined"
          href="http://localhost:8080/swagger-ui.html"
          target="_blank"
          rel="noreferrer"
          startIcon={<OpenInNewIcon />}
        >
          Abrir documentação da API
        </Button>
        <Button variant="contained" onClick={onClose}>
          Entendi
        </Button>
      </footer>
    </Dialog>
  );
}
