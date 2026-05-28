package com.emanoel.attus.challenge.dto;

import com.emanoel.attus.challenge.model.TicketCategory;
import com.emanoel.attus.challenge.model.TicketPriority;
import com.emanoel.attus.challenge.model.TicketStatus;

import java.time.LocalDateTime;

public record StoreTicketResponse(
        Long id,
        String title,
        String storeCode,
        String requesterName,
        TicketCategory category,
        TicketPriority priority,
        TicketStatus status,
        String description,
        boolean customerImpact,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
