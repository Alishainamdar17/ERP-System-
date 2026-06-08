package onedeoleela.onedeoleela.CashTracker.Repository;

import onedeoleela.onedeoleela.CashTracker.Entity.CashProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CashProjectRepository extends JpaRepository<CashProject, Long> {

    List<CashProject> findByActiveTrue();

    List<CashProject> findByActiveFalse();
}
