package com.travelplanner.controller.v1;

import com.travelplanner.exception.UnauthorizedException;
import com.travelplanner.model.Job;
import com.travelplanner.repository.JobRepository;
import com.travelplanner.repository.TripRepository;
import com.travelplanner.security.services.UserDetailsImpl;
import com.travelplanner.service.AsyncItineraryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/itineraries")
public class ItineraryController {

    private static final Logger logger = LoggerFactory.getLogger(ItineraryController.class);

    @Autowired
    private AsyncItineraryService asyncItineraryService;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private TripRepository tripRepository;

    @PostMapping("/generate/{tripId}")
    public ResponseEntity<?> generateItinerary(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return createGenerationJob(tripId, userDetails, "ITINERARY_GENERATION",
                "Itinerary generation started.");
    }

    @PutMapping("/regenerate/{tripId}")
    public ResponseEntity<?> regenerateItinerary(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return createGenerationJob(tripId, userDetails, "ITINERARY_REGENERATION",
                "Itinerary regeneration started.");
    }

    @PostMapping("/adapt/{tripId}")
    public ResponseEntity<?> adaptItinerary(
            @PathVariable Long tripId,
            @RequestBody Map<String, String> adaptationRequest,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String context = adaptationRequest == null ? null : adaptationRequest.get("context");
        if (context == null || context.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "A non-empty context is required."));
        }

        try {
            Long userId = userDetails.getId();
            verifyTripOwnership(tripId, userId);

            String jobId = UUID.randomUUID().toString();
            Job job = new Job(jobId, "ITINERARY_ADAPTATION", tripId, userId);
            jobRepository.save(job);
            asyncItineraryService.adaptItineraryAsync(jobId, tripId, userId, context.trim());

            return ResponseEntity.accepted().body(jobResponse(jobId, "Itinerary adaptation started."));
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Trip not found or access denied."));
        } catch (RuntimeException e) {
            logger.error("Error initiating itinerary adaptation for tripId {}", tripId, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "An error occurred while initiating itinerary adaptation."));
        }
    }

    private ResponseEntity<?> createGenerationJob(
            Long tripId, UserDetailsImpl userDetails, String jobType, String message) {
        try {
            Long userId = userDetails.getId();
            verifyTripOwnership(tripId, userId);

            String jobId = UUID.randomUUID().toString();
            Job job = new Job(jobId, jobType, tripId, userId);
            jobRepository.save(job);
            asyncItineraryService.generateItineraryAsync(jobId, tripId, userId);

            return ResponseEntity.accepted().body(jobResponse(jobId, message));
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Trip not found or access denied."));
        } catch (RuntimeException e) {
            logger.error("Error initiating itinerary job for tripId {}", tripId, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "An error occurred while initiating itinerary generation."));
        }
    }

    private void verifyTripOwnership(Long tripId, Long userId) {
        if (tripId == null || tripRepository.findByIdWithItinerary(tripId)
                .filter(trip -> trip.getUser() != null && trip.getUser().getId().equals(userId))
                .isEmpty()) {
            throw new UnauthorizedException("Trip not found or access denied");
        }
    }

    private Map<String, Object> jobResponse(String jobId, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("jobId", jobId);
        response.put("status", "PENDING");
        response.put("message", message + " Poll /api/v1/jobs/" + jobId + " for status.");
        return response;
    }
}
