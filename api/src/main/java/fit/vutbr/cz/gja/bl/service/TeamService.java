package fit.vutbr.cz.gja.bl.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import fit.vutbr.cz.gja.bl.annotations.SecureMethod;
import fit.vutbr.cz.gja.bl.models.CourseModel;
import fit.vutbr.cz.gja.bl.models.TeamModel;
import fit.vutbr.cz.gja.dal.entities.Activity;
import fit.vutbr.cz.gja.dal.entities.Student;
import fit.vutbr.cz.gja.dal.entities.User;
import fit.vutbr.cz.gja.dal.repositories.*;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import fit.vutbr.cz.gja.dal.entities.Team;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing teams
 * @author Vojtěch Kulíšek (xkulis03)
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 26.12.2023
 */
@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final ActivityRepository activityRepository;

    public TeamService(TeamRepository teamRepository, StudentRepository studentRepository, CourseRepository courseRepository, ActivityRepository activityRepository) {
        this.teamRepository = teamRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.activityRepository = activityRepository;
    }

    /**
     * Saves a new team.
     * @param user The authenticated user.
     * @param team The team to be saved.
     * @return The saved team model.
     * @throws AuthorizationServiceException if the user is not authorized to access the team's course.
     */
    @Transactional
    @SecureMethod
    public TeamModel save(User user, TeamModel team) {
        var activityOrNull = activityRepository.findById(team.getActivityId());
        if (activityOrNull.isPresent()) {
            var activity = activityOrNull.get();

            if (user.getAccessedCourses().contains(activity.getCourse())) {
                var teamEntity = new Team();

                teamEntity.setName(team.getName());
                teamEntity.setActivityId(team.getActivityId());

                var students = studentRepository.findAllByIdIsIn(team.getStudentIds());
                teamEntity.setMembers(students);
                
                return new TeamModel(teamRepository.save(teamEntity));
            }
            else {
                throw new AuthorizationServiceException("unauthorized access");
            }
        }
        return null;
    }

    /**
     * Retrieves all teams.
     * @return Iterable of all teams.
     */
    @SecureMethod
    public Iterable<Team> getAll() {
        return teamRepository.findAll();
    }

    /**
     * Retrieves all teams for a specific course.
     * @param courseId The ID of the course.
     * @return Iterable of teams for the specified course.
     */
    @SecureMethod
    public Iterable<TeamModel> getAllByCourse(long courseId) {
        var courseOrNull = courseRepository.findById(courseId);
        var teams = new ArrayList<TeamModel>();

        if (courseOrNull.isPresent()) {
            var course = courseOrNull.get();
            var activities = course.getActivities();

            for (var activity : activities) {
                var activityTeams = activity.getTeams();
                teams.addAll(activityTeams.stream().map(TeamModel::new).toList());
            }

            return teams;
        }
        return null;
    }

    /**
     * Retrieves a team by its ID.
     * @param id The ID of the team.
     * @return Optional containing the team, or empty if not found.
     */
    @SecureMethod
    public Optional<Team> get(Long id) {
        return teamRepository.findById(id);
    }

    /**
     * Deletes a team.
     * @param user The authenticated user.
     * @param id   The ID of the team to be deleted.
     * @throws AuthorizationServiceException if the user is not authorized to access the team's course.
     */
    @Transactional
    @SecureMethod
    public void delete(User user, Long id) {
        var teamOrNull = teamRepository.findById(id);
        if (teamOrNull.isPresent()) {
            var team = teamOrNull.get();

            if (user.getAccessedCourses().contains(team.getActivity().getCourse())) {
                teamRepository.delete(team);
            }
            else {
                throw new AuthorizationServiceException("unauthorized access");
            }
        }
    }
}
