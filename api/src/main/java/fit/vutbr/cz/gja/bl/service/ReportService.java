package fit.vutbr.cz.gja.bl.service;

import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import fit.vutbr.cz.gja.bl.annotations.SecureMethod;
import fit.vutbr.cz.gja.dal.entities.Activity;
import fit.vutbr.cz.gja.dal.entities.User;
import fit.vutbr.cz.gja.dal.repositories.CourseRepository;
import fit.vutbr.cz.gja.dal.repositories.TaskRepository;
import fit.vutbr.cz.gja.dal.repositories.UserRepository;
import org.springframework.data.jpa.domain.AbstractPersistable;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import fit.vutbr.cz.gja.dal.entities.Report;
import fit.vutbr.cz.gja.dal.repositories.ReportRepository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing reports
 * @author Vojtěch Kulíšek (xkulis03)
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 26.12.2023
 */
@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final TaskRepository taskRepository;

    public ReportService(ReportRepository reportRepository, TaskRepository taskRepository) {
        this.reportRepository = reportRepository;
        this.taskRepository = taskRepository;
    }
    
    /**
     * Saves a new report.
     * @param user   The authenticated user.
     * @param report The report to be saved.
     * @return The saved report.
     * @throws AuthorizationServiceException if the user is not authorized to access the task's course.
     */
    @Transactional
    @SecureMethod
    public Report save(User user, Report report) {
        var taskOrNull = taskRepository.findById(report.getTaskId());
        if (taskOrNull.isPresent() && report.getId() == null) {
            var task = taskOrNull.get();

            if (user.getAccessedCourses().contains(task.getCourse())) {
                return reportRepository.save(report);
            }
            else {
                throw new AuthorizationServiceException("unauthorized access");
            }
        }
        return null;
    }

    /**
     * Updates an existing report.
     * @param user   The authenticated user.
     * @param report The updated report.
     * @return The updated report.
     * @throws AuthorizationServiceException if the user is not authorized to access the task's course.
     */
    @Transactional
    @SecureMethod
    public Report update(User user, Report report) {
        if (report.getId() != null) {
            var oldReportOrNull = reportRepository.findById(report.getId());
            if (oldReportOrNull.isPresent()) {
                var updatedReport = oldReportOrNull.get();

                if (user.getAccessedCourses().contains(updatedReport.getTask().getCourse())) {
                    updatedReport.update(report);
                    reportRepository.save(updatedReport);

                    return updatedReport;
                }
                else {
                    throw new AuthorizationServiceException("unauthorized access");
                }
            }
        }
        return null;
    }

    /**
     * Retrieves all reports.
     * @return Iterable of all reports.
     */
    @SecureMethod
    public Iterable<Report> getAll() {
        return reportRepository.findAll();
    }

    /**
     * Retrieves all reports for a specific activity.
     * @param activityId The ID of the activity.
     * @return Iterable of reports for the specified activity.
     */
    @SecureMethod
    public Iterable<Report> getAllByActivity(long activityId) {
        var tasks = taskRepository.findAllByActivityId(activityId);
        var taskIds = StreamSupport.stream(tasks.spliterator(), true)
            .map(AbstractPersistable::getId)
            .collect(Collectors.toList());

        return reportRepository.findAllByTaskIdIn(taskIds);
    }

    /**
     * Retrieves a report by its ID.
     * @param id The ID of the report.
     * @return Optional containing the report, or empty if not found.
     */
    public Optional<Report> get(Long id) {
        return reportRepository.findById(id);
    }

    /**
     * Deletes a report.
     * @param user The authenticated user.
     * @param id   The ID of the report to be deleted.
     * @throws AuthorizationServiceException if the user is not authorized to access the task's course.
     */
    @Transactional
    @SecureMethod
    public void delete(User user, Long id) {
        var reportOrNull = reportRepository.findById(id);
        if (reportOrNull.isPresent()) {
            var report = reportOrNull.get();
            
            if (user.getAccessedCourses().contains(report.getTask().getCourse())) {
                reportRepository.delete(report);
            }
            else{
                throw new AuthorizationServiceException("unauthorized access");
            }
        }
    }
}
