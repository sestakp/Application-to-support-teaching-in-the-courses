package fit.vutbr.cz.gja.dal.entities;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.jpa.domain.AbstractPersistable;

import java.util.ArrayList;
import java.util.Collection;

/**
 * Represents course student
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 23.12.2023
 */
@Entity
public class Student extends AbstractPersistable<Long> {

    @NotBlank
    private String name;
    @Pattern(regexp = "\\d+", message = "Must contain only numbers")
    private String vutlogin;
    @NotBlank
    private String fitlogin;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    @JsonIgnore
    private Collection<Assessment> assessments = new ArrayList<>();
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    @JsonIgnore
    private Course course;
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "team_student", joinColumns = @JoinColumn(name = "student_id"), inverseJoinColumns = @JoinColumn(name = "team_id"))
    @JsonIgnore
    private Collection<Team> teams = new ArrayList<>();
    
    public Student(){}
    
    public Student(long id) {
        setId(id);
    }
    
    public void update(Student other) {
        setName(other.getName());
        setVUTLogin(other.getVUTLogin());
        setFITLogin(other.getFITLogin());
    }
    
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getVUTLogin() {
        return vutlogin;
    }
    public void setVUTLogin(String vutLogin) {
        this.vutlogin = vutLogin;
    }

    public String getFITLogin() {
        return fitlogin;
    }
    public void setFITLogin(String fitLogin) {
        this.fitlogin = fitLogin;
    }

    public Collection<Assessment> getAssessments() {
        return assessments;
    }
    public void setAssessments(Collection<Assessment> assessments) {
        this.assessments = assessments;
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
}
