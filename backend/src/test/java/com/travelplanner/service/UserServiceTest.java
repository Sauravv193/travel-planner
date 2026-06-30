package com.travelplanner.service;

import com.travelplanner.model.User;
import com.travelplanner.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("encodedPassword123");
    }

    @Test
    void getUserProfile_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        User result = userService.getUserProfile(1L);

        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        assertEquals("test@example.com", result.getEmail());
    }

    @Test
    void getUserProfile_NotFound_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.getUserProfile(1L));
    }

    @Test
    void updateUserProfile_UpdateUsername_Success() {
        User updatedDetails = new User();
        updatedDetails.setUsername("newusername");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByUsernameAndDeletedFalse("newusername")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User result = userService.updateUserProfile(1L, updatedDetails);

        assertNotNull(result);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUserProfile_UpdatePassword_Success() {
        User updatedDetails = new User();
        updatedDetails.setPassword("newPassword123");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.encode("newPassword123")).thenReturn("encodedNewPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User result = userService.updateUserProfile(1L, updatedDetails);

        assertNotNull(result);
        verify(passwordEncoder).encode("newPassword123");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUserProfile_UsernameAlreadyTaken_ThrowsException() {
        User updatedDetails = new User();
        updatedDetails.setUsername("takenusername");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByUsernameAndDeletedFalse("takenusername")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> userService.updateUserProfile(1L, updatedDetails));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updateUserProfile_SameUsername_NoConflict() {
        User updatedDetails = new User();
        updatedDetails.setUsername("testuser"); // Same as current

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User result = userService.updateUserProfile(1L, updatedDetails);

        assertNotNull(result);
        // Should not check for uniqueness since username is same
        verify(userRepository, never()).existsByUsernameAndDeletedFalse(anyString());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUserProfile_EmptyUsername_NoChange() {
        User updatedDetails = new User();
        updatedDetails.setUsername(""); // Empty string

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User result = userService.updateUserProfile(1L, updatedDetails);

        assertNotNull(result);
        verify(userRepository, never()).existsByUsernameAndDeletedFalse(anyString());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUserProfile_UserNotFound_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.updateUserProfile(1L, testUser));
        verify(userRepository, never()).save(any(User.class));
    }
}
