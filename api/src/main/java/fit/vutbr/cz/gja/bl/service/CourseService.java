package fit.vutbr.cz.gja.bl.service;

import java.util.*;
import java.util.stream.Collectors;

import fit.vutbr.cz.gja.bl.annotations.SecureMethod;
import fit.vutbr.cz.gja.dal.entities.Type;
import fit.vutbr.cz.gja.dal.entities.User;
import fit.vutbr.cz.gja.dal.repositories.TypeRepository;
import fit.vutbr.cz.gja.dal.repositories.UserRepository;
import fit.vutbr.cz.gja.bl.models.CourseModel;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import fit.vutbr.cz.gja.dal.entities.Course;
import fit.vutbr.cz.gja.dal.repositories.CourseRepository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing courses
 * @author Vojtěch Kulíšek (xkulis03)
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 26.12.2023
 */
@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final TypeRepository typeRepository;

    public CourseService(CourseRepository courseRepository, TypeRepository typeRepository) {
        this.courseRepository = courseRepository;
        this.typeRepository = typeRepository;
    }

    /**
     * Saves a new course.
     * @param user   The authenticated user.
     * @param course The course to be saved.
     * @return The saved course.
     * @throws AuthorizationServiceException if the user is not authorized to access the course.
     */
    @Transactional
    @SecureMethod
    public Course save(User user, Course course) {
        if (course.getId() == null) {
            course.setGuarantorId(user.getId());
            course.getSolvers().add(user);

            var storedCourse = courseRepository.save(course);

            var types = Arrays.asList("Přednáška", "Projekt", "Půlsemestrální zkouška", "Semestrální zkouška");

            for (String typeName : types) {
                var type = new Type();
                type.setName(typeName);
                type.setCourseId(storedCourse.getId());

                typeRepository.save(type);
            }

            return storedCourse;
        }
        return null;
    }

    /**
     * Updates an existing course.
     * @param user   The authenticated user.
     * @param course The updated course.
     * @return The updated course.
     * @throws AuthorizationServiceException if the user is not authorized to access the course.
     */
    @Transactional
    @SecureMethod
    public Course update(User user, Course course) {
        if (course.getId() != null) {
            if (course.getGuarantorId().equals(user.getId())) {
                var oldCourse = courseRepository.findById(course.getId());
                
                if (oldCourse.isPresent()) {
                    var updatedCourse = oldCourse.get();
                    updatedCourse.update(course);
                    courseRepository.save(updatedCourse);

                    return updatedCourse;
                }
            }
            else {
                throw new AuthorizationServiceException("unauthorized access");
            }
        }
        return null;
    }

    /**
     * Retrieves all courses accessible by the user.
     * @param user The authenticated user.
     * @return Iterable of accessible courses.
     */
    @SecureMethod
    public Iterable<Course> getAll(User user) {
        var courseIds = user.getAccessedCourses()
            .stream()
            .map(Course::getId)
            .toList();

        return courseRepository.findAllByIdIsIn(courseIds);
    }

    /**
     * Retrieves a course by its ID for the specified user.
     * @param user The authenticated user.
     * @param id   The ID of the course to retrieve.
     * @return Optional containing the course model, or empty if not found.
     * @throws AuthorizationServiceException if the user is not authorized to access the course.
     */
    @SecureMethod
    public Optional<CourseModel> get(User user, Long id) {
        var courseIds = user.getAccessedCourses()
            .stream()
            .map(Course::getId)
            .toList();

        if (courseIds.contains(id)) {
            var c = courseRepository.findById(id);
            return c.map(course -> Optional.of(new CourseModel(course))).orElse(null);
        }

        throw new AuthorizationServiceException("unauthorized access");
    }

    /**
     * Deletes a course.
     * @param user The authenticated user.
     * @param id   The ID of the course to be deleted.
     * @throws AuthorizationServiceException if the user is not authorized to access the course.
     */
    @Transactional
    @SecureMethod
    public void delete(User user, Long id) {
        var courseOrNull = courseRepository.findById(id);
        if (courseOrNull.isPresent()) {
            var course = courseOrNull.get();
            
            if (course.getGuarantorId().equals(user.getId())) {
                courseRepository.delete(course);
            }
            else{
                throw new AuthorizationServiceException("unauthorized access");
            }
        }
    }
}
