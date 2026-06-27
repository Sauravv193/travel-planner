package com.travelplanner.controller.v1;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelplanner.dto.request.TripRequest;
import com.travelplanner.model.Trip;
import com.travelplanner.model.User;
import com.travelplanner.security.services.UserDetailsImpl;
import com.travelplanner.service.TripService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class TripControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TripService tripService;

    @InjectMocks
    private TripController tripController;

    private ObjectMapper objectMapper;
    private UserDetailsImpl userDetails;
    private Trip testTrip;
    private TripRequest testTripRequest;

    @BeforeEach
    void setUp() {
        userDetails = new UserDetailsImpl(1L, "testuser", "test@example.com", "password");
        mockMvc = MockMvcBuilders.standaloneSetup(tripController)
                .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver(userDetails))
                .build();
        objectMapper = new ObjectMapper();

        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        testTrip = new Trip();
        testTrip.setId(1L);
        testTrip.setDestination("Paris");
        testTrip.setBudget(2000.0);
        testTrip.setInterests("Museums, Food");
        testTrip.setNumberOfTravelers(2);
        testTrip.setStartDate(new java.util.Date());
        testTrip.setEndDate(new java.util.Date(System.currentTimeMillis() + 86400000L));
        testTrip.setUser(user);

        testTripRequest = new TripRequest();
        testTripRequest.setDestination("Paris");
        testTripRequest.setBudget(2000.0);
        testTripRequest.setInterests("Museums, Food");
        testTripRequest.setNumberOfTravelers(2);
        testTripRequest.setStartDate(new Date());
        testTripRequest.setEndDate(new Date(System.currentTimeMillis() + 86400000L));
    }

    @Test
    void createTrip_ReturnsCreatedTrip() throws Exception {
        when(tripService.createTrip(any(Trip.class), eq(1L))).thenReturn(testTrip);

        mockMvc.perform(post("/api/v1/trips")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testTripRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.destination").value("Paris"))
                .andExpect(jsonPath("$.budget").value(2000.0));
    }

    @Test
    void getUserTrips_ReturnsList() throws Exception {
        when(tripService.getTripsForUser(1L)).thenReturn(List.of(testTrip));

        mockMvc.perform(get("/api/v1/trips"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].destination").value("Paris"));
    }

    @Test
    void getUserTrips_EmptyList_Returns200() throws Exception {
        when(tripService.getTripsForUser(1L)).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/trips"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void getTripById_Found_ReturnsTrip() throws Exception {
        when(tripService.getTripById(1L, 1L)).thenReturn(Optional.of(testTrip));

        mockMvc.perform(get("/api/v1/trips/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.destination").value("Paris"));
    }

    @Test
    void getTripById_NotFound_Returns404() throws Exception {
        when(tripService.getTripById(1L, 1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/trips/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateTrip_ReturnsUpdatedTrip() throws Exception {
        when(tripService.updateTrip(eq(1L), any(Trip.class), eq(1L))).thenReturn(testTrip);

        mockMvc.perform(put("/api/v1/trips/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testTripRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.destination").value("Paris"));
    }

    @Test
    void deleteTrip_ReturnsNoContent() throws Exception {
        doNothing().when(tripService).deleteTrip(1L, 1L);

        mockMvc.perform(delete("/api/v1/trips/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void getPaginatedTrips_ReturnsPage() throws Exception {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Trip> page = new PageImpl<>(List.of(testTrip), pageable, 1);
        when(tripService.getTripsForUserPaginated(eq(1L), eq(0), eq(10), eq("id"), eq("asc")))
                .thenReturn(page);

        mockMvc.perform(get("/api/v1/trips/paginated")
                .param("page", "0")
                .param("size", "10")
                .param("sort", "id")
                .param("direction", "asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].destination").value("Paris"))
                .andExpect(jsonPath("$.currentPage").value(0))
                .andExpect(jsonPath("$.pageSize").value(10));
    }
}
