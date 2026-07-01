package com.travelplanner.security;

import com.travelplanner.security.jwt.AuthEntryPointJwt;
import com.travelplanner.security.jwt.AuthTokenFilter;
import com.travelplanner.security.oauth2.CustomOAuth2UserService;
import com.travelplanner.security.oauth2.OAuth2AuthenticationSuccessHandler;
import com.travelplanner.security.services.UserDetailsServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableMethodSecurity
public class WebSecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(WebSecurityConfig.class);

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Autowired
    private AuthTokenFilter authTokenFilter;

    @Autowired(required = false)
    private CustomOAuth2UserService customOAuth2UserService;

    @Autowired(required = false)
    private OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    @Value("${CORS_ORIGINS:http://localhost:5173,https://travel-planner-akyd.vercel.app}")
    private String allowedOrigins;

    @Value("${GOOGLE_CLIENT_ID:}")
    private String googleClientId;

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        configuration.setAllowedOriginPatterns(Arrays.asList(allowedOrigins.split(",")));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        boolean oauth2Enabled = googleClientId != null && !googleClientId.isEmpty()
            && customOAuth2UserService != null && oAuth2AuthenticationSuccessHandler != null;

        if (oauth2Enabled) {
            logger.info("OAuth2 login is ENABLED (Google client ID configured)");
        } else {
            logger.info("OAuth2 login is DISABLED (set GOOGLE_CLIENT_ID to enable)");
        }

        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // Conditionally apply OAuth2 login — only when client ID is configured
        if (oauth2Enabled) {
            http.oauth2Login(oauth2 -> oauth2
                    .userInfoEndpoint(userInfo -> userInfo
                            .userService(customOAuth2UserService))
                    .successHandler(oAuth2AuthenticationSuccessHandler));
        }

        http.authorizeHttpRequests(auth ->
                        auth
                                // Public endpoints - no authentication required
                                .requestMatchers("/").permitAll()
                                .requestMatchers("/api/health").permitAll()
                                .requestMatchers("/api/status").permitAll()
                                .requestMatchers("/api/test").permitAll()
                                .requestMatchers("/api/test-gemini").permitAll()
                                .requestMatchers("/error").permitAll()
                                .requestMatchers("/api/debug/**").permitAll()
                                .requestMatchers("/api/v1/auth/**").permitAll()
                                .requestMatchers("/api/auth/**").permitAll()
                                .requestMatchers("/oauth2/**").permitAll()
                                .requestMatchers("/login/**").permitAll()
                                .requestMatchers("/swagger-ui/**").permitAll()
                                .requestMatchers("/v3/api-docs/**").permitAll()
                                .requestMatchers("/api-docs/**").permitAll()
                                .requestMatchers("/webjars/**").permitAll()
                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                // Protected endpoints - authentication required
                                .requestMatchers("/api/v1/trips/**").authenticated()
                                .requestMatchers("/api/trips/**").authenticated()
                                .requestMatchers("/api/v1/itineraries/**").authenticated()
                                .requestMatchers("/api/itineraries/**").authenticated()
                                .requestMatchers("/api/v1/journal/**").authenticated()
                                .requestMatchers("/api/journal/**").authenticated()
                                .requestMatchers("/api/v1/photos/**").authenticated()
                                .requestMatchers("/api/photos/**").authenticated()
                                .requestMatchers("/api/v1/user/**").authenticated()
                                .requestMatchers("/api/user/**").authenticated()
                                .requestMatchers("/api/v1/conversations/**").authenticated()
                                .requestMatchers("/api/conversations/**").authenticated()
                                .requestMatchers("/api/v1/jobs/**").authenticated()
                                .requestMatchers("/api/jobs/**").authenticated()
                                .requestMatchers("/api/v1/cache/**").authenticated()
                                .requestMatchers("/api/cache/**").authenticated()
                                .anyRequest().authenticated()
                );

        // Explicitly configure the authentication provider
        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}