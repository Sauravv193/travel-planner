package com.travelplanner.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class HealthController {

@GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "Travel Planner Backend");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }

    // Root endpoint for basic health check
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Travel Planner Backend API is running");
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("endpoints", new String[]{
            "/api/health",
            "/api/auth/signin", 
            "/api/auth/signup",
            "/api/trips",
            "/api/itineraries"
        });
        return ResponseEntity.ok(response);
    }

    // Simple diagnostic endpoint
    @GetMapping("/api/status")
    public ResponseEntity<Map<String, String>> status() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("service", "Travel Planner Backend");
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
}