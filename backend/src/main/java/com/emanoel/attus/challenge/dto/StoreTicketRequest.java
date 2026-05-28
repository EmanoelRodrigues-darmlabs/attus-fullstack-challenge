package com.emanoel.attus.challenge.dto;

import com.emanoel.attus.challenge.model.TicketCategory;
import com.emanoel.attus.challenge.model.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record StoreTicketRequest(
        @NotBlank(message = "Título é obrigatório")
        @Size(min = 5, max = 120, message = "Título deve ter entre 5 e 120 caracteres")
        String title,

        @NotBlank(message = "Código da unidade é obrigatório")
        @Size(max = 20, message = "Código da unidade deve ter no máximo 20 caracteres")
        String storeCode,

        @NotBlank(message = "Solicitante é obrigatório")
        @Size(max = 90, message = "Solicitante deve ter no máximo 90 caracteres")
        String requesterName,

        @NotNull(message = "Categoria é obrigatória")
        TicketCategory category,

        @NotNull(message = "Prioridade é obrigatória")
        TicketPriority priority,

        @NotBlank(message = "Descrição é obrigatória")
        @Size(min = 15, max = 2000, message = "Descrição deve ter entre 15 e 2000 caracteres")
        String description,

        Boolean customerImpact
) {
}
