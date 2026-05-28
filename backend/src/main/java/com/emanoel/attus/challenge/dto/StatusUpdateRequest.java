package com.emanoel.attus.challenge.dto;

import com.emanoel.attus.challenge.model.TicketStatus;
import jakarta.validation.constraints.NotNull;

public record StatusUpdateRequest(
        @NotNull(message = "Status é obrigatório")
        TicketStatus status
) {
}
