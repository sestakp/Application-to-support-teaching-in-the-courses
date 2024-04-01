package fit.vutbr.cz.gja.dal.entities;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.data.jpa.domain.AbstractPersistable;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

/**
 * Represents course task
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 23.12.2023
 */
@Entity
public class Task extends AbstractPersistable<Long> {

    @Positive
    @Column(name = "task_order")
    private int order;
    @NotBlank
    private String name;
    private String criteriaCategory;
    private String description;
    @NotNull
    private Date start;
    @NotNull
    private Date end;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", referencedColumnName = "id", updatable=false, insertable=false)
    @JsonIgnore
    private Course course;
    @Column(name="course_id")
    private Long courseId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id", referencedColumnName = "id", updatable=false, insertable=false)
    @JsonIgnore
    private Type type;
    @Column(name="type_id")
    private Long typeId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", referencedColumnName = "id", updatable=false, insertable=false)
    @JsonIgnore
    private Activity activity;
    @Column(name="activity_id")
    private Long activityId;
    
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.REMOVE})
    @JoinColumn(name = "task_id")
    @JsonIgnore
    private Collection<Report> reports = new ArrayList<>();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsible_user_id", referencedColumnName = "id", updatable=false, insertable=false)
    @JsonIgnore
    private User responsibleUser;
    @Column(name="responsible_user_id")
    private Long responsibleUserId;
    
    public void update(Task other) {
        setOrder(other.getOrder());
        setName(other.getName());
        setDescription(other.getDescription());
        setStart(other.getStart());
        setEnd(other.getEnd());
        setTypeId(other.getTypeId());
        setActivityId(other.getActivityId());
        setCriteriaCategory(other.getCriteriaCategory());
        setResponsibleUserId(other.getResponsibleUserId());
    }

    public int getOrder() {
        return order;
    }
    public void setOrder(int order) {
        this.order = order;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getCriteriaCategory() {
        return criteriaCategory;
    }
    public void setCriteriaCategory(String criteriaCategory) {
        this.criteriaCategory = criteriaCategory;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public Date getStart() {
        return start;
    }
    public void setStart(Date startDate) {
        this.start = startDate;
    }

    public Date getEnd() {
        return end;
    }
    public void setEnd(Date endDate) {
        this.end = endDate;
    }

    public Course getCourse() {
        return course;
    }
    public void setCourse(Course course) {
        this.course = course;
    }

    public Type getType() {
        return type;
    }
    public void setType(Type type) {
        this.type = type;
    }

    public Activity getActivity() {
        return activity;
    }
    public void setActivity(Activity activity) {
        this.activity = activity;
    }
    
    public Collection<Report> getReports() {
        return reports;
    }
    public void setReports(Collection<Report> reports) {
        this.reports = reports;
    }

    public User getResponsibleUser() {
        return responsibleUser;
    }
    public void setResponsibleUser(User responsibleUser) {
        this.responsibleUser = responsibleUser;
    }

    public Long getCourseId() {
        return courseId;
    }
    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Long getTypeId() {
        return typeId;
    }
    public void setTypeId(Long typeId) {
        this.typeId = typeId;
    }

    public Long getActivityId() {
        return activityId;
    }
    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Long getResponsibleUserId() {
        return responsibleUserId;
    }
    public void setResponsibleUserId(Long responsibleUserId) {
        this.responsibleUserId = responsibleUserId;
    }
}
