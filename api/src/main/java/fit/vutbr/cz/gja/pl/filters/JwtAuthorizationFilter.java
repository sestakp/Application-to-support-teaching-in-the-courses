package fit.vutbr.cz.gja.pl.filters;

import com.fasterxml.jackson.databind.ObjectMapper;
import fit.vutbr.cz.gja.bl.service.AuthService;
import fit.vutbr.cz.gja.pl.auth.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT authorization filter
 * @author Pavel Šesták (xsesta07)
 * @since 02.01.2024
 */
@Component
public class JwtAuthorizationFilter extends OncePerRequestFilter {
    
    private final JwtUtil jwtUtil;
    private final ObjectMapper mapper;

    public JwtAuthorizationFilter(JwtUtil jwtUtil, ObjectMapper mapper) {
        this.jwtUtil = jwtUtil;
        this.mapper = mapper;
    }

    /**
     * Apply JWT filter
     * @param request HTTP request
     * @param response HTTP response
     * @param filterChain Filter chain
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Map<String, Object> errorDetails = new HashMap<>();

        try {
            String accessToken = jwtUtil.resolveToken(request);
            
            if (accessToken == null ) {
                filterChain.doFilter(request, response);
                return;
            }
            
            Claims claims = jwtUtil.resolveClaims(request);

            if (claims != null & jwtUtil.validateClaims(claims)) {
                String email = claims.getSubject();
                Authentication authentication = 
                    new UsernamePasswordAuthenticationToken(email,"",new ArrayList<>());
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        }
        catch (AuthenticationException e) {
            errorDetails.put("message", "Authentication Error");
            errorDetails.put("details",e.getMessage());
            
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            mapper.writeValue(response.getWriter(), errorDetails);
        }
        
        filterChain.doFilter(request, response);
    }
}
