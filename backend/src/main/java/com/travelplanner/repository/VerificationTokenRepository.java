package com.travelplanner.repository;

import com.travelplanner.model.User;
import com.travelplanner.model.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByToken(String token);
    Optional<VerificationToken> findByUserAndTokenTypeAndUsedFalse(User user, VerificationToken.TokenType tokenType);
    void deleteByUser(User user);
}
