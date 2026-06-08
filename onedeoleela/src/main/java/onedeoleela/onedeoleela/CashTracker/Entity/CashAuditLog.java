package onedeoleela.onedeoleela.CashTracker.Entity;

import jakarta.persistence.*;
import lombok.*;
import onedeoleela.onedeoleela.Entity.User;

import java.time.LocalDateTime;

/**
 * Immutable audit trail for every financial event in the Cash Tracker module.
 */
@Entity
@Table(name = "cash_audit_log")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CashAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entity_type", nullable = false)
    private String entityType;          // e.g. "CASH_PROJECT", "TRANSACTION", "TRANSFER"

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditAction action;

    @Column(name = "old_value", columnDefinition = "TEXT")
    private String oldValue;

    @Column(name = "new_value", columnDefinition = "TEXT")
    private String newValue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by", nullable = false)
    private User performedBy;

    @Column(name = "performed_at", nullable = false, updatable = false)
    private LocalDateTime performedAt;

    @PrePersist
    protected void onCreate() {
        performedAt = LocalDateTime.now();
    }

    public enum AuditAction { CREATE, UPDATE, DELETE }
}
