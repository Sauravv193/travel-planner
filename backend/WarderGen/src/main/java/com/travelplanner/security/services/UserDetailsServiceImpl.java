package com.travelplanner.security.services;

import com.travelplanner.model.User;
import com.travelplanner.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);
    
    @Autowired
    UserRepository userRepository;

    @Value("${app.security.email-verification-required:false}")
    private boolean emailVerificationRequired;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        logger.info("Attempting to load user with identifier: {}", identifier);
        
        User user = null;
        
        // First try to find by username (including deleted users for security)
        if (userRepository.findByUsername(identifier).isPresent()) {
            user = userRepository.findByUsername(identifier).get();
            logger.info("User found by username: {} with id: {}", user.getUsername(), user.getId());
        } 
        // If not found by username, try to find by email
        else if (userRepository.findByEmail(identifier).isPresent()) {
            user = userRepository.findByEmail(identifier).get();
            logger.info("User found by email: {} with id: {}", user.getEmail(), user.getId());
        }
        
        // If user not found by either username or email
        if (user == null) {
            logger.error("User not found with identifier: {}", identifier);
            throw new UsernameNotFoundException("User not found with identifier: " + identifier);
        }

        // Check if user is soft deleted
        if (user.isDeleted()) {
            logger.warn("Attempted login for deleted user: {}", identifier);
            throw new UsernameNotFoundException("User account has been deleted");
        }

        // Check if user is verified (optional - can be disabled for development)
        if (emailVerificationRequired && !user.isVerified()) {
            logger.warn("Attempted login for unverified user: {}", identifier);
            throw new UsernameNotFoundException("User account is not verified");
        }

        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        logger.info("UserDetails built successfully for user: {}", user.getUsername());
        
        return userDetails;
    }
}