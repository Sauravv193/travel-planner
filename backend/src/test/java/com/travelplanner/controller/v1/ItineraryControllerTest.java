package com.travelplanner.controller.v1;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelplanner.model.Job;
import com.travelplanner.model.Trip;
import com.travelplanner.model.User;
import com.travelplanner.repository.JobRepository;
import com.travelplanner.repository.TripRepository;
import com.travelplanner.security.services.UserDetailsImpl;
import com.travelplanner.service.AsyncItineraryService;
import com.travelplanner.service.ItineraryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ItineraryControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ItineraryService itineraryService;

    @Mock
    private AsyncItineraryService asyncItineraryService;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private TripRepository tripRepository;

    @InjectMocks
    private ItineraryController itineraryController;

    @Captor
    private ArgumentCaptor<Job> jobCaptor;

    private ObjectMapper objectMapper;
    private UserDetailsImpl userDetails;

    @BeforeEach
    void setUp() {
        userDetails = new UserDetailsImpl(1L, "testuser", "test@example.com", "password");
        User owner = new User("testuser", "test@example.com", "password");
        owner.setId(1L);
        Trip ownedTrip = new Trip();
        ownedTrip.setId(1L);
        ownedTrip.setUser(owner);
        lenient().when(tripRepository.findByIdWithItinerary(1L)).thenReturn(java.util.Optional.of(ownedTrip));

        mockMvc = MockMvcBuilders.standaloneSetup(itineraryController)
                .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver(userDetails))
                .build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void generateItinerary_ReturnsAcceptedWithJobId() throws Exception {
        when(jobRepository.save(any(Job.class))).thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(post("/api/v1/itineraries/generate/1"))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.jobId").exists())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.message").exists());

        verify(jobRepository).save(any(Job.class));
        verify(asyncItineraryService).generateItineraryAsync(anyString(), eq(1L), eq(1L));
    }

    @Test
    void regenerateItinerary_ReturnsAcceptedWithJobId() throws Exception {
        when(jobRepository.save(any(Job.class))).thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(put("/api/v1/itineraries/regenerate/1"))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.jobId").exists())
                .andExpect(jsonPath("$.status").value("PENDING"));

        verify(jobRepository).save(any(Job.class));
        verify(asyncItineraryService).generateItineraryAsync(anyString(), eq(1L), eq(1L));
    }

    @Test
    void adaptItinerary_ReturnsAcceptedWithJobId() throws Exception {
        when(jobRepository.save(any(Job.class))).thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(post("/api/v1/itineraries/adapt/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"context\": \"Add more outdoor activities\"}"))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.jobId").exists())
                .andExpect(jsonPath("$.status").value("PENDING"));

        verify(jobRepository).save(any(Job.class));
        verify(asyncItineraryService).adaptItineraryAsync(anyString(), eq(1L), eq(1L), eq("Add more outdoor activities"));
    }

    @Test
    void generateItinerary_JobCreatedWithCorrectFields() throws Exception {
        when(jobRepository.save(any(Job.class))).thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(post("/api/v1/itineraries/generate/1"))
                .andExpect(status().isAccepted());

        verify(jobRepository).save(jobCaptor.capture());
        Job savedJob = jobCaptor.getValue();
        assertNotNull(savedJob.getJobId());
        assertEquals("ITINERARY_GENERATION", savedJob.getJobType());
        assertEquals(1L, savedJob.getTripId());
        assertEquals(1L, savedJob.getUserId());
        assertEquals(Job.JobStatus.PENDING, savedJob.getStatus());
    }

    @Test
    void adaptItinerary_JobCreatedWithCorrectFields() throws Exception {
        when(jobRepository.save(any(Job.class))).thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(post("/api/v1/itineraries/adapt/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"context\": \"Reduce budget\"}"))
                .andExpect(status().isAccepted());

        verify(jobRepository).save(jobCaptor.capture());
        Job savedJob = jobCaptor.getValue();
        assertEquals("ITINERARY_ADAPTATION", savedJob.getJobType());
        assertEquals(1L, savedJob.getTripId());
    }

    @Test
    void generateItinerary_RejectsTripNotOwnedByUser() throws Exception {
        when(tripRepository.findByIdWithItinerary(1L)).thenReturn(java.util.Optional.empty());

        mockMvc.perform(post("/api/v1/itineraries/generate/1"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(asyncItineraryService);
        verify(jobRepository, never()).save(any(Job.class));
    }
}
