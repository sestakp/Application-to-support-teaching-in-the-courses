package fit.vutbr.cz.gja.dal.repositories;

import fit.vutbr.cz.gja.dal.entities.Activity;
import org.springframework.data.repository.CrudRepository;

/**
 * Activity CRUD repository
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 23.12.2023
 */
public interface ActivityRepository extends CrudRepository<Activity, Long> {
    /**
     * Finds all activities in course
     * @param courseId Course ID
     * @return Course activities
     */
    Iterable<Activity> findAllByCourseId(long courseId);
}
