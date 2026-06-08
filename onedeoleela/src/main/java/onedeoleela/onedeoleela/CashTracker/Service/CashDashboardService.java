package onedeoleela.onedeoleela.CashTracker.Service;

import lombok.RequiredArgsConstructor;
import onedeoleela.onedeoleela.CashTracker.Dto.CashTrackerDto;
import onedeoleela.onedeoleela.CashTracker.Repository.CashProjectRepository;
import onedeoleela.onedeoleela.CashTracker.Repository.CashTransactionRepository;
import onedeoleela.onedeoleela.CashTracker.Repository.CashTransferRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CashDashboardService {

    private final CashProjectRepository projectRepository;
    private final CashTransactionRepository transactionRepository;
    private final CashTransferRepository transferRepository;
    private final CashProjectService projectService;

    @Transactional(readOnly = true)
    public CashTrackerDto.DashboardResponse getDashboard() {
        var allProjects = projectRepository.findAll();
        var activeProjects = projectRepository.findByActiveTrue();

        BigDecimal totalBalance = activeProjects.stream()
                .map(p -> projectService.calculateBalance(p.getId()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long shortfallCount = activeProjects.stream()
                .filter(p -> projectService.calculateBalance(p.getId())
                        .compareTo(BigDecimal.ZERO) < 0)
                .count();

        return CashTrackerDto.DashboardResponse.builder()
                .totalProjects(allProjects.size())
                .activeProjects(activeProjects.size())
                .totalBalance(totalBalance)
                .totalIncome(transactionRepository.sumAllIncome())
                .totalExpense(transactionRepository.sumAllExpense())
                .totalTransfersOut(transferRepository.sumAllTransfersOut())
                .projectsInShortfall((int) shortfallCount)
                .build();
    }
}
