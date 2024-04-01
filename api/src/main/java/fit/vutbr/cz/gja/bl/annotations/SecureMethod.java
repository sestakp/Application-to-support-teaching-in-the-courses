package fit.vutbr.cz.gja.bl.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotates method requiring authorization
 * @author Pavel Šesták (xsesta07)
 * @since 09.01.2024
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface SecureMethod {
    
}