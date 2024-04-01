package fit.vutbr.cz.gja.dal.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.data.jpa.domain.AbstractPersistable;

/**
 * Represents assessment report
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 23.12.2023
 */
@Entity
public class Report extends AbstractPersistable<Long> {

    @NotBlank
    private String description;
    private String hours;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", updatable=false, insertable=false)
    @JsonIgnore
    private User user;
    @Column(name="user_id")
    private Long userId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", referencedColumnName = "id", updatable=false, insertable=false)
    @JsonIgnore
    private Task task;
    @Column(name="task_id")
    private Long taskId;
    
    public void update(Report other){
        setDescription(other.getDescription());
        setHours(other.getHours());
    }
    
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getHours() {
        return hours;
    }
    public void setHours(String hours) {
        this.hours = hours;
    }

    public User getUser() {
        return user;
    }
    public void setUser(User author) {
        this.user = author;
    }

    public Task getTask() {
        return task;
    }
    public void setTask(Task task) {
        this.task = task;
    }

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getTaskId() {
        return taskId;
    }
    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }
}
