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

import fit.vutbr.cz.gja.dal.entities.Activity;
import fit.vutbr.cz.gja.bl.service.ActivityService;

/**
 * Activity REST API
 * @author Martin Kmenta (xkment06)
 * @author Daniel Peřina (xperin12)
 * @author Vojtěch Kulíšek (xkulis03)
 * @author Pavel Šesták (xsesta07)
 * @since 27.12.2023
 */
@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService _service;

    public ActivityController(ActivityService _service) {
        this._service = _service;
    }

    /**
     * Get activity
     * @param id Acitivity ID
     * @return Activity
     */
    @GetMapping("/{id}")
    public Activity getById(@PathVariable long id) {
        return _service.get(id).orElse(null);
    }

    /**
     * Get all activities in course
     * @param id Course ID
     * @return Activities in course
     */
    @GetMapping("/course/{id}")
    public Iterable<Activity> getAllByCourse(@PathVariable long id) {
        return _service.getAllByCourse(id);
    }

    /**
     * Get all activities
     * @return All activities
     */
    @GetMapping
    public Iterable<Activity> getAll() {
        return _service.getAll();
    }

    /**
     * Create activity
     * @param model Activity
     * @return Created activity
     */
    @PostMapping
    public Activity create(@RequestBody Activity model) {
        return _service.save(null, model);
    }

    /**
     * Update activity
     * @param model Activity
     * @return Updated activity
     */
    @PutMapping
    public Activity update(@RequestBody Activity model) {
        return _service.update(null, model);
    }

    /**
     * Delete activity
     * @param id Activity ID
     */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {
        _service.delete(null, id);
    }
}
