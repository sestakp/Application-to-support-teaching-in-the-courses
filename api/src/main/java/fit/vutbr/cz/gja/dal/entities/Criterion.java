package fit.vutbr.cz.gja.dal.entities;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.domain.AbstractPersistable;

import java.util.ArrayList;
import java.util.Collection;

/**
 * Represents activity criterion
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 23.12.2023
 */
@Entity
public class Criterion extends AbstractPersistable<Long> {

    @NotBlank
    private String code;
    @NotBlank
    private String name;
    @NotBlank
    private String category;
    private String description;
    @NotBlank
    private String assessmentMethod;
    private double maxPoints;
    private double minPoints;
    private String feedback;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", referencedColumnName = "id", updatable=false, insertable=false)
    @JsonIgnore
    private Activity activity;
    @Column(name="activity_id")
    private Long activityId;
    
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.REMOVE})
    @JoinColumn(name = "criterion_id")
    @JsonIgnore
    private Collection<Assessment> assessments = new ArrayList<>();
    
    public void update(Criterion other) {
        setCode(other.getCode());
        setName(other.getName());
        setDescription(other.getDescription());
        setAssessmentMethod(other.getAssessmentMethod());
        setMaxPoints(other.getMaxPoints());
        setMinPoints(other.getMinPoints());
        setFeedback(other.getFeedback());
    }

    public String getCode() {
        return code;
    }
    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getAssessmentMethod() {
        return assessmentMethod;
    }
    public void setAssessmentMethod(String assessmentMethod) {
        this.assessmentMethod = assessmentMethod;
    }
    
    public double getMaxPoints() {
        return maxPoints;
    }
    public void setMaxPoints(double maxPoints) {
        this.maxPoints = maxPoints;
    }

    public double getMinPoints() {
        return minPoints;
    }
    public void setMinPoints(double minPoints) {
        this.minPoints = minPoints;
    }

    public String getFeedback() {
        return feedback;
    }
    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
    
    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }
    
    public Collection<Assessment> getAssessments() {
        return assessments;
    }
    public void setAssessments(Collection<Assessment> assessments) {
        this.assessments = assessments;
    }

    public Long getActivityId() {
        return activityId;
    }
    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }
}
