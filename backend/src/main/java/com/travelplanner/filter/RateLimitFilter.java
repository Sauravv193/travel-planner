package com.travelplanner.filter;

import com.travelplanner.config.RateLimitConfig;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
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
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String requestUri = request.getRequestURI();
        if (isExemptPath(requestUri)) {
            filterChain.doFilter(request, response);
            return;
        }

        /*
         * Use the servlet remote address. application.properties enables
         * Spring's forwarded-header strategy so requests behind the configured
         * Render proxy receive the forwarded client address. Never trust a
         * caller-controlled X-API-Key as a rate-limit identity: clients could
         * rotate arbitrary values to obtain fresh buckets.
         */
        String identifier = request.getRemoteAddr();

        /*
         * Match the actual controller base paths. The itinerary controller is
         * mapped to /api/v1/itineraries (plural), so the former singular
         * /itinerary/generate check never matched itinerary generation.
         */
        boolean expensiveOperation = requestUri.startsWith("/api/v1/itineraries/")
                || requestUri.startsWith("/api/v1/conversations");

        Bucket bucket = expensiveOperation
                ? rateLimitConfig.resolveStrictBucket(identifier)
                : rateLimitConfig.resolveBucket(identifier);

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (probe.isConsumed()) {
            response.addHeader("X-Rate-Limit-Remaining",
                    String.valueOf(probe.getRemainingTokens()));
            filterChain.doFilter(request, response);
            return;
        }

        logger.warn("Rate limit exceeded: method={}, client={}",
                request.getMethod(), identifier);
        long retryAfterSeconds = Math.max(1,
                (probe.getNanosToWaitForRefill() + 999_999_999L) / 1_000_000_000L);
        response.addHeader("X-Rate-Limit-Retry-After-Seconds",
                String.valueOf(retryAfterSeconds));
        response.sendError(HttpStatus.TOO_MANY_REQUESTS.value(),
                "Too many requests. Please try again later.");
    }

    private boolean isExemptPath(String path) {
        return path.equals("/")
                || path.startsWith("/health")
                || path.startsWith("/actuator")
                || path.startsWith("/swagger")
                || path.startsWith("/api-docs")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/webjars");
    }
}
