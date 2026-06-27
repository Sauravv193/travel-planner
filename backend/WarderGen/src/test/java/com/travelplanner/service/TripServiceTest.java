package com.travelplanner.service;

import com.travelplanner.exception.ResourceNotFoundException;
import com.travelplanner.exception.UnauthorizedException;
import com.travelplanner.model.Trip;
import com.travelplanner.model.User;
import com.travelplanner.repository.TripRepository;
import com.travelplanner.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TripServiceTest {

    @Mock
    private TripRepository tripRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TripService tripService;

    @Captor
    private ArgumentCaptor<Trip> tripCaptor;

    private User testUser;
    private Trip testTrip;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");

        testTrip = new Trip();
        testTrip.setId(1L);
        testTrip.setDestination("Paris");
        testTrip.setBudget(2000.0);
        testTrip.setInterests("Museums, Food");
        testTrip.setNumberOfTravelers(2);
        testTrip.setTravelStyle("Adventure");
        testTrip.setUser(testUser);
    }

    @Test
    void createTrip_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(tripRepository.save(any(Trip.class))).thenReturn(testTrip);

        Trip result = tripService.createTrip(testTrip, 1L);

        assertNotNull(result);
        assertEquals("Paris", result.getDestination());
        assertEquals(testUser, result.getUser());
        verify(tripRepository).save(tripCaptor.capture());
        assertEquals(testUser, tripCaptor.getValue().getUser());
    }

    @Test
    void createTrip_UserNotFound_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> tripService.createTrip(testTrip, 1L));
        verify(tripRepository, never()).save(any(Trip.class));
    }

    @Test
    void getTripsForUser_ReturnsList() {
        when(tripRepository.findByUserId(1L)).thenReturn(List.of(testTrip));

        List<Trip> trips = tripService.getTripsForUser(1L);

        assertEquals(1, trips.size());
        assertEquals("Paris", trips.get(0).getDestination());
    }

    @Test
    void getTripsForUser_NoTrips_ReturnsEmptyList() {
        when(tripRepository.findByUserId(1L)).thenReturn(List.of());

        List<Trip> trips = tripService.getTripsForUser(1L);

        assertTrue(trips.isEmpty());
    }

    @Test
    void getTripsForUserPaginated_ReturnsPage() {
        Page<Trip> page = new PageImpl<>(List.of(testTrip));
        when(tripRepository.findByUserId(eq(1L), any(Pageable.class))).thenReturn(page);

        Page<Trip> result = tripService.getTripsForUserPaginated(1L, 0, 10, "id", "asc");

        assertEquals(1, result.getContent().size());
        assertEquals("Paris", result.getContent().get(0).getDestination());
    }

    @Test
    void getTripsForUserPaginated_DescSort() {
        Page<Trip> page = new PageImpl<>(List.of(testTrip));
        when(tripRepository.findByUserId(eq(1L), any(Pageable.class))).thenReturn(page);

        Page<Trip> result = tripService.getTripsForUserPaginated(1L, 0, 10, "id", "desc");

        assertEquals(1, result.getContent().size());
    }

    @Test
    void getTripById_FoundAndAuthorized() {
        when(tripRepository.findByIdWithItinerary(1L)).thenReturn(Optional.of(testTrip));

        Optional<Trip> result = tripService.getTripById(1L, 1L);

        assertTrue(result.isPresent());
        assertEquals("Paris", result.get().getDestination());
    }

    @Test
    void getTripById_NotFound() {
        when(tripRepository.findByIdWithItinerary(1L)).thenReturn(Optional.empty());

        Optional<Trip> result = tripService.getTripById(1L, 1L);

        assertFalse(result.isPresent());
    }

    @Test
    void getTripById_NotAuthorized_ReturnsEmpty() {
        when(tripRepository.findByIdWithItinerary(1L)).thenReturn(Optional.of(testTrip));

        Optional<Trip> result = tripService.getTripById(1L, 999L);

        assertFalse(result.isPresent());
    }

    @Test
    void updateTrip_Success() {
        Trip updatedDetails = new Trip();
        updatedDetails.setDestination("London");
        updatedDetails.setBudget(3000.0);
        updatedDetails.setInterests("History, Art");
        updatedDetails.setNumberOfTravelers(3);
        updatedDetails.setAccommodationStyle("Hotel");
        updatedDetails.setBudgetTier("LUXURY");
        updatedDetails.setTravelStyle("Cultural");
        updatedDetails.setDietaryNeeds("Halal");
        updatedDetails.setMustTryFoods("Fish and Chips");

        when(tripRepository.findById(1L)).thenReturn(Optional.of(testTrip));
        when(tripRepository.save(any(Trip.class))).thenReturn(testTrip);

        Trip result = tripService.updateTrip(1L, updatedDetails, 1L);

        assertNotNull(result);
        verify(tripRepository).save(tripCaptor.capture());
        Trip saved = tripCaptor.getValue();
        assertEquals("London", saved.getDestination());
        assertEquals(3000.0, saved.getBudget());
        assertEquals("LUXURY", saved.getBudgetTier());
    }

    @Test
    void updateTrip_NotAuthorized_ThrowsException() {
        when(tripRepository.findById(1L)).thenReturn(Optional.of(testTrip));

        assertThrows(UnauthorizedException.class, () -> tripService.updateTrip(1L, testTrip, 999L));
        verify(tripRepository, never()).save(any(Trip.class));
    }

    @Test
    void updateTrip_NotFound_ThrowsException() {
        when(tripRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class, () -> tripService.updateTrip(1L, testTrip, 1L));
        verify(tripRepository, never()).save(any(Trip.class));
    }

    @Test
    void deleteTrip_SoftDelete_Success() {
        when(tripRepository.findById(1L)).thenReturn(Optional.of(testTrip));
        when(tripRepository.save(any(Trip.class))).thenReturn(testTrip);

        tripService.deleteTrip(1L, 1L);

        verify(tripRepository).save(tripCaptor.capture());
        Trip saved = tripCaptor.getValue();
        assertTrue(saved.getDeleted());
        assertNotNull(saved.getDeletedAt());
    }

    @Test
    void deleteTrip_NotAuthorized_ThrowsException() {
        when(tripRepository.findById(1L)).thenReturn(Optional.of(testTrip));

        assertThrows(UnauthorizedException.class, () -> tripService.deleteTrip(1L, 999L));
        verify(tripRepository, never()).save(any(Trip.class));
    }

    @Test
    void permanentDeleteTrip_Success() {
        when(tripRepository.findById(1L)).thenReturn(Optional.of(testTrip));

        tripService.permanentDeleteTrip(1L, 1L);

        verify(tripRepository).delete(testTrip);
    }

    @Test
    void permanentDeleteTrip_NotFound_ThrowsException() {
        when(tripRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> tripService.permanentDeleteTrip(1L, 1L));
        verify(tripRepository, never()).delete(any(Trip.class));
    }

    @Test
    void restoreTrip_Success() {
        testTrip.setDeleted(true);
        testTrip.setDeletedAt(LocalDateTime.now());

        when(tripRepository.findById(1L)).thenReturn(Optional.of(testTrip));
        when(tripRepository.save(any(Trip.class))).thenReturn(testTrip);

        tripService.restoreTrip(1L, 1L);

        verify(tripRepository).save(tripCaptor.capture());
        Trip saved = tripCaptor.getValue();
        assertFalse(saved.getDeleted());
        assertNull(saved.getDeletedAt());
    }

    @Test
    void restoreTrip_NotAuthorized_ThrowsException() {
        when(tripRepository.findById(1L)).thenReturn(Optional.of(testTrip));

        assertThrows(UnauthorizedException.class, () -> tripService.restoreTrip(1L, 999L));
    }

    @Test
    void searchByDestination_ReturnsMatchingTrips() {
        when(tripRepository.findByDestinationContainingIgnoreCase("paris")).thenReturn(List.of(testTrip));

        List<Trip> results = tripService.searchByDestination("paris");

        assertEquals(1, results.size());
        assertEquals("Paris", results.get(0).getDestination());
    }

    @Test
    void searchByDestination_NoMatches_ReturnsEmptyList() {
        when(tripRepository.findByDestinationContainingIgnoreCase("unknown")).thenReturn(List.of());

        List<Trip> results = tripService.searchByDestination("unknown");

        assertTrue(results.isEmpty());
    }

    @Test
    void getPopularTrips_ReturnsTrips() {
        when(tripRepository.findAllActiveByOrderByCreatedAtDesc()).thenReturn(List.of(testTrip));

        List<Trip> results = tripService.getPopularTrips();

        assertEquals(1, results.size());
    }

    @Test
    void getPopularTrips_NoTrips_ReturnsEmptyList() {
        when(tripRepository.findAllActiveByOrderByCreatedAtDesc()).thenReturn(List.of());

        List<Trip> results = tripService.getPopularTrips();

        assertTrue(results.isEmpty());
    }
}
