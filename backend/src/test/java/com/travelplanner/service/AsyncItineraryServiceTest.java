package com.travelplanner.service;

import com.travelplanner.model.Itinerary;
import com.travelplanner.model.Job;
import com.travelplanner.repository.JobRepository;
import com.travelplanner.repository.ItineraryRepository;
import com.travelplanner.repository.TripRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AsyncItineraryServiceTest {

    @Mock
    private ItineraryService itineraryService;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private ItineraryRepository itineraryRepository;

    @Mock
    private TripRepository tripRepository;

    @InjectMocks
    private AsyncItineraryService asyncItineraryService;

    @Captor
    private ArgumentCaptor<Job> jobCaptor;

    private Job testJob;

    @BeforeEach
    void setUp() {
        testJob = new Job("job-123", "ITINERARY_GENERATION", 1L, 1L);
    }

    @Test
    void generateItineraryAsync_Success() {
        when(jobRepository.findByJobId("job-123")).thenReturn(Optional.of(testJob));
        when(jobRepository.save(any(Job.class))).thenReturn(testJob);

        Itinerary mockItinerary = new Itinerary();
        mockItinerary.setContent("{\"days\": []}");
        when(itineraryService.generateItinerary(1L, 1L)).thenReturn(mockItinerary);

        asyncItineraryService.generateItineraryAsync("job-123", 1L, 1L);

        verify(jobRepository, times(2)).save(jobCaptor.capture());
        Job finalJob = jobCaptor.getAllValues().get(jobCaptor.getAllValues().size() - 1);
        assertEquals(Job.JobStatus.COMPLETED, finalJob.getStatus());
        assertNotNull(finalJob.getCompletedAt());
        assertEquals("{\"days\": []}", finalJob.getResult());
    }

    @Test
    void generateItineraryAsync_JobNotFound() {
        when(jobRepository.findByJobId("job-999")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            asyncItineraryService.generateItineraryAsync("job-999", 1L, 1L);
        });
    }

    @Test
    void generateItineraryAsync_ItineraryServiceFails_UpdatesJobToFailed() {
        when(jobRepository.findByJobId("job-123")).thenReturn(Optional.of(testJob));
        when(jobRepository.save(any(Job.class))).thenReturn(testJob);

        // Simulate failure after all retries
        when(itineraryService.generateItinerary(1L, 1L)).thenThrow(new RuntimeException("Gemini API error"));

        asyncItineraryService.generateItineraryAsync("job-123", 1L, 1L);

        // Find the last saved job
        verify(jobRepository, atLeastOnce()).save(jobCaptor.capture());
        Job lastJob = jobCaptor.getAllValues().get(jobCaptor.getAllValues().size() - 1);
        assertEquals(Job.JobStatus.FAILED, lastJob.getStatus());
        assertNotNull(lastJob.getErrorMessage());
        assertTrue(lastJob.getErrorMessage().contains("Gemini API error") || 
                   lastJob.getErrorMessage().contains("3 attempts"));
    }

    @Test
    void generateItineraryAsync_TransientFailureThenSuccess() {
        when(jobRepository.findByJobId("job-123")).thenReturn(Optional.of(testJob));
        when(jobRepository.save(any(Job.class))).thenReturn(testJob);

        // First call fails, second succeeds
        Itinerary mockItinerary = new Itinerary();
        mockItinerary.setContent("{\"days\": []}");
        when(itineraryService.generateItinerary(1L, 1L))
                .thenThrow(new RuntimeException("Transient error"))
                .thenReturn(mockItinerary);

        asyncItineraryService.generateItineraryAsync("job-123", 1L, 1L);

        verify(itineraryService, times(2)).generateItinerary(1L, 1L);
        verify(jobRepository, atLeast(2)).save(any(Job.class));
    }

    @Test
    void adaptItineraryAsync_Success() {
        when(jobRepository.findByJobId("job-456")).thenReturn(Optional.of(testJob));
        when(jobRepository.save(any(Job.class))).thenReturn(testJob);

        Itinerary mockItinerary = new Itinerary();
        mockItinerary.setContent("{\"days\": [{\"day\": 1}]}");
        when(itineraryService.adaptItinerary(1L, 1L, "Add more outdoor activities")).thenReturn(mockItinerary);

        asyncItineraryService.adaptItineraryAsync("job-456", 1L, 1L, "Add more outdoor activities");

        verify(jobRepository, atLeast(2)).save(any(Job.class));
        verify(itineraryService).adaptItinerary(1L, 1L, "Add more outdoor activities");
    }

    @Test
    void adaptItineraryAsync_Failure_UpdatesJobToFailed() {
        when(jobRepository.findByJobId("job-456")).thenReturn(Optional.of(testJob));
        when(jobRepository.save(any(Job.class))).thenReturn(testJob);

        when(itineraryService.adaptItinerary(1L, 1L, "test")).thenThrow(new RuntimeException("Adaptation failed"));

        asyncItineraryService.adaptItineraryAsync("job-456", 1L, 1L, "test");

        verify(jobRepository, atLeast(2)).save(jobCaptor.capture());
        Job lastJob = jobCaptor.getAllValues().get(jobCaptor.getAllValues().size() - 1);
        assertEquals(Job.JobStatus.FAILED, lastJob.getStatus());
    }
}
