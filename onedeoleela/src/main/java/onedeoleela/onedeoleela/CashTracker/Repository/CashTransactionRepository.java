package onedeoleela.onedeoleela.CashTracker.Repository;

import onedeoleela.onedeoleela.CashTracker.Entity.CashTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CashTransactionRepository extends JpaRepository<CashTransaction, Long> {

    List<CashTransaction> findByProjectIdOrderByTransactionDateDesc(Long projectId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM CashTransaction t " +
           "WHERE t.project.id = :projectId AND t.type = 'INCOME'")
    BigDecimal sumIncomeByProject(@Param("projectId") Long projectId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM CashTransaction t " +
           "WHERE t.project.id = :projectId AND t.type = 'EXPENSE'")
    BigDecimal sumExpenseByProject(@Param("projectId") Long projectId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM CashTransaction t WHERE t.type = 'INCOME'")
    BigDecimal sumAllIncome();

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM CashTransaction t WHERE t.type = 'EXPENSE'")
    BigDecimal sumAllExpense();
}
