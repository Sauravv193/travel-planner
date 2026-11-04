package com.travelplanner.controller.v1;

import com.travelplanner.dto.response.JobResponse;
import com.travelplanner.exception.UnauthorizedException;
import com.travelplanner.model.Job;
import com.travelplanner.repository.JobRepository;
import com.travelplanner.repository.TripRepository;
import com.travelplanner.security.services.UserDetailsImpl;
import com.travelplanner.service.AsyncItineraryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/jobs")
public class JobController {

    private final JobRepository jobRepository;
    private final TripRepository tripRepository;
    private final AsyncItineraryService asyncItineraryService;

    public JobController(JobRepository jobRepository,
                         TripRepository tripRepository,
                         AsyncItineraryService asyncItineraryService) {
        this.jobRepository = jobRepository;
        this.tripRepository = tripRepository;
        this.asyncItineraryService = asyncItineraryService;
    }

    @PostMapping("/itinerary/generate")
    public ResponseEntity<Map<String, Object>> createItineraryGenerationJob(
            @RequestBody Map<String, Long> request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Long tripId = request.get("tripId");
        Long userId = userDetails.getId();
        verifyTripOwnership(tripId, userId);

        String jobId = UUID.randomUUID().toString();
        Job job = jobRepository.save(new Job(jobId, "ITINERARY_GENERATION", tripId, userId));

        // Invoke the separate Spring bean so @Async is applied through its proxy.
        asyncItineraryService.generateItineraryAsync(jobId, tripId, userId);
        return ResponseEntity.accepted().body(jobResponse(job));
    }

    @PostMapping("/itinerary/adapt")
    public ResponseEntity<Map<String, Object>> createItineraryAdaptationJob(
            @RequestBody Map<String, Object> request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Object rawTripId = request.get("tripId");
        Object rawContext = request.get("context");
        if (!(rawTripId instanceof Number) || !(rawContext instanceof String)
                || ((String) rawContext).isBlank()) {
            throw new IllegalArgumentException("A valid tripId and non-empty context are required");
        }

        Long tripId = ((Number) rawTripId).longValue();
        String context = ((String) rawContext).trim();
        Long userId = userDetails.getId();
        verifyTripOwnership(tripId, userId);

        String jobId = UUID.randomUUID().toString();
        Job job = jobRepository.save(new Job(jobId, "ITINERARY_ADAPTATION", tripId, userId));
        asyncItineraryService.adaptItineraryAsync(jobId, tripId, userId, context);
        return ResponseEntity.accepted().body(jobResponse(job));
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<JobResponse> getJobStatus(
            @PathVariable String jobId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Job job = jobRepository.findByJobIdAndUserId(jobId, userDetails.getId())
                .orElse(null);
        if (job == null) {
            return ResponseEntity.notFound().build();
        }

        JobResponse response = new JobResponse(
                job.getJobId(), job.getStatus().toString(), job.getResult(),
                job.getErrorMessage(), job.getCreatedAt(), job.getStartedAt(),
                job.getCompletedAt());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> deleteJob(
            @PathVariable String jobId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Job job = jobRepository.findByJobIdAndUserId(jobId, userDetails.getId())
                .orElse(null);
        if (job == null) {
            return ResponseEntity.notFound().build();
        }
        jobRepository.delete(job);
        return ResponseEntity.noContent().build();
    }

    private void verifyTripOwnership(Long tripId, Long userId) {
        if (tripId == null || tripRepository.findByIdWithItinerary(tripId)
                .filter(trip -> trip.getUser().getId().equals(userId))
                .isEmpty()) {
            throw new UnauthorizedException("Trip not found or access denied");
        }
    }

    private Map<String, Object> jobResponse(Job job) {
        Map<String, Object> response = new HashMap<>();
        response.put("jobId", job.getJobId());
        response.put("status", job.getStatus().toString());
        response.put("message", "Job accepted. Poll the jobId for its status.");
        return response;
    }
}
