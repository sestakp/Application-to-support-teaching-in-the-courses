package fit.vutbr.cz.gja.dal.repositories;

import fit.vutbr.cz.gja.dal.entities.Criterion;
import org.springframework.data.repository.CrudRepository;

/**
 * Criterion CRUD repository
 * @author Daniel Peřina (xperin12)
 * @since 23.12.2023
 */
public interface CriterionRepository extends CrudRepository<Criterion, Long> {
    /**
     * Find all criteria in activity
     * @param activityId Activity ID
     * @return All criteria in activity
     */
    Iterable<Criterion> findAllByActivityId(long activityId);
}
