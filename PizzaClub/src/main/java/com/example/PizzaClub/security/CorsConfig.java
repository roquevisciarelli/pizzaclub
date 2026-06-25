package com.example.PizzaClub.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permitir orígenes de forma flexible (ideal para desarrollo y producción)
        configuration.setAllowedOriginPatterns(List.of("*")); 
        
        // Permitir todos los métodos HTTP comunes
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Permitir cabeceras comunes, incluyendo Authorization para JWT
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        
        // CRÍTICO: Permitir que el navegador envíe credenciales (cookies, tokens)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}