package onedeoleela.onedeoleela.CashTracker.Controller;

import lombok.RequiredArgsConstructor;
import onedeoleela.onedeoleela.CashTracker.Dto.CashTrackerDto;
import onedeoleela.onedeoleela.CashTracker.Service.CashProjectService;
import onedeoleela.onedeoleela.Entity.User;
import onedeoleela.onedeoleela.Repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST endpoints for Cash Tracker projects.
 * Base path: /api/cash/projects
 */
@RestController
@RequestMapping("/api/cash/projects")
@CrossOrigin(origins = "${frontend.url}")
@RequiredArgsConstructor
public class CashProjectController {

    private final CashProjectService projectService;
    private final UserRepository     userRepository;

    private User resolveUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
    }

    // ── PROJECTS ─────────────────────────────────────────────────────────

    /** POST /api/cash/projects?userId=1 */
    @PostMapping
    public ResponseEntity<CashTrackerDto.ApiResponse<CashTrackerDto.ProjectResponse>> create(
            @RequestBody CashTrackerDto.ProjectCreateRequest request,
            @RequestParam Long userId) {
        return ResponseEntity.ok(
                CashTrackerDto.ApiResponse.ok(projectService.create(request, resolveUser(userId))));
    }

    /** GET /api/cash/projects[?active=true|false] */
    @GetMapping
    public ResponseEntity<CashTrackerDto.ApiResponse<List<CashTrackerDto.ProjectResponse>>> getAll(
            @RequestParam(required = false) Boolean active) {
        return ResponseEntity.ok(
                CashTrackerDto.ApiResponse.ok(projectService.getAll(active)));
    }

    /** GET /api/cash/projects/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<CashTrackerDto.ApiResponse<CashTrackerDto.ProjectResponse>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                CashTrackerDto.ApiResponse.ok(projectService.getById(id)));
    }

    /** PUT /api/cash/projects/{id}?userId=1 */
    @PutMapping("/{id}")
    public ResponseEntity<CashTrackerDto.ApiResponse<CashTrackerDto.ProjectResponse>> update(
            @PathVariable Long id,
            @RequestBody CashTrackerDto.ProjectUpdateRequest request,
            @RequestParam Long userId) {
        return ResponseEntity.ok(
                CashTrackerDto.ApiResponse.ok(projectService.update(id, request, resolveUser(userId))));
    }

    /** DELETE /api/cash/projects/{id}?userId=1 */
    @DeleteMapping("/{id}")
    public ResponseEntity<CashTrackerDto.ApiResponse<Void>> deactivate(
            @PathVariable Long id,
            @RequestParam Long userId) {
        projectService.deactivate(id, resolveUser(userId));
        return ResponseEntity.ok(
                CashTrackerDto.ApiResponse.ok("Project deactivated", null));
    }

    // ── USING PROJECTS ────────────────────────────────────────────────────

    /** GET /api/cash/projects/{id}/using */
    @GetMapping("/{id}/using")
    public ResponseEntity<CashTrackerDto.ApiResponse<List<CashTrackerDto.UsingProjectResponse>>> getUsingProjects(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                CashTrackerDto.ApiResponse.ok(projectService.getUsingProjects(id)));
    }

    /** POST /api/cash/projects/{id}/using?userId=1 */
    @PostMapping("/{id}/using")
    public ResponseEntity<CashTrackerDto.ApiResponse<CashTrackerDto.UsingProjectResponse>> addUsingProject(
            @PathVariable Long id,
            @RequestBody CashTrackerDto.UsingProjectRequest request,
            @RequestParam Long userId) {
        return ResponseEntity.ok(
                CashTrackerDto.ApiResponse.ok(projectService.addUsingProject(id, request, resolveUser(userId))));
    }

    /** PUT /api/cash/projects/using/{usingId}?userId=1 */
    @PutMapping("/using/{usingId}")
    public ResponseEntity<CashTrackerDto.ApiResponse<CashTrackerDto.UsingProjectResponse>> updateUsingProject(
            @PathVariable Long usingId,
            @RequestBody CashTrackerDto.UsingProjectRequest request,
            @RequestParam Long userId) {
        return ResponseEntity.ok(
                CashTrackerDto.ApiResponse.ok(projectService.updateUsingProject(usingId, request, resolveUser(userId))));
    }

    /** DELETE /api/cash/projects/using/{usingId}?userId=1 */
    @DeleteMapping("/using/{usingId}")
    public ResponseEntity<CashTrackerDto.ApiResponse<Void>> deleteUsingProject(
            @PathVariable Long usingId,
            @RequestParam Long userId) {
        projectService.deleteUsingProject(usingId, resolveUser(userId));
        return ResponseEntity.ok(
                CashTrackerDto.ApiResponse.ok("Using project deleted", null));
    }

    // ── DEBT REASSIGNMENT  ← NEW ──────────────────────────────────────────

    /**
     * POST /api/cash/projects/using/reassign?userId=1
     *
     * Moves a list of UsingProject rows from their current funder to a new funder.
     * All selected rows must currently belong to the same funding project.
     *
     * Request body:
     * {
     *   "usingProjectIds": [5, 8],
     *   "newFundingProjectId": 3,
     *   "note": "Raheja funded Aura; debts transferred"
     * }
     *
     * IMPORTANT: This endpoint is mapped BEFORE /{id}/using to avoid Spring
     * treating "reassign" as a path variable.
     */
    @PostMapping("/using/reassign")
    public ResponseEntity<CashTrackerDto.ApiResponse<CashTrackerDto.ReassignResponse>> reassignUsingProjects(
            @RequestBody CashTrackerDto.ReassignRequest request,
            @RequestParam Long userId) {
        return ResponseEntity.ok(
                CashTrackerDto.ApiResponse.ok(
                        projectService.reassignUsingProjects(request, resolveUser(userId))));
    }
    /** GET /api/cash/projects/reassignments */
    @GetMapping("/reassignments")
    public ResponseEntity<CashTrackerDto.ApiResponse<List<CashTrackerDto.ReassignmentResponse>>> getAllReassignments() {
        return ResponseEntity.ok(
                CashTrackerDto.ApiResponse.ok(projectService.getAllReassignments()));
    }

}
