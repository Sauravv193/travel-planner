package com.travelplanner.controller.v1;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelplanner.model.Job;
import com.travelplanner.repository.JobRepository;
import com.travelplanner.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class JobControllerTest {

    private MockMvc mockMvc;

    @Mock
    private JobRepository jobRepository;

    @InjectMocks
    private JobController jobController;

    private ObjectMapper objectMapper;
    private UserDetailsImpl userDetails;
    private Job testJob;

    @BeforeEach
    void setUp() {
        userDetails = new UserDetailsImpl(1L, "testuser", "test@example.com", "password");
        mockMvc = MockMvcBuilders.standaloneSetup(jobController)
                .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver(userDetails))
                .build();
        objectMapper = new ObjectMapper();

        testJob = new Job("job-123", "ITINERARY_GENERATION", 1L, 1L);
    }

    @Test
    void createItineraryGenerationJob_ReturnsAccepted() throws Exception {
        when(jobRepository.save(any(Job.class))).thenReturn(testJob);

        mockMvc.perform(post("/api/v1/jobs/itinerary/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"tripId\": 1}"))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.jobId").exists())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void createItineraryAdaptationJob_ReturnsAccepted() throws Exception {
        when(jobRepository.save(any(Job.class))).thenReturn(testJob);

        mockMvc.perform(post("/api/v1/jobs/itinerary/adapt")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"tripId\": 1, \"context\": \"Add more outdoor activities\"}"))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.jobId").exists())
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void getJobStatus_Found_ReturnsJobResponse() throws Exception {
        testJob.setStatus(Job.JobStatus.COMPLETED);
        testJob.setResult("{\"days\": []}");
        testJob.setStartedAt(LocalDateTime.now().minusMinutes(5));
        testJob.setCompletedAt(LocalDateTime.now());

        when(jobRepository.findByJobId("job-123")).thenReturn(Optional.of(testJob));

        mockMvc.perform(get("/api/v1/jobs/job-123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jobId").value("job-123"))
                .andExpect(jsonPath("$.status").value("COMPLETED"))
                .andExpect(jsonPath("$.result").value("{\"days\": []}"));
    }

    @Test
    void getJobStatus_Pending_ReturnsPendingStatus() throws Exception {
        when(jobRepository.findByJobId("job-123")).thenReturn(Optional.of(testJob));

        mockMvc.perform(get("/api/v1/jobs/job-123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.result").doesNotExist());
    }

    @Test
    void getJobStatus_Failed_ReturnsError() throws Exception {
        testJob.setStatus(Job.JobStatus.FAILED);
        testJob.setErrorMessage("Gemini API error");
        testJob.setCompletedAt(LocalDateTime.now());

        when(jobRepository.findByJobId("job-123")).thenReturn(Optional.of(testJob));

        mockMvc.perform(get("/api/v1/jobs/job-123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("FAILED"))
                .andExpect(jsonPath("$.errorMessage").value("Gemini API error"));
    }

    @Test
    void getJobStatus_NotFound_Returns404() throws Exception {
        when(jobRepository.findByJobId("job-999")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/jobs/job-999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteJob_Found_ReturnsNoContent() throws Exception {
        when(jobRepository.findByJobId("job-123")).thenReturn(Optional.of(testJob));
        doNothing().when(jobRepository).deleteByJobId("job-123");

        mockMvc.perform(delete("/api/v1/jobs/job-123"))
                .andExpect(status().isNoContent());

        verify(jobRepository).deleteByJobId("job-123");
    }

    @Test
    void deleteJob_NotFound_Returns404() throws Exception {
        when(jobRepository.findByJobId("job-999")).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/v1/jobs/job-999"))
                .andExpect(status().isNotFound());

        verify(jobRepository, never()).deleteByJobId(anyString());
    }
}
