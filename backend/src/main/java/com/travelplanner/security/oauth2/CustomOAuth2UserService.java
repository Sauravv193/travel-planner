package com.travelplanner.security.oauth2;

import com.travelplanner.model.User;
import com.travelplanner.repository.UserRepository;
import com.travelplanner.security.services.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private static final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        try {
            return processOAuth2User(oauth2User);
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

    private OAuth2User processOAuth2User(OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Google account did not provide an email address");
        }

        logger.info("Processing OAuth2 user");

        Optional<User> userOptional = userRepository.findByEmailAndDeletedFalse(email);

        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            logger.info("Existing OAuth2 user found");
        } else {
            user = new User();
            user.setEmail(email);
            user.setUsername(generateUniqueUsername(email));

            // OAuth-only accounts still need a valid password hash to satisfy User
            // validation. The random value is never exposed or used for authentication.
            String unusableRandomPassword = UUID.randomUUID() + UUID.randomUUID().toString();
            user.setPassword(passwordEncoder.encode(unusableRandomPassword));

            user.setVerified(true);
            user.setCreatedBy("oauth2");

            user = userRepository.save(user);
            logger.info("New user created through Google OAuth");
        }

        return UserDetailsImpl.build(user, oauth2User.getAttributes());
    }

    private String generateUniqueUsername(String email) {
        String localPart = email.substring(0, email.indexOf('@'))
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9_]", "_");

        if (localPart.length() < 3) {
            localPart = "usr" + localPart;
        }

        String base = localPart.substring(0, Math.min(localPart.length(), 14));
        String candidate;
        do {
            String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 5);
            candidate = base + "_" + suffix;
        } while (userRepository.findByUsername(candidate).isPresent());

        return candidate;
    }
}
