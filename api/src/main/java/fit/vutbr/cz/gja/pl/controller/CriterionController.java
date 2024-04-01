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

import fit.vutbr.cz.gja.dal.entities.Criterion;
import fit.vutbr.cz.gja.bl.service.CriterionService;

/**
 * Activity criteria REST API
 * @author Martin Kmenta (xkment06)
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 27.12.2023
 */
@RestController
@RequestMapping("/api/criteria")
public class CriterionController {
    private final CriterionService _service;

    public CriterionController(CriterionService _service) {
        this._service = _service;
    }

    /**
     * Get criterion
     * @param id Criterion ID
     * @return Criterion
     */
    @GetMapping("/{id}")
    public Criterion getById(@PathVariable long id) {
        return _service.get(id).orElse(null);
    }

    /**
     * Get all criteria
     * @return All criteria
     */
    @GetMapping
    public Iterable<Criterion> getAll() {
        return _service.getAll();
    }

    /**
     * Get activity criteria
     * @param id Activity ID
     * @return Activity criteria
     */
    @GetMapping("/activity/{id}")
    public Iterable<Criterion> getAllByActivity(@PathVariable long id) {
        return _service.getAllByActivity(id);
    }

    /**
     * Create criterion
     * @param model Criterion
     * @return Created criterion
     */
    @PostMapping
    public Criterion create(@RequestBody Criterion model) {
        return _service.save(null,model);
    }

    /**
     * Update criterion
     * @param model Criterion
     * @return Updated criterion
     */
    @PutMapping
    public Criterion update(@RequestBody Criterion model) {
        return _service.update(null,model);
    }

    /**
     * Delete criterion
     * @param id Criterion ID
     */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {
        _service.delete(null,id);
    }
}
