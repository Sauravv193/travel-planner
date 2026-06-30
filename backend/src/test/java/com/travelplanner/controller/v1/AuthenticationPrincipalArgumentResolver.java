package com.travelplanner.controller.v1;

import com.travelplanner.security.services.UserDetailsImpl;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * Custom HandlerMethodArgumentResolver for resolving @AuthenticationPrincipal
 * in standalone MockMvc test setups.
 * 
 * Supports both UserDetailsImpl (concrete type) and UserDetails (interface)
 * parameter types used across different controllers.
 */
public class AuthenticationPrincipalArgumentResolver implements HandlerMethodArgumentResolver {

    private final UserDetailsImpl userDetails;

    public AuthenticationPrincipalArgumentResolver(UserDetailsImpl userDetails) {
        this.userDetails = userDetails;
    }

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(AuthenticationPrincipal.class) 
                && (parameter.getParameterType().equals(UserDetailsImpl.class) 
                    || parameter.getParameterType().equals(UserDetails.class));
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                 NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
        return userDetails;
    }
}
