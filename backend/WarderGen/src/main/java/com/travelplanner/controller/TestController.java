package com.travelplanner.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Test endpoint working");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/simple")
    public ResponseEntity<String> simple() {
        return ResponseEntity.ok("Simple endpoint working");
    }

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }

    @GetMapping("/basic")
    public String basic() {
        return "OK";
    }
}