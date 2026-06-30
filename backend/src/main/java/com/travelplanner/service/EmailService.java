package com.travelplanner.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${spring.mail.enabled:false}")
    private boolean mailEnabled;

    @Async
    public void sendVerificationEmail(String to, String token) {
        if (!mailEnabled) {
            logger.info("Email sending is disabled. Verification token for {}: {}", to, token);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Verify Your Email");
            message.setText("Please verify your email by clicking the link below:\n\n" +
                    frontendUrl + "/verify-email?token=" + token + "\n\n" +
                    "This link will expire in 24 hours.\n\n" +
                    "If you did not create an account, please ignore this email.");
            
            mailSender.send(message);
            logger.info("Verification email sent to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send verification email to {}: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String to, String token) {
        if (!mailEnabled) {
            logger.info("Email sending is disabled. Password reset token for {}: {}", to, token);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Reset Your Password");
            message.setText("You requested a password reset. Click the link below to reset your password:\n\n" +
                    frontendUrl + "/reset-password?token=" + token + "\n\n" +
                    "This link will expire in 1 hour.\n\n" +
                    "If you did not request a password reset, please ignore this email.");
            
            mailSender.send(message);
            logger.info("Password reset email sent to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send password reset email to {}: {}", to, e.getMessage());
        }
    }
}
