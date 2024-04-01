package fit.vutbr.cz.gja.dal.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.domain.AbstractPersistable;

/**
 * Represents course type
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 23.12.2023
 */
@Entity
public class Type extends AbstractPersistable<Long> {

    @NotBlank
    private String name;

    @ManyToOne(cascade = {}, fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", referencedColumnName = "id", updatable=false, insertable=false)
    @JsonIgnore
    private Course course;
    @Column(name="course_id")
    private Long courseId;
    
    public void update(Type other) {
        setName(other.getName());
    }

    public String getName() {
        return name;
    }
    public void setName(String text) {
        this.name = text;
    }

    public Course getCourse() {
        return course;
    }

    public Long getCourseId() {
        return courseId;
    }
    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
}
