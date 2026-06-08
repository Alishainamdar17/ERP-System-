package onedeoleela.onedeoleela.CashTracker.Service;

import lombok.RequiredArgsConstructor;
import onedeoleela.onedeoleela.CashTracker.Entity.CashAuditLog;
import onedeoleela.onedeoleela.CashTracker.Repository.CashAuditLogRepository;
import onedeoleela.onedeoleela.Entity.User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CashAuditService {

    private final CashAuditLogRepository auditLogRepository;

    public void log(String entityType, Long entityId,
                    CashAuditLog.AuditAction action,
                    String oldValue, String newValue,
                    User actor) {
        CashAuditLog log = CashAuditLog.builder()
                .entityType(entityType)
                .entityId(entityId)
                .action(action)
                .oldValue(oldValue)
                .newValue(newValue)
                .performedBy(actor)
                .build();
        auditLogRepository.save(log);
    }
}
