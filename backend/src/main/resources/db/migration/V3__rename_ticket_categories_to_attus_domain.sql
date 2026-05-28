update store_tickets
set category = 'BILLING_AND_VALUES'
where category = 'PRICE_DIVERGENCE';

update store_tickets
set category = 'DOCUMENTS_AND_DEADLINES'
where category = 'STOCK';

update store_tickets
set category = 'INTERNAL_SERVICE'
where category = 'CUSTOMER_SERVICE';
