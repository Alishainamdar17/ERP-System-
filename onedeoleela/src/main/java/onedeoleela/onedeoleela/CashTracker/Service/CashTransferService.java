package onedeoleela.onedeoleela.CashTracker.Service;

import lombok.RequiredArgsConstructor;
import onedeoleela.onedeoleela.CashTracker.Dto.CashTrackerDto;
import onedeoleela.onedeoleela.CashTracker.Entity.CashAuditLog;
import onedeoleela.onedeoleela.CashTracker.Entity.CashProject;
import onedeoleela.onedeoleela.CashTracker.Entity.CashTransfer;
import onedeoleela.onedeoleela.CashTracker.Repository.CashTransferRepository;
import onedeoleela.onedeoleela.Entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CashTransferService {

    private final CashTransferRepository transferRepository;
    private final CashProjectService projectService;
    private final CashAuditService auditService;

    @Transactional
    public CashTrackerDto.TransferResponse create(CashTrackerDto.TransferCreateRequest req, User actor) {
        if (req.getFromProjectId().equals(req.getToProjectId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "fromProjectId and toProjectId must be different");
        }
        CashProject from = projectService.findById(req.getFromProjectId());
        CashProject to   = projectService.findById(req.getToProjectId());

        CashTransfer transfer = CashTransfer.builder()
                .fromProject(from)
                .toProject(to)
                .amount(req.getAmount())
                .transferDate(req.getTransferDate() != null ? req.getTransferDate() : LocalDate.now())
                .note(req.getNote())
                .createdBy(actor)
                .build();
        transfer = transferRepository.save(transfer);
        auditService.log("TRANSFER", transfer.getId(), CashAuditLog.AuditAction.CREATE,
                null, from.getName() + " → " + to.getName() + " ₹" + req.getAmount(), actor);
        return toResponse(transfer);
    }

    @Transactional(readOnly = true)
    public List<CashTrackerDto.TransferResponse> getByProject(Long projectId) {
        return transferRepository
                .findByFromProjectIdOrToProjectIdOrderByTransferDateDesc(projectId, projectId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<CashTrackerDto.TransferResponse> getAll() {
        return transferRepository.findAll()
                .stream().map(this::toResponse).toList();
    }

    private CashTrackerDto.TransferResponse toResponse(CashTransfer t) {
        return CashTrackerDto.TransferResponse.builder()
                .id(t.getId())
                .fromProjectId(t.getFromProject().getId())
                .fromProjectName(t.getFromProject().getName())
                .toProjectId(t.getToProject().getId())
                .toProjectName(t.getToProject().getName())
                .amount(t.getAmount())
                .transferDate(t.getTransferDate())
                .note(t.getNote())
                .createdBy(t.getCreatedBy().getFullName())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
