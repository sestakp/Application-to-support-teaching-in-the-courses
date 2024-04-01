package fit.vutbr.cz.gja.pl.controller;

import fit.vutbr.cz.gja.bl.annotations.SecureMethod;
import fit.vutbr.cz.gja.bl.models.CourseModel;
import fit.vutbr.cz.gja.dal.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import fit.vutbr.cz.gja.dal.entities.Course;
import fit.vutbr.cz.gja.bl.service.CourseService;

/**
 * Courses REST API
 * @author Martin Kmenta (xkment06)
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 25.12.2023
 */
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService _service;

    public CourseController(CourseService _service) {
        this._service = _service;
    }


    /**
     * Get course
     * @param id Course ID
     * @return Course
     */
    @GetMapping("/{id}")
    public CourseModel getById(@PathVariable long id) {
        return _service.get(null, id).orElse(null);
    }

    /**
     * Get all courses
     * @return All courses
     */
    @GetMapping
    public Iterable<Course> getAll() {
        return _service.getAll(null);
    }

    /**
     * Create course
     * @param model Course
     * @return Created course
     */
    @PostMapping
    public Course create(@RequestBody Course model) {
        return _service.save(null, model);
    }

    /**
     * Update course
     * @param model Course
     * @return Updated course
     */
    @PutMapping
    public Course update(@RequestBody Course model) {
        return _service.update(null, model);
    }

    /**
     * Delete course
     * @param id Course ID
     */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {
        _service.delete(null, id);
    }
}
