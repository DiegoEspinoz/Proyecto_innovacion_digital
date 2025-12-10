package com.ecoliving.config;

import com.ecoliving.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                // Endpoints públicos
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/products/**").permitAll()
                .requestMatchers("/api/categories/**").permitAll()
                .requestMatchers("/actuator/**").permitAll()
                .requestMatchers("/error").permitAll()
                .requestMatchers("/favicon.ico").permitAll()
                
                // Endpoints que requieren autenticación
                .requestMatchers("/api/cart/**").authenticated()
                .requestMatchers("/api/interests/**").authenticated()
                .requestMatchers("/api/orders/**").authenticated()
                
                // Endpoints admin
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // Cualquier otra cosa
                .anyRequest().permitAll()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // ⭐⭐ PERMITE TODOS LOS ORÍGENES ⭐⭐
        configuration.setAllowedOrigins(Arrays.asList("*"));
        
        // ⭐⭐ TODOS LOS MÉTODOS HTTP ⭐⭐
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));
        
        // ⭐⭐ TODOS LOS HEADERS ⭐⭐
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers",
            "X-Demo-Mode",      // Para modo demo
            "X-Demo-User",      // Para modo demo
            "X-User-Id",        // Para identificar usuario
            "Cache-Control",
            "Pragma"
        ));
        
        // ⭐⭐ HEADERS EXPUESTOS ⭐⭐
        configuration.setExposedHeaders(Arrays.asList(
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials",
            "Authorization",
            "Content-Disposition"
        ));
        
        // Con "*" no puede ser true, debe ser false
        configuration.setAllowCredentials(false);
        
        // Tiempo de caché para preflight (1 hora)
        configuration.setMaxAge(3600L);
        
        System.out.println("🔥 CORS CONFIGURADO: PERMITIENDO TODOS LOS ORÍGENES (*)");
        System.out.println("✅ Métodos permitidos: " + configuration.getAllowedMethods());
        System.out.println("✅ Headers permitidos: " + configuration.getAllowedHeaders());

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

