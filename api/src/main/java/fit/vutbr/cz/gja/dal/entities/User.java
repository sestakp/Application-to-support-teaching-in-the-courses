package fit.vutbr.cz.gja.dal.entities;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.checkerframework.checker.index.qual.IndexFor;
import org.springframework.data.jpa.domain.AbstractPersistable;
import org.springframework.security.crypto.bcrypt.BCrypt;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

/**
 * Represents system user
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @author Martin Kmeta (xkment06)
 * @since 23.12.2023
 */
@Entity
@Table(indexes = {
    @Index(name="idx_email", columnList = "email", unique = true),
    @Index(name="idx_hash", columnList = "verifiedHash"),
    @Index(name="idx_verified", columnList = "isVerified")
})
public class User extends AbstractPersistable<Long> {

    @NotBlank
    @Email
    private String email;
    @NotBlank
    private String password;
    @NotBlank
    private String name;
    private boolean isVerified;
    private String verifiedHash;
    private Date registrationDate;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "guarantor_id")
    @JsonIgnore
    private Collection<Course> guaranteedCourses = new ArrayList<>();


    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.REMOVE, CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "responsible_user_id")
    @JsonIgnore
    private Collection<Task> responsibleTasks = new ArrayList<>();
    
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "course_solver", 
        joinColumns = @JoinColumn(name = "user_id"), 
        inverseJoinColumns = @JoinColumn(name = "course_id"),
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "course_id"})
    )

    @JsonIgnore
    private Collection<Course> accessedCourses = new ArrayList<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private Collection<Assessment> assessments = new ArrayList<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private Collection<Report> reports = new ArrayList<>();
    
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = BCrypt.hashpw(password, BCrypt.gensalt());
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public Boolean getVerified() {
        return isVerified;
    }
    public void setVerified(Boolean verified) {
        isVerified = verified;
    }

    public String getVerifiedHash() {
        return verifiedHash;
    }
    public void setVerifiedHash(String verifiedHash) {
        this.verifiedHash = verifiedHash;
    }

    public Date getRegistrationDate() {
        return registrationDate;
    }
    public void setRegistrationDate(Date registrationDate) {
        this.registrationDate = registrationDate;
    }

    public Collection<Course> getGuaranteedCourses() {
        return guaranteedCourses;
    }
    public void setGuaranteedCourses(Collection<Course> guaranteedCourses) {
        this.guaranteedCourses = guaranteedCourses;
    }

    public Collection<Course> getAccessedCourses() {
        return accessedCourses;
    }
    public void setAccessedCourses(Collection<Course> accessedCourses) {
        this.accessedCourses = accessedCourses;
    }

    public Collection<Assessment> getAssessments() {
        return assessments;
    }
    public void setAssessments(Collection<Assessment> assessments) {
        this.assessments = assessments;
    }

    public Collection<Report> getReports() {
        return reports;
    }
    public void setReports(Collection<Report> reports) {
        this.reports = reports;
    }


    public Collection<Task> getResponsibleTasks() {
        return responsibleTasks;
    }
    public void setResponsibleTasks(Collection<Task> responsibleTasks) {
        this.responsibleTasks = responsibleTasks;
    }
    
    
}
