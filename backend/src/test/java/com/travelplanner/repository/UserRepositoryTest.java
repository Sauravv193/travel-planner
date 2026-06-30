package com.travelplanner.repository;

import com.travelplanner.model.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserRepositoryTest {

    @Mock
    private UserRepository userRepository;

    @Test
    void testFindByUsername_Success() {
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("password");
        user.setDeleted(false);

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        Optional<User> found = userRepository.findByUsername("testuser");

        assertTrue(found.isPresent());
        assertEquals("testuser", found.get().getUsername());
    }

    @Test
    void testFindByUsername_NotFound() {
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        Optional<User> found = userRepository.findByUsername("nonexistent");

        assertFalse(found.isPresent());
    }

    @Test
    void testExistsByUsername_True() {
        when(userRepository.existsByUsernameAndDeletedFalse("testuser")).thenReturn(true);

        Boolean exists = userRepository.existsByUsernameAndDeletedFalse("testuser");

        assertTrue(exists);
    }

    @Test
    void testExistsByUsername_False() {
        when(userRepository.existsByUsernameAndDeletedFalse("nonexistent")).thenReturn(false);

        Boolean exists = userRepository.existsByUsernameAndDeletedFalse("nonexistent");

        assertFalse(exists);
    }

    @Test
    void testExistsByEmail_True() {
        when(userRepository.existsByEmailAndDeletedFalse("test@example.com")).thenReturn(true);

        Boolean exists = userRepository.existsByEmailAndDeletedFalse("test@example.com");

        assertTrue(exists);
    }

    @Test
    void testFindByUsernameAndDeletedFalse_Success() {
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("password");
        user.setDeleted(false);

        when(userRepository.findByUsernameAndDeletedFalse("testuser")).thenReturn(Optional.of(user));

        Optional<User> found = userRepository.findByUsernameAndDeletedFalse("testuser");

        assertTrue(found.isPresent());
    }

    @Test
    void testFindByUsernameAndDeletedFalse_DeletedUser() {
        when(userRepository.findByUsernameAndDeletedFalse("testuser")).thenReturn(Optional.empty());

        Optional<User> found = userRepository.findByUsernameAndDeletedFalse("testuser");

        assertFalse(found.isPresent());
    }
}
