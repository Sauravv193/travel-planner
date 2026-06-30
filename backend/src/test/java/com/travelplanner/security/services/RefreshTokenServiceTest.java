package com.travelplanner.security.services;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.travelplanner.exception.BadRequestException;
import com.travelplanner.exception.TokenRefreshException;
import com.travelplanner.model.RefreshToken;
import com.travelplanner.model.User;
import com.travelplanner.repository.RefreshTokenRepository;
import com.travelplanner.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RefreshTokenService refreshTokenService;

    private User testUser;
    private RefreshToken testRefreshToken;

    @BeforeEach
    void setUp() {
        // Inject @Value field that would normally be provided by Spring
        ReflectionTestUtils.setField(refreshTokenService, "jwtRefreshExpirationMs", 604800000L);
        
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");

        testRefreshToken = new RefreshToken();
        testRefreshToken.setId(1L);
        testRefreshToken.setToken("test-token");
        testRefreshToken.setUser(testUser);
        testRefreshToken.setExpiryDate(Instant.now().plusMillis(604800000L)); // 7 days
        testRefreshToken.setRevoked(false);
    }

    @Test
    void testCreateRefreshToken_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(refreshTokenRepository.findByUserAndRevokedFalse(testUser)).thenReturn(Optional.empty());
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(testRefreshToken);

        RefreshToken result = refreshTokenService.createRefreshToken(1L);

        assertNotNull(result);
        assertEquals(testUser, result.getUser());
        assertFalse(result.isRevoked());
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    @Test
    void testCreateRefreshToken_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> refreshTokenService.createRefreshToken(1L));
        verify(refreshTokenRepository, never()).save(any(RefreshToken.class));
    }

    @Test
    void testCreateRefreshToken_RevokeExistingToken() {
        RefreshToken existingToken = new RefreshToken();
        existingToken.setToken("old-token");
        existingToken.setUser(testUser);
        existingToken.setRevoked(false);

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(refreshTokenRepository.findByUserAndRevokedFalse(testUser)).thenReturn(Optional.of(existingToken));
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(testRefreshToken);

        refreshTokenService.createRefreshToken(1L);

        verify(refreshTokenRepository).save(existingToken);
        assertTrue(existingToken.isRevoked());
    }

    @Test
    void testVerifyExpiration_ValidToken() {
        RefreshToken validToken = new RefreshToken();
        validToken.setExpiryDate(Instant.now().plusMillis(1000));

        RefreshToken result = refreshTokenService.verifyExpiration(validToken);

        assertEquals(validToken, result);
    }

    @Test
    void testVerifyExpiration_ExpiredToken() {
        RefreshToken expiredToken = new RefreshToken();
        expiredToken.setExpiryDate(Instant.now().minusMillis(1000));

        assertThrows(TokenRefreshException.class, () -> refreshTokenService.verifyExpiration(expiredToken));
        verify(refreshTokenRepository).delete(expiredToken);
    }

    @Test
    void testRotateRefreshToken_Success() {
        when(refreshTokenRepository.findByToken("test-token")).thenReturn(Optional.of(testRefreshToken));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(refreshTokenRepository.findByUserAndRevokedFalse(testUser)).thenReturn(Optional.empty());
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(testRefreshToken);

        RefreshToken result = refreshTokenService.rotateRefreshToken("test-token");

        assertNotNull(result);
        assertTrue(testRefreshToken.isRevoked());
        verify(refreshTokenRepository, times(2)).save(any(RefreshToken.class));
    }

    @Test
    void testRotateRefreshToken_TokenNotFound() {
        when(refreshTokenRepository.findByToken("test-token")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> refreshTokenService.rotateRefreshToken("test-token"));
    }

    @Test
    void testRotateRefreshToken_AlreadyRevoked() {
        testRefreshToken.setRevoked(true);
        when(refreshTokenRepository.findByToken("test-token")).thenReturn(Optional.of(testRefreshToken));

        assertThrows(TokenRefreshException.class, () -> refreshTokenService.rotateRefreshToken("test-token"));
        verify(refreshTokenRepository).deleteByUser(testUser);
    }

    @Test
    void testDeleteByUserId_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        doNothing().when(refreshTokenRepository).deleteByUser(testUser);

        refreshTokenService.deleteByUserId(1L);

        verify(refreshTokenRepository).deleteByUser(testUser);
    }

    @Test
    void testDeleteByUserId_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> refreshTokenService.deleteByUserId(1L));
        verify(refreshTokenRepository, never()).deleteByUser(any(User.class));
    }
}
