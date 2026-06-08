package onedeoleela.onedeoleela.CashTracker.Controller;

import lombok.RequiredArgsConstructor;
import onedeoleela.onedeoleela.CashTracker.Dto.CashTrackerDto;
import onedeoleela.onedeoleela.CashTracker.Service.CashTransactionService;
import onedeoleela.onedeoleela.Entity.User;
import onedeoleela.onedeoleela.Repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST endpoints for income/expense transactions.
 * Base path: /api/cash/transactions
 */
@RestController
@RequestMapping("/api/cash/transactions")
@CrossOrigin(origins = "${frontend.url}")
@RequiredArgsConstructor
public class CashTransactionController {

    private final CashTransactionService transactionService;
    private final UserRepository userRepository;

    private User resolveUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
    }

    /** POST /api/cash/transactions?userId=1 */
    @PostMapping
    public ResponseEntity<CashTrackerDto.ApiResponse<CashTrackerDto.TransactionResponse>> create(
            @RequestBody CashTrackerDto.TransactionCreateRequest request,
            @RequestParam Long userId) {
        return ResponseEntity.ok(
                CashTrackerDto.ApiResponse.ok(transactionService.create(request, resolveUser(userId))));
    }

    /** GET /api/cash/transactions/project/{projectId} */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<CashTrackerDto.ApiResponse<List<CashTrackerDto.TransactionResponse>>> getByProject(
            @PathVariable Long projectId) {
        return ResponseEntity.ok(
                CashTrackerDto.ApiResponse.ok(transactionService.getByProject(projectId)));
    }

    /** GET /api/cash/transactions/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<CashTrackerDto.ApiResponse<CashTrackerDto.TransactionResponse>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                CashTrackerDto.ApiResponse.ok(transactionService.getById(id)));
    }

    /** DELETE /api/cash/transactions/{id}?userId=1 */
    @DeleteMapping("/{id}")
    public ResponseEntity<CashTrackerDto.ApiResponse<Void>> delete(
            @PathVariable Long id,
            @RequestParam Long userId) {
        transactionService.delete(id, resolveUser(userId));
        return ResponseEntity.ok(
                CashTrackerDto.ApiResponse.ok("Transaction deleted", null));
    }
}
