package com.travelplanner.security.jwt;

import com.travelplanner.security.services.UserDetailsServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;

class AuthTokenFilterTest {

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void ignoresJwtSuppliedInQueryParameter() throws Exception {
        JwtUtils jwtUtils = mock(JwtUtils.class);
        UserDetailsServiceImpl userDetailsService = mock(UserDetailsServiceImpl.class);
        AuthTokenFilter filter = new AuthTokenFilter();
        ReflectionTestUtils.setField(filter, "jwtUtils", jwtUtils);
        ReflectionTestUtils.setField(filter, "userDetailsService", userDetailsService);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setMethod("GET");
        request.setRequestURI("/api/v1/user/profile");
        request.setParameter("token", "query.jwt.value");

        filter.doFilter(request, new MockHttpServletResponse(), new MockFilterChain());

        verifyNoInteractions(jwtUtils, userDetailsService);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }
}
