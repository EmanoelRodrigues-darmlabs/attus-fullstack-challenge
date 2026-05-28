package com.emanoel.attus.challenge.controller;

import com.emanoel.attus.challenge.dto.StatusUpdateRequest;
import com.emanoel.attus.challenge.dto.StoreTicketRequest;
import com.emanoel.attus.challenge.dto.StoreTicketResponse;
import com.emanoel.attus.challenge.dto.TicketStatsResponse;
import com.emanoel.attus.challenge.model.TicketPriority;
import com.emanoel.attus.challenge.model.TicketStatus;
import com.emanoel.attus.challenge.service.StoreTicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@Tag(name = "Operational Tickets", description = "Demandas operacionais de procuradoria digital")
public class StoreTicketController {

    private final StoreTicketService service;

    public StoreTicketController(StoreTicketService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Pesquisa chamados com filtros opcionais")
    public List<StoreTicketResponse> search(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) TicketPriority priority,
            @RequestParam(required = false) String search
    ) {
        return service.search(status, priority, search);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca um chamado pelo identificador")
    public StoreTicketResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Cria um novo chamado operacional")
    public StoreTicketResponse create(@Valid @RequestBody StoreTicketRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza todos os dados editáveis do chamado")
    public StoreTicketResponse update(@PathVariable Long id, @Valid @RequestBody StoreTicketRequest request) {
        return service.update(id, request);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Atualiza apenas o status do chamado")
    public StoreTicketResponse updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request
    ) {
        return service.updateStatus(id, request.status());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Remove um chamado")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/stats")
    @Operation(summary = "Retorna indicadores resumidos dos chamados")
    public TicketStatsResponse stats() {
        return service.stats();
    }
}
