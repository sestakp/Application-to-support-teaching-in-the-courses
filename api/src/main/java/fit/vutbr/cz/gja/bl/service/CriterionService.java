package fit.vutbr.cz.gja.bl.service;

import java.util.Optional;

import fit.vutbr.cz.gja.bl.annotations.SecureMethod;
import fit.vutbr.cz.gja.dal.entities.Activity;
import fit.vutbr.cz.gja.dal.entities.User;
import fit.vutbr.cz.gja.dal.repositories.ActivityRepository;
import fit.vutbr.cz.gja.dal.repositories.UserRepository;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import fit.vutbr.cz.gja.dal.entities.Criterion;
import fit.vutbr.cz.gja.dal.repositories.CriterionRepository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing criteria
 * @author Vojtěch Kulíšek (xkulis03)
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 26.12.2023
 */
@Service
public class CriterionService {

    private final CriterionRepository criterionRepository;
    private final ActivityRepository activityRepository;

    public CriterionService(CriterionRepository criterionRepository, ActivityRepository activityRepository) {
        this.criterionRepository = criterionRepository;
        this.activityRepository = activityRepository;
    }

    /**
     * Saves a new criterion.
     * @param user      The authenticated user.
     * @param criterion The criterion to be saved.
     * @return The saved criterion.
     * @throws AuthorizationServiceException if the user is not authorized to access the course.
     */
    @Transactional
    @SecureMethod
    public Criterion save(User user, Criterion criterion) {
        var activityOrNull = activityRepository.findById(criterion.getActivityId());

        if (activityOrNull.isPresent() && criterion.getId() == null) {
            var activity = activityOrNull.get();

            if (user.getAccessedCourses().contains(activity.getCourse())) {
                criterion.setActivity(activity);
                return criterionRepository.save(criterion);
            }
            else{
                throw new AuthorizationServiceException("unauthorized access");
            }
        }
        return null;
    }

    /**
     * Updates an existing criterion.
     * @param user      The authenticated user.
     * @param criterion The updated criterion.
     * @return The updated criterion.
     * @throws AuthorizationServiceException if the user is not authorized to access the course.
     */
    @Transactional
    @SecureMethod
    public Criterion update(User user, Criterion criterion) {
        if (criterion.getId() != null) {
            var oldCriterionOrNull = criterionRepository.findById(criterion.getId());
            if (oldCriterionOrNull.isPresent()) {
                var updatedCriterion = oldCriterionOrNull.get();

                if (user.getAccessedCourses().contains(updatedCriterion.getActivity().getCourse())) {
                    updatedCriterion.update(criterion);
                    criterionRepository.save(updatedCriterion);

                    return updatedCriterion;
                }
                else {
                    throw new AuthorizationServiceException("unauthorized access");
                }
            }
        }
        return null;
    }

    /**
     * Retrieves all criteria.
     * @return Iterable of all criteria.
     */
    @SecureMethod
    public Iterable<Criterion> getAll() {
        return criterionRepository.findAll();
    }

    /**
     * Retrieves all criteria for a specific activity.
     * @param activityId The ID of the activity.
     * @return Iterable of criteria for the specified activity.
     */
    @SecureMethod
    public Iterable<Criterion> getAllByActivity(long activityId) {
        return criterionRepository.findAllByActivityId(activityId);
    }

    /**
     * Retrieves a criterion by its ID.
     * @param id The ID of the criterion.
     * @return Optional containing the criterion, or empty if not found.
     */
    @SecureMethod
    public Optional<Criterion> get(Long id) {
        return criterionRepository.findById(id);
    }

    /**
     * Deletes a criterion.
     * @param user The authenticated user.
     * @param id   The ID of the criterion to be deleted.
     * @throws AuthorizationServiceException if the user is not authorized to access the course.
     */
    @Transactional
    @SecureMethod
    public void delete(User user, Long id) {
        var criterionOrNull = criterionRepository.findById(id);
        if (criterionOrNull.isPresent()) {
            var criterion = criterionOrNull.get();

            if (user.getAccessedCourses().contains(criterion.getActivity().getCourse())) {
                criterionRepository.delete(criterion);
            }
            else{
                throw new AuthorizationServiceException("unauthorized access");
            }
        }
    }
}
