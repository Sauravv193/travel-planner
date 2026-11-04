package com.travelplanner.controller.v1;

import com.travelplanner.model.Job;
import com.travelplanner.model.Trip;
import com.travelplanner.model.User;
import com.travelplanner.repository.JobRepository;
import com.travelplanner.repository.TripRepository;
import com.travelplanner.security.services.UserDetailsImpl;
import com.travelplanner.service.AsyncItineraryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class JobControllerTest {

    private MockMvc mockMvc;

    @Mock private JobRepository jobRepository;
    @Mock private TripRepository tripRepository;
    @Mock private AsyncItineraryService asyncItineraryService;
    @InjectMocks private JobController jobController;

    private UserDetailsImpl userDetails;
    private Trip ownedTrip;
    private Job testJob;

    @BeforeEach
    void setUp() {
        userDetails = new UserDetailsImpl(1L, "testuser", "test@example.com", "password");
        User owner = new User("testuser", "test@example.com", "password");
        owner.setId(1L);
        ownedTrip = new Trip();
        ownedTrip.setId(10L);
        ownedTrip.setUser(owner);
        testJob = new Job("job-123", "ITINERARY_GENERATION", 10L, 1L);

        mockMvc = MockMvcBuilders.standaloneSetup(jobController)
                .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver(userDetails))
                .build();
    }

    @Test
    void createItineraryGenerationJob_VerifiesOwnershipAndStartsAsyncWork() throws Exception {
        when(tripRepository.findByIdWithItinerary(10L)).thenReturn(Optional.of(ownedTrip));
        when(jobRepository.save(any(Job.class))).thenReturn(testJob);

        mockMvc.perform(post("/api/v1/jobs/itinerary/generate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"tripId\":10}"))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.jobId").value("job-123"))
                .andExpect(jsonPath("$.status").value("PENDING"));

        verify(asyncItineraryService).generateItineraryAsync(anyString(), eq(10L), eq(1L));
    }

    @Test
    void createItineraryAdaptationJob_RejectsBlankContext() {
        assertThrows(IllegalArgumentException.class,
                () -> jobController.createItineraryAdaptationJob(
                        java.util.Map.of("tripId", 10L, "context", "  "), userDetails));

        verifyNoInteractions(asyncItineraryService);
        verifyNoInteractions(jobRepository);
    }

    @Test
    void createItineraryAdaptationJob_StartsAsyncWork() throws Exception {
        when(tripRepository.findByIdWithItinerary(10L)).thenReturn(Optional.of(ownedTrip));
        when(jobRepository.save(any(Job.class))).thenReturn(
                new Job("job-456", "ITINERARY_ADAPTATION", 10L, 1L));

        mockMvc.perform(post("/api/v1/jobs/itinerary/adapt")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"tripId\":10,\"context\":\"Add outdoor activities\"}"))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.status").value("PENDING"));

        verify(asyncItineraryService).adaptItineraryAsync(anyString(), eq(10L), eq(1L), eq("Add outdoor activities"));
    }

    @Test
    void getJobStatus_OnlyFindsJobsOwnedByAuthenticatedUser() throws Exception {
        testJob.setStatus(Job.JobStatus.COMPLETED);
        testJob.setResult("{\"days\": []}");
        when(jobRepository.findByJobIdAndUserId("job-123", 1L)).thenReturn(Optional.of(testJob));

        mockMvc.perform(get("/api/v1/jobs/job-123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jobId").value("job-123"))
                .andExpect(jsonPath("$.status").value("COMPLETED"));

        verify(jobRepository).findByJobIdAndUserId("job-123", 1L);
        verify(jobRepository, never()).findByJobId(anyString());
    }

    @Test
    void getJobStatus_UnknownOrOtherUsersJobReturns404() throws Exception {
        when(jobRepository.findByJobIdAndUserId("job-123", 1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/jobs/job-123"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteJob_RejectsActiveJobs() throws Exception {
        testJob.setStatus(Job.JobStatus.PROCESSING);
        when(jobRepository.findByJobIdAndUserId("job-123", 1L)).thenReturn(Optional.of(testJob));

        mockMvc.perform(delete("/api/v1/jobs/job-123"))
                .andExpect(status().isConflict());

        verify(jobRepository, never()).delete(any(Job.class));
    }

    @Test
    void deleteJob_DeletesTerminalJobsOwnedByUser() throws Exception {
        testJob.setStatus(Job.JobStatus.COMPLETED);
        when(jobRepository.findByJobIdAndUserId("job-123", 1L)).thenReturn(Optional.of(testJob));

        mockMvc.perform(delete("/api/v1/jobs/job-123"))
                .andExpect(status().isNoContent());

        verify(jobRepository).delete(testJob);
    }

    @Test
    void createGenerationJob_DoesNotStartForUnownedTrip() {
        when(tripRepository.findByIdWithItinerary(10L)).thenReturn(Optional.empty());

        assertThrows(com.travelplanner.exception.UnauthorizedException.class,
                () -> jobController.createItineraryGenerationJob(
                        java.util.Map.of("tripId", 10L), userDetails));

        verify(jobRepository, never()).save(any(Job.class));
        verifyNoInteractions(asyncItineraryService);
    }
}
