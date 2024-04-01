package fit.vutbr.cz.gja.bl.service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import fit.vutbr.cz.gja.bl.annotations.SecureMethod;
import fit.vutbr.cz.gja.dal.repositories.*;
import fit.vutbr.cz.gja.pl.auth.JwtUtil;
import fit.vutbr.cz.gja.bl.models.CurrentUserModel;
import fit.vutbr.cz.gja.bl.models.LoginModel;
import fit.vutbr.cz.gja.bl.models.RegisterModel;
import fit.vutbr.cz.gja.bl.models.UserModel;
import jakarta.persistence.EntityExistsException;
import org.apache.commons.lang3.concurrent.ConcurrentException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;

import fit.vutbr.cz.gja.dal.entities.User;
import fit.vutbr.cz.gja.dal.entities.Course;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing users
 * @author Vojtěch Kulíšek (xkulis03)
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @author Martin Kmenta (xkment06)
 * @since 26.12.2023
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final CourseRepository courseRepository;
    
    private final SendEmailService sendEmailService;
    private final String backendUrl;

    public UserService(UserRepository userRepository, JwtUtil jwtUtil, CourseRepository courseRepository, SendEmailService sendEmailService, @Value("${backend.url}") String backendUrl) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.courseRepository = courseRepository;
        this.sendEmailService = sendEmailService;
        this.backendUrl = backendUrl;
    }

    /**
     * Saves or updates a user based on the provided information.
     * @param user              The user information to be saved or updated.
     * @return The saved or updated user.
     */
    @Transactional
    @SecureMethod
    public UserModel save(UserModel user) {
        if (user.getId() == 0L) {
            var userToStore = new User();
            
            userToStore.setEmail(user.getEmail());
            userToStore.setName(user.getName());
            userToStore.setRegistrationDate(new Date());
            userToStore.setVerifiedHash(UUID.randomUUID().toString());

            var storedUser = userRepository.save(userToStore);
            sendVerificationEmail(storedUser.getId());
            
            return new UserModel(storedUser);
        }
        else {
            var userInDbOrNull = userRepository.findById(user.getId());
            if (userInDbOrNull.isPresent()) {
                var userInDb = userInDbOrNull.get();

                var courseIds = user.getPrivilegedCourses();
                var courses = courseRepository.findAllByIdIsIn(courseIds);
                

                var difference = userInDb.getAccessedCourses().stream()
                    .filter(element -> !courses.contains(element))
                    .toList();                
                
                for(var c : difference){
                    
                    for(var t : userInDb.getResponsibleTasks()){
                        if(Objects.equals(t.getCourse().getId(), c.getId())){
                            t.setResponsibleUserId(null);
                        }
                    }

                    userInDb.getReports().removeIf(r -> Objects.equals(r.getTask().getCourse().getId(), c.getId()));
                    userInDb.getAssessments().removeIf(a -> Objects.equals(a.getCriterion().getActivity().getCourse().getId(), c.getId()));
                }
                
                userInDb.setAccessedCourses(courses);

                return new UserModel(userRepository.save(userInDb));
            }
        }
        return null;
    }

    @Transactional
    @SecureMethod
    public boolean update(User user, RegisterModel registerModel) {
        if (user.getEmail().equals(registerModel.getEmail())) {
            var userInDbOrNull = userRepository.findById(user.getId());
            if (userInDbOrNull.isPresent()) {
                var userInDb = userInDbOrNull.get();

                userInDb.setName(registerModel.getName());
                userInDb.setPassword(registerModel.getPassword());

                userRepository.save(userInDb);
                return true;
            }
        }
        else {
            throw new AuthorizationServiceException("unauthorized access");
        }
        return false;
    }

    /**
     * Registers a new user with the provided registration information.
     * @param registerModel The registration information for the new user.
     * @return The registered user.
     * @throws EntityExistsException if a user with the same email already exists.
     */
    @Transactional
    public User register(RegisterModel registerModel) {
        var currentUser = userRepository.findByEmail(registerModel.getEmail());
        if(currentUser.isEmpty()){
            var user = new User();
            
            user.setEmail(registerModel.getEmail());
            user.setName(registerModel.getName());
            user.setPassword(registerModel.getPassword());
            user.setRegistrationDate(new Date());
            user.setVerifiedHash(UUID.randomUUID().toString());

            var storedUser = userRepository.save(user);
            sendVerificationEmail(storedUser.getId());

            return storedUser;
        }
        else {
            throw new EntityExistsException("User with current email already exist");
        }
    }

    /**
     * Retrieves all verified users.
     * @return Iterable of all verified users.
     */
    @SecureMethod
    public Iterable<UserModel> getAll() {
        var users = userRepository.findAllByIsVerified(true);
        return StreamSupport.stream(users.spliterator(), false)
            .map(UserModel::new)
            .toList();
    }

    /**
     * Retrieves all users associated with a specific course.
     * @param courseId The ID of the course.
     * @return Iterable of users associated with the specified course.
     */
    @SecureMethod
    public Iterable<UserModel> getAllByCourse(long courseId) {
        var course = new Course(courseId);
        var users = userRepository.findAllByAccessedCoursesContains(course);
        return StreamSupport.stream(users.spliterator(), false)
            .map(UserModel::new)
            .toList();
    }

    /**
     * Retrieves a user by its ID.
     * @param id The ID of the user.
     * @return Optional containing the user, or empty if not found.
     */
    @SecureMethod
    public Optional<User> get(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Deletes a user.
     * @param authenticatedUser The authenticated user performing the action.
     * @param id                The ID of the user to be deleted.
     * @throws AuthorizationServiceException if the authenticated user is not authorized to delete the user.
     */
    @Transactional
    @SecureMethod
    public void delete(User authenticatedUser, Long id) {
        Optional<User> userOrNull = userRepository.findById(id);
        if (userOrNull.isPresent()) {
            User user = userOrNull.get();
            
            if (Objects.equals(user.getId(), authenticatedUser.getId())) {
                userRepository.delete(user);
            }
            else {
                throw new AuthorizationServiceException("Unauthorized delete");
            }
        }
    }

    /**
     * Sends a verification email to the specified user.
     * @param id The ID of the user to whom the verification email should be sent.
     */
    @Transactional
    public void sendVerificationEmail(Long id) {
        var userOrNull = userRepository.findById(id);
        if (userOrNull.isPresent()) {
            var user = userOrNull.get();
            
            sendEmailService.sendMessage("application@fit.vutbr.cz",
                user.getEmail(),
                "Verify your account",
                "Please verify your account on address: "+backendUrl+"/api/users/verification/" + user.getVerifiedHash());
        }
    }

    /**
     * Handles user verification based on the provided verification hash.
     * @param hash The verification hash.
     * @return Message
     */
    @Transactional
    public String verification(String hash) {
        var userOrNull = userRepository.findByVerifiedHash(hash);
        if (userOrNull.isPresent()) {
            var user = userOrNull.get();
            
            user.setVerified(true);
            user.setVerifiedHash(null);

            userRepository.save(user);
            return "User account verified";
        }
        return "Verification failed";
    }

    /**
     * Performs user login using the provided login information.
     * @param loginModel The login information.
     * @return The authenticated user's information.
     */
    public CurrentUserModel login(LoginModel loginModel) {
        try {
            var userOrNull = userRepository.findByEmail(loginModel.getEmail());
            if (userOrNull.isPresent()) {
                var user = userOrNull.get();
                
                if (BCrypt.checkpw(loginModel.getPassword(), user.getPassword())) {
                    String token = jwtUtil.createToken(user);
                    
                    var currentUser = new CurrentUserModel();
                    
                    currentUser.setId(user.getId());
                    currentUser.setName(user.getName());
                    currentUser.setEmail(user.getEmail());
                    currentUser.setToken(token);
                    
                    return currentUser;
                }
            }
            return null;
        }
        catch (Exception e) {
            return null;
        }
    }
}
