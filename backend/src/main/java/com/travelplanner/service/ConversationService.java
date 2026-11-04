package com.travelplanner.service;

import com.travelplanner.exception.UnauthorizedException;
import com.travelplanner.model.Conversation;
import com.travelplanner.model.ConversationMessage;
import com.travelplanner.repository.ConversationRepository;
import com.travelplanner.repository.TripRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ConversationService {
    private static final Logger logger = LoggerFactory.getLogger(ConversationService.class);

    @Autowired private ConversationRepository conversationRepository;
    @Autowired private TripRepository tripRepository;

    @Transactional
    public Conversation createConversation(Long tripId, Long userId) {
        tripRepository.findByIdWithItinerary(tripId)
                .filter(trip -> trip.getUser().getId().equals(userId))
                .orElseThrow(() -> new UnauthorizedException("You do not have access to this trip"));

        Conversation conversation = new Conversation(UUID.randomUUID().toString(), tripId, userId);
        Conversation saved = conversationRepository.save(conversation);
        logger.info("Created conversation {} for trip {} and user {}", saved.getConversationId(), tripId, userId);
        return saved;
    }

    public Conversation getConversation(String conversationId, Long userId) {
        return conversationRepository.findByConversationIdAndUserId(conversationId, userId)
                .orElseThrow(() -> new UnauthorizedException("Conversation not found or access denied"));
    }

    public List<Conversation> getConversationsForTrip(Long tripId, Long userId) {
        return conversationRepository.findByTripIdAndUserId(tripId, userId);
    }

    public List<Conversation> getConversationsForUser(Long userId) {
        return conversationRepository.findByUserId(userId);
    }

    @Transactional
    public ConversationMessage addUserMessage(String conversationId, Long userId, String content) {
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Message content must not be empty");
        }
        Conversation conversation = getConversation(conversationId, userId);
        int nextSequence = conversation.getMessages().size() + 1;
        ConversationMessage message = new ConversationMessage(
                conversation, ConversationMessage.MessageType.USER_REQUEST, content.trim(), nextSequence);
        conversation.addMessage(message);
        conversationRepository.save(conversation);
        logger.info("Added user message to conversation {} for user {}", conversationId, userId);
        return message;
    }

    private Conversation getConversationInternal(String conversationId) {
        return conversationRepository.findByConversationId(conversationId)
                .orElseThrow(() -> new UnauthorizedException("Conversation not found"));
    }

    @Transactional
    public ConversationMessage addAiResponse(String conversationId, String content) {
        Conversation conversation = getConversationInternal(conversationId);
        int nextSequence = conversation.getMessages().size() + 1;
        ConversationMessage message = new ConversationMessage(
                conversation, ConversationMessage.MessageType.AI_RESPONSE, content, nextSequence);
        conversation.addMessage(message);
        conversationRepository.save(conversation);
        return message;
    }

    public String getConversationHistory(String conversationId) {
        Conversation conversation = getConversationInternal(conversationId);
        StringBuilder history = new StringBuilder("CONVERSATION HISTORY:\n");
        conversation.getMessages().forEach(message -> {
            history.append(message.getType() == ConversationMessage.MessageType.USER_REQUEST ? "User: " : "AI: ")
                    .append(message.getContent()).append("\n");
        });
        return history.toString();
    }

    @Transactional
    public void deleteConversation(String conversationId, Long userId) {
        Conversation conversation = getConversation(conversationId, userId);
        conversationRepository.delete(conversation);
        logger.info("Deleted conversation {} for user {}", conversationId, userId);
    }
}
