package fit.vutbr.cz.gja.bl.models;

import jakarta.validation.constraints.Email;

/**
 * User login model for client
 * @author Pavel Šesták (xsesta07)
 * @since 02.01.2024
 */
public class LoginModel {
    
    @Email
    public String email;
    public String password;
    
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
        this.password = password;
    }
}
