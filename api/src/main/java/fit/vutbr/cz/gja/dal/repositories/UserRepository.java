package fit.vutbr.cz.gja.dal.repositories;

import fit.vutbr.cz.gja.dal.entities.Course;
import fit.vutbr.cz.gja.dal.entities.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.Optional;

/**
 * User CRUD repository
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 23.12.2023
 */
public interface UserRepository extends CrudRepository<User, Long> {
    /**
     * Find user by email
     * @param email User email
     * @return User with given email or none
     */
    Optional<User> findByEmail(String email);

    /**
     * Find verified user by email
     * @param email User email
     * @param isVerified Verified user
     * @return Verified user with given email or none
     */
    Optional<User> findByEmailAndIsVerified(String email, boolean isVerified);

    /**
     * Find user by hash
     * @param hash Verification hash
     * @return User or none
     */
    Optional<User> findByVerifiedHash(String hash);

    /**
     * Find all solvers of course
     * @param course Course
     * @return All solvers of course
     */
    Iterable<User> findAllByAccessedCoursesContains(Course course);

    /**
     * Find all verified users
     * @param isVerified Verified user
     * @return All verified users
     */
    Iterable<User> findAllByIsVerified(boolean isVerified);
}
