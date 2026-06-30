package com.travelplanner.security.oauth2;

import com.travelplanner.security.jwt.JwtUtils;
import com.travelplanner.security.services.RefreshTokenService;
import com.travelplanner.security.services.UserDetailsImpl;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private static final Logger logger = LoggerFactory.getLogger(OAuth2AuthenticationSuccessHandler.class);

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, 
            Authentication authentication) throws IOException, ServletException {
        
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        UserDetailsImpl userDetails = (UserDetailsImpl) oauth2User;
        
        String token = jwtUtils.generateJwtToken(authentication);
        
        // Create a refresh token for the OAuth user as well
        String refreshToken = "";
        try {
            refreshToken = refreshTokenService.createRefreshToken(userDetails.getId()).getToken();
        } catch (Exception e) {
            logger.warn("Could not create refresh token for OAuth user: {}", e.getMessage());
        }
        
        logger.info("OAuth2 authentication successful for user: {}", userDetails.getUsername());
        
        // Redirect to frontend with JWT token and refresh token (if available)
        String redirectUrl;
        if (!refreshToken.isEmpty()) {
            redirectUrl = String.format("%s/oauth2/callback?token=%s&refreshToken=%s", 
                    frontendUrl, token, refreshToken);
        } else {
            redirectUrl = String.format("%s/oauth2/callback?token=%s", frontendUrl, token);
        }
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
