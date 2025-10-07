package com.travelplanner.service;

import com.travelplanner.model.User;
import com.travelplanner.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Retrieves a user's profile by their ID.
     *
     * @param userId The ID of the user to retrieve.
     * @return The User object.
     * @throws RuntimeException if the user is not found.
     */
    @Transactional(readOnly = true)
    public User getUserProfile(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    /**
     * Updates a user's profile information.
     * It allows changing the username and password, with validation to ensure the username remains unique.
     * The email address cannot be changed.
     *
     * @param userId      The ID of the user to update.
     * @param userDetails A User object containing the new details.
     * @return The updated User object.
     * @throws RuntimeException if the user is not found or if the new username is already taken.
     */
    @Transactional
    public User updateUserProfile(Long userId, User userDetails) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Logic to update USERNAME
        // Check if the new username is different, not null/empty, and not already taken.
        if (StringUtils.hasText(userDetails.getUsername()) && !userDetails.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(userDetails.getUsername())) {
                throw new RuntimeException("Error: Username is already taken!");
            }
            user.setUsername(userDetails.getUsername());
        }

        // Logic to update PASSWORD
        // Check if a new password was provided and encode it securely.
        if (StringUtils.hasText(userDetails.getPassword())) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        // Logic for updating the email has been removed, making it non-editable.

        return userRepository.save(user);
    }
}