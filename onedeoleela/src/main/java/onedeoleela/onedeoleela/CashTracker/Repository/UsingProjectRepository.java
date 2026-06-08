package onedeoleela.onedeoleela.CashTracker.Repository;

import onedeoleela.onedeoleela.CashTracker.Entity.UsingProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface UsingProjectRepository extends JpaRepository<UsingProject, Long> {

    List<UsingProject> findByFundingProjectId(Long fundingProjectId);

    void deleteByFundingProjectId(Long fundingProjectId);

    @Query("SELECT COALESCE(SUM(u.amountGiven), 0) FROM UsingProject u WHERE u.fundingProject.id = :projectId")
    BigDecimal sumGivenByFundingProject(@Param("projectId") Long projectId);

    @Query("SELECT COALESCE(SUM(u.amountReturned), 0) FROM UsingProject u WHERE u.fundingProject.id = :projectId")
    BigDecimal sumReturnedByFundingProject(@Param("projectId") Long projectId);
}