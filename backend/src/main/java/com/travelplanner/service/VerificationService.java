package com.travelplanner.service;

import com.travelplanner.exception.BadRequestException;
import com.travelplanner.model.User;
import com.travelplanner.model.VerificationToken;
import com.travelplanner.repository.UserRepository;
import com.travelplanner.repository.VerificationTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class VerificationService {
    private static final Logger logger = LoggerFactory.getLogger(VerificationService.class);

    @Value("${app.verification.email-expiration-hours:24}")
    private int emailExpirationHours;

    @Value("${app.verification.password-expiration-hours:1}")
    private int passwordExpirationHours;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public String createEmailVerificationToken(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User not found"));

        // Delete any existing email verification tokens
        verificationTokenRepository.findByUserAndTokenTypeAndUsedFalse(user, VerificationToken.TokenType.EMAIL_VERIFICATION)
                .ifPresent(token -> verificationTokenRepository.delete(token));

        // Create new token
        String tokenValue = UUID.randomUUID().toString();
        VerificationToken token = new VerificationToken(
                tokenValue,
                user,
                Instant.now().plusSeconds(emailExpirationHours * 3600),
                VerificationToken.TokenType.EMAIL_VERIFICATION
        );

        verificationTokenRepository.save(token);
        emailService.sendVerificationEmail(user.getEmail(), tokenValue);
        
        logger.info("Email verification token created for user: {}", userId);
        return tokenValue;
    }

    @Transactional
    public String createPasswordResetToken(String email) {
        User user = userRepository.findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        // Delete any existing password reset tokens
        verificationTokenRepository.findByUserAndTokenTypeAndUsedFalse(user, VerificationToken.TokenType.PASSWORD_RESET)
                .ifPresent(token -> verificationTokenRepository.delete(token));

        // Create new token
        String tokenValue = UUID.randomUUID().toString();
        VerificationToken token = new VerificationToken(
                tokenValue,
                user,
                Instant.now().plusSeconds(passwordExpirationHours * 3600),
                VerificationToken.TokenType.PASSWORD_RESET
        );

        verificationTokenRepository.save(token);
        emailService.sendPasswordResetEmail(user.getEmail(), tokenValue);
        
        logger.info("Password reset token created for user: {}", user.getId());
        return tokenValue;
    }

    @Transactional
    public boolean verifyEmail(String token) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid token"));

        if (verificationToken.isUsed()) {
            throw new BadRequestException("Token has already been used");
        }

        if (verificationToken.getExpiryDate().isBefore(Instant.now())) {
            verificationTokenRepository.delete(verificationToken);
            throw new BadRequestException("Token has expired");
        }

        if (verificationToken.getTokenType() != VerificationToken.TokenType.EMAIL_VERIFICATION) {
            throw new BadRequestException("Invalid token type");
        }

        // Mark token as used
        verificationToken.setUsed(true);
        verificationTokenRepository.save(verificationToken);

        // Verify user
        User user = verificationToken.getUser();
        user.setVerified(true);
        userRepository.save(user);
        
        logger.info("Email verified for user: {}", user.getId());
        return true;
    }

    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid token"));

        if (verificationToken.isUsed()) {
            throw new BadRequestException("Token has already been used");
        }

        if (verificationToken.getExpiryDate().isBefore(Instant.now())) {
            verificationTokenRepository.delete(verificationToken);
            throw new BadRequestException("Token has expired");
        }

        if (verificationToken.getTokenType() != VerificationToken.TokenType.PASSWORD_RESET) {
            throw new BadRequestException("Invalid token type");
        }

        // Mark token as used
        verificationToken.setUsed(true);
        verificationTokenRepository.save(verificationToken);

        // Update password
        User user = verificationToken.getUser();
        user.setPassword(newPassword); // Should be encoded by the controller
        userRepository.save(user);
        
        logger.info("Password reset for user: {}", user.getId());
        return true;
    }
}
