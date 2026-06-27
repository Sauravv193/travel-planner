package com.travelplanner.service;

import com.travelplanner.exception.ResourceNotFoundException;
import com.travelplanner.exception.UnauthorizedException;
import com.travelplanner.model.Trip;
import com.travelplanner.model.User;
import com.travelplanner.repository.TripRepository;
import com.travelplanner.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Validated
public class TripService {
    
    private static final Logger logger = LoggerFactory.getLogger(TripService.class);

    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public TripService(TripRepository tripRepository, UserRepository userRepository) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    public Trip createTrip(Trip trip, Long userId) {
        logger.info("Creating trip for user ID: {}", userId);
        logger.info("Trip details - Destination: {}, Start: {}, End: {}, Budget: {}", 
            trip.getDestination(), trip.getStartDate(), trip.getEndDate(), trip.getBudget());
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        logger.info("Found user: {}", user.getUsername());
        
        trip.setUser(user);
        Trip savedTrip = tripRepository.save(trip);
        logger.info("Trip saved with ID: {}", savedTrip.getId());
        return savedTrip;
    }

    public List<Trip> getTripsForUser(Long userId) {
        logger.info("Fetching trips for user ID: {}", userId);
        List<Trip> trips = tripRepository.findByUserId(userId);
        logger.info("Found {} trips for user ID: {}", trips.size(), userId);
        return trips;
    }

    public Page<Trip> getTripsForUserPaginated(Long userId, int page, int size, String sort, String direction) {
        logger.info("Fetching paginated trips for user ID: {}, page: {}, size: {}", userId, page, size);
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        
        Page<Trip> trips = tripRepository.findByUserId(userId, pageable);
        logger.info("Found {} trips for user ID: {} (page {} of {})", 
            trips.getContent().size(), userId, page, trips.getTotalPages());
        
        return trips;
    }

    @Cacheable(value = "trips", key = "#tripId", unless = "#result.isEmpty()")
    public Optional<Trip> getTripById(Long tripId, Long userId) {
        logger.info("Fetching trip with ID: {} for user ID: {}", tripId, userId);
        Optional<Trip> tripOpt = tripRepository.findByIdWithItinerary(tripId)
                .filter(trip -> trip.getUser().getId().equals(userId));
        
        if (tripOpt.isPresent()) {
            Trip trip = tripOpt.get();
            logger.info("Trip found: {}, Itinerary present: {}", trip.getDestination(), trip.getItinerary() != null);
            if (trip.getItinerary() != null) {
                logger.info("Itinerary content length: {}", 
                    trip.getItinerary().getContent() != null ? trip.getItinerary().getContent().length() : 0);
            }
        } else {
            logger.warn("Trip not found or user not authorized for trip ID: {}, user ID: {}", tripId, userId);
        }
        
        return tripOpt;
    }

    @Caching(evict = {
        @CacheEvict(value = "trips", key = "#tripId"),
        @CacheEvict(value = "itineraries", key = "#tripId"),
        @CacheEvict(value = "popular", allEntries = true)
    })
    public Trip updateTrip(Long tripId, Trip tripDetails, Long userId) {
        Trip trip = tripRepository.findById(tripId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new UnauthorizedException("You don't have permission to modify this trip"));

        trip.setDestination(tripDetails.getDestination());
        trip.setStartDate(tripDetails.getStartDate());
        trip.setEndDate(tripDetails.getEndDate());
        trip.setBudget(tripDetails.getBudget());
        trip.setInterests(tripDetails.getInterests());
        trip.setNumberOfTravelers(tripDetails.getNumberOfTravelers());
        trip.setAccommodationStyle(tripDetails.getAccommodationStyle());
        trip.setBudgetTier(tripDetails.getBudgetTier());
        trip.setTravelStyle(tripDetails.getTravelStyle());
        trip.setDietaryNeeds(tripDetails.getDietaryNeeds());
        trip.setMustTryFoods(tripDetails.getMustTryFoods());

        return tripRepository.save(trip);
    }

    @Caching(evict = {
        @CacheEvict(value = "trips", key = "#tripId"),
        @CacheEvict(value = "itineraries", key = "#tripId"),
        @CacheEvict(value = "popular", allEntries = true)
    })
    public void deleteTrip(Long tripId, Long userId) {
        Trip trip = tripRepository.findById(tripId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new UnauthorizedException("You don't have permission to delete this trip"));

        // Soft delete
        trip.setDeleted(true);
        trip.setDeletedAt(LocalDateTime.now());
        tripRepository.save(trip);
        
        logger.info("Soft deleted trip {} for user {}", tripId, userId);
    }

    /**
     * Permanently delete a trip (admin only)
     */
    public void permanentDeleteTrip(Long tripId, Long userId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        tripRepository.delete(trip);
        logger.info("Permanently deleted trip {} by user {}", tripId, userId);
    }

    /**
     * Restore a soft-deleted trip
     */
    public void restoreTrip(Long tripId, Long userId) {
        Trip trip = tripRepository.findById(tripId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new UnauthorizedException("You don't have permission to restore this trip"));

        trip.setDeleted(false);
        trip.setDeletedAt(null);
        tripRepository.save(trip);
        
        logger.info("Restored trip {} for user {}", tripId, userId);
    }

    @Cacheable(value = "destinations", key = "#destination.toLowerCase()")
    public List<Trip> searchByDestination(String destination) {
        logger.info("Searching trips by destination: {}", destination);
        return tripRepository.findByDestinationContainingIgnoreCase(destination);
    }

    @Cacheable(value = "popular", key = "'all'")
    public List<Trip> getPopularTrips() {
        logger.info("Fetching popular trips");
        // This would typically use a more sophisticated query
        // For now, we'll return trips sorted by creation date
        return tripRepository.findAllActiveByOrderByCreatedAtDesc();
    }
}