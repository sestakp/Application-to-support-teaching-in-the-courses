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

import fit.vutbr.cz.gja.dal.entities.Assessment;
import fit.vutbr.cz.gja.bl.service.AssessmentService;

/**
 * Assessment REST API
 * @author Martin Kmenta (xkment06)
 * @author Daniel Peřina (xperin12)
 * @author Vojtěch Kulíšek (xkulis03)
 * @author Pavel Šesták (xsesta07)
 * @since 27.12.2023
 */
@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    private final AssessmentService _service;
    
    public AssessmentController(AssessmentService _service) {
        this._service = _service;
    }

    /**
     * Get assessment
     * @param id Assessment ID
     * @return Assessment
     */
    @GetMapping("/{id}")
    public Assessment getById(@PathVariable long id) {
        return _service.get(id).orElse(null);
    }

    /**
     * Get all assessments
     * @return All assessments
     */
    @GetMapping
    public Iterable<Assessment> getAll() {
        return _service.getAll();
    }

    /**
     * Get all assessments in task
     * @param id Task ID
     * @return Assessments in task
     * @throws Exception
     */
    @GetMapping("/task/{id}")
    public Iterable<Assessment> getAllByTask(@PathVariable long id) throws Exception {
        return  _service.getAllByTask(id);
    }

    /**
     * Get all assessments in activity
     * @param id Activity ID
     * @return Assessments in activity
     */
    @GetMapping("/activity/{id}")
    public Iterable<Assessment> getAllByActivity(@PathVariable long id) {
        return _service.getAllByActivity(id);        
    }

    /**
     * Create assessment
     * @param model Assessment
     * @return Created assessment
     */
    @PostMapping
    public Assessment create(@RequestBody Assessment model) {
        return _service.save(null,model);
    }

    /**
     * Update assessment
     * @param model Assessment
     * @return Updated assessment
     */
    @PutMapping
    public Assessment update(@RequestBody Assessment model) {
        return _service.update(null,model);
    }

    /**
     * Delete assessment
     * @param id Assessment ID
     */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {
        _service.delete(id);
    }
}