package fit.vutbr.cz.gja.dal.repositories;

import fit.vutbr.cz.gja.dal.entities.Type;
import org.springframework.data.repository.CrudRepository;

/**
 * Type CRUD repository
 * @author Daniel Peřina (xperin12)
 * @since 23.12.2023
 */
public interface TypeRepository extends CrudRepository<Type, Long> {
    /**
     * Find all types in course
     * @param courseId Course ID
     * @return All types in course
     */
    Iterable<Type> findAllByCourseId(long courseId);
}
