package onedeoleela.onedeoleela.CashTracker.Entity;

import jakarta.persistence.*;
import lombok.*;
import onedeoleela.onedeoleela.Entity.User;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Inter-project fund transfer: moves money from one CashProject to another.
 * Supports multi-hop flows (A→B, B→X, etc.) as described in the SRS.
 */
@Entity
@Table(name = "cash_transfers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CashTransfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_project_id", nullable = false)
    private CashProject fromProject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_project_id", nullable = false)
    private CashProject toProject;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "transfer_date", nullable = false)
    private LocalDate transferDate;

    @Column(columnDefinition = "TEXT")
    private String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
