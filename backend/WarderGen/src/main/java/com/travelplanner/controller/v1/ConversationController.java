package com.travelplanner.controller.v1;

import com.travelplanner.dto.response.ConversationResponse;
import com.travelplanner.model.Conversation;
import com.travelplanner.model.ConversationMessage;
import com.travelplanner.security.services.UserDetailsImpl;
import com.travelplanner.service.ConversationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Conversation Controller
 * 
 * Provides endpoints for conversational AI interactions.
 * Enables multi-turn conversations for itinerary refinement.
 * 
 * Endpoints:
 * - POST /api/v1/conversations - Create new conversation
 * - GET /api/v1/conversations/{conversationId} - Get conversation details
 * - POST /api/v1/conversations/{conversationId}/message - Send message
 * - GET /api/v1/conversations/trip/{tripId} - Get conversations for trip
 */
@RestController
@RequestMapping("/api/v1/conversations")
public class ConversationController {

    private static final Logger logger = LoggerFactory.getLogger(ConversationController.class);

    @Autowired
    private ConversationService conversationService;

    /**
     * Create a new conversation for a trip
     * 
     * POST /api/v1/conversations
     * Body: { "tripId": 123 }
     * Response: { "conversationId": "uuid-123", "tripId": 123, "userId": 456 }
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createConversation(
            @RequestBody Map<String, Long> request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        Long tripId = request.get("tripId");
        Long userId = userDetails.getId();
        
        logger.info("Creating conversation for trip: {}, user: {}", tripId, userId);
        
        Conversation conversation = conversationService.createConversation(tripId, userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("conversationId", conversation.getConversationId());
        response.put("tripId", conversation.getTripId());
        response.put("userId", conversation.getUserId());
        response.put("createdAt", conversation.getCreatedAt());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get conversation by ID
     * 
     * GET /api/v1/conversations/{conversationId}
     * Response: { "conversationId": "...", "messages": [...] }
     */
    @GetMapping("/{conversationId}")
    public ResponseEntity<ConversationResponse> getConversation(@PathVariable String conversationId) {
        logger.info("Fetching conversation: {}", conversationId);
        
        Conversation conversation = conversationService.getConversation(conversationId);
        
        ConversationResponse response = new ConversationResponse(
            conversation.getConversationId(),
            conversation.getTripId(),
            conversation.getUserId(),
            conversation.getCreatedAt(),
            conversation.getUpdatedAt(),
            conversation.getMessages().stream()
                .map(this::mapMessageToResponse)
                .collect(Collectors.toList())
        );
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get all conversations for a trip
     * 
     * GET /api/v1/conversations/trip/{tripId}
     */
    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<ConversationResponse>> getConversationsForTrip(@PathVariable Long tripId) {
        logger.info("Fetching conversations for trip: {}", tripId);
        
        List<Conversation> conversations = conversationService.getConversationsForTrip(tripId);
        
        List<ConversationResponse> response = conversations.stream()
            .map(conv -> new ConversationResponse(
                conv.getConversationId(),
                conv.getTripId(),
                conv.getUserId(),
                conv.getCreatedAt(),
                conv.getUpdatedAt(),
                conv.getMessages().stream()
                    .map(this::mapMessageToResponse)
                    .collect(Collectors.toList())
            ))
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Send a message in a conversation
     * 
     * POST /api/v1/conversations/{conversationId}/message
     * Body: { "content": "Replace Day 2 with more outdoor activities" }
     * Response: { "messageId": 123, "type": "USER_REQUEST", "content": "..." }
     */
    @PostMapping("/{conversationId}/message")
    public ResponseEntity<Map<String, Object>> sendMessage(
            @PathVariable String conversationId,
            @RequestBody Map<String, String> request) {
        
        String content = request.get("content");
        logger.info("Adding message to conversation: {}", conversationId);
        
        ConversationMessage message = conversationService.addUserMessage(conversationId, content);
        
        Map<String, Object> response = new HashMap<>();
        response.put("messageId", message.getId());
        response.put("type", message.getType().toString());
        response.put("content", message.getContent());
        response.put("sequenceNumber", message.getSequenceNumber());
        response.put("createdAt", message.getCreatedAt());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a conversation
     * 
     * DELETE /api/v1/conversations/{conversationId}
     */
    @DeleteMapping("/{conversationId}")
    public ResponseEntity<Void> deleteConversation(@PathVariable String conversationId) {
        logger.info("Deleting conversation: {}", conversationId);
        
        conversationService.deleteConversation(conversationId);
        
        return ResponseEntity.noContent().build();
    }

    /**
     * Map ConversationMessage to response DTO
     */
    private Map<String, Object> mapMessageToResponse(ConversationMessage message) {
        Map<String, Object> map = new HashMap<>();
        map.put("messageId", message.getId());
        map.put("type", message.getType().toString());
        map.put("content", message.getContent());
        map.put("sequenceNumber", message.getSequenceNumber());
        map.put("createdAt", message.getCreatedAt());
        return map;
    }
}
