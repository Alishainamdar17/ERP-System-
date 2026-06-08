package onedeoleela.onedeoleela.Repository.Planning_Repository;

import onedeoleela.onedeoleela.Entity.Planing_Entity.Dependency;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DependencyRepository extends JpaRepository<Dependency, Long> {

    Dependency findBySuccessorId(Long id);

    List<Dependency> findByPredecessorId(Long id);
}
