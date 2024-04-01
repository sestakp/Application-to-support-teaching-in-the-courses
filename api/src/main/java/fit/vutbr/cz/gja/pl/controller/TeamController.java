package fit.vutbr.cz.gja.pl.controller;

import java.util.List;

import fit.vutbr.cz.gja.bl.models.TeamModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fit.vutbr.cz.gja.dal.entities.Team;
import fit.vutbr.cz.gja.bl.service.TeamService;

/**
 * Activity teams REST API
 * @author Martin Kmenta (xkment06)
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 27.12.2023
 */
@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService _service;

    public TeamController(TeamService _service) {
        this._service = _service;
    }

    /**
     * Get team
     * @param id Team ID
     * @return Team
     */
    @GetMapping("/{id}")
    public Team getById(@PathVariable long id) {
        return _service.get(id).orElse(null);
    }

    /**
     * Get all teams
     * @return All teams
     */
    @GetMapping
    public Iterable<Team> getAll() {
        return _service.getAll();
    }

    /**
     * Get course teams
     * @param id Course ID
     * @return Course teams
     */
    @GetMapping("/course/{id}")
    public Iterable<TeamModel> getAllByCourse(@PathVariable long id) { return _service.getAllByCourse(id); }

    /**
     * Create team
     * @param model Team
     * @return Created team
     */
    @PostMapping
    public TeamModel create(@RequestBody TeamModel model) {
        return _service.save(null,model);
    }

    /**
     * Delete team
     * @param id Team ID
     */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {
        _service.delete(null,id);
    }
}
