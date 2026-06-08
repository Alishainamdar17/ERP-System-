package onedeoleela.onedeoleela.Controller.Planning_Controller;


import onedeoleela.onedeoleela.Entity.Planing_Entity.*;
import onedeoleela.onedeoleela.Repository.Planning_Repository.*;
import onedeoleela.onedeoleela.Service.Planning_Service.*;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/planning_project/api/dependencies")
public class DependencyController {

    private final DependencyRepository repo;

    public DependencyController(DependencyRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public Dependency create(@RequestBody Dependency d) {
        return repo.save(d);
    }

    @GetMapping
    public List<Dependency> getAll() {
        return repo.findAll();
    }
}