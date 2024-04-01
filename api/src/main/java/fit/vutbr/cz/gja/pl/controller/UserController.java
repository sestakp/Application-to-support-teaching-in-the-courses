package fit.vutbr.cz.gja.pl.controller;

import fit.vutbr.cz.gja.bl.models.CurrentUserModel;
import fit.vutbr.cz.gja.bl.models.LoginModel;
import fit.vutbr.cz.gja.bl.models.RegisterModel;
import fit.vutbr.cz.gja.bl.models.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fit.vutbr.cz.gja.dal.entities.User;
import fit.vutbr.cz.gja.bl.service.UserService;

/**
 * Users REST API
 * @author Martin Kmenta (xkment06)
 * @author Daniel Peřina (xperin12)
 * @author Pavel Šesták (xsesta07)
 * @since 27.12.2023
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService _service;

    public UserController(UserService _service) {
        this._service = _service;
    }

    /**
     * Get user
     * @param id User ID
     * @return User
     */
    @GetMapping("/{id}")
    public User getById(@PathVariable long id) {
        return _service.get(id).orElse(null);
    }

    /**
     * Verify user
     * @param hash Verification hash
     * @return Result message
     */
    @GetMapping("/verification/{hash}")
    public String verification(@PathVariable String hash) { return _service.verification(hash);}

    /**
     * Get all users
     * @return All users
     */
    @GetMapping
    public Iterable<UserModel> getAll() {
        return _service.getAll();
    }

    /**
     * Get course solvers
     * @param id Course ID
     * @return Course solvers
     */
    @GetMapping("/course/{id}")
    public Iterable<UserModel> getAllByCourse(@PathVariable long id) {
        return _service.getAllByCourse(id);
    }

    /**
     * Update user
     * @param model User
     * @return Updated user
     */
    @PutMapping
    public boolean update(@RequestBody RegisterModel model) {
        return _service.update(null, model);
    }

    /**
     * Delete user
     * @param id User ID
     */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {
        _service.delete(null,id);
    }

    /**
     * Login user
     * @param loginModel User credentials
     * @return User login
     */
    @PostMapping("/login")
    public CurrentUserModel login(@RequestBody LoginModel loginModel){
        return _service.login(loginModel);
    }

    /**
     * Register user
     * @param model Registration form
     * @return User
     */
    @PostMapping("/register")
    public User register(@RequestBody RegisterModel model){
        return _service.register(model);
    }
}
