package fit.vutbr.cz.gja.bl.service;

import fit.vutbr.cz.gja.dal.entities.User;
import fit.vutbr.cz.gja.dal.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Service for authentication-related operations
 * @author Pavel Šesták (xsesta07)
 * @since 02.01.2024
 */
@Service
public class AuthService implements UserDetailsService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Load user details by username (email).
     * @param email The email (username) of the user.
     * @return UserDetails object representing the authenticated user.
     * @throws UsernameNotFoundException if the user is not found.
     */
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        var userOrNull = userRepository.findByEmail(email);
        
        if (userOrNull.isPresent()) {
            var user = userOrNull.get();
            
            if (!user.getVerified()) {
                return null;
            }
            
            List<String> roles = new ArrayList<>();
            roles.add("USER");
            var userDetails = org.springframework.security.core.userdetails.User.builder()
                    .username(user.getEmail())
                    .password(user.getPassword())
                    .roles(roles.toArray(new String[0]))
                    .build();

            return userDetails;
        }
        return null;        
    }
}
