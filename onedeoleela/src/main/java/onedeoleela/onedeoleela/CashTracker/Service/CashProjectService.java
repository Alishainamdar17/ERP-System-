package onedeoleela.onedeoleela.CashTracker.Service;

import lombok.RequiredArgsConstructor;
import onedeoleela.onedeoleela.CashTracker.Dto.CashTrackerDto;
import onedeoleela.onedeoleela.CashTracker.Entity.CashAuditLog;
import onedeoleela.onedeoleela.CashTracker.Entity.CashProject;
import onedeoleela.onedeoleela.CashTracker.Entity.CashReassignment;
import onedeoleela.onedeoleela.CashTracker.Entity.UsingProject;
import onedeoleela.onedeoleela.CashTracker.Repository.CashProjectRepository;
import onedeoleela.onedeoleela.CashTracker.Repository.CashReassignmentRepository;
import onedeoleela.onedeoleela.CashTracker.Repository.CashTransactionRepository;
import onedeoleela.onedeoleela.CashTracker.Repository.CashTransferRepository;
import onedeoleela.onedeoleela.CashTracker.Repository.UsingProjectRepository;
import onedeoleela.onedeoleela.Entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CashProjectService {

    private final CashProjectRepository        projectRepository;
    private final CashTransactionRepository    transactionRepository;
    private final CashTransferRepository       transferRepository;
    private final UsingProjectRepository       usingProjectRepository;
    private final CashReassignmentRepository   reassignmentRepository; // ← NAYA
    private final CashAuditService             auditService;

    // ── CREATE ────────────────────────────────────────────────────────────
    @Transactional
    public CashTrackerDto.ProjectResponse create(CashTrackerDto.ProjectCreateRequest req, User actor) {
        CashProject project = CashProject.builder()
                .name(req.getName())
                .clientName(req.getClientName())
                .totalValue(req.getTotalValue() != null ? req.getTotalValue() : BigDecimal.ZERO)
                .openingBalance(req.getOpeningBalance() != null ? req.getOpeningBalance() : BigDecimal.ZERO)
                .active(true)
                .createdBy(actor)
                .build();
        project = projectRepository.save(project);

        if (req.getUsingProjects() != null && !req.getUsingProjects().isEmpty()) {
            saveUsingProjects(project, req.getUsingProjects());
        }

        auditService.log("CASH_PROJECT", project.getId(), CashAuditLog.AuditAction.CREATE,
                null, project.getName(), actor);
        return toResponse(project);
    }

    // ── READ ──────────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<CashTrackerDto.ProjectResponse> getAll(Boolean active) {
        List<CashProject> projects;
        if (active == null)   projects = projectRepository.findAll();
        else if (active)      projects = projectRepository.findByActiveTrue();
        else                  projects = projectRepository.findByActiveFalse();
        return projects.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CashTrackerDto.ProjectResponse getById(Long id) {
        return toResponse(findById(id));
    }

    // ── UPDATE ────────────────────────────────────────────────────────────
    @Transactional
    public CashTrackerDto.ProjectResponse update(Long id, CashTrackerDto.ProjectUpdateRequest req, User actor) {
        CashProject project = findById(id);
        String oldName = project.getName();
        project.setName(req.getName());
        project.setClientName(req.getClientName());
        if (req.getTotalValue() != null) project.setTotalValue(req.getTotalValue());
        projectRepository.save(project);

        if (req.getUsingProjects() != null) {
            usingProjectRepository.deleteByFundingProjectId(id);
            if (!req.getUsingProjects().isEmpty()) {
                saveUsingProjects(project, req.getUsingProjects());
            }
        }

        auditService.log("CASH_PROJECT", id, CashAuditLog.AuditAction.UPDATE,
                oldName, req.getName(), actor);
        return toResponse(project);
    }

    // ── DEACTIVATE ────────────────────────────────────────────────────────
    @Transactional
    public void deactivate(Long id, User actor) {
        CashProject project = findById(id);
        project.setActive(false);
        projectRepository.save(project);
        auditService.log("CASH_PROJECT", id, CashAuditLog.AuditAction.DELETE,
                project.getName(), null, actor);
    }

    // ── USING PROJECTS ────────────────────────────────────────────────────

    @Transactional
    public CashTrackerDto.UsingProjectResponse addUsingProject(Long fundingProjectId,
                                                               CashTrackerDto.UsingProjectRequest req,
                                                               User actor) {
        CashProject fundingProject = findById(fundingProjectId);
        UsingProject up = UsingProject.builder()
                .fundingProject(fundingProject)
                .name(req.getName())
                .refNo(req.getRefNo())
                .amountGiven(req.getAmountGiven()       != null ? req.getAmountGiven()       : BigDecimal.ZERO)
                .amountReturned(req.getAmountReturned() != null ? req.getAmountReturned()    : BigDecimal.ZERO)
                .build();
        up = usingProjectRepository.save(up);
        auditService.log("USING_PROJECT", up.getId(), CashAuditLog.AuditAction.CREATE,
                null, up.getName(), actor);
        return toUsingResponse(up);
    }

    @Transactional
    public CashTrackerDto.UsingProjectResponse updateUsingProject(Long usingProjectId,
                                                                  CashTrackerDto.UsingProjectRequest req,
                                                                  User actor) {
        UsingProject up = findUsingById(usingProjectId);
        String oldName = up.getName();
        up.setName(req.getName());
        up.setRefNo(req.getRefNo());
        if (req.getAmountGiven()    != null) up.setAmountGiven(req.getAmountGiven());
        if (req.getAmountReturned() != null) up.setAmountReturned(req.getAmountReturned());
        up = usingProjectRepository.save(up);
        auditService.log("USING_PROJECT", up.getId(), CashAuditLog.AuditAction.UPDATE,
                oldName, up.getName(), actor);
        return toUsingResponse(up);
    }

    @Transactional
    public void deleteUsingProject(Long usingProjectId, User actor) {
        UsingProject up = findUsingById(usingProjectId);
        auditService.log("USING_PROJECT", usingProjectId, CashAuditLog.AuditAction.DELETE,
                up.getName(), null, actor);
        usingProjectRepository.delete(up);
    }

    @Transactional(readOnly = true)
    public List<CashTrackerDto.UsingProjectResponse> getUsingProjects(Long fundingProjectId) {
        return usingProjectRepository.findByFundingProjectId(fundingProjectId)
                .stream().map(this::toUsingResponse).toList();
    }

    // ── DEBT REASSIGNMENT ─────────────────────────────────────────────────
    @Transactional
    public CashTrackerDto.ReassignResponse reassignUsingProjects(CashTrackerDto.ReassignRequest req,
                                                                 User actor) {
        if (req.getUsingProjectIds() == null || req.getUsingProjectIds().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "usingProjectIds must not be empty");
        }

        // 1. Load all selected rows
        List<UsingProject> rows = req.getUsingProjectIds().stream()
                .map(this::findUsingById)
                .collect(Collectors.toList());

        // 2. Validate: all rows must share the same current funder
        List<Long> distinctFunderIds = rows.stream()
                .map(u -> u.getFundingProject().getId())
                .distinct()
                .collect(Collectors.toList());

        if (distinctFunderIds.size() > 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "All selected using-projects must belong to the same funding project. " +
                            "Found multiple funders: " + distinctFunderIds);
        }

        CashProject oldFunder = rows.get(0).getFundingProject();

        // 3. Validate: new funder exists and is different
        if (req.getNewFundingProjectId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "newFundingProjectId is required");
        }
        if (req.getNewFundingProjectId().equals(oldFunder.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "New funding project must be different from the current one");
        }

        CashProject newFunder = findById(req.getNewFundingProjectId());

        // 4. Perform FK swap + save history
        String noteSnippet = req.getNote() != null && !req.getNote().isBlank()
                ? " | Note: " + req.getNote()
                : "";

        for (UsingProject up : rows) {
            String oldVal = "fundingProject=" + oldFunder.getName()
                    + " | given=" + up.getAmountGiven()
                    + " | returned=" + up.getAmountReturned();
            String newVal = "fundingProject=" + newFunder.getName() + noteSnippet;

            // ── pending PEHLE calculate karo (before FK swap) ──
            BigDecimal pending = up.getAmountGiven().subtract(up.getAmountReturned());
            pending = pending.compareTo(BigDecimal.ZERO) > 0 ? pending : BigDecimal.ZERO;

            up.setFundingProject(newFunder);
            usingProjectRepository.save(up);

            auditService.log("USING_PROJECT", up.getId(),
                    CashAuditLog.AuditAction.UPDATE, oldVal, newVal, actor);

            // ── NAYA: reassign history save karo ──
            reassignmentRepository.save(CashReassignment.builder()
                    .usingProject(up)
                    .fromFundingProject(oldFunder)
                    .toFundingProject(newFunder)
                    .amount(pending)
                    .note(req.getNote())
                    .createdBy(actor)
                    .build());
        }

        // 5. Build response
        BigDecimal totalGiven = rows.stream()
                .map(UsingProject::getAmountGiven)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPending = rows.stream()
                .map(u -> u.getAmountGiven().subtract(u.getAmountReturned()))
                .map(p -> p.compareTo(BigDecimal.ZERO) > 0 ? p : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<CashTrackerDto.UsingProjectResponse> reassignedSnapshots = rows.stream()
                .map(this::toUsingResponse)
                .collect(Collectors.toList());

        return CashTrackerDto.ReassignResponse.builder()
                .reassignedCount(rows.size())
                .oldFundingProjectId(oldFunder.getId())
                .oldFundingProjectName(oldFunder.getName())
                .newFundingProjectId(newFunder.getId())
                .newFundingProjectName(newFunder.getName())
                .totalAmountReassigned(totalGiven)
                .totalPendingReassigned(totalPending)
                .reassigned(reassignedSnapshots)
                .build();
    }

    // ── ALL REASSIGNMENTS (Transfers page tab ke liye) ────────────────────
    @Transactional(readOnly = true)
    public List<CashTrackerDto.ReassignmentResponse> getAllReassignments() {
        return reassignmentRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(r -> CashTrackerDto.ReassignmentResponse.builder()
                        .id(r.getId())
                        .subProjectName(r.getUsingProject().getName())
                        .subProjectRefNo(r.getUsingProject().getRefNo())
                        .fromFunderName(r.getFromFundingProject().getName())
                        .toFunderName(r.getToFundingProject().getName())
                        .amount(r.getAmount())
                        .note(r.getNote())
                        .createdAt(r.getCreatedAt().toString())
                        .build())
                .collect(Collectors.toList());
    }

    // ── BALANCE ───────────────────────────────────────────────────────────
    public BigDecimal calculateBalance(Long projectId) {
        CashProject project = findById(projectId);
        BigDecimal income  = transactionRepository.sumIncomeByProject(projectId);
        BigDecimal expense = transactionRepository.sumExpenseByProject(projectId);
        BigDecimal out     = transferRepository.sumTransfersOut(projectId);
        BigDecimal in      = transferRepository.sumTransfersIn(projectId);
        return project.getOpeningBalance()
                .add(income)
                .subtract(expense)
                .subtract(out)
                .add(in);
    }

    // ── HELPERS ───────────────────────────────────────────────────────────
    public CashProject findById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Cash project not found: " + id));
    }

    private UsingProject findUsingById(Long id) {
        return usingProjectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Using project not found: " + id));
    }

    private void saveUsingProjects(CashProject project, List<CashTrackerDto.UsingProjectRequest> requests) {
        requests.forEach(r -> {
            UsingProject up = UsingProject.builder()
                    .fundingProject(project)
                    .name(r.getName())
                    .refNo(r.getRefNo())
                    .amountGiven(r.getAmountGiven()       != null ? r.getAmountGiven()       : BigDecimal.ZERO)
                    .amountReturned(r.getAmountReturned() != null ? r.getAmountReturned()    : BigDecimal.ZERO)
                    .build();
            usingProjectRepository.save(up);
        });
    }

    public CashTrackerDto.ProjectResponse toResponse(CashProject project) {
        BigDecimal balance = calculateBalance(project.getId());
        Double spentPct = null;
        if (project.getTotalValue().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal expense = transactionRepository.sumExpenseByProject(project.getId());
            spentPct = expense
                    .divide(project.getTotalValue(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

        List<UsingProject> usingList = usingProjectRepository.findByFundingProjectId(project.getId());
        BigDecimal totalGiven    = usingList.stream().map(UsingProject::getAmountGiven)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalReturned = usingList.stream().map(UsingProject::getAmountReturned)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalPending  = totalGiven.subtract(totalReturned);

        List<CashTrackerDto.UsingProjectResponse> usingResponses = usingList.stream()
                .map(this::toUsingResponse).toList();

        // ── NAYA: reassign history fetch karo ──
        List<CashTrackerDto.ReassignHistoryItem> reassignHistory =
                reassignmentRepository
                        .findByFromFundingProjectIdOrToFundingProjectIdOrderByCreatedAtDesc(
                                project.getId(), project.getId())
                        .stream()
                        .map(r -> CashTrackerDto.ReassignHistoryItem.builder()
                                .id(r.getId())
                                .usingProjectId(r.getUsingProject().getId())
                                .subProjectName(r.getUsingProject().getName())
                                .subProjectRefNo(r.getUsingProject().getRefNo())
                                .fromFunderId(r.getFromFundingProject().getId())
                                .fromFunderName(r.getFromFundingProject().getName())
                                .toFunderId(r.getToFundingProject().getId())
                                .toFunderName(r.getToFundingProject().getName())
                                .amount(r.getAmount())
                                .note(r.getNote())
                                .createdAt(r.getCreatedAt().toString())
                                .build())
                        .collect(Collectors.toList());

        return CashTrackerDto.ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .clientName(project.getClientName())
                .totalValue(project.getTotalValue())
                .openingBalance(project.getOpeningBalance())
                .currentBalance(balance)
                .active(project.isActive())
                .createdAt(project.getCreatedAt())
                .spentPercentage(spentPct)
                .usingProjects(usingResponses)
                .totalGivenOut(totalGiven)
                .totalReturned(totalReturned)
                .totalPending(totalPending)
                .reassignHistory(reassignHistory) // ← NAYA
                .build();
    }

    public CashTrackerDto.UsingProjectResponse toUsingResponse(UsingProject up) {
        BigDecimal pending = up.getAmountGiven().subtract(up.getAmountReturned());
        return CashTrackerDto.UsingProjectResponse.builder()
                .id(up.getId())
                .fundingProjectId(up.getFundingProject().getId())
                .fundingProjectName(up.getFundingProject().getName())
                .name(up.getName())
                .refNo(up.getRefNo())
                .amountGiven(up.getAmountGiven())
                .amountReturned(up.getAmountReturned())
                .pending(pending.compareTo(BigDecimal.ZERO) > 0 ? pending : BigDecimal.ZERO)
                .createdAt(up.getCreatedAt())
                .build();
    }
}