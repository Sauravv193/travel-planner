package com.travelplanner.service;

import com.travelplanner.dto.prompt.ItineraryPrompt;
import com.travelplanner.model.Itinerary;
import com.travelplanner.model.Trip;
import com.travelplanner.model.User;
import com.travelplanner.repository.ItineraryRepository;
import com.travelplanner.repository.TripRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ItineraryServiceTest {

    @Mock
    private ItineraryRepository itineraryRepository;

    @Mock
    private TripRepository tripRepository;

    @Mock
    private GeminiService geminiService;

    @Mock
    private PromptBuilderService promptBuilderService;

    @InjectMocks
    private ItineraryService itineraryService;

    private Trip testTrip;
    private Itinerary testItinerary;
    private User testUser;

    @BeforeEach
    void setUp() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");

        testTrip = new Trip();
        testTrip.setId(1L);
        testTrip.setDestination("Paris");
        testTrip.setNumberOfTravelers(2);
        testTrip.setTravelStyle("Adventure");
        testTrip.setInterests("Museums, Food");
        testTrip.setBudgetTier("STANDARD");
        testTrip.setBudget(2000.0);
        testTrip.setAccommodationStyle("Hotel");
        testTrip.setDietaryNeeds("Vegetarian");
        testTrip.setMustTryFoods("Croissants");
        testTrip.setUser(user);
        testTrip.setStartDate(new java.util.Date());
        testTrip.setEndDate(new java.util.Date(System.currentTimeMillis() + 86400000L)); // +1 day

        testItinerary = new Itinerary();
        testItinerary.setId(1L);
        testItinerary.setContent("{\"days\": []}");
    }

    @Test
    void testGenerateItinerary_Success() {
        when(tripRepository.findById(1L)).thenReturn(java.util.Optional.of(testTrip));
        when(promptBuilderService.buildItineraryPrompt(any())).thenReturn("Test prompt");
        when(geminiService.callGemini(any())).thenReturn("{\"days\": []}");
        when(itineraryRepository.save(any(Itinerary.class))).thenReturn(testItinerary);

        Itinerary result = itineraryService.generateItinerary(1L, 1L);

        assertNotNull(result);
        verify(geminiService).callGemini(any());
        verify(itineraryRepository).save(any(Itinerary.class));
    }

    @Test
    void testGenerateItinerary_TripNotFound() {
        when(tripRepository.findById(1L)).thenReturn(java.util.Optional.empty());

        assertThrows(RuntimeException.class, () -> itineraryService.generateItinerary(1L, 1L));
        verify(geminiService, never()).callGemini(any());
    }
}
