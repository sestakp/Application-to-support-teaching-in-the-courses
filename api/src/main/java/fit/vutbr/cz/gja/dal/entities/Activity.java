package fit.vutbr.cz.gja.dal.entities;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.domain.AbstractPersistable;

import java.util.ArrayList;
import java.util.Collection;

/**
 * Represents course activity
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 23.12.2023
 */
@Entity
public class Activity extends AbstractPersistable<Long> {

    @NotBlank
    private String name;
    private boolean isTeamBased;
    @Column(length = 4096)
    private String emailTemplate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", referencedColumnName = "id", updatable=false, insertable=false)
    @JsonIgnore
    private Course course;
    @Column(name="course_id")
    private Long courseId;
    
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "activity", cascade = {CascadeType.REMOVE})
    @JsonIgnore
    private Collection<Team> teams = new ArrayList<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.REMOVE})
    @JoinColumn(name = "activity_id")
    @JsonIgnore
    private Collection<Criterion> criteria = new ArrayList<>();
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id")
    @JsonIgnore
    private Collection<Task> tasks = new ArrayList<>();
    
    public void update(Activity other) {
        setName(other.getName());
        setTeamBased(other.getTeamBased());
        setEmailTemplate(other.getEmailTemplate());
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public Boolean getTeamBased() {
        return isTeamBased;
    }
    public void setTeamBased(Boolean teamBased) {
        isTeamBased = teamBased;
    }

    public String getEmailTemplate() {
        return emailTemplate;
    }
    public void setEmailTemplate(String emailTemplate) {
        this.emailTemplate = emailTemplate;
    }

    public Course getCourse() {
        return course;
    }
    public void setCourse(Course course) {
        this.course = course;
    }

    public Collection<Team> getTeams() {
        return teams;
    }
    public void setTeams(Collection<Team> teams) {
        this.teams = teams;
    }

    public Collection<Criterion> getCriteria() {
        return criteria;
    }
    public void setCriteria(Collection<Criterion> criterionCategories) {
        this.criteria = criterionCategories;
    }

    public Collection<Task> getTasks() {
        return tasks;
    }
    public void setTasks(Collection<Task> tasks) {
        this.tasks = tasks;
    }

    public Long getCourseId() {
        return courseId;
    }
    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
}
