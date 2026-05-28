package com.emanoel.attus.challenge.dto;

public record TicketStatsResponse(
        long total,
        long open,
        long inProgress,
        long resolved,
        long critical
) {
}
