package com.emanoel.attus.challenge.service;

import com.emanoel.attus.challenge.dto.StoreTicketRequest;
import com.emanoel.attus.challenge.exception.ResourceNotFoundException;
import com.emanoel.attus.challenge.model.StoreTicket;
import com.emanoel.attus.challenge.model.TicketCategory;
import com.emanoel.attus.challenge.model.TicketPriority;
import com.emanoel.attus.challenge.model.TicketStatus;
import com.emanoel.attus.challenge.repository.StoreTicketRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class StoreTicketServiceTest {

    @Mock
    private StoreTicketRepository repository;

    @InjectMocks
    private StoreTicketService service;

    @Test
    void shouldCreateTicketWithOpenStatus() {
        StoreTicketRequest request = validRequest();
        ArgumentCaptor<StoreTicket> captor = ArgumentCaptor.forClass(StoreTicket.class);
        when(repository.save(captor.capture())).thenAnswer(invocation -> invocation.getArgument(0));

        service.create(request);

        verify(repository).save(captor.getValue());
        StoreTicket saved = captor.getValue();

        assertThat(saved.getTitle()).isEqualTo("Falha na consulta de processo");
        assertThat(saved.getStatus()).isEqualTo(TicketStatus.OPEN);
        assertThat(saved.isCustomerImpact()).isTrue();
    }

    @Test
    void shouldNormalizeBlankSearchBeforeQueryingRepository() {
        when(repository.search(null, null, null)).thenReturn(List.of());

        service.search(null, null, "   ");

        verify(repository).search(null, null, null);
    }

    @Test
    void shouldThrowWhenUpdatingStatusOfUnknownTicket() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.updateStatus(99L, TicketStatus.RESOLVED))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Chamado não encontrado");
    }

    private StoreTicketRequest validRequest() {
        return new StoreTicketRequest(
                "Falha na consulta de processo",
                "UN-1024",
                "Mariana Silva",
                TicketCategory.BILLING_AND_VALUES,
                TicketPriority.HIGH,
                "Valor de cobrança precisa ser revisado pela equipe responsável.",
                true
        );
    }
}
