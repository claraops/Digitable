package com.restaurant.digital.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Rapport journalier des ventes")
public class RapportJournalier {
    @Schema(description = "Date du rapport")
    private LocalDateTime date;
    @Schema(description = "Nombre de factures", example = "25")
    private Long nombreFactures;
    @Schema(description = "Chiffre d'affaires", example = "1250.00")
    private BigDecimal chiffreAffaires;
    @Schema(description = "Ticket moyen", example = "50.00")
    private BigDecimal ticketMoyen;
}