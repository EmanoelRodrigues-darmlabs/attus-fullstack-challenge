# Análise de Incidente

## Cenário

Usuários relatam erro recorrente ao tentar cadastrar demandas relacionadas à consulta de processos. O front-end exibe mensagem genérica de falha e a operação não é concluída.

## Logs observados

```text
2026-05-26 10:12:44 INFO  [9d1b7b6e] StoreTicketService - Ticket created id=41 storeCode=UN-1024 priority=HIGH
2026-05-26 10:15:02 WARN  [e54a9a35] GlobalExceptionHandler - Validation failed: {description=Descrição deve ter entre 15 e 2000 caracteres}
2026-05-26 10:15:09 WARN  [e54a9a35] GlobalExceptionHandler - Invalid request payload: Cannot deserialize value of type TicketPriority from String "URGENTE"
2026-05-26 10:16:31 ERROR [88bb3c18] GlobalExceptionHandler - Unexpected error
org.springframework.dao.DataIntegrityViolationException: Data too long for column 'store_code'
```

## Análise

Os logs indicam três problemas diferentes:

1. Requisições com descrição curta estão sendo bloqueadas por validação. Esse comportamento é correto, mas o front-end precisa mostrar uma mensagem mais clara para o usuário.
2. O valor `URGENTE` foi enviado como prioridade, mas a API aceita apenas `LOW`, `MEDIUM`, `HIGH` e `CRITICAL`. Isso indica divergência entre contrato do front-end e contrato da API, ou algum cliente externo enviando valor inválido.
3. O erro `Data too long for column 'store_code'` mostra que um código de unidade maior que 20 caracteres chegou até o banco. A API já possui validação para esse campo, então a causa provável seria uma rota antiga, payload não validado ou inconsistência em alguma versão anterior do back-end.

## Correção proposta

- Garantir que todos os endpoints de criação e edição usem DTOs com `@Valid`.
- Exibir no front-end mensagens claras a partir dos `fieldErrors` retornados pela API.
- Manter as opções de prioridade no front-end derivadas de uma lista controlada.
- Adicionar teste automatizado para código de unidade acima de 20 caracteres.
- Revisar clientes ou automações externas que possam estar chamando a API com valores antigos.

## Prevenção

- Documentar claramente os enums no Swagger.
- Adicionar testes de contrato para valores inválidos.
- Monitorar quantidade de erros HTTP 400 e 500 por endpoint.
- Registrar `X-Request-Id` no front-end em caso de erro para facilitar suporte.
- Criar alertas quando ocorrerem erros 500 no endpoint `POST /api/tickets`.
- Validar payloads em qualquer rota que aceite criação ou atualização de chamados.

## Resultado esperado

Com as validações alinhadas e os erros tratados antes de chegar ao banco, a aplicação passa a retornar erros 400 explicativos para problemas de entrada e reduz a chance de erros 500 em produção.
