package fit.vutbr.cz.gja.bl.service;

import java.util.Optional;

import fit.vutbr.cz.gja.bl.annotations.SecureMethod;
import fit.vutbr.cz.gja.dal.entities.Activity;
import fit.vutbr.cz.gja.dal.entities.User;
import fit.vutbr.cz.gja.dal.repositories.CourseRepository;
import fit.vutbr.cz.gja.dal.repositories.UserRepository;
import org.checkerframework.checker.units.qual.A;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import fit.vutbr.cz.gja.dal.entities.Type;
import fit.vutbr.cz.gja.dal.repositories.TypeRepository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing types
 * @author Vojtěch Kulíšek (xkulis03)
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 26.12.2023
 */
@Service
public class TypeService {

    private final TypeRepository typeRepository;
    private final CourseRepository courseRepository;

    public TypeService(TypeRepository typeRepository, CourseRepository courseRepository) {
        this.typeRepository = typeRepository;
        this.courseRepository = courseRepository;
    }

    /**
     * Saves a new type.
     * @param user The authenticated user.
     * @param type The type to be saved.
     * @return The saved type.
     * @throws AuthorizationServiceException if the user is not authorized to access the type's course.
     */
    @Transactional
    @SecureMethod
    public Type save(User user, Type type) {
        var courseOrNull = courseRepository.findById(type.getCourseId());
        if (courseOrNull.isPresent() && type.getId() == null) {
            var course = courseOrNull.get();

            if (user.getAccessedCourses().contains(course)) {
                return typeRepository.save(type);
            }
            else {
                throw new AuthorizationServiceException("unauthorized access");
            }
        }
        return null;
    }

    /**
     * Updates an existing type.
     * @param user The authenticated user.
     * @param type The updated type.
     * @return The updated type.
     * @throws AuthorizationServiceException if the user is not authorized to access the type's course.
     */
    @Transactional
    @SecureMethod
    public Type update(User user, Type type) {
        if (type.getId() != null) {
            var oldTypeOrNull = typeRepository.findById(type.getId());
            if (oldTypeOrNull.isPresent()) {
                var updatedType = oldTypeOrNull.get();

                if (user.getAccessedCourses().contains(updatedType.getCourse())) {
                    updatedType.update(type);
                    typeRepository.save(updatedType);
                    return updatedType;
                }
                else {
                    throw new AuthorizationServiceException("unauthorized access");
                }
            }
        }
        return null;
    }

    /**
     * Retrieves all types.
     * @return Iterable of all types.
     */
    @SecureMethod
    public Iterable<Type> getAll() {
        return typeRepository.findAll();
    }

    /**
     * Retrieves all types for a specific course.
     * @param courseId The ID of the course.
     * @return Iterable of types for the specified course.
     */
    @SecureMethod
    public Iterable<Type> getAllByCourse(long courseId) {
        return typeRepository.findAllByCourseId(courseId);
    }

    /**
     * Retrieves a type by its ID.
     * @param id The ID of the type.
     * @return Optional containing the type, or empty if not found.
     */
    @SecureMethod
    public Optional<Type> get(Long id) {
        return typeRepository.findById(id);
    }

    /**
     * Deletes a type.
     * @param user The authenticated user.
     * @param id   The ID of the type to be deleted.
     * @throws AuthorizationServiceException if the user is not authorized to access the type's course.
     */
    @Transactional
    @SecureMethod
    public void delete(User user, Long id) {
        var typeOrNull = typeRepository.findById(id);

        if (typeOrNull.isPresent()) {
            var type = typeOrNull.get();

            if (user.getAccessedCourses().contains(type.getCourse())) {
                typeRepository.delete(type);
            }
            else {
                throw new AuthorizationServiceException("unauthorized access");
            }
        }
    }
}
