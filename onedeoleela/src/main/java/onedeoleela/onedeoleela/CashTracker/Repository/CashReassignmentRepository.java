package onedeoleela.onedeoleela.CashTracker.Repository;

import onedeoleela.onedeoleela.CashTracker.Entity.CashReassignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CashReassignmentRepository extends JpaRepository<CashReassignment, Long> {

    List<CashReassignment> findByFromFundingProjectIdOrToFundingProjectIdOrderByCreatedAtDesc(
            Long fromId, Long toId
    );

    List<CashReassignment> findAllByOrderByCreatedAtDesc();
}