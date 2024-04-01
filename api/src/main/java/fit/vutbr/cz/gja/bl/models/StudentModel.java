package fit.vutbr.cz.gja.bl.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Student model for client
 * @author Pavel Šesták (xsesta07)
 * @since 08.01.2024
 */
public class StudentModel {
    
    @NotBlank
    private String name;
    @Pattern(regexp = "\\d+", message = "Must contain only numbers")
    private String vutlogin;
    private String fitlogin;
    private Long courseId;
    
    public String getName(){
        return this.name;
    }
    
    public String getVUTLogin() {
        return this.vutlogin;
    }
    
    public String getFITLogin(){
        return this.fitlogin;
    }
    
    public Long getCourseId(){
        return this.courseId;
    }
}
