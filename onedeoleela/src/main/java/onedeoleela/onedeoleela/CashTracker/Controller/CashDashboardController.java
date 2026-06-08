package onedeoleela.onedeoleela.CashTracker.Controller;

import lombok.RequiredArgsConstructor;
import onedeoleela.onedeoleela.CashTracker.Dto.CashTrackerDto;
import onedeoleela.onedeoleela.CashTracker.Service.CashDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Dashboard summary endpoint for the Cash Tracker module.
 * Base path: /api/cash/dashboard
 */
@RestController
@RequestMapping("/api/cash/dashboard")
@CrossOrigin(origins = "${frontend.url}")
@RequiredArgsConstructor
public class CashDashboardController {

    private final CashDashboardService dashboardService;

    /** GET /api/cash/dashboard */
    @GetMapping
    public ResponseEntity<CashTrackerDto.ApiResponse<CashTrackerDto.DashboardResponse>> getDashboard() {
        return ResponseEntity.ok(
                CashTrackerDto.ApiResponse.ok(dashboardService.getDashboard()));
    }
}
