package com.travelplanner.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Conversation Message Model
 * 
 * Represents individual messages in a conversation.
 * Stores both user requests and AI responses.
 */
@Entity
@Table(name = "conversation_messages")
public class ConversationMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageType type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private Integer sequenceNumber;

    public enum MessageType {
        USER_REQUEST,
        AI_RESPONSE
    }

    // Constructors
    public ConversationMessage() {
        this.createdAt = LocalDateTime.now();
    }

    public ConversationMessage(Conversation conversation, MessageType type, String content, Integer sequenceNumber) {
        this();
        this.conversation = conversation;
        this.type = type;
        this.content = content;
        this.sequenceNumber = sequenceNumber;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Conversation getConversation() {
        return conversation;
    }

    public void setConversation(Conversation conversation) {
        this.conversation = conversation;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getSequenceNumber() {
        return sequenceNumber;
    }

    public void setSequenceNumber(Integer sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
    }
}
