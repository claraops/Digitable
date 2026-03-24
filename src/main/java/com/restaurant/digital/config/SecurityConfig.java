package com.restaurant.digital.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()  // Autorise toutes les requêtes sans authentification
            )
            .csrf(csrf -> csrf.disable());  // Désactive CSRF pour les tests API
        return http.build();
    }
}