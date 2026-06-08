package onedeoleela.onedeoleela.Repository.Planning_Repository;

import onedeoleela.onedeoleela.Entity.Planing_Entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findByParentId(Long parentId);
    List<Task> findByProjectIdAndParentId(Long projectId, Long parentId); // parentId can be null
}