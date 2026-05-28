package com.emanoel.attus.challenge.dto;

import java.time.Instant;
import java.util.Map;

public record ApiErrorResponse(
        String message,
        String requestId,
        Instant timestamp,
        Map<String, String> fieldErrors
) {
}
