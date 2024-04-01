package fit.vutbr.cz.gja.dal.repositories;

import fit.vutbr.cz.gja.dal.entities.Course;
import fit.vutbr.cz.gja.dal.entities.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;
import java.util.List;

/**
 * Course CRUD repository
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 23.12.2023
 */
public interface CourseRepository extends CrudRepository<Course, Long> {
    /**
     * Find all courses by ids
     * @param ids Course ids
     * @return All courses with id in given list
     */
    Collection<Course> findAllByIdIsIn(Collection<Long> ids);
}
