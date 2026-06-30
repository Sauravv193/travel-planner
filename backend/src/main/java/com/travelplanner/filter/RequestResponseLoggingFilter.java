package com.travelplanner.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class RequestResponseLoggingFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(RequestResponseLoggingFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        ContentCachingRequestWrapper requestWrapper = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);

        long startTime = System.currentTimeMillis();
        
        try {
            filterChain.doFilter(requestWrapper, responseWrapper);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            logRequest(requestWrapper, duration);
            logResponse(responseWrapper, duration);
            responseWrapper.copyBodyToResponse();
        }
    }

    private void logRequest(ContentCachingRequestWrapper request, long duration) {
        String requestBody = new String(request.getContentAsByteArray(), StandardCharsets.UTF_8);
        
        logger.info("Incoming Request: method={}, uri={}, query={}, remoteAddr={}, duration={}ms, body={}",
            request.getMethod(),
            request.getRequestURI(),
            request.getQueryString(),
            request.getRemoteAddr(),
            duration,
            requestBody.isEmpty() ? "[empty]" : requestBody
        );
    }

    private void logResponse(ContentCachingResponseWrapper response, long duration) {
        String responseBody = new String(response.getContentAsByteArray(), StandardCharsets.UTF_8);
        
        logger.info("Outgoing Response: status={}, duration={}ms, body={}",
            response.getStatus(),
            duration,
            responseBody.isEmpty() ? "[empty]" : responseBody
        );
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/actuator") || path.startsWith("/swagger") || path.startsWith("/v3/api-docs");
    }
}