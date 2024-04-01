package fit.vutbr.cz.gja.pl.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;

import java.util.Arrays;

/**
 * CORS configuration
 * @author Pavel Šesták (xsesta07)
 * @since 04.01.2024
 */
@Configuration
public class CorsConfig {
    
    private String clientUrl;
    public CorsConfig(@Value("${client.url}") String clientUrl){
        this.clientUrl = clientUrl;
    }
    
    /**
     * CORS filter
     * @return FilterRegistrationBean
     */
    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        
        corsConfiguration.setAllowedOriginPatterns(Arrays.asList("http://localhost", "http://client", "http://172.16.1.2", clientUrl));
        corsConfiguration.addAllowedMethod("GET");
        corsConfiguration.addAllowedMethod("POST");
        corsConfiguration.addAllowedMethod("PUT");
        corsConfiguration.addAllowedMethod("DELETE");
        corsConfiguration.addAllowedMethod("OPTIONS");
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);

        FilterRegistrationBean<CorsFilter> registrationBean = new FilterRegistrationBean<>(new CorsFilter(source));
        registrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return registrationBean;
    }
}
