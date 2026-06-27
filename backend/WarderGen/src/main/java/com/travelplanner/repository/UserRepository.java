package com.travelplanner.repository;

import com.travelplanner.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsernameAndDeletedFalse(String username);
    Optional<User> findByEmailAndDeletedFalse(String email);
    Boolean existsByUsernameAndDeletedFalse(String username);
    Boolean existsByEmailAndDeletedFalse(String email);
    
    // Include deleted users for authentication
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}
