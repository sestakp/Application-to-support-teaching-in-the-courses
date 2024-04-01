package fit.vutbr.cz.gja.pl.config;

import fit.vutbr.cz.gja.pl.filters.JwtAuthorizationFilter;
import fit.vutbr.cz.gja.bl.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.ExceptionTranslationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Security configuration
 * @author Pavel Šesták (xsesta07)
 * @since 02.01.2024
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    private final AuthService authService;
    private final JwtAuthorizationFilter jwtAuthorizationFilter;
    
    public SecurityConfig(AuthService authService, JwtAuthorizationFilter jwtAuthorizationFilter){
        this.authService = authService;
        this.jwtAuthorizationFilter = jwtAuthorizationFilter;
    }

    /**
     * Authentication Manager bean for Spring Security.
     *
     * @param {HttpSecurity} http - The HttpSecurity instance.
     * @param {NoOpPasswordEncoder} noOpPasswordEncoder - The NoOpPasswordEncoder instance.
     * @returns {AuthenticationManager} The Authentication Manager.
     * @throws {Exception} Throws an exception if an error occurs.
     */
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, NoOpPasswordEncoder noOpPasswordEncoder) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(authService).passwordEncoder(noOpPasswordEncoder);
        
        return authenticationManagerBuilder.build();
    }

    /**
     * Security Filter Chain for Spring Security.
     *
     * @param {HttpSecurity} http - The HttpSecurity instance.
     * @returns {SecurityFilterChain} The Security Filter Chain.
     * @throws {Exception} Throws an exception if an error occurs.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(authorizationManagerRequestMatcherRegistry -> {
                
            //free endpoints here
            authorizationManagerRequestMatcherRegistry.requestMatchers("/api/users/login").permitAll();
            authorizationManagerRequestMatcherRegistry.requestMatchers("/api/users/register").permitAll();
                authorizationManagerRequestMatcherRegistry.requestMatchers("/api/users/verification/**").permitAll();
            authorizationManagerRequestMatcherRegistry.requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll();
            
            //enable authentication and authorization on all endpoints
            authorizationManagerRequestMatcherRegistry.anyRequest().authenticated();
            
        }).sessionManagement(httpSecuritySessionManagementConfigurer -> httpSecuritySessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class) //setting correct position of filter in filterchain
            .addFilterAfter(jwtAuthorizationFilter, ExceptionTranslationFilter.class);

        return http.build();
    }

    /**
     * Password Encoder bean for Spring Security.
     *
     * @returns {NoOpPasswordEncoder} The NoOpPasswordEncoder instance.
     */
    @SuppressWarnings("deprecation")
    @Bean
    public NoOpPasswordEncoder passwordEncoder() {
        return (NoOpPasswordEncoder) NoOpPasswordEncoder.getInstance();
    }
}
