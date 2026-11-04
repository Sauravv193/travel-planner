package com.travelplanner.service;

import com.travelplanner.exception.UnauthorizedException;
import com.travelplanner.model.Conversation;
import com.travelplanner.model.ConversationMessage;
import com.travelplanner.repository.ConversationRepository;
import com.travelplanner.repository.TripRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConversationServiceTest {

    @Mock private ConversationRepository conversationRepository;
    @Mock private TripRepository tripRepository;
    @InjectMocks private ConversationService conversationService;

    private Conversation conversation;

    @BeforeEach
    void setUp() {
        conversation = new Conversation("conv-123", 10L, 7L);
    }

    @Test
    void getConversation_OnlyReturnsForOwner() {
        when(conversationRepository.findByConversationIdAndUserId("conv-123", 7L))
                .thenReturn(Optional.of(conversation));

        assertEquals("conv-123", conversationService.getConversation("conv-123", 7L).getConversationId());
        verify(conversationRepository).findByConversationIdAndUserId("conv-123", 7L);
    }

    @Test
    void getConversation_OtherUserCannotRead() {
        when(conversationRepository.findByConversationIdAndUserId("conv-123", 8L))
                .thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class,
                () -> conversationService.getConversation("conv-123", 8L));
    }

    @Test
    void getConversationsForTrip_IsScopedToOwner() {
        when(conversationRepository.findByTripIdAndUserId(10L, 7L))
                .thenReturn(List.of(conversation));

        assertEquals(1, conversationService.getConversationsForTrip(10L, 7L).size());
        verify(conversationRepository).findByTripIdAndUserId(10L, 7L);
    }

    @Test
    void addUserMessage_RequiresOwner() {
        when(conversationRepository.findByConversationIdAndUserId("conv-123", 7L))
                .thenReturn(Optional.of(conversation));
        when(conversationRepository.save(any(Conversation.class))).thenReturn(conversation);

        ConversationMessage result = conversationService.addUserMessage("conv-123", 7L, "Change day two");

        assertEquals("Change day two", result.getContent());
        assertEquals(ConversationMessage.MessageType.USER_REQUEST, result.getType());
    }

    @Test
    void addUserMessage_RejectsBlankContent() {
        assertThrows(IllegalArgumentException.class,
                () -> conversationService.addUserMessage("conv-123", 7L, "  "));
        verifyNoInteractions(conversationRepository);
    }

    @Test
    void deleteConversation_RequiresOwner() {
        when(conversationRepository.findByConversationIdAndUserId("conv-123", 7L))
                .thenReturn(Optional.of(conversation));

        conversationService.deleteConversation("conv-123", 7L);

        verify(conversationRepository).delete(conversation);
    }

    @Test
    void deleteConversation_OtherUserCannotDelete() {
        when(conversationRepository.findByConversationIdAndUserId("conv-123", 8L))
                .thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class,
                () -> conversationService.deleteConversation("conv-123", 8L));
        verify(conversationRepository, never()).delete(any(Conversation.class));
    }
}
