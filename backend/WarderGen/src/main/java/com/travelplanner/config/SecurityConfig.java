package com.travelplanner.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SecurityConfig {

    @Value("${cors.origins:http://localhost:3000,http://localhost:5173,https://travel-planner-frontend.vercel.app}")
    private String corsOrigins;

    @Value("${cors.allowed-methods:GET,POST,PUT,DELETE,OPTIONS,PATCH}")
    private String allowedMethods;

    @Value("${cors.allowed-headers:*}")
    private String allowedHeaders;

    @Value("${cors.exposed-headers:Authorization,Content-Type,X-Total-Count,X-Page-Count}")
    private String exposedHeaders;

    @Value("${cors.max-age:3600}")
    private long maxAge;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                String[] origins = corsOrigins.split(",");
                String[] methods = allowedMethods.split(",");
                String[] headers = allowedHeaders.split(",");
                String[] exposed = exposedHeaders.split(",");

                registry.addMapping("/**")
                        .allowedOrigins(origins)
                        .allowedMethods(methods)
                        .allowedHeaders(headers)
                        .exposedHeaders(exposed)
                        .allowCredentials(true)
                        .maxAge(maxAge);
            }
        };
    }
}