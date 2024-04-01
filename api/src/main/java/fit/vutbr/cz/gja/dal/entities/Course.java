package fit.vutbr.cz.gja.dal.entities;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.domain.AbstractPersistable;

import java.util.ArrayList;
import java.util.Collection;

/**
 * Represents a course
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 23.12.2023
 */
@Entity
public class Course extends AbstractPersistable<Long> {

    @NotBlank
    private String abbrevation;
    @NotBlank
    private String name;
    private int year;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guarantor_id", referencedColumnName = "id", updatable = false, insertable = false)
    @JsonIgnore
    private User guarantor;
    @Column(name="guarantor_id")
    private Long guarantorId;
    
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "course_solver", 
        joinColumns = @JoinColumn(name = "course_id"), 
        inverseJoinColumns = @JoinColumn(name = "user_id"),
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "course_id"})
    )
    @JsonIgnore
    private Collection<User> solvers = new ArrayList<>();
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Collection<Student> students = new ArrayList<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.REMOVE})
    @JoinColumn(name = "course_id")
    @JsonIgnore
    private Collection<Activity> activities = new ArrayList<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.REMOVE})
    @JoinColumn(name = "course_id")
    @JsonIgnore
    private Collection<Task> tasks = new ArrayList<>();
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.REMOVE})
    @JoinColumn(name = "course_id")
    @JsonIgnore
    private Collection<Type> types = new ArrayList<>();
    
    public Course() {}
    
    public Course(long id) {
        setId(id);
    }
    
    public void update(Course other) {
        setName(other.getName());
        setAbbrevation(other.getAbbrevation());
        setYear(other.getYear());
    }

    public String getAbbrevation() {
        return abbrevation;
    }
    public void setAbbrevation(String abbrevation) {
        this.abbrevation = abbrevation;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public int getYear() {
        return year;
    }
    public void setYear(int year) {
        this.year = year;
    }

    public User getGuarantor() {
        return guarantor;
    }
    public void setGuarantor(User guarantor) {
        this.guarantor = guarantor;
    }

    public Collection<User> getSolvers() {
        return solvers;
    }
    public void setSolvers(Collection<User> solvers) {
        this.solvers = solvers;
    }

    public Collection<Student> getStudents() {
        return students;
    }
    public void setStudents(Collection<Student> students) {
        this.students = students;
    }

    public Collection<Activity> getActivities() {
        return activities;
    }
    public void setActivities(Collection<Activity> activities) {
        this.activities = activities;
    }

    public Collection<Task> getTasks() {
        return tasks;
    }
    public void setTasks(Collection<Task> tasks) {
        this.tasks = tasks;
    }

    public Collection<Type> getTypes() {
        return types;
    }
    public void setTypes(Collection<Type> types) {
        this.types = types;
    }

    public Long getGuarantorId() {
        return guarantorId;
    }
    public void setGuarantorId(Long guarantorId) {
        this.guarantorId = guarantorId;
    }
}
