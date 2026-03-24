package com.restaurant.digital.dto.response;

import com.restaurant.digital.model.entity.Facture;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Data
@Builder
public class RapportJournalier {
    private LocalDateTime date;
    private Long nombreFactures;
    private BigDecimal chiffreAffaires;
    private BigDecimal ticketMoyen;
    private List<Facture> factures;
    
    public String getDateFormatted() {
        return date != null ? 
            date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) : 
            "";
    }
    
    public String getChiffreAffairesFormatted() {
        return chiffreAffaires != null ? 
            String.format("%.2f €", chiffreAffaires) : 
            "0.00 €";
    }
    
    public String getTicketMoyenFormatted() {
        return ticketMoyen != null ? 
            String.format("%.2f €", ticketMoyen) : 
            "0.00 €";
    }
}