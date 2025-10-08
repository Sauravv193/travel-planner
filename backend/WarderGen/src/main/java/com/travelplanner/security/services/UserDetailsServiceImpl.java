package com.travelplanner.security.services;

import com.travelplanner.model.User;
import com.travelplanner.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        logger.info("Attempting to load user with identifier: {}", identifier);
        
        User user = null;
        
        // First try to find by username
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

        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        logger.info("UserDetails built successfully for user: {}", user.getUsername());
        
        return userDetails;
    }
}