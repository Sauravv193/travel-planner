package com.travelplanner.exception;

public class TokenRefreshException extends RuntimeException {
    public TokenRefreshException(String token, String message) {
        super(String.format("%s: '%s'", message, token));
    }
}
