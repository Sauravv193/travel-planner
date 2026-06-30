package com.travelplanner.service;

import com.travelplanner.model.Conversation;
import com.travelplanner.model.ConversationMessage;
import com.travelplanner.repository.ConversationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConversationServiceTest {

    @Mock
    private ConversationRepository conversationRepository;

    @InjectMocks
    private ConversationService conversationService;

    private Conversation testConversation;

    @BeforeEach
    void setUp() {
        testConversation = new Conversation("conv-123", 1L, 1L);
    }

    @Test
    void createConversation_Success() {
        when(conversationRepository.save(any(Conversation.class))).thenReturn(testConversation);

        Conversation result = conversationService.createConversation(1L, 1L);

        assertNotNull(result);
        assertEquals("conv-123", result.getConversationId());
        assertEquals(1L, result.getTripId());
        assertEquals(1L, result.getUserId());
        verify(conversationRepository).save(any(Conversation.class));
    }

    @Test
    void getConversation_Found() {
        when(conversationRepository.findByConversationId("conv-123")).thenReturn(Optional.of(testConversation));

        Conversation result = conversationService.getConversation("conv-123");

        assertNotNull(result);
        assertEquals("conv-123", result.getConversationId());
    }

    @Test
    void getConversation_NotFound_ThrowsException() {
        when(conversationRepository.findByConversationId("conv-999")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> conversationService.getConversation("conv-999"));
    }

    @Test
    void getConversationsForTrip_ReturnsList() {
        when(conversationRepository.findByTripId(1L)).thenReturn(List.of(testConversation));

        List<Conversation> results = conversationService.getConversationsForTrip(1L);

        assertEquals(1, results.size());
        assertEquals("conv-123", results.get(0).getConversationId());
    }

    @Test
    void getConversationsForTrip_NoConversations_ReturnsEmptyList() {
        when(conversationRepository.findByTripId(1L)).thenReturn(List.of());

        List<Conversation> results = conversationService.getConversationsForTrip(1L);

        assertTrue(results.isEmpty());
    }

    @Test
    void getConversationsForUser_ReturnsList() {
        when(conversationRepository.findByUserId(1L)).thenReturn(List.of(testConversation));

        List<Conversation> results = conversationService.getConversationsForUser(1L);

        assertEquals(1, results.size());
    }

    @Test
    void addUserMessage_Success() {
        when(conversationRepository.findByConversationId("conv-123")).thenReturn(Optional.of(testConversation));
        when(conversationRepository.save(any(Conversation.class))).thenReturn(testConversation);

        ConversationMessage message = conversationService.addUserMessage("conv-123", "Replace Day 2");

        assertNotNull(message);
        assertEquals(ConversationMessage.MessageType.USER_REQUEST, message.getType());
        assertEquals("Replace Day 2", message.getContent());
        assertEquals(1, message.getSequenceNumber());
        verify(conversationRepository).save(any(Conversation.class));
    }

    @Test
    void addUserMessage_MultipleMessages_CorrectSequence() {
        // Add first user message
        when(conversationRepository.findByConversationId("conv-123")).thenReturn(Optional.of(testConversation));
        when(conversationRepository.save(any(Conversation.class))).thenReturn(testConversation);

        conversationService.addUserMessage("conv-123", "First message");

        // Add AI response (simulated via messages list size now being 1)
        when(conversationRepository.findByConversationId("conv-123")).thenReturn(Optional.of(testConversation));

        ConversationMessage aiResponse = conversationService.addAiResponse("conv-123", "AI response");

        assertNotNull(aiResponse);
        assertEquals(ConversationMessage.MessageType.AI_RESPONSE, aiResponse.getType());
        assertEquals("AI response", aiResponse.getContent());
    }

    @Test
    void addUserMessage_ConversationNotFound_ThrowsException() {
        when(conversationRepository.findByConversationId("conv-999")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> conversationService.addUserMessage("conv-999", "test"));
    }

    @Test
    void addAiResponse_Success() {
        when(conversationRepository.findByConversationId("conv-123")).thenReturn(Optional.of(testConversation));
        when(conversationRepository.save(any(Conversation.class))).thenReturn(testConversation);

        ConversationMessage message = conversationService.addAiResponse("conv-123", "Here is your updated itinerary");

        assertNotNull(message);
        assertEquals(ConversationMessage.MessageType.AI_RESPONSE, message.getType());
        assertEquals("Here is your updated itinerary", message.getContent());
    }

    @Test
    void getConversationHistory_ReturnsFormattedString() {
        // Add a user message and AI response to the conversation
        ConversationMessage userMsg = new ConversationMessage(
            testConversation, ConversationMessage.MessageType.USER_REQUEST, "Add more outdoor activities", 1
        );
        ConversationMessage aiMsg = new ConversationMessage(
            testConversation, ConversationMessage.MessageType.AI_RESPONSE, "Updated itinerary with outdoor activities", 2
        );
        testConversation.getMessages().add(userMsg);
        testConversation.getMessages().add(aiMsg);

        when(conversationRepository.findByConversationId("conv-123")).thenReturn(Optional.of(testConversation));

        String history = conversationService.getConversationHistory("conv-123");

        assertTrue(history.contains("Add more outdoor activities"));
        assertTrue(history.contains("Updated itinerary with outdoor activities"));
        assertTrue(history.contains("User:"));
        assertTrue(history.contains("AI:"));
    }

    @Test
    void getConversationHistory_EmptyConversation() {
        when(conversationRepository.findByConversationId("conv-123")).thenReturn(Optional.of(testConversation));

        String history = conversationService.getConversationHistory("conv-123");

        assertTrue(history.contains("CONVERSATION HISTORY"));
        assertFalse(history.contains("User:"));
    }

    @Test
    void deleteConversation_Success() {
        doNothing().when(conversationRepository).deleteByConversationId("conv-123");

        conversationService.deleteConversation("conv-123");

        verify(conversationRepository).deleteByConversationId("conv-123");
    }
}
