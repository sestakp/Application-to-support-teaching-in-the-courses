package fit.vutbr.cz.gja.dal.repositories;

import fit.vutbr.cz.gja.dal.entities.Course;
import fit.vutbr.cz.gja.dal.entities.Student;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;

/**
 * Student CRUD repository
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 23.12.2023
 */
public interface StudentRepository extends CrudRepository<Student, Long> {
    /**
     * Find all students in course
     * @param courseId Course ID
     * @return All students in course
     */
    Collection<Student> findAllByCourseId(long courseId);

    /**
     * Find all students by ids
     * @param ids Student ids
     * @return All students with ids
     */
    Collection<Student> findAllByIdIsIn(Collection<Long> ids);
}
