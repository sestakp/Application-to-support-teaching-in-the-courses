package fit.vutbr.cz.gja.dal.repositories;

import fit.vutbr.cz.gja.dal.entities.Student;
import fit.vutbr.cz.gja.dal.entities.Team;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;

/**
 * Team CRUD repository
 * @author Daniel Peřina (xperin12)
 * @since 23.12.2023
 */
public interface TeamRepository extends CrudRepository<Team, Long> {
}
