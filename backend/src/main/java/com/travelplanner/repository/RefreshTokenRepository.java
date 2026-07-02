package com.travelplanner.repository;

import com.travelplanner.model.RefreshToken;
import com.travelplanner.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    @Query("SELECT r FROM RefreshToken r JOIN FETCH r.user WHERE r.token = :token")
    Optional<RefreshToken> findByToken(@Param("token") String token);
    Optional<RefreshToken> findByUserAndRevokedFalse(User user);
    void deleteByUser(User user);
}
