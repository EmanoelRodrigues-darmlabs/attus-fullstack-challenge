create table store_tickets (
    id bigint not null auto_increment,
    title varchar(120) not null,
    store_code varchar(20) not null,
    requester_name varchar(90) not null,
    category varchar(40) not null,
    priority varchar(20) not null,
    status varchar(20) not null,
    description text not null,
    customer_impact boolean not null,
    created_at datetime(6) not null,
    updated_at datetime(6) not null,
    primary key (id)
);

create index idx_store_tickets_status on store_tickets(status);
create index idx_store_tickets_priority on store_tickets(priority);
create index idx_store_tickets_store_code on store_tickets(store_code);

insert into store_tickets (
    title,
    store_code,
    requester_name,
    category,
    priority,
    status,
    description,
    customer_impact,
    created_at,
    updated_at
) values
(
    'Divergência de preço no caixa',
    'CV-1024',
    'Mariana Silva',
    'PRICE_DIVERGENCE',
    'HIGH',
    'OPEN',
    'Operador reportou divergência entre preço da etiqueta e preço apresentado no PDV durante atendimento.',
    true,
    current_timestamp(6),
    current_timestamp(6)
),
(
    'Acesso bloqueado ao sistema de estoque',
    'LB-0308',
    'Rafael Costa',
    'SYSTEM_ACCESS',
    'MEDIUM',
    'IN_PROGRESS',
    'Equipe da loja não consegue acessar o módulo de consulta de estoque desde a abertura.',
    false,
    current_timestamp(6),
    current_timestamp(6)
);
