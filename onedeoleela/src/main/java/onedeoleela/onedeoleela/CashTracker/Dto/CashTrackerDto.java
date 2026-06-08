package onedeoleela.onedeoleela.CashTracker.Dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * All request/response DTOs for the Cash Tracker module.
 * Grouped as inner classes to keep things tidy.
 */
public class CashTrackerDto {

    // ─────────────────────────────────────────────
    //  PROJECT
    // ─────────────────────────────────────────────

    @Getter @Setter
    public static class ProjectCreateRequest {
        private String name;
        private String clientName;
        private BigDecimal totalValue;
        private BigDecimal openingBalance = BigDecimal.ZERO;
        private List<UsingProjectRequest> usingProjects;
    }

    @Getter @Setter
    public static class ProjectUpdateRequest {
        private String name;
        private String clientName;
        private BigDecimal totalValue;
        private List<UsingProjectRequest> usingProjects;
    }

    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ProjectResponse {
        private Long id;
        private String name;
        private String clientName;
        private BigDecimal totalValue;
        private BigDecimal openingBalance;
        private BigDecimal currentBalance;
        private boolean active;
        private LocalDateTime createdAt;
        private Double spentPercentage;
        private List<UsingProjectResponse> usingProjects;
        private BigDecimal totalGivenOut;
        private BigDecimal totalReturned;
        private BigDecimal totalPending;
        private List<ReassignHistoryItem> reassignHistory;
    }

    // ── Reassign History item (for project summary response) ──
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ReassignHistoryItem {
        private Long   id;
        private Long   usingProjectId;
        private String subProjectName;   // usingProject.name
        private String subProjectRefNo;  // usingProject.refNo
        private Long   fromFunderId;
        private String fromFunderName;   // fromFundingProject.name
        private Long   toFunderId;
        private String toFunderName;     // toFundingProject.name
        private BigDecimal amount;
        private String note;
        private String createdAt;        // ISO string for frontend
    }

    // ── All reassignments list (for Transfers page tab) ──
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ReassignmentResponse {
        private Long   id;
        private String subProjectName;
        private String subProjectRefNo;
        private String fromFunderName;
        private String toFunderName;
        private BigDecimal amount;
        private String note;
        private String createdAt;
    }

    // ─────────────────────────────────────────────
    //  USING PROJECT
    // ─────────────────────────────────────────────

    @Getter @Setter
    public static class UsingProjectRequest {
        private String name;
        private String refNo;
        private BigDecimal amountGiven;
        private BigDecimal amountReturned;
    }

    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class UsingProjectResponse {
        private Long id;
        private Long fundingProjectId;
        private String fundingProjectName;
        private String name;
        private String refNo;
        private BigDecimal amountGiven;
        private BigDecimal amountReturned;
        private BigDecimal pending;
        private LocalDateTime createdAt;
    }

    // ─────────────────────────────────────────────
    //  DEBT REASSIGNMENT  ← NEW
    // ─────────────────────────────────────────────

    /**
     * Request body for POST /api/cash/projects/using/reassign
     *
     * Example:
     * {
     *   "usingProjectIds": [5, 8],
     *   "newFundingProjectId": 3,
     *   "note": "Raheja funded Aura; Project1 and Project2 debt transferred to Raheja"
     * }
     */
    @Getter @Setter
    public static class ReassignRequest {
        /** IDs of UsingProject rows to move — must all belong to same current funder */
        private List<Long> usingProjectIds;

        /** The CashProject that will become the new fundingProject FK */
        private Long newFundingProjectId;

        /** Optional free-text note recorded in audit log */
        private String note;
    }

    /**
     * Response body returned after a successful reassignment.
     *
     * Example:
     * {
     *   "reassignedCount": 2,
     *   "oldFundingProjectId": 1,
     *   "oldFundingProjectName": "Aura",
     *   "newFundingProjectId": 3,
     *   "newFundingProjectName": "Raheja",
     *   "totalAmountReassigned": 100000,
     *   "totalPendingReassigned": 100000,
     *   "reassigned": [ { id, name, amountGiven, amountReturned, pending }, ... ]
     * }
     */
    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ReassignResponse {
        private int reassignedCount;
        private Long oldFundingProjectId;
        private String oldFundingProjectName;
        private Long newFundingProjectId;
        private String newFundingProjectName;
        /** Sum of amountGiven across all moved rows */
        private BigDecimal totalAmountReassigned;
        /** Sum of pending (amountGiven − amountReturned) across all moved rows */
        private BigDecimal totalPendingReassigned;
        /** Snapshot of each moved row (id, name, amountGiven, amountReturned, pending) */
        private List<UsingProjectResponse> reassigned;
    }

    // ─────────────────────────────────────────────
    //  TRANSACTION
    // ─────────────────────────────────────────────

    @Getter @Setter
    public static class TransactionCreateRequest {
        private Long projectId;
        private String type;            // "INCOME" or "EXPENSE"
        private BigDecimal amount;
        private LocalDate transactionDate;
        private String description;
    }

    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class TransactionResponse {
        private Long id;
        private Long projectId;
        private String projectName;
        private String type;
        private BigDecimal amount;
        private LocalDate transactionDate;
        private String description;
        private String createdBy;
        private LocalDateTime createdAt;
    }

    // ─────────────────────────────────────────────
    //  TRANSFER
    // ─────────────────────────────────────────────

    @Getter @Setter
    public static class TransferCreateRequest {
        private Long fromProjectId;
        private Long toProjectId;
        private BigDecimal amount;
        private LocalDate transferDate;
        private String note;
    }

    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class TransferResponse {
        private Long id;
        private Long fromProjectId;
        private String fromProjectName;
        private Long toProjectId;
        private String toProjectName;
        private BigDecimal amount;
        private LocalDate transferDate;
        private String note;
        private String createdBy;
        private LocalDateTime createdAt;
    }

    // ─────────────────────────────────────────────
    //  DASHBOARD
    // ─────────────────────────────────────────────

    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DashboardResponse {
        private int totalProjects;
        private int activeProjects;
        private BigDecimal totalBalance;
        private BigDecimal totalIncome;
        private BigDecimal totalExpense;
        private BigDecimal totalTransfersOut;
        private int projectsInShortfall;
        private BigDecimal totalGivenOut;
        private BigDecimal totalReturned;
        private BigDecimal totalPending;
        private List<ReassignHistoryItem> reassignHistory;
    }

    // ─────────────────────────────────────────────
    //  AUDIT
    // ─────────────────────────────────────────────

    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class AuditResponse {
        private Long id;
        private String entityType;
        private Long entityId;
        private String action;
        private String oldValue;
        private String newValue;
        private String performedBy;
        private LocalDateTime performedAt;
    }

    // ─────────────────────────────────────────────
    //  GENERIC API WRAPPER
    // ─────────────────────────────────────────────

    @Getter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;

        public static <T> ApiResponse<T> ok(T data) {
            return ApiResponse.<T>builder().success(true).message("OK").data(data).build();
        }

        public static <T> ApiResponse<T> ok(String message, T data) {
            return ApiResponse.<T>builder().success(true).message(message).data(data).build();
        }
    }
}
