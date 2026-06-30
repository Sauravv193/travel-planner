package com.travelplanner.controller.v1;

import com.travelplanner.model.Itinerary;
import com.travelplanner.model.Job;
import com.travelplanner.repository.JobRepository;
import com.travelplanner.security.services.UserDetailsImpl;
import com.travelplanner.service.AsyncItineraryService;
import com.travelplanner.service.ItineraryService;
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
    private ItineraryService itineraryService;

    @Autowired
    private AsyncItineraryService asyncItineraryService;

    @Autowired
    private JobRepository jobRepository;

    /**
     * Generate itinerary asynchronously
     * 
     * Returns immediately with a jobId. Client should poll /api/v1/jobs/{jobId}
     * for status and results.
     * 
     * POST /api/v1/itineraries/generate/{tripId}
     * Response: { "jobId": "uuid-123", "status": "PENDING" }
     */
    @PostMapping("/generate/{tripId}")
    public ResponseEntity<?> generateItinerary(@PathVariable Long tripId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            logger.info("Initiating async itinerary generation for tripId: {}, user: {}", tripId, userDetails.getId());

            // Create job record
            String jobId = UUID.randomUUID().toString();
            Job job = new Job(jobId, "ITINERARY_GENERATION", tripId, userDetails.getId());
            jobRepository.save(job);

            // Trigger async processing
            asyncItineraryService.generateItineraryAsync(jobId, tripId, userDetails.getId());

            // Return jobId immediately
            Map<String, Object> response = new HashMap<>();
            response.put("jobId", jobId);
            response.put("status", "PENDING");
            response.put("message", "Itinerary generation started. Poll /api/v1/jobs/" + jobId + " for status.");

            return ResponseEntity.accepted().body(response);

        } catch (RuntimeException e) {
            logger.error("Error initiating itinerary generation for tripId {}: {}", tripId, e.getMessage());
            if (e.getMessage().contains("user not authorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "An error occurred while initiating itinerary generation."));
        }
    }

    /**
     * Regenerate itinerary asynchronously
     * 
     * POST /api/v1/itineraries/regenerate/{tripId}
     * Response: { "jobId": "uuid-456", "status": "PENDING" }
     */
    @PutMapping("/regenerate/{tripId}")
    public ResponseEntity<?> regenerateItinerary(@PathVariable Long tripId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            logger.info("Initiating async itinerary regeneration for tripId: {}, user: {}", tripId, userDetails.getId());

            String jobId = UUID.randomUUID().toString();
            Job job = new Job(jobId, "ITINERARY_REGENERATION", tripId, userDetails.getId());
            jobRepository.save(job);

            asyncItineraryService.generateItineraryAsync(jobId, tripId, userDetails.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("jobId", jobId);
            response.put("status", "PENDING");
            response.put("message", "Itinerary regeneration started. Poll /api/v1/jobs/" + jobId + " for status.");

            return ResponseEntity.accepted().body(response);

        } catch (RuntimeException e) {
            logger.error("Error initiating itinerary regeneration for tripId {}: {}", tripId, e.getMessage());
            if (e.getMessage().contains("user not authorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "An error occurred while initiating itinerary regeneration."));
        }
    }

    /**
     * Adapt itinerary asynchronously
     * 
     * POST /api/v1/itineraries/adapt/{tripId}
     * Body: { "context": "Add more outdoor activities" }
     * Response: { "jobId": "uuid-789", "status": "PENDING" }
     */
    @PostMapping("/adapt/{tripId}")
    public ResponseEntity<?> adaptItinerary(@PathVariable Long tripId, @RequestBody Map<String, String> adaptationRequest, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            String context = adaptationRequest.get("context");
            logger.info("Initiating async itinerary adaptation for tripId: {}, user: {}, context: {}", tripId, userDetails.getId(), context);

            String jobId = UUID.randomUUID().toString();
            Job job = new Job(jobId, "ITINERARY_ADAPTATION", tripId, userDetails.getId());
            jobRepository.save(job);

            asyncItineraryService.adaptItineraryAsync(jobId, tripId, userDetails.getId(), context);

            Map<String, Object> response = new HashMap<>();
            response.put("jobId", jobId);
            response.put("status", "PENDING");
            response.put("message", "Itinerary adaptation started. Poll /api/v1/jobs/" + jobId + " for status.");

            return ResponseEntity.accepted().body(response);

        } catch (RuntimeException e) {
            logger.error("Error initiating itinerary adaptation for tripId {}: {}", tripId, e.getMessage());
            if (e.getMessage().contains("user not authorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "An error occurred while initiating itinerary adaptation."));
        }
    }
}
