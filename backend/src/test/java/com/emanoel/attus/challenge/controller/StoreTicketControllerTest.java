package com.emanoel.attus.challenge.controller;

import com.emanoel.attus.challenge.dto.StoreTicketResponse;
import com.emanoel.attus.challenge.config.RequestIdFilter;
import com.emanoel.attus.challenge.dto.StoreTicketRequest;
import com.emanoel.attus.challenge.exception.GlobalExceptionHandler;
import com.emanoel.attus.challenge.model.TicketCategory;
import com.emanoel.attus.challenge.model.TicketPriority;
import com.emanoel.attus.challenge.model.TicketStatus;
import com.emanoel.attus.challenge.service.StoreTicketService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(StoreTicketController.class)
@Import({GlobalExceptionHandler.class, RequestIdFilter.class})
@TestPropertySource(properties = "app.cors.allowed-origins=http://localhost:5173")
public class StoreTicketControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StoreTicketService service;

    @Test
    void shouldCreateTicketWhenPayloadIsValid() throws Exception {
        StoreTicketResponse response = new StoreTicketResponse(
                1L,
                "Falha na consulta de processo",
                "UN-1024",
                "Mariana Silva",
                TicketCategory.BILLING_AND_VALUES,
                TicketPriority.HIGH,
                TicketStatus.OPEN,
                "Valor de cobrança precisa ser revisado pela equipe responsável.",
                true,
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        StoreTicketRequest request = new StoreTicketRequest(
                "Falha na consulta de processo",
                "UN-1024",
                "Mariana Silva",
                TicketCategory.BILLING_AND_VALUES,
                TicketPriority.HIGH,
                "Valor de cobrança precisa ser revisado pela equipe responsável.",
                true
        );
        when(service.create(request)).thenReturn(response);

        mockMvc.perform(post("/api/tickets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Falha na consulta de processo",
                                  "storeCode": "UN-1024",
                                  "requesterName": "Mariana Silva",
                                  "category": "BILLING_AND_VALUES",
                                  "priority": "HIGH",
                                  "description": "Valor de cobrança precisa ser revisado pela equipe responsável.",
                                  "customerImpact": true
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(header().exists("X-Request-Id"))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("OPEN"));
    }

    @Test
    void shouldSearchTicketsWithOptionalFilters() throws Exception {
        when(service.search(TicketStatus.OPEN, TicketPriority.HIGH, "cobrança")).thenReturn(List.of());

        mockMvc.perform(get("/api/tickets")
                        .param("status", "OPEN")
                        .param("priority", "HIGH")
                        .param("search", "cobrança"))
                .andExpect(status().isOk())
                .andExpect(header().exists("X-Request-Id"));

        verify(service).search(TicketStatus.OPEN, TicketPriority.HIGH, "cobrança");
    }

    @Test
    void shouldReturnBadRequestWhenRequiredFieldsAreMissing() throws Exception {
        mockMvc.perform(post("/api/tickets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "",
                                  "storeCode": "",
                                  "requesterName": "",
                                  "description": "curta"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Dados inválidos"))
                .andExpect(jsonPath("$.fieldErrors.title").exists())
                .andExpect(jsonPath("$.fieldErrors.storeCode").exists())
                .andExpect(jsonPath("$.fieldErrors.category").exists())
                .andExpect(jsonPath("$.fieldErrors.priority").exists());
    }

    @Test
    void shouldReturnNotFoundWhenStaticResourceDoesNotExist() throws Exception {
        mockMvc.perform(get("/admin/propagandas"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Recurso não encontrado"));
    }
}
