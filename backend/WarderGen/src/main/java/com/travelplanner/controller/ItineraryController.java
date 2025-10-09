package com.travelplanner.controller;

import com.travelplanner.model.Itinerary;
import com.travelplanner.security.services.UserDetailsImpl;
import com.travelplanner.service.ItineraryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/itineraries")
public class ItineraryController {

    private static final Logger logger = LoggerFactory.getLogger(ItineraryController.class);

    @Autowired
    private ItineraryService itineraryService;
    @PostMapping("/generate/{tripId}")
    public ResponseEntity<?> generateItinerary(@PathVariable Long tripId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            Itinerary itinerary = itineraryService.generateItinerary(tripId, userDetails.getId());
            return ResponseEntity.ok(itinerary);
        } catch (RuntimeException e) {
            logger.error("Error generating itinerary for tripId {}: {}", tripId, e.getMessage());
            if (e.getMessage().contains("user not authorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "An error occurred while generating the itinerary."));
        }
    }

    @PutMapping("/regenerate/{tripId}")
    public ResponseEntity<?> regenerateItinerary(@PathVariable Long tripId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            Itinerary updatedItinerary = itineraryService.generateItinerary(tripId, userDetails.getId());
            return ResponseEntity.ok(updatedItinerary);
        } catch (RuntimeException e) {
            logger.error("Error regenerating itinerary for tripId {}: {}", tripId, e.getMessage());
            if (e.getMessage().contains("user not authorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "An error occurred while regenerating the itinerary."));
        }
    }

    @PostMapping("/adapt/{tripId}")
    public ResponseEntity<?> adaptItinerary(@PathVariable Long tripId, @RequestBody Map<String, String> adaptationRequest, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            String context = adaptationRequest.get("context");
            Itinerary adaptedItinerary = itineraryService.adaptItinerary(tripId, userDetails.getId(), context);
            return ResponseEntity.ok(adaptedItinerary);
        } catch (RuntimeException e) {
            logger.error("Error adapting itinerary for tripId {}: {}", tripId, e.getMessage());
            if (e.getMessage().contains("user not authorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "An error occurred while adapting the itinerary."));
        }
    }
}