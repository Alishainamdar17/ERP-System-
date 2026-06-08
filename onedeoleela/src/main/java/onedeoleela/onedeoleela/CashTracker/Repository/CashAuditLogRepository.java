package onedeoleela.onedeoleela.CashTracker.Repository;

import onedeoleela.onedeoleela.CashTracker.Entity.CashAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CashAuditLogRepository extends JpaRepository<CashAuditLog, Long> {

    Page<CashAuditLog> findAllByOrderByPerformedAtDesc(Pageable pageable);

    Page<CashAuditLog> findByEntityTypeAndEntityIdOrderByPerformedAtDesc(
            String entityType, Long entityId, Pageable pageable);
}
