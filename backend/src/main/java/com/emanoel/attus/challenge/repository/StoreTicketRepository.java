package com.emanoel.attus.challenge.repository;

import com.emanoel.attus.challenge.model.StoreTicket;
import com.emanoel.attus.challenge.model.TicketPriority;
import com.emanoel.attus.challenge.model.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StoreTicketRepository extends JpaRepository<StoreTicket, Long> {

    @Query("""
            select ticket from StoreTicket ticket
            where (:status is null or ticket.status = :status)
              and (:priority is null or ticket.priority = :priority)
              and (
                :search is null
                or lower(ticket.title) like lower(concat('%', :search, '%'))
                or lower(ticket.storeCode) like lower(concat('%', :search, '%'))
                or lower(ticket.requesterName) like lower(concat('%', :search, '%'))
                or lower(ticket.description) like lower(concat('%', :search, '%'))
              )
            order by ticket.updatedAt desc, ticket.id desc
            """)
    List<StoreTicket> search(
            @Param("status") TicketStatus status,
            @Param("priority") TicketPriority priority,
            @Param("search") String search
    );

    long countByStatus(TicketStatus status);

    long countByPriority(TicketPriority priority);
}
