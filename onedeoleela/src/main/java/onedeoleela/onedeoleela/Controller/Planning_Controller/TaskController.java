package onedeoleela.onedeoleela.Controller.Planning_Controller;

import onedeoleela.onedeoleela.Entity.Planing_Entity.Task;
import onedeoleela.onedeoleela.Repository.Planning_Repository.TaskRepository;
import onedeoleela.onedeoleela.Service.Planning_Service.TaskService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/planning_project/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskRepository repo;
    private final TaskService service;

    public TaskController(TaskRepository repo, TaskService service) {
        this.repo = repo;
        this.service = service;
    }

    private LocalDate safeParse(Object val) {
        if (val == null) return null;
        String s = val.toString().trim();
        if (s.isEmpty()) return null;
        try { return LocalDate.parse(s.substring(0, 10)); } // handles "2026-04-10T00:00:00" too
        catch (Exception e) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid date: " + s); }
    }

    // ── CREATE WORK ORDER (root task) ──────────────────────────────────────────
    @PostMapping("/root")
    public Task createRoot(@RequestBody Map<String, String> body) {
        Long projectId = Long.parseLong(body.get("projectId"));

        // Count existing WOs for this project to generate sequential wbsId
        long woCount = repo.findByProjectIdAndParentId(projectId, null).size();

        Task t = new Task();
        t.setProjectId(projectId);
        t.setParentId(null);
        t.setWbsId("WO-" + (woCount + 1));
        t.setName(body.getOrDefault("name", "Work Order"));
        t.setWoNumber(body.get("woNumber"));
        t.setProjectCode(body.get("projectCode"));
        t.setStartDate(safeParse(body.get("startDate")));
        t.setEndDate(safeParse(body.get("endDate")));
        t.setStatus("NOT_STARTED");
        t.setProgressPercent(0);

        return repo.save(t);
    }

    // ── CREATE CHILD (line item / sub-task) ────────────────────────────────────
    @PostMapping("/{parentId}/child")
    public Task addChild(@PathVariable Long parentId, @RequestBody Map<String, String> body) {
        Task parent = repo.findById(parentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parent not found"));

        Task child = service.addChildTask(parentId, body.get("name"));
        child.setProjectId(parent.getProjectId());
        child.setStatus("NOT_STARTED");
        child.setProgressPercent(0);

        return repo.save(child);
    }

    // ── GET ALL TASKS FOR A PROJECT ────────────────────────────────────────────
    @GetMapping("/project/{projectId}")
    public List<Task> getByProject(@PathVariable Long projectId) {
        return repo.findByProjectId(projectId);
    }

    // ── UPDATE TASK (name, dept, person, progress, status, remark, sqft) ──────
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Task t = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        if (body.containsKey("name"))         t.setName((String) body.get("name"));
        if (body.containsKey("department"))   t.setDepartment((String) body.get("department"));
        if (body.containsKey("actionPerson")) t.setActionPerson((String) body.get("actionPerson"));
        if (body.containsKey("status"))       t.setStatus((String) body.get("status"));
        if (body.containsKey("remark"))       t.setRemark((String) body.get("remark"));

        if (body.containsKey("quantitySqft") && body.get("quantitySqft") != null)
            t.setQuantitySqft(((Number) body.get("quantitySqft")).doubleValue());

        if (body.containsKey("progressPercent") && body.get("progressPercent") != null)
            t.setProgressPercent(((Number) body.get("progressPercent")).intValue());

        return repo.save(t);
    }

    // ── UPDATE DATES ───────────────────────────────────────────────────────────
    @PutMapping("/{id}/dates")
    public Task updateDates(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Task t = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        t.setStartDate(safeParse(body.get("startDate")));
        t.setEndDate(safeParse(body.get("endDate")));

        return repo.save(t);
    }

    // ── DELETE (recursive — handles WOs with line items) ──────────────────────
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        deleteRecursive(id);
        return "Deleted";
    }

    private void deleteRecursive(Long id) {
        List<Task> children = repo.findByParentId(id);
        for (Task child : children) {
            deleteRecursive(child.getId());
        }
        repo.deleteById(id);
    }
}