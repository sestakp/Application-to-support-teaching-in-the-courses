package fit.vutbr.cz.gja.bl.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import fit.vutbr.cz.gja.bl.annotations.SecureMethod;
import fit.vutbr.cz.gja.dal.entities.*;
import fit.vutbr.cz.gja.dal.repositories.*;
import org.springframework.data.jpa.domain.AbstractPersistable;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing assessments
 * @author Vojtěch Kulíšek (xkulis03)
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 26.12.2023
 */
@Service
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final TaskRepository taskRepository;
    private final CriterionRepository criterionRepository;
    private final UserRepository userRepository;

    public AssessmentService(AssessmentRepository assessmentRepository, TaskRepository taskRepository, CriterionRepository criterionRepository, UserRepository userRepository) {
        this.assessmentRepository = assessmentRepository;
        this.taskRepository = taskRepository;
        this.criterionRepository = criterionRepository;
        this.userRepository = userRepository;
    }

    /**
     * Saves a new assessment.
     * @param user       The authenticated user.
     * @param assessment The assessment to be saved.
     * @return The saved assessment.
     * @throws AuthorizationServiceException if the user is not authorized to access the course.
     */
    @Transactional
    @SecureMethod
    public Assessment save(User user, Assessment assessment) {
        var assessmentOrNull = assessmentRepository.findByCriterionIdIsAndStudentIdIsAndTeamIdIs(assessment.getCriterionId(),
            assessment.getStudentId(), assessment.getTeamId());

        if (assessment.getId() == null) {
            var criterionOrNull = criterionRepository.findById(assessment.getCriterionId());

            if (criterionOrNull.isPresent()) {
                var criterion = criterionOrNull.get();
                
                if (user.getAccessedCourses().contains(criterion.getActivity().getCourse())) {
                    if (assessmentOrNull.isPresent()) {
                        var assessmentToStore = assessmentOrNull.get();
                        assessmentToStore.setFeedback(assessment.getFeedback());
                        assessmentToStore.setPoints(assessment.getPoints());
                        assessmentToStore.setUserId(assessment.getUserId());
                        
                        return assessmentRepository.save(assessmentToStore);
                    } else {
                        return assessmentRepository.save(assessment);
                    }
                }
                else {
                    throw new AuthorizationServiceException("unauthorized access");
                }
            }
        }
        return null;
    }

    /**
     * Updates an existing assessment.
     * @param user       The authenticated user.
     * @param assessment The updated assessment.
     * @return The updated assessment.
     * @throws AuthorizationServiceException if the user is not authorized to access the course.
     */
    @Transactional
    @SecureMethod
    public Assessment update(User user, Assessment assessment) {
        if (assessment.getId() != null) {
            var oldAssessmentOrNull = assessmentRepository.findById(assessment.getId());
            
            if (oldAssessmentOrNull.isPresent()) {
                var updatedAssessment = oldAssessmentOrNull.get();

                if (user.getAccessedCourses().contains(updatedAssessment.getCriterion().getActivity().getCourse())) {
                    updatedAssessment.update(assessment);
                    assessmentRepository.save(updatedAssessment);

                    return updatedAssessment;
                }
                else{
                    throw new AuthorizationServiceException("unauthorized access");
                }
            }
        }
        return null;
    }

    /**
     * Retrieves all assessments.
     * @return Iterable of all assessments.
     */
    @SecureMethod
    public Iterable<Assessment> getAll() {
        return assessmentRepository.findAll();
    }

    /**
     * Retrieves all assessments for a specific task.
     * @param taskId The ID of the task.
     * @return Iterable of assessments for the specified task.
     * @throws Exception if the task is not found.
     */
    @SecureMethod
    public Iterable<Assessment> getAllByTask(long taskId) throws Exception {
        var task = taskRepository.findById(taskId);
        
        if (task.isEmpty()) throw new Exception("Task not found");

        var criteria = criterionRepository.findAllByActivityId(task.get().getActivityId());
        var criteriaIds = StreamSupport.stream(criteria.spliterator(), false)
            .map(AbstractPersistable::getId)
            .collect(Collectors.toList());

        return assessmentRepository.findAllByCriterionIdIn(criteriaIds);
    }

    /**
     * Retrieves all assessments for a specific activity.
     * @param activityId The ID of the activity.
     * @return Iterable of assessments for the specified activity.
     */
    public Iterable<Assessment> getAllByActivity(long activityId) {
        var criteria = criterionRepository.findAllByActivityId(activityId);
        var criteriaIds = StreamSupport.stream(criteria.spliterator(), false)
            .map(AbstractPersistable::getId)
            .collect(Collectors.toList());

        return assessmentRepository.findAllByCriterionIdIn(criteriaIds);
    }

    /**
     * Retrieves an assessment by its ID.
     * @param id The ID of the assessment.
     * @return Optional containing the assessment, or empty if not found.
     */
    public Optional<Assessment> get(Long id) {
        return assessmentRepository.findById(id);
    }

    /**
     * Deletes an assessment.
     * @param id The ID of the assessment to be deleted.
     * @throws AuthorizationServiceException if the user is not authorized to access the course.
     */
    @Transactional
    @SecureMethod
    public void delete(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.getPrincipal() instanceof String email) {
            var userOrNull = userRepository.findByEmailAndIsVerified(email, true);

            var assessmentOrNull = assessmentRepository.findById(id);

            if (assessmentOrNull.isPresent() && userOrNull.isPresent()) {
                var user = userOrNull.get();
                var assessment = assessmentOrNull.get();

                if (user.getAccessedCourses().contains(assessment.getCriterion().getActivity().getCourse())) {
                    assessmentRepository.delete(assessment);
                }
                else {
                    throw new AuthorizationServiceException("unauthorized access");
                }
            }
        }
    }
}
