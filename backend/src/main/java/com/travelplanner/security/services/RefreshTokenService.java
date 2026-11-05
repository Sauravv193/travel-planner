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
import java.util.List;
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

    @Transactional(readOnly = true)
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Transactional
    public RefreshToken createRefreshToken(Long userId) {
        User user = userRepository.findByIdForUpdate(userId)
                .orElseThrow(() -> new BadRequestException("User not found"));
        return createRefreshTokenForLockedUser(user);
    }

    private RefreshToken createRefreshTokenForLockedUser(User user) {
        // Revoke every active token, including duplicates left by previous concurrent requests.
        List<RefreshToken> activeTokens = refreshTokenRepository.findAllByUserAndRevokedFalse(user);
        for (RefreshToken activeToken : activeTokens) {
            activeToken.setRevoked(true);
        }
        if (!activeTokens.isEmpty()) {
            refreshTokenRepository.saveAll(activeTokens);
            logger.info("Revoked {} previous refresh token(s) for user: {}",
                    activeTokens.size(), user.getId());
        }

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(Instant.now().plusMillis(jwtRefreshExpirationMs));
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setRevoked(false);

        RefreshToken savedToken = refreshTokenRepository.save(refreshToken);
        logger.info("Created new refresh token for user: {}", user.getId());
        return savedToken;
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
        // Resolve the owner first, then lock in a consistent order (user -> token).
        Long userId = refreshTokenRepository.findUserIdByToken(refreshTokenValue)
                .orElseThrow(() -> new TokenRefreshException(refreshTokenValue,
                        "Refresh token not found"));

        User lockedUser = userRepository.findByIdForUpdate(userId)
                .orElseThrow(() -> new BadRequestException("User not found"));

        // Re-read under lock: another request may have rotated/revoked this token while waiting.
        RefreshToken oldRefreshToken = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> new TokenRefreshException(refreshTokenValue,
                        "Refresh token not found"));

        verifyExpiration(oldRefreshToken);

        if (oldRefreshToken.isRevoked()) {
            logger.warn("Detected refresh-token reuse for user: {}", lockedUser.getId());
            refreshTokenRepository.deleteByUser(lockedUser);
            throw new TokenRefreshException(refreshTokenValue,
                    "Refresh token has been revoked due to suspicious activity");
        }

        // createRefreshTokenForLockedUser revokes the old token and any legacy duplicates.
        RefreshToken newRefreshToken = createRefreshTokenForLockedUser(lockedUser);
        oldRefreshToken.setReplacedByToken(newRefreshToken.getToken());
        refreshTokenRepository.save(oldRefreshToken);

        logger.info("Rotated refresh token for user: {}", lockedUser.getId());
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
