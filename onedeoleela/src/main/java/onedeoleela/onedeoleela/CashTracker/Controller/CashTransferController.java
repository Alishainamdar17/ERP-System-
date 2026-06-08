package onedeoleela.onedeoleela.CashTracker.Controller;

import lombok.RequiredArgsConstructor;
import onedeoleela.onedeoleela.CashTracker.Dto.CashTrackerDto;
import onedeoleela.onedeoleela.CashTracker.Service.CashTransferService;
import onedeoleela.onedeoleela.Entity.User;
import onedeoleela.onedeoleela.Repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST endpoints for inter-project fund transfers.
 * Base path: /api/cash/transfers
 */
@RestController
@RequestMapping("/api/cash/transfers")
@CrossOrigin(origins = "${frontend.url}")
@RequiredArgsConstructor
public class CashTransferController {

    private final CashTransferService transferService;
    private final UserRepository userRepository;

    private User resolveUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
    }

    /** POST /api/cash/transfers?userId=1 */
    @PostMapping
    public ResponseEntity<CashTrackerDto.ApiResponse<CashTrackerDto.TransferResponse>> create(
            @RequestBody CashTrackerDto.TransferCreateRequest request,
            @RequestParam Long userId) {
        return ResponseEntity.ok(
                CashTrackerDto.ApiResponse.ok(transferService.create(request, resolveUser(userId))));
    }

    /** GET /api/cash/transfers */
    @GetMapping
    public ResponseEntity<CashTrackerDto.ApiResponse<List<CashTrackerDto.TransferResponse>>> getAll() {
        return ResponseEntity.ok(
                CashTrackerDto.ApiResponse.ok(transferService.getAll()));
    }

    /** GET /api/cash/transfers/project/{projectId} */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<CashTrackerDto.ApiResponse<List<CashTrackerDto.TransferResponse>>> getByProject(
            @PathVariable Long projectId) {
        return ResponseEntity.ok(
                CashTrackerDto.ApiResponse.ok(transferService.getByProject(projectId)));
    }
}
