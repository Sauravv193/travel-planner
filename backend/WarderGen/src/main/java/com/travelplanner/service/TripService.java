package com.travelplanner.service;

import com.travelplanner.model.Trip;
import com.travelplanner.model.User;
import com.travelplanner.repository.TripRepository;
import com.travelplanner.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class TripService {
    
    private static final Logger logger = LoggerFactory.getLogger(TripService.class);

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private UserRepository userRepository;

    public Trip createTrip(Trip trip, Long userId) {
        logger.info("Creating trip for user ID: {}", userId);
        logger.info("Trip details - Destination: {}, Start: {}, End: {}, Budget: {}", 
            trip.getDestination(), trip.getStartDate(), trip.getEndDate(), trip.getBudget());
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
        logger.info("Found user: {}", user.getUsername());
        
        trip.setUser(user);
        // The interests field will be automatically set from the request body
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

    public Trip updateTrip(Long tripId, Trip tripDetails, Long userId) {
        Trip trip = tripRepository.findById(tripId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Error: Trip not found or user not authorized."));

        trip.setDestination(tripDetails.getDestination());
        trip.setStartDate(tripDetails.getStartDate());
        trip.setEndDate(tripDetails.getEndDate());
        trip.setBudget(tripDetails.getBudget());
        trip.setInterests(tripDetails.getInterests()); // --- UPDATE INTERESTS ---

        return tripRepository.save(trip);
    }

    public void deleteTrip(Long tripId, Long userId) {
        Trip trip = tripRepository.findById(tripId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Error: Trip not found or user not authorized."));

        tripRepository.delete(trip);
    }
}