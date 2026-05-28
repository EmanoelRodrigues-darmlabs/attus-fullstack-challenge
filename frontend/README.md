# Front-end

Interface web do módulo de demandas operacionais de procuradoria digital.

## Stack

- React 18
- TypeScript
- Vite
- Material UI
- MUI Icons
- SCSS/Sass
- Vitest
- Testing Library

## Funcionalidades

- Painel de acompanhamento com indicadores.
- Busca por unidade, título ou solicitante.
- Filtros por status e prioridade.
- Criação e edição de chamados em tela própria.
- Atualização de status diretamente nos cards.
- Confirmação para remoção e cancelamento de chamado.
- Toasts de sucesso e erro com Snackbar/Alert do Material UI.
- Validação de campos obrigatórios e regras de negócio.
- Tema claro/escuro com `ThemeProvider`, `createTheme` e preferência salva no navegador.

## Executar localmente

Instale as dependências:

```bash
npm install
```

Execute o front-end:

```bash
npm run dev
```

URL padrão:

```text
http://localhost:5173
```

Por padrão, o front-end chama a API em `/api`. No modo de desenvolvimento, o proxy do Vite redireciona essas chamadas para `http://localhost:8080`.

Para rodar apontando diretamente para o back-end local no PowerShell:

```powershell
$env:VITE_API_URL="http://localhost:8080/api"
npm run dev
```

Em bash/zsh:

```bash
VITE_API_URL="http://localhost:8080/api" npm run dev
```

No Docker, essa variável já é enviada pelo `docker-compose.yml`.

## Testes e build

Rodar testes:

```bash
npm test
```

Gerar build de produção:

```bash
npm run build
```

Pré-visualizar o build:

```bash
npm run preview
```

## Estrutura principal

```text
src/
  App/
    App.tsx
    style.scss
  api/
    ticketsApi.ts
  components/
    AppToaster/
    ChallengeInfoModal/
    ConfirmationModal/
    SelectField/
    TicketFilters/
    TicketForm/
    TicketList/
    TicketStatsBar/
  styles/
    global.scss
  theme/
    appTheme.ts
  types/
    ticket.ts
  utils/
    validation.ts
    validation.test.ts
```

## Observações técnicas

- O tema é criado em `src/theme/appTheme.ts`.
- `src/styles/global.scss` concentra reset, variáveis globais e utilitários compartilhados.
- Cada componente visual mantém seu próprio `style.scss` para evitar um arquivo global grande.
- `src/components/SelectField/SelectField.tsx` encapsula o `Select` do Material UI para manter tipagem e padronização.
- `src/components/AppToaster/AppToaster.tsx` concentra os toasts usando `Snackbar` e `Alert`.
- As validações do formulário ficam em `src/utils/validation.ts`, com testes em `validation.test.ts`.
