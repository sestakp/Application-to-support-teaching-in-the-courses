package fit.vutbr.cz.gja.bl.models;

/**
 * User register model for client
 * @author Pavel Šesták (xsesta07)
 * @since 02.01.2024
 */
public class RegisterModel {
    
    public String email;
    public String name;
    public String password;

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
