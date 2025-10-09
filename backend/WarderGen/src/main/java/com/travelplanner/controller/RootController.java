package com.travelplanner.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Travel Planner Backend API is running");
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("version", "1.0.0");
        response.put("endpoints", new String[]{
            "/api/health",
            "/api/status", 
            "/api/auth/signin", 
            "/api/auth/signup",
            "/api/trips",
            "/api/itineraries"
        });
        return ResponseEntity.ok(response);
    }
}