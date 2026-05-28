package com.emanoel.attus.challenge.repository;

import com.emanoel.attus.challenge.model.StoreTicket;
import com.emanoel.attus.challenge.model.TicketCategory;
import com.emanoel.attus.challenge.model.TicketPriority;
import com.emanoel.attus.challenge.model.TicketStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@TestPropertySource(properties = {
        "spring.flyway.enabled=false",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
public class StoreTicketRepositoryTest {

    @Autowired
    private StoreTicketRepository repository;

    @Test
    void shouldListMostRecentlyCreatedTicketFirstEvenWhenOlderTicketImpactsCustomer() throws Exception {
        StoreTicket olderImpactingTicket = ticket("Falha na consulta de processo", true);
        repository.saveAndFlush(olderImpactingTicket);

        Thread.sleep(20);

        StoreTicket newerTicket = ticket("Novo chamado cadastrado", false);
        repository.saveAndFlush(newerTicket);

        List<StoreTicket> tickets = repository.search(null, null, null);

        assertThat(tickets).extracting(StoreTicket::getTitle)
                .containsExactly("Novo chamado cadastrado", "Falha na consulta de processo");
    }

    @Test
    void shouldListRecentlyEditedTicketFirst() throws Exception {
        StoreTicket olderTicket = ticket("Chamado antigo", false);
        repository.saveAndFlush(olderTicket);

        Thread.sleep(20);

        StoreTicket newerTicket = ticket("Chamado mais novo", false);
        repository.saveAndFlush(newerTicket);

        Thread.sleep(20);

        olderTicket.setDescription("Descrição alterada para simular edição recente do chamado.");
        repository.saveAndFlush(olderTicket);

        List<StoreTicket> tickets = repository.search(null, null, null);

        assertThat(tickets).extracting(StoreTicket::getTitle)
                .containsExactly("Chamado antigo", "Chamado mais novo");
    }

    private StoreTicket ticket(String title, boolean customerImpact) {
        StoreTicket ticket = new StoreTicket();
        ticket.setTitle(title);
        ticket.setStoreCode(customerImpact ? "UN-1024" : "UN-2048");
        ticket.setRequesterName("Mariana Silva");
        ticket.setCategory(TicketCategory.SYSTEM_ACCESS);
        ticket.setPriority(TicketPriority.HIGH);
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setDescription("Descrição suficiente para validar o chamado operacional.");
        ticket.setCustomerImpact(customerImpact);
        return ticket;
    }
}
