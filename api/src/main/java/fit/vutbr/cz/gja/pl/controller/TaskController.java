package fit.vutbr.cz.gja.pl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fit.vutbr.cz.gja.dal.entities.Task;
import fit.vutbr.cz.gja.bl.service.TaskService;

/**
 * Course tasks REST API
 * @author Martin Kmenta (xkment06)
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 27.12.2023
 */
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService _service;

    public TaskController(TaskService _service) {
        this._service = _service;
    }

    /**
     * Get task
     * @param id Task ID
     * @return Task
     */
    @GetMapping("/{id}")
    public Task getById(@PathVariable long id) {
        return _service.get(id).orElse(null);
    }

    /**
     * Get all tasks
     * @return All tasks
     */
    @GetMapping
    public Iterable<Task> getAll() {
        return _service.getAll();
    }

    /**
     * Get course tasks
     * @param id Course ID
     * @return Course tasks
     */
    @GetMapping("/course/{id}")
    public Iterable<Task> getAllByTask(@PathVariable long id) {
        return _service.getAllByCourse(id);
    }

    /**
     * Create task
     * @param model Task
     * @return Created task
     */
    @PostMapping
    public Task create(@RequestBody Task model) {
        return _service.save(null,model);
    }

    /**
     * Update task
     * @param model Task
     * @return Updated task
     */
    @PutMapping
    public Task update(@RequestBody Task model) {
        return _service.update(null,model);
    }

    /**
     * Delete task
     * @param id Task ID
     */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {
        _service.delete(null,id);
    }
}
