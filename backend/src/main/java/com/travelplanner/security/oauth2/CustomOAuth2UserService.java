package com.travelplanner.security.oauth2;

import com.travelplanner.model.User;
import com.travelplanner.repository.UserRepository;
import com.travelplanner.security.services.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private static final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        try {
            return processOAuth2User(userRequest, oauth2User);
        } catch (Exception ex) {
            logger.error("Error processing OAuth2 user: {}", ex.getMessage(), ex);
            throw new OAuth2AuthenticationException(
                    new org.springframework.security.oauth2.core.OAuth2Error(
                            "oauth2_error", 
                            "Error processing OAuth2 user", 
                            null), 
                    ex);
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        
        logger.info("Processing OAuth2 user with email: {}", email);

        Optional<User> userOptional = userRepository.findByEmailAndDeletedFalse(email);
        
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            logger.info("Existing user found: {}", user.getUsername());
        } else {
            // Create new user
            user = new User();
            user.setEmail(email);
            user.setUsername(email.split("@")[0]); // Use email prefix as username
            user.setPassword(""); // OAuth2 users don't have passwords
            user.setVerified(true); // OAuth2 users are pre-verified
            user.setCreatedBy("oauth2");
            
            user = userRepository.save(user);
            logger.info("New user created via OAuth2: {}", user.getUsername());
        }

        return UserDetailsImpl.build(user, oauth2User.getAttributes());
    }
}
