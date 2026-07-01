package com.travelplanner.service;

import com.travelplanner.model.Itinerary;
import com.travelplanner.model.Job;
import com.travelplanner.model.Trip;
import com.travelplanner.repository.JobRepository;
import com.travelplanner.repository.ItineraryRepository;
import com.travelplanner.repository.TripRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Async Itinerary Service
 * 
 * Handles asynchronous AI itinerary generation using Spring's @Async.
 * This allows the main request thread to return immediately while
 * the AI generation happens in the background.
 * 
 * Workflow:
 * 1. Controller creates a Job record with PENDING status
 * 2. Controller returns jobId to client
 * 3. This service processes the job in background thread
 * 4. Updates job status to PROCESSING → COMPLETED/FAILED
 * 5. Client polls job status via JobController
 */
@Service
public class AsyncItineraryService {

    private static final Logger logger = LoggerFactory.getLogger(AsyncItineraryService.class);
    private static final int MAX_RETRIES = 3;

    @Autowired
    private ItineraryService itineraryService;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ItineraryRepository itineraryRepository;

    @Autowired
    private TripRepository tripRepository;

    /**
     * Generate itinerary asynchronously
     * 
     * @param jobId The job ID to track this operation
     * @param tripId The trip ID to generate itinerary for
     * @param userId The user ID for authorization
     */
    @Async("taskExecutor")
    // @Transactional removed to prevent DB connection exhaustion during long AI calls
    public void generateItineraryAsync(String jobId, Long tripId, Long userId) {
        logger.info("Starting async itinerary generation for job: {}, trip: {}, user: {}", jobId, tripId, userId);

        Job job = jobRepository.findByJobId(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        try {
            // Update job status to PROCESSING
            job.setStatus(Job.JobStatus.PROCESSING);
            job.setStartedAt(LocalDateTime.now());
            jobRepository.save(job);

            logger.info("Job {} marked as PROCESSING", jobId);

            // Generate itinerary with retry logic
            Itinerary itinerary = generateWithRetry(tripId, userId, job);

            // Update job with success
            job.setStatus(Job.JobStatus.COMPLETED);
            job.setCompletedAt(LocalDateTime.now());
            job.setResult(itinerary.getContent());
            jobRepository.save(job);

            logger.info("Job {} completed successfully", jobId);

        } catch (Exception e) {
            logger.error("Job {} failed: {}", jobId, e.getMessage(), e);

            // Update job with failure
            job.setStatus(Job.JobStatus.FAILED);
            job.setCompletedAt(LocalDateTime.now());
            job.setErrorMessage(e.getMessage());
            jobRepository.save(job);
        }
    }

    /**
     * Generate itinerary with retry logic
     * 
     * Retries up to MAX_RETRIES times if Gemini API fails.
     * This handles transient failures like network issues or API rate limits.
     */
    private Itinerary generateWithRetry(Long tripId, Long userId, Job job) {
        int attempt = 0;
        Exception lastException = null;

        while (attempt < MAX_RETRIES) {
            attempt++;
            try {
                logger.info("Attempt {}/{} for job {}", attempt, MAX_RETRIES, job.getJobId());
                
                Itinerary itinerary = itineraryService.generateItinerary(tripId, userId);
                
                logger.info("Itinerary generation succeeded on attempt {} for job {}", attempt, job.getJobId());
                return itinerary;

            } catch (Exception e) {
                lastException = e;
                logger.warn("Attempt {} failed for job {}: {}", attempt, job.getJobId(), e.getMessage());
                
                if (attempt < MAX_RETRIES) {
                    // Exponential backoff: 2^attempt seconds
                    try {
                        long backoffTime = (long) Math.pow(2, attempt) * 1000;
                        logger.info("Waiting {}ms before retry for job {}", backoffTime, job.getJobId());
                        Thread.sleep(backoffTime);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("Thread interrupted during backoff", ie);
                    }
                }
            }
        }

        job.setRetryCount(attempt);
        // Capture stack trace from lastException for diagnosis
        String errorDetail = "Unknown";
        if (lastException != null) {
            java.io.StringWriter sw = new java.io.StringWriter();
            java.io.PrintWriter pw = new java.io.PrintWriter(sw);
            lastException.printStackTrace(pw);
            pw.flush();
            String fullTrace = sw.toString();
            // First 2000 chars of stack trace
            errorDetail = lastException.getClass().getName() + ": " + lastException.getMessage() + " | STACK: " + fullTrace.substring(0, Math.min(fullTrace.length(), 2000));
        }
        throw new RuntimeException("Failed to generate itinerary after " + MAX_RETRIES + " attempts. Full error: " + errorDetail, lastException);
    }

    /**
     * Adapt itinerary asynchronously
     */
    @Async("taskExecutor")
    // @Transactional removed to prevent DB connection exhaustion during long AI calls
    public void adaptItineraryAsync(String jobId, Long tripId, Long userId, String context) {
        logger.info("Starting async itinerary adaptation for job: {}, trip: {}, user: {}", jobId, tripId, userId);

        Job job = jobRepository.findByJobId(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        try {
            job.setStatus(Job.JobStatus.PROCESSING);
            job.setStartedAt(LocalDateTime.now());
            jobRepository.save(job);

            Itinerary itinerary = itineraryService.adaptItinerary(tripId, userId, context);

            job.setStatus(Job.JobStatus.COMPLETED);
            job.setCompletedAt(LocalDateTime.now());
            job.setResult(itinerary.getContent());
            jobRepository.save(job);

            logger.info("Job {} adaptation completed successfully", jobId);

        } catch (Exception e) {
            logger.error("Job {} adaptation failed: {}", jobId, e.getMessage(), e);

            job.setStatus(Job.JobStatus.FAILED);
            job.setCompletedAt(LocalDateTime.now());
            job.setErrorMessage(e.getMessage());
            jobRepository.save(job);
        }
    }
}
