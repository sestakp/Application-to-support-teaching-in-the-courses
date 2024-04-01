package fit.vutbr.cz.gja.pl.controller;

import fit.vutbr.cz.gja.bl.models.StudentModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fit.vutbr.cz.gja.dal.entities.Student;
import fit.vutbr.cz.gja.bl.service.StudentService;

/**
 * Course students REST API
 * @author Martin Kmenta (xkment06)
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 27.12.2023
 */
@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService _service;

    public StudentController(StudentService _service) {
        this._service = _service;
    }

    /**
     * Get student
     * @param id Student ID
     * @return Student
     */
    @GetMapping("/{id}")
    public Student getById(@PathVariable long id) {
        return _service.get(id).orElse(null);
    }

    /**
     * Get all students
     * @return All students
     */
    @GetMapping
    public Iterable<Student> getAll() {
        return _service.getAll();
    }

    /**
     * Get course students
     * @param id Course ID
     * @return Course students
     */
    @GetMapping("/course/{id}")
    public Iterable<Student> getAllByCourse(@PathVariable long id) {
        return _service.getAllByCourse(id);
    }

    /**
     * Create student
     * @param model Student
     * @return Created student
     */
    @PostMapping
    public Student create(@RequestBody StudentModel model) {
        return _service.save(null,model);
    }

    /**
     * Update student
     * @param model Student
     * @return Updated student
     */
    @PutMapping
    public Student update(@RequestBody Student model) {
        return _service.update(null,model);
    }

    /**
     * Delete student
     * @param id Student ID
     */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {
        _service.delete(null,id);
    }
}
