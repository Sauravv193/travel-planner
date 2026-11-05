package com.travelplanner.security.oauth2;

import com.travelplanner.model.User;
import com.travelplanner.repository.UserRepository;
import com.travelplanner.security.services.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
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

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        try {
            return processOAuth2User(oauth2User);
        } catch (OAuth2AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            logger.error("Error processing OAuth2 user: {}", ex.getClass().getSimpleName());
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("oauth2_error", "Error processing OAuth2 user", null), ex);
        }
    }

    private OAuth2User processOAuth2User(OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        if (email == null || email.isBlank()) {
            throw oauthError("Google account did not provide an email address");
        }

        // Google must assert that the email belongs to this account.
        if (!Boolean.TRUE.equals(oauth2User.getAttribute("email_verified"))) {
            throw oauthError("Google did not verify the email address");
        }

        logger.info("Processing OAuth2 user");

        // Include soft-deleted rows: the DB unique constraint applies to them too.
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) {
            User user = existing.get();
            if (user.isDeleted()) {
                throw oauthError("This account was deleted. Contact support to restore access.");
            }
            logger.info("Existing OAuth2 user found");
            return UserDetailsImpl.build(user, oauth2User.getAttributes());
        }

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setUsername(generateUniqueUsername(email));
        String unusableRandomPassword = UUID.randomUUID() + UUID.randomUUID().toString();
        newUser.setPassword(new BCryptPasswordEncoder().encode(unusableRandomPassword));
        newUser.setVerified(true);
        newUser.setCreatedBy("oauth2");

        try {
            // Flush here so a unique-key race is caught before returning from this method.
            User saved = userRepository.saveAndFlush(newUser);
            logger.info("New user created through Google OAuth");
            return UserDetailsImpl.build(saved, oauth2User.getAttributes());
        } catch (DataIntegrityViolationException ex) {
            // A parallel callback may have inserted this email after our initial lookup.
            Optional<User> concurrentUser = userRepository.findByEmail(email);
            if (concurrentUser.isPresent() && !concurrentUser.get().isDeleted()) {
                logger.info("Reused account created by a concurrent OAuth callback");
                return UserDetailsImpl.build(concurrentUser.get(), oauth2User.getAttributes());
            }
            if (concurrentUser.isPresent()) {
                throw oauthError("This account was deleted. Contact support to restore access.");
            }
            // Do not hide unrelated constraints (for example, a username collision).
            throw ex;
        }
    }

    private OAuth2AuthenticationException oauthError(String description) {
        return new OAuth2AuthenticationException(new OAuth2Error("oauth2_error", description, null));
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
