package com.travelplanner.controller;

import com.travelplanner.model.User;
import com.travelplanner.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
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
@Profile("dev") // Only available when running with -Dspring.profiles.active=dev
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
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isEmpty()) {
                response.put("error", "User not found");
                return ResponseEntity.badRequest().body(response);
            }

            User user = userOpt.get();
            boolean matches = passwordEncoder.matches(password, user.getPassword());

            response.put("username", user.getUsername());
            response.put("passwordMatches", matches);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error testing password: ", e);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
