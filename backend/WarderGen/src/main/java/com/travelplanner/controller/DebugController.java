package com.travelplanner.controller;

import com.travelplanner.model.User;
import com.travelplanner.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/debug")
public class DebugController {
    private static final Logger logger = LoggerFactory.getLogger(DebugController.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @PostMapping("/test-password")
    public ResponseEntity<?> testPassword(@RequestParam String username, @RequestParam String password) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            logger.info("Testing password for user: {}", username);
            
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isEmpty()) {
                response.put("error", "User not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            User user = userOpt.get();
            String storedPassword = user.getPassword();
            
            logger.info("Stored password hash: {}", storedPassword);
            logger.info("Input password: {}", password);
            
            boolean matches = passwordEncoder.matches(password, storedPassword);
            logger.info("Password matches: {}", matches);
            
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("storedPasswordHash", storedPassword);
            response.put("inputPassword", password);
            response.put("passwordMatches", matches);
            response.put("encoderType", passwordEncoder.getClass().getSimpleName());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error testing password: ", e);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @PostMapping("/encode-password")
    public ResponseEntity<?> encodePassword(@RequestParam String password) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String encoded = passwordEncoder.encode(password);
            logger.info("Encoded password: {} -> {}", password, encoded);
            
            response.put("originalPassword", password);
            response.put("encodedPassword", encoded);
            response.put("encoderType", passwordEncoder.getClass().getSimpleName());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error encoding password: ", e);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}