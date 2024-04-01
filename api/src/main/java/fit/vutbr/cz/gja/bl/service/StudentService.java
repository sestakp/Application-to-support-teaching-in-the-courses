package fit.vutbr.cz.gja.bl.service;

import java.util.Date;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import fit.vutbr.cz.gja.bl.annotations.SecureMethod;
import fit.vutbr.cz.gja.bl.models.StudentModel;
import fit.vutbr.cz.gja.bl.models.UserModel;
import fit.vutbr.cz.gja.dal.entities.Course;
import fit.vutbr.cz.gja.dal.entities.Team;
import fit.vutbr.cz.gja.dal.entities.User;
import fit.vutbr.cz.gja.dal.repositories.CourseRepository;
import fit.vutbr.cz.gja.dal.repositories.TeamRepository;
import fit.vutbr.cz.gja.dal.repositories.UserRepository;
import jakarta.persistence.EntityExistsException;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import fit.vutbr.cz.gja.dal.entities.Student;
import fit.vutbr.cz.gja.dal.repositories.StudentRepository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing students
 * @author Vojtěch Kulíšek (xkulis03)
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 26.12.2023
 */
@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final TeamRepository teamRepository;
    private final CourseRepository courseRepository;

    public StudentService(StudentRepository studentRepository, TeamRepository teamRepository, CourseRepository courseRepository) {
        this.studentRepository = studentRepository;
        this.teamRepository = teamRepository;
        this.courseRepository = courseRepository;
    }

    /**
     * Saves a new student.
     * @param user    The authenticated user.
     * @param student The student model to be saved.
     * @return The saved student entity.
     * @throws AuthorizationServiceException if the user is not authorized to access the student's course.
     */
    @Transactional
    @SecureMethod
    public Student save(User user, StudentModel student) {
        var courseOrNull = courseRepository.findById(student.getCourseId());

        if (courseOrNull.isPresent()) {
            var course = courseOrNull.get();
            var studentEntity = new Student();

            if (user.getAccessedCourses().contains(course)) {
                studentEntity.setName(student.getName());
                studentEntity.setFITLogin(student.getFITLogin());
                studentEntity.setVUTLogin(student.getVUTLogin());
                studentEntity.setCourse(course);

                return studentRepository.save(studentEntity);
            }
            else {
                throw new AuthorizationServiceException("unauthorized access");
            }
        }
        return null;
    }

    /**
     * Updates an existing student.
     * @param user    The authenticated user.
     * @param student The updated student entity.
     * @return The updated student entity.
     * @throws AuthorizationServiceException if the user is not authorized to access the student's course.
     */
    @Transactional
    @SecureMethod
    public Student update(User user, Student student) {
        if (student.getId() != null) {
            var oldStudentOrNull = studentRepository.findById(student.getId());
            if (oldStudentOrNull.isPresent()) {
                var updatedStudent = oldStudentOrNull.get();
                
                if (user.getAccessedCourses().contains(updatedStudent.getCourse())) {
                    updatedStudent.update(student);
                    studentRepository.save(updatedStudent);

                    return updatedStudent;
                }
                else {
                    throw new AuthorizationServiceException("unauthorized access");
                }
            }
        }
        return null;
    }

    /**
     * Retrieves all students.
     * @return Iterable of all students.
     */
    @SecureMethod
    public Iterable<Student> getAll() {
        return studentRepository.findAll();
    }

    /**
     * Retrieves all students for a specific course.
     * @param courseId The ID of the course.
     * @return Iterable of students for the specified course.
     */
    @SecureMethod
    public Iterable<Student> getAllByCourse(long courseId) {
        return studentRepository.findAllByCourseId(courseId);
    }

    /**
     * Retrieves a student by its ID.
     * @param id The ID of the student.
     * @return Optional containing the student, or empty if not found.
     */
    @SecureMethod
    public Optional<Student> get(Long id) {
        return studentRepository.findById(id);
    }

    /**
     * Deletes a student.
     * @param user The authenticated user.
     * @param id   The ID of the student to be deleted.
     * @throws AuthorizationServiceException if the user is not authorized to access the student's course.
     */
    @Transactional
    @SecureMethod
    public void delete(User user, Long id) {
        var studentOrNull = studentRepository.findById(id);
        if (studentOrNull.isPresent()) {
            var student = studentOrNull.get();

            if (user.getAccessedCourses().contains(student.getCourse())) {
                for (Team team: student.getTeams()) {
                    var teamSize = team.getMembers().size();
                    if (teamSize < 1) {
                        teamRepository.delete(team);
                    }
                    
                    team.getMembers().remove(student);
                }
                
                
                studentRepository.delete(student);
            }
            else {
                throw new AuthorizationServiceException("unauthorized access");
            }
        }
        else{
            throw new EntityExistsException("Entity not found");
        }
    }
}
