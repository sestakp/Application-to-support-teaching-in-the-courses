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

import fit.vutbr.cz.gja.dal.entities.Type;
import fit.vutbr.cz.gja.bl.service.TypeService;

/**
 * Course types REST API
 * @author Martin Kmenta (xkment06)
 * @author Daniel Peřina (xperin12)
 * @author Vojtěch Kulíšek (xkulis03)
 * @author Pavel Šesták (xsesta07)
 * @since 27.12.2023
 */
@RestController
@RequestMapping("/api/types")
public class TypeController {

    private final TypeService _service;

    public TypeController(TypeService _service) {
        this._service = _service;
    }

    /**
     * Get type
     * @param id Type id
     * @return Type
     */
    @GetMapping("/{id}")
    public Type getById(@PathVariable long id) {
        return _service.get(id).orElse(null);
    }

    /**
     * Get all types
     * @return All types
     */
    @GetMapping
    public Iterable<Type> getAll() {
        return _service.getAll();
    }

    /**
     * Get course types
     * @param id Course ID
     * @return Course types
     */
    @GetMapping("/course/{id}")
    public Iterable<Type> getAllByCourse(@PathVariable long id) {
        return _service.getAllByCourse(id);
    }

    /**
     * Create type
     * @param model Type
     * @return Created type
     */
    @PostMapping
    public Type create(@RequestBody Type model) {
        return _service.save(null,model);
    }

    /**
     * Update type
     * @param model Type
     * @return Updated type
     */
    @PutMapping
    public Type update(@RequestBody Type model) {
        return _service.update(null,model);
    }

    /**
     * Delete type
     * @param id Type ID
     */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {
        _service.delete(null,id);
    }
}
