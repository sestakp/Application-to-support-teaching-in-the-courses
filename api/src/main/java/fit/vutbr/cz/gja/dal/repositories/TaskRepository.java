package fit.vutbr.cz.gja.dal.repositories;

import fit.vutbr.cz.gja.dal.entities.Task;
import org.springframework.data.repository.CrudRepository;

/**
 * Task CRUD repository
 * @author Daniel Peřina (xperin12)
 * @since 23.12.2023
 */
public interface TaskRepository extends CrudRepository<Task, Long> {
    /**
     * Find all tasks in activity
     * @param activityId Activity ID
     * @return All tasks in activity
     */
    Iterable<Task> findAllByActivityId(long activityId);

    /**
     * Find all tasks in course
     * @param courseId Course ID
     * @return All tasks in course
     */
    Iterable<Task> findAllByCourseId(long courseId);
}
