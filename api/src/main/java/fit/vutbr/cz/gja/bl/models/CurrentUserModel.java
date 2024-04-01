package fit.vutbr.cz.gja.bl.models;

/**
 * Current user model for client
 * @author Pavel Šesták (xsesta07)
 * @since 04.01.2024
 */
public class CurrentUserModel {
    
    private Long id;
    private String email;
    private String name;
    
    public String token;
    
    public void setId(Long id){
        this.id = id;
    }
    
    public void setEmail(String email){
        this.email = email;
    }
    
    public void setName(String name){
        this.name = name;
    }
    
    public void setToken(String token){
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }
}
