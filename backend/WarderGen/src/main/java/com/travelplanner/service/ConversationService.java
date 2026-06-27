package com.travelplanner.service;

import com.travelplanner.model.Conversation;
import com.travelplanner.model.ConversationMessage;
import com.travelplanner.repository.ConversationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Conversation Service
 * 
 * Manages multi-turn conversations for itinerary refinement.
 * Maintains conversation history to enable context-aware AI responses.
 */
@Service
public class ConversationService {

    private static final Logger logger = LoggerFactory.getLogger(ConversationService.class);

    @Autowired
    private ConversationRepository conversationRepository;

    /**
     * Create a new conversation for a trip
     */
    @Transactional
    public Conversation createConversation(Long tripId, Long userId) {
        String conversationId = UUID.randomUUID().toString();
        Conversation conversation = new Conversation(conversationId, tripId, userId);
        conversation = conversationRepository.save(conversation);
        
        logger.info("Created conversation {} for trip {} and user {}", conversationId, tripId, userId);
        return conversation;
    }

    /**
     * Get conversation by ID
     */
    public Conversation getConversation(String conversationId) {
        return conversationRepository.findByConversationId(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found: " + conversationId));
    }

    /**
     * Get all conversations for a trip
     */
    public List<Conversation> getConversationsForTrip(Long tripId) {
        return conversationRepository.findByTripId(tripId);
    }

    /**
     * Get all conversations for a user
     */
    public List<Conversation> getConversationsForUser(Long userId) {
        return conversationRepository.findByUserId(userId);
    }

    /**
     * Add a user message to the conversation
     */
    @Transactional
    public ConversationMessage addUserMessage(String conversationId, String content) {
        Conversation conversation = getConversation(conversationId);
        
        int nextSequence = conversation.getMessages().size() + 1;
        ConversationMessage message = new ConversationMessage(
            conversation,
            ConversationMessage.MessageType.USER_REQUEST,
            content,
            nextSequence
        );
        
        conversation.addMessage(message);
        conversationRepository.save(conversation);
        
        logger.info("Added user message to conversation {}", conversationId);
        return message;
    }

    /**
     * Add an AI response to the conversation
     */
    @Transactional
    public ConversationMessage addAiResponse(String conversationId, String content) {
        Conversation conversation = getConversation(conversationId);
        
        int nextSequence = conversation.getMessages().size() + 1;
        ConversationMessage message = new ConversationMessage(
            conversation,
            ConversationMessage.MessageType.AI_RESPONSE,
            content,
            nextSequence
        );
        
        conversation.addMessage(message);
        conversationRepository.save(conversation);
        
        logger.info("Added AI response to conversation {}", conversationId);
        return message;
    }

    /**
     * Get conversation history as formatted string for AI context
     */
    public String getConversationHistory(String conversationId) {
        Conversation conversation = getConversation(conversationId);
        
        StringBuilder history = new StringBuilder();
        history.append("CONVERSATION HISTORY:\n");
        
        conversation.getMessages().forEach(message -> {
            if (message.getType() == ConversationMessage.MessageType.USER_REQUEST) {
                history.append("User: ").append(message.getContent()).append("\n");
            } else {
                history.append("AI: ").append(message.getContent()).append("\n");
            }
        });
        
        return history.toString();
    }

    /**
     * Delete a conversation
     */
    @Transactional
    public void deleteConversation(String conversationId) {
        conversationRepository.deleteByConversationId(conversationId);
        logger.info("Deleted conversation {}", conversationId);
    }
}
