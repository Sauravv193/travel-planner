package com.travelplanner.controller.v1;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelplanner.model.Conversation;
import com.travelplanner.model.ConversationMessage;
import com.travelplanner.security.services.UserDetailsImpl;
import com.travelplanner.service.ConversationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ConversationControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ConversationService conversationService;

    @InjectMocks
    private ConversationController conversationController;

    private ObjectMapper objectMapper;
    private UserDetailsImpl userDetails;
    private Conversation testConversation;

    @BeforeEach
    void setUp() {
        userDetails = new UserDetailsImpl(1L, "testuser", "test@example.com", "password");
        mockMvc = MockMvcBuilders.standaloneSetup(conversationController)
                .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver(userDetails))
                .build();
        objectMapper = new ObjectMapper();

        testConversation = new Conversation("conv-123", 1L, 1L);
    }

    @Test
    void createConversation_ReturnsCreatedConversation() throws Exception {
        when(conversationService.createConversation(1L, 1L)).thenReturn(testConversation);

        mockMvc.perform(post("/api/v1/conversations")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"tripId\": 1}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.conversationId").value("conv-123"))
                .andExpect(jsonPath("$.tripId").value(1))
                .andExpect(jsonPath("$.userId").value(1));
    }

    @Test
    void getConversation_ReturnsConversationWithMessages() throws Exception {
        ConversationMessage msg = new ConversationMessage(
            testConversation, ConversationMessage.MessageType.USER_REQUEST, "Hello", 1
        );
        testConversation.getMessages().add(msg);

        when(conversationService.getConversation("conv-123")).thenReturn(testConversation);

        mockMvc.perform(get("/api/v1/conversations/conv-123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.conversationId").value("conv-123"))
                .andExpect(jsonPath("$.messages[0].type").value("USER_REQUEST"))
                .andExpect(jsonPath("$.messages[0].content").value("Hello"));
    }

    @Test
    void getConversationsForTrip_ReturnsList() throws Exception {
        when(conversationService.getConversationsForTrip(1L)).thenReturn(List.of(testConversation));

        mockMvc.perform(get("/api/v1/conversations/trip/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].conversationId").value("conv-123"));
    }

    @Test
    void getConversationsForTrip_Empty_ReturnsEmptyList() throws Exception {
        when(conversationService.getConversationsForTrip(1L)).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/conversations/trip/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void sendMessage_ReturnsCreatedMessage() throws Exception {
        ConversationMessage message = new ConversationMessage(
            testConversation, ConversationMessage.MessageType.USER_REQUEST, "Add more activities", 1
        );
        message.setId(1L);

        when(conversationService.addUserMessage("conv-123", "Add more activities")).thenReturn(message);

        mockMvc.perform(post("/api/v1/conversations/conv-123/message")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"content\": \"Add more activities\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.messageId").value(1))
                .andExpect(jsonPath("$.type").value("USER_REQUEST"))
                .andExpect(jsonPath("$.content").value("Add more activities"))
                .andExpect(jsonPath("$.sequenceNumber").value(1));
    }

    @Test
    void deleteConversation_ReturnsNoContent() throws Exception {
        doNothing().when(conversationService).deleteConversation("conv-123");

        mockMvc.perform(delete("/api/v1/conversations/conv-123"))
                .andExpect(status().isNoContent());

        verify(conversationService).deleteConversation("conv-123");
    }

    @Test
    void createConversation_EmptyBody_UsesNullTripId() throws Exception {
        when(conversationService.createConversation(null, 1L)).thenReturn(testConversation);

        mockMvc.perform(post("/api/v1/conversations")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.conversationId").value("conv-123"));
    }
}
