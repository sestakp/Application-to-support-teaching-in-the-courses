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

import fit.vutbr.cz.gja.dal.entities.Report;
import fit.vutbr.cz.gja.bl.service.ReportService;

/**
 * Assessment report REST API
 * @author Martin Kmenta (xkment06)
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 27.12.2023
 */
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService _service;

    public ReportController(ReportService _service) {
        this._service = _service;
    }

    /**
     * Get report
     * @param id Report ID
     * @return Report
     */
    @GetMapping("/{id}")
    public Report getById(@PathVariable long id) {
        return _service.get(id).orElse(null);
    }

    /**
     * Get all reports
     * @return All reports
     */
    @GetMapping
    public Iterable<Report> getAll() {
        return _service.getAll();
    }

    /**
     * Get activity assessment reports
     * @param id Activity ID
     * @return Activity assessment reports
     */
    @GetMapping("/activity/{id}")
    public Iterable<Report> getAllByActivity(@PathVariable long id) {
        return _service.getAllByActivity(id);
    }

    /**
     * Create report
     * @param model Report
     * @return Created report
     */
    @PostMapping
    public Report create(@RequestBody Report model) {
        return _service.save(null,model);
    }

    /**
     * Update report
     * @param model Report
     * @return Updated report
     */
    @PutMapping
    public Report update(@RequestBody Report model) {
        return _service.update(null,model);
    }

    /**
     * Delete report
     * @param id Report ID
     */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {
        _service.delete(null,id);
    }
}
