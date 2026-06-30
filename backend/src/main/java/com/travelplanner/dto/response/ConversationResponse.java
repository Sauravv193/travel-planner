package com.travelplanner.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Conversation Response DTO
 * 
 * Represents a conversation with its messages.
 */
public class ConversationResponse {
    
    private String conversationId;
    private Long tripId;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<Map<String, Object>> messages;

    public ConversationResponse() {
    }

    public ConversationResponse(String conversationId, Long tripId, Long userId, 
                               LocalDateTime createdAt, LocalDateTime updatedAt, 
                               List<Map<String, Object>> messages) {
        this.conversationId = conversationId;
        this.tripId = tripId;
        this.userId = userId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.messages = messages;
    }

    // Getters and Setters
    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    public Long getTripId() {
        return tripId;
    }

    public void setTripId(Long tripId) {
        this.tripId = tripId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<Map<String, Object>> getMessages() {
        return messages;
    }

    public void setMessages(List<Map<String, Object>> messages) {
        this.messages = messages;
    }
}
