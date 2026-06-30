package com.travelplanner.filter;

import com.travelplanner.config.RateLimitConfig;
import com.travelplanner.exception.BadRequestException;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(1)
public class RateLimitFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(RateLimitFilter.class);
    
    @Autowired
    private RateLimitConfig rateLimitConfig;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
            FilterChain filterChain) throws ServletException, IOException {
        
        // Skip rate limiting for health checks, Swagger, and static resources
        String requestURI = request.getRequestURI();
        if (requestURI.contains("/health") || 
            requestURI.contains("/actuator") || 
            requestURI.contains("/swagger") || 
            requestURI.contains("/api-docs") ||
            requestURI.contains("/webjars") ||
            requestURI.equals("/")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // Get client IP address
        String ipAddress = getClientIP(request);
        
        // Get API key from header if present (for authenticated requests)
        String apiKey = request.getHeader("X-API-Key");
        String identifier = (apiKey != null && !apiKey.isEmpty()) ? apiKey : ipAddress;
        
        // For expensive AI operations, use strict rate limiting
        boolean isExpensiveOperation = requestURI.contains("/itinerary/generate") ||
                                       requestURI.contains("/conversations");
        
        io.github.bucket4j.Bucket bucket = isExpensiveOperation ? 
                rateLimitConfig.resolveStrictBucket(identifier) : 
                rateLimitConfig.resolveBucket(identifier);
        
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        
        if (probe.isConsumed()) {
            // Add rate limit headers
            response.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            filterChain.doFilter(request, response);
        } else {
            // Rate limit exceeded
            logger.warn("Rate limit exceeded for IP: {} on URI: {}", ipAddress, requestURI);
            
            long waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000;
            response.addHeader("X-Rate-Limit-Retry-After-Seconds", String.valueOf(waitForRefill));
            response.sendError(429, "Too many requests. Please try again later.");
        }
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty() || !xfHeader.contains(request.getRemoteAddr())) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
