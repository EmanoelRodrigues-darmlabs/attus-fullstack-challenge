# Nota Técnica

## Contexto

Como o desafio pede uma funcionalidade ponta a ponta, o domínio escolhido foi um módulo de demandas operacionais de procuradoria digital. A escolha conversa com um contexto de gestão jurídica: usuários podem registrar ocorrências relacionadas a acesso a sistemas, execução fiscal, cobrança, documentos, prazos e atendimento interno.

O objetivo foi construir um fluxo pequeno, mas completo, cobrindo criação, edição, listagem, filtros, mudança de status, persistência, validações, logs e testes.

## Decisões técnicas

### Front-end

Foi usado React com TypeScript e Vite para criar uma aplicação leve, tipada e simples de executar. A interface foi separada em duas experiências principais:

- acompanhamento dos chamados;
- tela de criação e edição.

Essa separação deixa o fluxo mais claro para o usuário: o acompanhamento funciona como painel operacional, enquanto a tela de formulário concentra os dados necessários para cadastrar ou alterar um chamado.

A camada visual usa Material UI onde ele acelera comportamento e acessibilidade: botões, campos, selects, chips, base dos modais, snackbars/toasts e tema claro/escuro. O layout estrutural, cards e textos ficam em HTML semântico com SCSS separado por componente. O tema fica centralizado em `src/theme/appTheme.ts`, usando `ThemeProvider` e `CssBaseline` no `App`.

Os campos obrigatórios usam asterisco. Quando o usuário tenta salvar com dados inválidos, apenas a borda do campo fica vermelha, um toast no canto superior direito informa os problemas encontrados e a tela direciona o foco para o primeiro campo inválido. Essa abordagem evita poluir o formulário com mensagens repetidas abaixo de cada campo.

Os dropdowns usam `Select` do Material UI em um wrapper pequeno (`SelectField`), mantendo tipagem por opção e evitando repetição. O scroll lock do menu foi desativado para impedir deslocamento visual da tela, e o menu fecha automaticamente quando a página rola.

As ações sensíveis usam confirmação visual própria: remoção de chamado e mudança para o status `Cancelado`. Mudanças comuns de status continuam diretas para manter o fluxo operacional rápido.

### Back-end

Foi usado Spring Boot com arquitetura em camadas:

- `controller`: entrada HTTP e documentação dos endpoints;
- `service`: regra de negócio e logs;
- `repository`: persistência com Spring Data JPA;
- `dto`: contratos de entrada e saída;
- `exception`: tratamento padronizado de erros.

Essa divisão facilita testes, manutenção e evolução do módulo. O back-end também concentra a validação definitiva dos dados com Bean Validation.

### Banco de dados

Foi escolhido MariaDB, conforme solicitado. As tabelas são criadas por Flyway, evitando criação manual de schema e tornando a execução mais previsível para quem for avaliar.

### Logs e diagnóstico

Cada requisição recebe um `X-Request-Id`. Esse valor entra nos logs via MDC, permitindo correlacionar uma ação no front-end com o processamento no back-end.

Os logs cobrem:

- criação de chamados;
- atualização de chamados;
- mudança de status;
- remoção;
- payloads inválidos;
- validações inválidas;
- erros inesperados.

### Testes

Os testes do back-end cobrem:

- criação com payload válido no controller;
- retorno de erro quando campos obrigatórios estão inválidos;
- comportamento do service ao criar chamado;
- erro ao atualizar status de chamado inexistente.

Os testes do front-end cobrem os cenários principais de validação do formulário.

## Trade-offs

- A autenticação não foi implementada porque não foi solicitada no enunciado. Em ambiente real, os endpoints deveriam ser protegidos.
- A exclusão é física. Em produção, uma exclusão lógica poderia ser melhor para auditoria.
- A listagem não possui paginação, pois o desafio trabalha com um volume pequeno de dados. Para produção, a paginação seria importante.
- Os indicadores são simples e calculados a partir dos chamados. Em escala maior, poderiam ser calculados por queries específicas ou agregações otimizadas.
- O histórico de mudança de status não foi modelado para manter o escopo objetivo. Em um cenário real, seria útil para auditoria e suporte.
- O uso de Material UI aumenta o bundle do front-end em comparação com componentes próprios, mas reduz tempo de implementação e melhora consistência visual dentro do prazo do desafio.

## Melhorias futuras

- Autenticação e autorização por perfil.
- Histórico de mudanças de status.
- Comentários internos no chamado.
- Paginação no endpoint de listagem.
- Auditoria de usuário responsável por cada alteração.
- Observabilidade com métricas, tracing distribuído e dashboards.
- Testes end-to-end com Playwright.
- Soft delete para preservar histórico operacional.
- Exportação de chamados para análise operacional.
