package fit.vutbr.cz.gja.dal.entities;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.domain.AbstractPersistable;

import java.util.ArrayList;
import java.util.Collection;

/**
 * Represents activity team
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 23.12.2023
 */
@Entity
public class Team extends AbstractPersistable<Long> {

    @NotBlank
    private String name;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", insertable = false, updatable = false)
    @JsonIgnore
    private Activity activity;
    @Column(name = "activity_id")
    private Long activityId;
    
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "team_student", joinColumns = @JoinColumn(name = "team_id"), inverseJoinColumns = @JoinColumn(name = "student_id"))
    @JsonIgnore
    private Collection<Student> members = new ArrayList<>();
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    @JsonIgnore
    private Collection<Assessment> assessments = new ArrayList<>();
    
    public void Update(Team other) {
        setName(other.getName());
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public Activity getActivity() {
        return activity;
    }
    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public Long getActivityId() {
        return activityId;
    }
    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Collection<Student> getMembers() {
        return members;
    }
    public void setMembers(Collection<Student> members) {
        this.members = members;
    }

    public Collection<Assessment> getAssessments() {
        return assessments;
    }
    public void setAssessments(Collection<Assessment> assessments) {
        this.assessments = assessments;
    }
}
