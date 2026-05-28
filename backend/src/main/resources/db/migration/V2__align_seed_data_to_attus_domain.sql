update store_tickets
set
    title = 'Falha na consulta de processo',
    store_code = 'UN-1024',
    requester_name = 'Mariana Silva',
    category = 'SYSTEM_ACCESS',
    priority = 'HIGH',
    status = 'OPEN',
    description = 'Usuário reportou falha ao consultar processo de execução fiscal no painel de acompanhamento.',
    customer_impact = true,
    updated_at = current_timestamp(6)
where id = 1;

update store_tickets
set
    title = 'Pendência na integração de documentos',
    store_code = 'UN-0308',
    requester_name = 'Rafael Costa',
    category = 'STOCK',
    priority = 'MEDIUM',
    status = 'IN_PROGRESS',
    description = 'Equipe identificou pendência na integração de documentos necessários para análise de uma demanda.',
    customer_impact = false,
    updated_at = current_timestamp(6)
where id = 2;
