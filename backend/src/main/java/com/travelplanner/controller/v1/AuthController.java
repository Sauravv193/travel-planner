package com.travelplanner.controller.v1;

import com.travelplanner.dto.request.ForgotPasswordRequest;
import com.travelplanner.dto.request.LoginRequest;
import com.travelplanner.dto.request.ResetPasswordRequest;
import com.travelplanner.dto.request.SignupRequest;
import com.travelplanner.dto.request.TokenRefreshRequest;
import com.travelplanner.dto.response.JwtResponse;
import com.travelplanner.dto.response.MessageResponse;
import com.travelplanner.exception.BadRequestException;
import com.travelplanner.model.RefreshToken;
import com.travelplanner.model.User;
import com.travelplanner.repository.UserRepository;
import com.travelplanner.security.jwt.JwtUtils;
import com.travelplanner.security.services.RefreshTokenService;
import com.travelplanner.security.services.UserDetailsImpl;
import com.travelplanner.service.VerificationService;
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
@RequestMapping("/api/v1/auth")
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

    @Autowired
    RefreshTokenService refreshTokenService;

    @Autowired
    VerificationService verificationService;

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
            
            // Create refresh token
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());
            
            logger.info("Successful signin for user: {}", loginRequest.getUsername());
            return ResponseEntity.ok(new JwtResponse(jwt, refreshToken.getToken(),
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

    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshToken -> {
                    // Verify token is not revoked
                    if (refreshToken.isRevoked()) {
                        logger.warn("Attempted to use revoked refresh token");
                        return ResponseEntity.status(403).body(new MessageResponse("Refresh token has been revoked"));
                    }
                    
                    // Rotate refresh token
                    RefreshToken newRefreshToken = refreshTokenService.rotateRefreshToken(requestRefreshToken);
                    
                    // Generate new access token - build a UserDetailsImpl from the user
                    User user = refreshToken.getUser();
                    UserDetailsImpl userDetails = UserDetailsImpl.build(user);
                    Authentication authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    String newAccessToken = jwtUtils.generateJwtToken(authentication);
                    
                    logger.info("Token refresh successful for user: {}", user.getId());
                    return ResponseEntity.ok(new JwtResponse(newAccessToken, newRefreshToken.getToken(),
                            user.getId(), user.getUsername(), user.getEmail()));
                })
                .orElseThrow(() -> {
                    logger.warn("Refresh token not found: {}", requestRefreshToken);
                    return new RuntimeException("Refresh token not found");
                });
    }

    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = userDetails.getId();
        refreshTokenService.deleteByUserId(userId);
        logger.info("User signed out: {}", userId);
        return ResponseEntity.ok(new MessageResponse("Log out successful!"));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        try {
            verificationService.verifyEmail(token);
            return ResponseEntity.ok(new MessageResponse("Email verified successfully!"));
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerificationEmail() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        try {
            verificationService.createEmailVerificationToken(userDetails.getId());
            return ResponseEntity.ok(new MessageResponse("Verification email sent successfully!"));
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            verificationService.createPasswordResetToken(request.getEmail());
            return ResponseEntity.ok(new MessageResponse("Password reset email sent successfully!"));
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            String encodedPassword = encoder.encode(request.getPassword());
            verificationService.resetPassword(request.getToken(), encodedPassword);
            return ResponseEntity.ok(new MessageResponse("Password reset successfully!"));
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsernameAndDeletedFalse(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmailAndDeletedFalse(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));
        user.setCreatedBy("system");

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
