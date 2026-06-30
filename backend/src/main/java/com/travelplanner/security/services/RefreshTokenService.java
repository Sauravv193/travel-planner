package com.travelplanner.security.services;

import com.travelplanner.exception.BadRequestException;
import com.travelplanner.exception.TokenRefreshException;
import com.travelplanner.model.RefreshToken;
import com.travelplanner.model.User;
import com.travelplanner.repository.RefreshTokenRepository;
import com.travelplanner.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {
    private static final Logger logger = LoggerFactory.getLogger(RefreshTokenService.class);

    @Value("${travel.app.jwtRefreshExpirationMs:604800000}") // 7 days default
    private Long jwtRefreshExpirationMs;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken createRefreshToken(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User not found"));

        // Revoke all existing refresh tokens for this user (token rotation)
        refreshTokenRepository.findByUserAndRevokedFalse(user).ifPresent(existingToken -> {
            existingToken.setRevoked(true);
            refreshTokenRepository.save(existingToken);
            logger.info("Revoked previous refresh token for user: {}", userId);
        });

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(Instant.now().plusMillis(jwtRefreshExpirationMs));
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setRevoked(false);

        refreshToken = refreshTokenRepository.save(refreshToken);
        logger.info("Created new refresh token for user: {}", userId);
        return refreshToken;
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), 
                    "Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @Transactional
    public RefreshToken rotateRefreshToken(String refreshTokenValue) {
        RefreshToken oldRefreshToken = findByToken(refreshTokenValue)
                .map(this::verifyExpiration)
                .orElseThrow(() -> new TokenRefreshException(refreshTokenValue, 
                        "Refresh token not found"));

        // Check if token is already revoked (potential token reuse attack)
        if (oldRefreshToken.isRevoked()) {
            logger.warn("Detected token reuse attempt for user: {}", 
                    oldRefreshToken.getUser().getId());
            refreshTokenRepository.deleteByUser(oldRefreshToken.getUser());
            throw new TokenRefreshException(refreshTokenValue, 
                    "Refresh token has been revoked due to suspicious activity");
        }

        // Revoke old token and create new one (token rotation)
        oldRefreshToken.setRevoked(true);
        RefreshToken newRefreshToken = createRefreshToken(oldRefreshToken.getUser().getId());
        oldRefreshToken.setReplacedByToken(newRefreshToken.getToken());
        refreshTokenRepository.save(oldRefreshToken);

        logger.info("Rotated refresh token for user: {}", oldRefreshToken.getUser().getId());
        return newRefreshToken;
    }

    @Transactional
    public void deleteByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User not found"));
        refreshTokenRepository.deleteByUser(user);
        logger.info("Deleted all refresh tokens for user: {}", userId);
    }
}
