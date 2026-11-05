package com.travelplanner.repository;

import com.travelplanner.model.User;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsernameAndDeletedFalse(String username);
    Optional<User> findByEmailAndDeletedFalse(String email);
    Boolean existsByUsernameAndDeletedFalse(String username);
    Boolean existsByEmailAndDeletedFalse(String email);

    // Include deleted users for account recovery and duplicate detection.
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    // Serializes refresh-token creation/rotation for a given user across app instances.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select u from User u where u.id = :id")
    Optional<User> findByIdForUpdate(@Param("id") Long id);
}
