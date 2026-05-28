package com.emanoel.attus.challenge.service;

import com.emanoel.attus.challenge.dto.StoreTicketRequest;
import com.emanoel.attus.challenge.dto.StoreTicketResponse;
import com.emanoel.attus.challenge.dto.TicketStatsResponse;
import com.emanoel.attus.challenge.exception.ResourceNotFoundException;
import com.emanoel.attus.challenge.model.StoreTicket;
import com.emanoel.attus.challenge.model.TicketPriority;
import com.emanoel.attus.challenge.model.TicketStatus;
import com.emanoel.attus.challenge.repository.StoreTicketRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StoreTicketService {

    private static final Logger log = LoggerFactory.getLogger(StoreTicketService.class);

    private final StoreTicketRepository repository;

    public StoreTicketService(StoreTicketRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<StoreTicketResponse> search(TicketStatus status, TicketPriority priority, String search) {
        String normalizedSearch = normalizeSearch(search);
        log.info(
                "Searching tickets status={} priority={} search={}",
                logFilter(status),
                logFilter(priority),
                logSearch(normalizedSearch)
        );
        return repository.search(status, priority, normalizedSearch)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public StoreTicketResponse findById(Long id) {
        return repository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Chamado não encontrado: " + id));
    }

    @Transactional
    public StoreTicketResponse create(StoreTicketRequest request) {
        StoreTicket ticket = new StoreTicket();
        applyRequest(ticket, request);
        ticket.setStatus(TicketStatus.OPEN);

        StoreTicket saved = repository.save(ticket);
        log.info("Ticket created id={} storeCode={} priority={}", saved.getId(), saved.getStoreCode(), saved.getPriority());
        return toResponse(saved);
    }

    @Transactional
    public StoreTicketResponse update(Long id, StoreTicketRequest request) {
        StoreTicket ticket = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chamado não encontrado: " + id));

        applyRequest(ticket, request);
        StoreTicket saved = repository.save(ticket);
        log.info("Ticket updated id={} status={} priority={}", saved.getId(), saved.getStatus(), saved.getPriority());
        return toResponse(saved);
    }

    @Transactional
    public StoreTicketResponse updateStatus(Long id, TicketStatus status) {
        StoreTicket ticket = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chamado não encontrado: " + id));

        TicketStatus previousStatus = ticket.getStatus();
        ticket.setStatus(status);
        StoreTicket saved = repository.save(ticket);
        log.info("Ticket status changed id={} from={} to={}", id, previousStatus, status);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        StoreTicket ticket = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chamado não encontrado: " + id));
        repository.delete(ticket);
        log.info("Ticket deleted id={}", id);
    }

    @Transactional(readOnly = true)
    public TicketStatsResponse stats() {
        return new TicketStatsResponse(
                repository.count(),
                repository.countByStatus(TicketStatus.OPEN),
                repository.countByStatus(TicketStatus.IN_PROGRESS),
                repository.countByStatus(TicketStatus.RESOLVED),
                repository.countByPriority(TicketPriority.CRITICAL)
        );
    }

    private void applyRequest(StoreTicket ticket, StoreTicketRequest request) {
        ticket.setTitle(request.title().trim());
        ticket.setStoreCode(request.storeCode().trim());
        ticket.setRequesterName(request.requesterName().trim());
        ticket.setCategory(request.category());
        ticket.setPriority(request.priority());
        ticket.setDescription(request.description().trim());
        ticket.setCustomerImpact(Boolean.TRUE.equals(request.customerImpact()));
    }

    private StoreTicketResponse toResponse(StoreTicket ticket) {
        return new StoreTicketResponse(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getStoreCode(),
                ticket.getRequesterName(),
                ticket.getCategory(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getDescription(),
                ticket.isCustomerImpact(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt()
        );
    }

    private String normalizeSearch(String search) {
        if (search == null || search.isBlank()) {
            return null;
        }
        return search.trim();
    }

    private String logFilter(Enum<?> filter) {
        return filter == null ? "ALL" : filter.name();
    }

    private String logSearch(String search) {
        return search == null ? "EMPTY" : search;
    }
}
