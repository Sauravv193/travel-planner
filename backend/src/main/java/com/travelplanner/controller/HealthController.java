package com.travelplanner.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Autowired(required = false)
    private DataSource dataSource;

    @Value("${spring.profiles.active:default}")
    private String activeProfile;

@GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "UP");
            response.put("timestamp", LocalDateTime.now().toString());
            response.put("service", "Travel Planner Backend");
            response.put("version", "1.0.0");
            response.put("profile", activeProfile);
            
            // Database health check
            Map<String, String> dbHealth = new HashMap<>();
            if (dataSource != null) {
                try (Connection connection = dataSource.getConnection()) {
                    if (connection.isValid(5)) {
                        dbHealth.put("status", "UP");
                        dbHealth.put("database", connection.getMetaData().getDatabaseProductName());
                    } else {
                        dbHealth.put("status", "DOWN");
                        dbHealth.put("error", "Connection validation failed");
                    }
                } catch (Exception dbEx) {
                    dbHealth.put("status", "DOWN");
                    dbHealth.put("error", dbEx.getMessage());
                }
            } else {
                dbHealth.put("status", "NOT_CONFIGURED");
                dbHealth.put("error", "DataSource not available");
            }
            response.put("database", dbHealth);
            
            // Environment info
            Map<String, String> envInfo = new HashMap<>();
            envInfo.put("DATABASE_URL_SET", System.getenv("DATABASE_URL") != null ? "YES" : "NO");
            envInfo.put("JWT_SECRET_SET", System.getenv("JWT_SECRET") != null ? "YES" : "NO");
            envInfo.put("GEMINI_API_KEY_SET", System.getenv("GEMINI_API_KEY") != null ? "YES" : "NO");
            envInfo.put("PORT", System.getenv("PORT"));
            response.put("environment", envInfo);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "ERROR");
            errorResponse.put("error", e.getMessage());
            errorResponse.put("stackTrace", e.getStackTrace());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }


    // Simple diagnostic endpoint
    @GetMapping("/status")
    public ResponseEntity<Map<String, String>> status() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("service", "Travel Planner Backend");
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
}