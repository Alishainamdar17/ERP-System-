package onedeoleela.onedeoleela.CashTracker.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Represents a sub-project under a Funding Project.
 * e.g. Vasant Hyderabad (funding) → Soltaire Business Hub ODL1017 (using)
 */
@Entity
@Table(name = "cash_using_projects")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UsingProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The parent funding project */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funding_project_id", nullable = false)
    private CashProject fundingProject;

    @Column(nullable = false)
    private String name;

    @Column(name = "ref_no")
    private String refNo;

    /** Amount given out to this using project */
    @Column(name = "amount_given", precision = 15, scale = 2)
    private BigDecimal amountGiven = BigDecimal.ZERO;

    /** Amount returned back from this using project */
    @Column(name = "amount_returned", precision = 15, scale = 2)
    private BigDecimal amountReturned = BigDecimal.ZERO;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (amountGiven == null) amountGiven = BigDecimal.ZERO;
        if (amountReturned == null) amountReturned = BigDecimal.ZERO;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}