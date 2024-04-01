package fit.vutbr.cz.gja.pl.auth;

import fit.vutbr.cz.gja.dal.entities.User;
import io.jsonwebtoken.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * JWT utilities
 * @author Pavel Šesták (xsesta07)
 * @since 02.01.2024
 */
@Component
public class JwtUtil {

    private String secret_key;
    private long accessTokenValidity = 60*60*1000;
    private final JwtParser jwtParser;
    private final String TOKEN_HEADER = "Authorization";
    private final String TOKEN_PREFIX = "Bearer ";
    
    public JwtUtil(@Value("${jwt.key}") String key){
        this.secret_key = key;
        this.jwtParser = Jwts.parser().setSigningKey(key);
    }

    /**
     * Create JWT for user
     * @param user User
     * @return Serialized JWT
     */
    public String createToken(User user) {
        Claims claims = Jwts.claims().setSubject(user.getEmail());
        claims.put("email",user.getEmail());
        
        Date tokenCreateTime = new Date();
        Date tokenValidity = new Date(tokenCreateTime.getTime() + TimeUnit.MINUTES.toMillis(accessTokenValidity));
        
        return Jwts.builder()
            .setClaims(claims)
            .setExpiration(tokenValidity)
            .signWith(SignatureAlgorithm.HS256, secret_key)
            .compact();
    }

    /**
     * Parse serialized JWT
     * @param token JWT token
     * @return User claims
     */
    private Claims parseJwtClaims(String token) {
        return jwtParser.parseClaimsJws(token).getBody();
    }

    /**
     * Resolve JWT token from request
     * @param req HTTP request
     * @return User claims
     */
    public Claims resolveClaims(HttpServletRequest req) {
        try {
            String token = resolveToken(req);
            if (token != null) {
                return parseJwtClaims(token);
            }
            return null;
        }
        catch (ExpiredJwtException ex) {
            req.setAttribute("expired", ex.getMessage());
            throw ex;
        }
        catch (Exception ex) {
            req.setAttribute("invalid", ex.getMessage());
            throw ex;
        }
    }

    /**
     * Resolve JWT token from request
     * @param request HTTP request
     * @return Serialized JWT
     */
    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(TOKEN_HEADER);
        if (bearerToken != null && bearerToken.startsWith(TOKEN_PREFIX)) {
            return bearerToken.substring(TOKEN_PREFIX.length());
        }
        return null;
    }

    /**
     * Validate user claims
     * @param claims User claims
     * @return Are claims validated
     * @throws AuthenticationException Claims expired
     */
    public boolean validateClaims(Claims claims) throws AuthenticationException {
        return claims.getExpiration().after(new Date());
    }

    /**
     * Get user email from claims
     * @param claims User claims
     * @return User email
     */
    public String getEmail(Claims claims) {
        return claims.getSubject();
    }

    /**
     * Get user roles from claims
     * @param claims User claims
     * @return List of user roles
     */
    private List<String> getRoles(Claims claims) {
        return (List<String>) claims.get("roles");
    }
}
