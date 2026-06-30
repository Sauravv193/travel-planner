package com.travelplanner.repository;

import com.travelplanner.model.RefreshToken;
import com.travelplanner.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUserAndRevokedFalse(User user);
    void deleteByUser(User user);
}
