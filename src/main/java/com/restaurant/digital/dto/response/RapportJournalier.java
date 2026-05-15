package com.restaurant.digital.dto.response;

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
public class RapportJournalier {
    private LocalDateTime date;
    private Long nombreFactures;
    private BigDecimal chiffreAffaires;
    private BigDecimal ticketMoyen;
}