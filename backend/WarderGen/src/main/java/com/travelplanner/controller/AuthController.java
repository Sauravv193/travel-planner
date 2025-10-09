package com.travelplanner.controller;

import com.travelplanner.dto.request.LoginRequest;
import com.travelplanner.dto.request.SignupRequest;
import com.travelplanner.dto.response.JwtResponse;
import com.travelplanner.dto.response.MessageResponse;
import com.travelplanner.model.User;
import com.travelplanner.repository.UserRepository;
import com.travelplanner.security.jwt.JwtUtils;
import com.travelplanner.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            logger.info("Signin attempt for user: {}", loginRequest.getUsername());
            logger.info("Creating authentication token for user: {} with password length: {}", 
                    loginRequest.getUsername(), loginRequest.getPassword().length());
            
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            logger.info("Successful signin for user: {}", loginRequest.getUsername());
            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail()));
                    
        } catch (BadCredentialsException e) {
            logger.error("Bad credentials for user: {}", loginRequest.getUsername());
            return ResponseEntity.status(401).body(new MessageResponse("Invalid username or password"));
        } catch (AuthenticationException e) {
            logger.error("Authentication failed for user: {} - Error: {}", loginRequest.getUsername(), e.getMessage());
            return ResponseEntity.status(401).body(new MessageResponse("Authentication failed: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error during signin for user: {} - Error: {}", loginRequest.getUsername(), e.getMessage());
            return ResponseEntity.status(500).body(new MessageResponse("An unexpected error occurred"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}