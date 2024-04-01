package fit.vutbr.cz.gja.bl.service;

import java.util.Optional;
import java.util.Collection;

import fit.vutbr.cz.gja.bl.annotations.SecureMethod;
import fit.vutbr.cz.gja.dal.entities.Student;
import fit.vutbr.cz.gja.dal.entities.User;
import fit.vutbr.cz.gja.dal.repositories.UserRepository;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import fit.vutbr.cz.gja.dal.entities.Task;
import fit.vutbr.cz.gja.dal.repositories.TaskRepository;
import fit.vutbr.cz.gja.dal.entities.Course;
import fit.vutbr.cz.gja.dal.repositories.CourseRepository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for managing tasks.
 */
/**
 * Service for managing tasks
 * @author Vojtěch Kulíšek (xkulis03)
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 26.12.2023
 */
@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final CourseRepository courseRepository;

    public TaskService(TaskRepository taskRepository, CourseRepository courseRepository) {
        this.taskRepository = taskRepository;
        this.courseRepository = courseRepository;
    }

    /**
     * Saves a new task.
     * @param user The authenticated user.
     * @param task The task to be saved.
     * @return The saved task entity.
     * @throws AuthorizationServiceException if the user is not authorized to access the task's course.
     */
    @Transactional
    @SecureMethod
    public Task save(User user, Task task) {
        var courseOrNull = courseRepository.findById(task.getCourseId());
        if (courseOrNull.isPresent() && task.getId() == null) {
            var course = courseOrNull.get();

            if (user.getAccessedCourses().contains(course)) {
                task.setCourse(course);
                return taskRepository.save(task);
            }
            else {
                throw new AuthorizationServiceException("unauthorized access");
            }
        }
        return null;
    }

    /**
     * Updates an existing task.
     * @param user The authenticated user.
     * @param task The updated task entity.
     * @return The updated task entity.
     * @throws AuthorizationServiceException if the user is not authorized to access the task's course.
     */
    @Transactional
    @SecureMethod
    public Task update(User user, Task task) {
        if (task.getId() != null) {
            var oldTaskOrNull = taskRepository.findById(task.getId());
            if (oldTaskOrNull.isPresent()) {
                var updatedTask = oldTaskOrNull.get();
                
                if (user.getAccessedCourses().contains(updatedTask.getCourse())) {
                    updatedTask.update(task);
                    taskRepository.save(updatedTask);

                    return updatedTask;
                }
                else {
                    throw new AuthorizationServiceException("unauthorized access");
                }
            }
        }
        return null;
    }

    /**
     * Retrieves all tasks.
     * @return Iterable of all tasks.
     */
    @SecureMethod
    public Iterable<Task> getAll() {
        return taskRepository.findAll();
    }

    /**
     * Retrieves all tasks for a specific course.
     * @param courseId The ID of the course.
     * @return Iterable of tasks for the specified course.
     */
    @SecureMethod
    public Iterable<Task> getAllByCourse(long courseId) {
        return taskRepository.findAllByCourseId(courseId);
    }

    /**
     * Retrieves a task by its ID.
     * @param id The ID of the task.
     * @return Optional containing the task, or empty if not found.
     */
    @SecureMethod
    public Optional<Task> get(Long id) {
        return taskRepository.findById(id);
    }

    /**
     * Deletes a task.
     * @param user The authenticated user.
     * @param id   The ID of the task to be deleted.
     * @throws AuthorizationServiceException if the user is not authorized to access the task's course.
     */
    @Transactional
    @SecureMethod
    public void delete(User user, Long id) {
        var taskToDeleteOrNull = taskRepository.findById(id);

        if (taskToDeleteOrNull.isPresent()) {
            var taskToDelete = taskToDeleteOrNull.get();

            if (user.getAccessedCourses().contains(taskToDelete.getCourse())) {
                taskRepository.delete(taskToDelete);
            }
            else {
                throw new AuthorizationServiceException("unauthorized access");
            }
        }
    }
}
