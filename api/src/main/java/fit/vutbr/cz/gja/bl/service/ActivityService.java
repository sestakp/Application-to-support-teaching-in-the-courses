package fit.vutbr.cz.gja.bl.service;

import java.util.Optional;

import fit.vutbr.cz.gja.bl.annotations.SecureMethod;
import fit.vutbr.cz.gja.dal.entities.User;
import fit.vutbr.cz.gja.dal.repositories.UserRepository;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import fit.vutbr.cz.gja.dal.entities.Activity;
import fit.vutbr.cz.gja.dal.repositories.ActivityRepository;
import fit.vutbr.cz.gja.dal.repositories.CourseRepository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing activities
 * @author Vojtěch Kulíšek (xkulis03)
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 26.12.2023
 */
@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final CourseRepository courseRepository;

    public ActivityService(ActivityRepository activityRepository, CourseRepository courseRepository) {
        this.activityRepository = activityRepository;
        this.courseRepository = courseRepository;
    }

    /**
     * Saves a new activity.
     * @param user     The authenticated user.
     * @param activity The activity to be saved.
     * @return The saved activity.
     * @throws AuthorizationServiceException if the user is not authorized to access the course.
     */
    @Transactional
    @SecureMethod
    public Activity save(User user, Activity activity) {
        var courseOrNull = courseRepository.findById(activity.getCourseId());

        if (courseOrNull.isPresent() && activity.getId() == null) {
            var course = courseOrNull.get();

            if (user.getAccessedCourses().contains(course)) {
                activity.setCourse(course);
                return activityRepository.save(activity);
            }
            else{
                throw new AuthorizationServiceException("unauthorized access");
            }
        }
        return null;
    }

    /**
     * Updates an existing activity.
     * @param user     The authenticated user.
     * @param activity The updated activity.
     * @return The updated activity.
     * @throws AuthorizationServiceException if the user is not authorized to access the course.
     */
    @Transactional
    @SecureMethod
    public Activity update(User user, Activity activity) {
        if (activity.getId() != null) {
            var oldActivityOrNull = activityRepository.findById(activity.getId());
            
            if (oldActivityOrNull.isPresent()) {
                var updatedActivity = oldActivityOrNull.get();

                if (user.getAccessedCourses().contains(updatedActivity.getCourse())) {
                    updatedActivity.update(activity);
                    activityRepository.save(updatedActivity);

                    return updatedActivity;
                }
                else{
                    throw new AuthorizationServiceException("unauthorized access");
                }
            }
        }
        return null;
    }
    
    /**
     * Retrieves all activities.
     * @return Iterable of all activities.
     */
    @SecureMethod
    public Iterable<Activity> getAll() {
        return activityRepository.findAll();
    }
    
    /**
     * Retrieves all activities for a specific course.
     * @param courseId The ID of the course.
     * @return Iterable of activities for the specified course.
     */
    @SecureMethod
    public Iterable<Activity> getAllByCourse(long courseId) {
        return activityRepository.findAllByCourseId(courseId);
    }

    /**
     * Retrieves an activity by its ID.
     * @param id The ID of the activity.
     * @return Optional containing the activity, or empty if not found.
     */
    @SecureMethod
    public Optional<Activity> get(Long id) {
        return activityRepository.findById(id);
    }

    /**
     * Deletes an activity.
     * @param user The authenticated user.
     * @param id   The ID of the activity to be deleted.
     * @throws AuthorizationServiceException if the user is not authorized to access the course.
     */
    @Transactional
    @SecureMethod
    public void delete(User user, Long id) {
        var activityOrNull = activityRepository.findById(id);

        if (activityOrNull.isPresent()) {
            var activity = activityOrNull.get();

            if (user.getAccessedCourses().contains(activity.getCourse())) {
                activityRepository.delete(activity);
            }
            else{
                throw new AuthorizationServiceException("unauthorized access");
            }
        }
    }
}
