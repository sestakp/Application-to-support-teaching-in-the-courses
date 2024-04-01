package fit.vutbr.cz.gja.dal.entities;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import org.springframework.data.jpa.domain.AbstractPersistable;

/**
 * Represents criterion assessment
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 23.12.2023
 */
@Entity
@Table(indexes = {
    @Index(name="idx_identifiers", columnList = "criterion_id,student_id,team_id", unique = true),
    @Index(name="idx_identifiers_student", columnList = "criterion_id,student_id", unique = true),
    @Index(name="idx_identifiers_team", columnList = "criterion_id,team_id", unique = true)
})
public class Assessment extends AbstractPersistable<Long> {
    
    private double points;
    private String feedback;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "criterion_id", referencedColumnName = "id", updatable=false, insertable=false)
    @JsonIgnore
    private Criterion criterion;
    @Column(name="criterion_id")
    private Long criterionId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", referencedColumnName = "id", updatable=false, insertable=false)
    @JsonIgnore
    private Student student;
    @Column(name="student_id")
    private Long studentId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", referencedColumnName = "id", updatable=false, insertable=false)
    @JsonIgnore
    private Team team;
    @Column(name="team_id")
    private Long teamId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", updatable=false, insertable=false)
    @JsonIgnore
    private User user;
    @Column(name="user_id")
    private Long userId;
    
    public void update(Assessment other) {
        setPoints(other.getPoints());
        setFeedback(other.getFeedback());
    }

    public double getPoints() {
        return points;
    }
    public void setPoints(double points) {
        this.points = points;
    }

    public String getFeedback() {
        return feedback;
    }
    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public Criterion getCriterion() {
        return criterion;
    }
    public void setCriterion(Criterion criterion) {
        this.criterion = criterion;
    }

    public Student getStudent() {
        return student;
    }
    public void setStudent(Student student) {
        this.student = student;
    }

    public Team getTeam() {
        return team;
    }
    public void setTeam(Team team) {
        this.team = team;
    }

    public User getUser() {
        return user;
    }
    public void setUser(User evaluator) {
        this.user = evaluator;
    }

    public Long getCriterionId() {
        return criterionId;
    }
    public void setCriterionId(Long criterionId) {
        this.criterionId = criterionId;
    }

    public Long getStudentId() {
        return studentId;
    }
    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getTeamId() {
        return teamId;
    }
    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
