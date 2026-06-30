package com.travelplanner.controller.v1;

import com.travelplanner.dto.request.LoginRequest;
import com.travelplanner.dto.request.SignupRequest;
import com.travelplanner.dto.request.TokenRefreshRequest;
import com.travelplanner.dto.response.JwtResponse;
import com.travelplanner.dto.response.MessageResponse;
import com.travelplanner.model.RefreshToken;
import com.travelplanner.model.User;
import com.travelplanner.repository.UserRepository;
import com.travelplanner.security.jwt.JwtUtils;
import com.travelplanner.security.services.RefreshTokenService;
import com.travelplanner.security.services.UserDetailsImpl;
import com.travelplanner.service.VerificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder encoder;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private VerificationService verificationService;

    @InjectMocks
    private AuthController authController;

    private User testUser;
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("encodedpassword");

        UserDetailsImpl userDetails = UserDetailsImpl.build(testUser);
        authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

    @Test
    void testSignin_Success() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(jwtUtils.generateJwtToken(any(Authentication.class))).thenReturn("jwt-token");

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken("refresh-token");
        when(refreshTokenService.createRefreshToken(1L)).thenReturn(refreshToken);

        ResponseEntity<?> response = authController.authenticateUser(loginRequest);

        assertEquals(200, response.getStatusCodeValue());
        JwtResponse jwtResponse = (JwtResponse) response.getBody();
        assertNotNull(jwtResponse);
        assertEquals("jwt-token", jwtResponse.getToken());
        assertEquals("refresh-token", jwtResponse.getRefreshToken());
    }

    @Test
    void testSignin_BadCredentials() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("wrongpassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        ResponseEntity<?> response = authController.authenticateUser(loginRequest);

        assertEquals(401, response.getStatusCodeValue());
        MessageResponse messageResponse = (MessageResponse) response.getBody();
        assertNotNull(messageResponse);
        assertEquals("Invalid username or password", messageResponse.getMessage());
    }

    @Test
    void testSignup_Success() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("newuser");
        signupRequest.setEmail("new@example.com");
        signupRequest.setPassword("password");

        when(userRepository.existsByUsernameAndDeletedFalse("newuser")).thenReturn(false);
        when(userRepository.existsByEmailAndDeletedFalse("new@example.com")).thenReturn(false);
        when(encoder.encode("password")).thenReturn("encodedpassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        ResponseEntity<?> response = authController.registerUser(signupRequest);

        assertEquals(200, response.getStatusCodeValue());
        MessageResponse messageResponse = (MessageResponse) response.getBody();
        assertNotNull(messageResponse);
        assertEquals("User registered successfully!", messageResponse.getMessage());
    }

    @Test
    void testSignup_UsernameTaken() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("existinguser");
        signupRequest.setEmail("new@example.com");
        signupRequest.setPassword("password");

        when(userRepository.existsByUsernameAndDeletedFalse("existinguser")).thenReturn(true);

        ResponseEntity<?> response = authController.registerUser(signupRequest);

        assertEquals(400, response.getStatusCodeValue());
        MessageResponse messageResponse = (MessageResponse) response.getBody();
        assertEquals("Error: Username is already taken!", messageResponse.getMessage());
    }

    @Test
    void testSignup_EmailTaken() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("newuser");
        signupRequest.setEmail("existing@example.com");
        signupRequest.setPassword("password");

        when(userRepository.existsByUsernameAndDeletedFalse("newuser")).thenReturn(false);
        when(userRepository.existsByEmailAndDeletedFalse("existing@example.com")).thenReturn(true);

        ResponseEntity<?> response = authController.registerUser(signupRequest);

        assertEquals(400, response.getStatusCodeValue());
        MessageResponse messageResponse = (MessageResponse) response.getBody();
        assertEquals("Error: Email is already in use!", messageResponse.getMessage());
    }
}
