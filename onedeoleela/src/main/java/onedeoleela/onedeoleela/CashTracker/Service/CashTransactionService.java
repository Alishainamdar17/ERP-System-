package onedeoleela.onedeoleela.CashTracker.Service;

import lombok.RequiredArgsConstructor;
import onedeoleela.onedeoleela.CashTracker.Dto.CashTrackerDto;
import onedeoleela.onedeoleela.CashTracker.Entity.CashAuditLog;
import onedeoleela.onedeoleela.CashTracker.Entity.CashProject;
import onedeoleela.onedeoleela.CashTracker.Entity.CashTransaction;
import onedeoleela.onedeoleela.CashTracker.Repository.CashTransactionRepository;
import onedeoleela.onedeoleela.Entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CashTransactionService {

    private final CashTransactionRepository transactionRepository;
    private final CashProjectService projectService;
    private final CashAuditService auditService;

    @Transactional
    public CashTrackerDto.TransactionResponse create(CashTrackerDto.TransactionCreateRequest req, User actor) {
        CashProject project = projectService.findById(req.getProjectId());

        CashTransaction.TransactionType type;
        try {
            type = CashTransaction.TransactionType.valueOf(req.getType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "type must be INCOME or EXPENSE");
        }

        CashTransaction tx = CashTransaction.builder()
                .project(project)
                .type(type)
                .amount(req.getAmount())
                .transactionDate(req.getTransactionDate() != null ? req.getTransactionDate() : LocalDate.now())
                .description(req.getDescription())
                .createdBy(actor)
                .build();
        tx = transactionRepository.save(tx);
        auditService.log("TRANSACTION", tx.getId(), CashAuditLog.AuditAction.CREATE,
                null, type + ":" + req.getAmount(), actor);
        return toResponse(tx);
    }

    @Transactional(readOnly = true)
    public List<CashTrackerDto.TransactionResponse> getByProject(Long projectId) {
        return transactionRepository
                .findByProjectIdOrderByTransactionDateDesc(projectId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CashTrackerDto.TransactionResponse getById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public void delete(Long id, User actor) {
        CashTransaction tx = findById(id);
        auditService.log("TRANSACTION", id, CashAuditLog.AuditAction.DELETE,
                tx.getType() + ":" + tx.getAmount(), null, actor);
        transactionRepository.delete(tx);
    }

    private CashTransaction findById(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Transaction not found: " + id));
    }

    private CashTrackerDto.TransactionResponse toResponse(CashTransaction tx) {
        return CashTrackerDto.TransactionResponse.builder()
                .id(tx.getId())
                .projectId(tx.getProject().getId())
                .projectName(tx.getProject().getName())
                .type(tx.getType().name())
                .amount(tx.getAmount())
                .transactionDate(tx.getTransactionDate())
                .description(tx.getDescription())
                .createdBy(tx.getCreatedBy().getFullName())
                .createdAt(tx.getCreatedAt())
                .build();
    }
}
