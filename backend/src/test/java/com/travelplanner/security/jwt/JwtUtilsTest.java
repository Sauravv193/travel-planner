package com.travelplanner.security.jwt;

import com.travelplanner.security.services.UserDetailsImpl;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.security.Key;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JwtUtilsTest {

    @InjectMocks
    private JwtUtils jwtUtils;

    private static final String SECRET = "testSecretKeyForJWTTokenGenerationThatIsLongEnoughForHS256Algorithm";

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", Base64.getEncoder().encodeToString(SECRET.getBytes()));
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 900000); // 15 minutes
    }

    @Test
    void testGenerateJwtToken_Success() {
        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "testuser", "test@example.com", "password");
        org.springframework.security.core.Authentication authentication = 
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

        String token = jwtUtils.generateJwtToken(authentication);

        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void testGetUserNameFromJwtToken_Success() {
        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "testuser", "test@example.com", "password");
        org.springframework.security.core.Authentication authentication = 
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

        String token = jwtUtils.generateJwtToken(authentication);
        String username = jwtUtils.getUserNameFromJwtToken(token);

        assertEquals("testuser", username);
    }

    @Test
    void testValidateJwtToken_ValidToken() {
        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "testuser", "test@example.com", "password");
        org.springframework.security.core.Authentication authentication = 
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

        String token = jwtUtils.generateJwtToken(authentication);
        boolean isValid = jwtUtils.validateJwtToken(token);

        assertTrue(isValid);
    }

    @Test
    void testValidateJwtToken_InvalidToken() {
        boolean isValid = jwtUtils.validateJwtToken("invalid.token.here");

        assertFalse(isValid);
    }

    @Test
    void testValidateJwtToken_ExpiredToken() {
        // Create an expired token
        Key key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(
                Base64.getEncoder().encodeToString(SECRET.getBytes())));
        String expiredToken = Jwts.builder()
                .setSubject("testuser")
                .setIssuedAt(new java.util.Date(System.currentTimeMillis() - 3600000))
                .setExpiration(new java.util.Date(System.currentTimeMillis() - 1800000))
                .signWith(key)
                .compact();

        boolean isValid = jwtUtils.validateJwtToken(expiredToken);

        assertFalse(isValid);
    }
}
