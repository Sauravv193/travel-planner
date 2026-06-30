package com.travelplanner.service;

import com.travelplanner.exception.BadRequestException;
import com.travelplanner.model.User;
import com.travelplanner.model.VerificationToken;
import com.travelplanner.repository.UserRepository;
import com.travelplanner.repository.VerificationTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VerificationServiceTest {

    @Mock
    private VerificationTokenRepository verificationTokenRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private VerificationService verificationService;

    private User testUser;
    private VerificationToken testToken;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setVerified(false);

        testToken = new VerificationToken();
        testToken.setId(1L);
        testToken.setToken("test-token");
        testToken.setUser(testUser);
        testToken.setExpiryDate(Instant.now().plusMillis(86400000L)); // 24 hours
        testToken.setTokenType(VerificationToken.TokenType.EMAIL_VERIFICATION);
        testToken.setUsed(false);
    }

    @Test
    void testCreateEmailVerificationToken_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(verificationTokenRepository.findByUserAndTokenTypeAndUsedFalse(
                testUser, VerificationToken.TokenType.EMAIL_VERIFICATION)).thenReturn(Optional.empty());
        when(verificationTokenRepository.save(any(VerificationToken.class))).thenReturn(testToken);

        String result = verificationService.createEmailVerificationToken(1L);

        assertNotNull(result);
        verify(emailService).sendVerificationEmail(testUser.getEmail(), result);
        verify(verificationTokenRepository).save(any(VerificationToken.class));
    }

    @Test
    void testCreateEmailVerificationToken_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> verificationService.createEmailVerificationToken(1L));
        verify(emailService, never()).sendVerificationEmail(any(), any());
    }

    @Test
    void testCreateEmailVerificationToken_RevokeExistingToken() {
        VerificationToken existingToken = new VerificationToken();
        existingToken.setToken("old-token");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(verificationTokenRepository.findByUserAndTokenTypeAndUsedFalse(
                testUser, VerificationToken.TokenType.EMAIL_VERIFICATION)).thenReturn(Optional.of(existingToken));
        when(verificationTokenRepository.save(any(VerificationToken.class))).thenReturn(testToken);

        verificationService.createEmailVerificationToken(1L);

        verify(verificationTokenRepository).delete(existingToken);
    }

    @Test
    void testCreatePasswordResetToken_Success() {
        when(userRepository.findByEmailAndDeletedFalse("test@example.com")).thenReturn(Optional.of(testUser));
        when(verificationTokenRepository.findByUserAndTokenTypeAndUsedFalse(
                testUser, VerificationToken.TokenType.PASSWORD_RESET)).thenReturn(Optional.empty());
        when(verificationTokenRepository.save(any(VerificationToken.class))).thenReturn(testToken);

        String result = verificationService.createPasswordResetToken("test@example.com");

        assertNotNull(result);
        verify(emailService).sendPasswordResetEmail(testUser.getEmail(), result);
        verify(verificationTokenRepository).save(any(VerificationToken.class));
    }

    @Test
    void testVerifyEmail_Success() {
        testToken.setTokenType(VerificationToken.TokenType.EMAIL_VERIFICATION);
        when(verificationTokenRepository.findByToken("test-token")).thenReturn(Optional.of(testToken));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        boolean result = verificationService.verifyEmail("test-token");

        assertTrue(result);
        assertTrue(testUser.isVerified());
        assertTrue(testToken.isUsed());
        verify(verificationTokenRepository).save(testToken);
        verify(userRepository).save(testUser);
    }

    @Test
    void testVerifyEmail_TokenNotFound() {
        when(verificationTokenRepository.findByToken("test-token")).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> verificationService.verifyEmail("test-token"));
    }

    @Test
    void testVerifyEmail_TokenAlreadyUsed() {
        testToken.setUsed(true);
        when(verificationTokenRepository.findByToken("test-token")).thenReturn(Optional.of(testToken));

        assertThrows(BadRequestException.class, () -> verificationService.verifyEmail("test-token"));
    }

    @Test
    void testVerifyEmail_TokenExpired() {
        testToken.setExpiryDate(Instant.now().minusMillis(1000));
        when(verificationTokenRepository.findByToken("test-token")).thenReturn(Optional.of(testToken));

        assertThrows(BadRequestException.class, () -> verificationService.verifyEmail("test-token"));
        verify(verificationTokenRepository).delete(testToken);
    }

    @Test
    void testVerifyEmail_WrongTokenType() {
        testToken.setTokenType(VerificationToken.TokenType.PASSWORD_RESET);
        when(verificationTokenRepository.findByToken("test-token")).thenReturn(Optional.of(testToken));

        assertThrows(BadRequestException.class, () -> verificationService.verifyEmail("test-token"));
    }

    @Test
    void testResetPassword_Success() {
        testToken.setTokenType(VerificationToken.TokenType.PASSWORD_RESET);
        when(verificationTokenRepository.findByToken("test-token")).thenReturn(Optional.of(testToken));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        boolean result = verificationService.resetPassword("test-token", "newpassword");

        assertTrue(result);
        assertTrue(testToken.isUsed());
        verify(verificationTokenRepository).save(testToken);
        verify(userRepository).save(testUser);
    }

    @Test
    void testResetPassword_TokenNotFound() {
        when(verificationTokenRepository.findByToken("test-token")).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> verificationService.resetPassword("test-token", "newpassword"));
    }
}
