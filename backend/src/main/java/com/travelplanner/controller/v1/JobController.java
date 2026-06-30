package com.travelplanner.controller.v1;

import com.travelplanner.dto.response.JobResponse;
import com.travelplanner.model.Job;
import com.travelplanner.repository.JobRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import com.travelplanner.security.services.UserDetailsImpl;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Job Controller
 * 
 * Provides endpoints for:
 * - Creating new async jobs
 * - Polling job status
 * - Getting job results
 * 
 * This enables the frontend to:
 * 1. Submit a job and get a jobId immediately
 * 2. Poll for job status periodically
 * 3. Retrieve results when job completes
 * 
 * Future enhancement: Replace polling with WebSocket for real-time updates.
 */
@RestController
@RequestMapping("/api/v1/jobs")
public class JobController {

    private static final Logger logger = LoggerFactory.getLogger(JobController.class);

    @Autowired
    private JobRepository jobRepository;

    /**
     * Create a new async job for itinerary generation
     * 
     * POST /api/v1/jobs/itinerary/generate
     * Body: { "tripId": 123 }
     * Response: { "jobId": "uuid-123", "status": "PENDING" }
     */
    @PostMapping("/itinerary/generate")
    public ResponseEntity<Map<String, Object>> createItineraryGenerationJob(
            @RequestBody Map<String, Long> request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        Long tripId = request.get("tripId");
        Long userId = userDetails.getId();
        
        logger.info("Creating itinerary generation job for trip: {}, user: {}", tripId, userId);
        
        // Generate unique job ID
        String jobId = UUID.randomUUID().toString();
        
        // Create job record
        Job job = new Job(jobId, "ITINERARY_GENERATION", tripId, userId);
        jobRepository.save(job);
        
        // Return job info
        Map<String, Object> response = new HashMap<>();
        response.put("jobId", jobId);
        response.put("status", job.getStatus().toString());
        response.put("message", "Job created successfully. Poll for status using the jobId.");
        
        return ResponseEntity.accepted().body(response);
    }

    /**
     * Create a new async job for itinerary adaptation
     * 
     * POST /api/v1/jobs/itinerary/adapt
     * Body: { "tripId": 123, "context": "Add more outdoor activities" }
     * Response: { "jobId": "uuid-456", "status": "PENDING" }
     */
    @PostMapping("/itinerary/adapt")
    public ResponseEntity<Map<String, Object>> createItineraryAdaptationJob(
            @RequestBody Map<String, Object> request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        Long tripId = ((Number) request.get("tripId")).longValue();
        String context = (String) request.get("context");
        Long userId = userDetails.getId();
        
        logger.info("Creating itinerary adaptation job for trip: {}, user: {}, context: {}", tripId, userId, context);
        
        String jobId = UUID.randomUUID().toString();
        
        Job job = new Job(jobId, "ITINERARY_ADAPTATION", tripId, userId);
        jobRepository.save(job);
        
        Map<String, Object> response = new HashMap<>();
        response.put("jobId", jobId);
        response.put("status", job.getStatus().toString());
        response.put("message", "Job created successfully. Poll for status using the jobId.");
        
        return ResponseEntity.accepted().body(response);
    }

    /**
     * Get job status by jobId
     * 
     * GET /api/v1/jobs/{jobId}
     * Response: { "jobId": "uuid-123", "status": "COMPLETED", "result": {...} }
     */
    @GetMapping("/{jobId}")
    public ResponseEntity<JobResponse> getJobStatus(@PathVariable String jobId) {
        logger.info("Fetching status for job: {}", jobId);
        
        Optional<Job> jobOpt = jobRepository.findByJobId(jobId);
        
        if (jobOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Job job = jobOpt.get();
        JobResponse response = new JobResponse(
            job.getJobId(),
            job.getStatus().toString(),
            job.getResult(),
            job.getErrorMessage(),
            job.getCreatedAt(),
            job.getStartedAt(),
            job.getCompletedAt()
        );
        
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a job record (cleanup after retrieving results)
     * 
     * DELETE /api/v1/jobs/{jobId}
     */
    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> deleteJob(@PathVariable String jobId) {
        logger.info("Deleting job: {}", jobId);
        
        Optional<Job> jobOpt = jobRepository.findByJobId(jobId);
        
        if (jobOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        jobRepository.deleteByJobId(jobId);
        return ResponseEntity.noContent().build();
    }


}
