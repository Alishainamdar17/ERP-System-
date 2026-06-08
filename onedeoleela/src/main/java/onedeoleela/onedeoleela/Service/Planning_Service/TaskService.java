package onedeoleela.onedeoleela.Service.Planning_Service;

import onedeoleela.onedeoleela.Entity.Planing_Entity.Task;
import onedeoleela.onedeoleela.Repository.Planning_Repository.TaskRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository repo;

    public TaskService(TaskRepository repo) {
        this.repo = repo;
    }

    // =========================
    // 🟢 ADD CHILD TASK (WBS AUTO GENERATION)
    // =========================
    public Task addChildTask(Long parentId, String name) {

        Task parent = repo.findById(parentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Parent not found"
                ));

        Task task = new Task();
        task.setName(name);
        task.setParentId(parentId);

        // WBS AUTO GENERATION
        List<Task> siblings = repo.findByParentId(parentId);
        String wbs = parent.getWbsId() + "." + (siblings.size() + 1);

        task.setWbsId(wbs);
        task.setStatus("NOT_STARTED");

        return repo.save(task);
    }

    // =========================
    // 🟢 UPDATE DATES
    // =========================
    public Task updateDates(Long id, LocalDate start, LocalDate end) {

        Task task = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Task not found"
                ));

        if (start != null && end != null && end.isBefore(start)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "End date cannot be before start date"
            );
        }

        task.setStartDate(start);
        task.setEndDate(end);

        // auto status update
        task.setStatus("IN_PROGRESS");

        return repo.save(task);
    }

    // =========================
    // 🟢 RESCHEDULE TASK (ERP CORE FEATURE)
    // =========================
    public Task rescheduleTask(Long id,
                               LocalDate newStart,
                               LocalDate newEnd,
                               String reason) {

        Task task = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Task not found"
                ));

        if (newStart == null || newEnd == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Start and End date required"
            );
        }

        if (newEnd.isBefore(newStart)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid date range"
            );
        }

        task.setStartDate(newStart);
        task.setEndDate(newEnd);
        task.setStatus("DELAYED");

        // optional field (add in entity)
        task.setDelayReason(reason);

        return repo.save(task);
    }

    // =========================
    // 🟢 DELAY UPDATE (SIMPLE FLOW)
    // =========================
    public Task updateDelay(Long id,
                            LocalDate revisedEndDate,
                            String reason) {

        Task task = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Task not found"
                ));

        if (revisedEndDate == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Revised date required"
            );
        }

        task.setEndDate(revisedEndDate);
        task.setStatus("DELAYED");
        task.setDelayReason(reason);

        return repo.save(task);
    }

    // =========================
    // 🟢 AUTO PROGRESS CALCULATION (NEW ERP LOGIC)
    // =========================
    public Task updateProgress(Long id, int progress) {

        Task task = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Task not found"
                ));

        if (progress < 0 || progress > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Progress must be 0-100"
            );
        }

        task.setProgressPercent(progress);

        if (progress == 100) {
            task.setStatus("DONE");
        } else if (progress > 0) {
            task.setStatus("IN_PROGRESS");
        } else {
            task.setStatus("NOT_STARTED");
        }

        return repo.save(task);
    }

    // =========================
    // 🟢 BULK STATUS UPDATE (PIPELINE SUPPORT)
    // =========================
    public void updatePipelineStatus(List<Long> taskIds, String status) {

        for (Long id : taskIds) {

            Task task = repo.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Task not found: " + id
                    ));

            task.setStatus(status);
            repo.save(task);
        }
    }
}