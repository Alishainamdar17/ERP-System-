package onedeoleela.onedeoleela.CashTracker.Entity;

import jakarta.persistence.*;
import lombok.*;
import onedeoleela.onedeoleela.Entity.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Represents a financial project with its own cash balance.
 * Linked to the existing Onedeoleela User entity.
 */
@Entity
@Table(name = "cash_projects")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CashProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "client_name")
    private String clientName;

    @Column(name = "total_value", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalValue = BigDecimal.ZERO;

    @Column(name = "opening_balance", nullable = false, precision = 15, scale = 2)
    private BigDecimal openingBalance = BigDecimal.ZERO;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    /** Creator linked to Onedeoleela's existing User entity */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
