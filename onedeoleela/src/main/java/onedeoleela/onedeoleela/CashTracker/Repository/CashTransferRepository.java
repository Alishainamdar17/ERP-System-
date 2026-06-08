package onedeoleela.onedeoleela.CashTracker.Repository;

import onedeoleela.onedeoleela.CashTracker.Entity.CashTransfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CashTransferRepository extends JpaRepository<CashTransfer, Long> {

    List<CashTransfer> findByFromProjectIdOrToProjectIdOrderByTransferDateDesc(
            Long fromProjectId, Long toProjectId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM CashTransfer t WHERE t.fromProject.id = :projectId")
    BigDecimal sumTransfersOut(@Param("projectId") Long projectId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM CashTransfer t WHERE t.toProject.id = :projectId")
    BigDecimal sumTransfersIn(@Param("projectId") Long projectId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM CashTransfer t")
    BigDecimal sumAllTransfersOut();
}
