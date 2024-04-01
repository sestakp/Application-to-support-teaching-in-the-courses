package fit.vutbr.cz.gja.bl.aspects;

import fit.vutbr.cz.gja.bl.annotations.SecureMethod;
import fit.vutbr.cz.gja.dal.entities.User;
import fit.vutbr.cz.gja.dal.repositories.UserRepository;
import org.aopalliance.intercept.MethodInvocation;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.aop.aspectj.MethodInvocationProceedingJoinPoint;
import org.springframework.aop.framework.ReflectiveMethodInvocation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.AccessibleObject;
import java.lang.reflect.Method;
import java.nio.file.AccessDeniedException;

/**
 * User authentication and authorization
 * @author Pavel Šesták (xsesta07)
 * @since 09.01.2024
 */
@Component
@Aspect
public class SecurityAspect {
    
    @Autowired
    private UserRepository userRepository;

    @Pointcut("@annotation(secureMethod) && execution(* *(..))")
    public void secureMethodPointcut(SecureMethod secureMethod) {}

    /**
     * Using this aspect expecting first param of entity User
     * @param joinPoint
     * @param secureMethod
     * @return
     * @throws Throwable
     */
    @Around("secureMethodPointcut(secureMethod)")
    public Object secureMethod(ProceedingJoinPoint joinPoint, SecureMethod secureMethod) throws Throwable {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.getPrincipal() instanceof String email) {
            var userOrNull = userRepository.findByEmailAndIsVerified(email, true);
            if (userOrNull.isEmpty()) {
                throw new AccessDeniedException("User not found or not verified");
            }
            var user = userOrNull.get();
            
            Object[] modifiedArgs = joinPoint.getArgs();
            
            if(modifiedArgs.length > 0 && modifiedArgs[0] == null){
                modifiedArgs[0] = user;
            }
            
            return joinPoint.proceed(modifiedArgs);
        } else {
            throw new AccessDeniedException("User not authenticated");
        }
    }
}
