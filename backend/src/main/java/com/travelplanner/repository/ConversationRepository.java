package com.travelplanner.repository;

import com.travelplanner.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Conversation Repository
 * 
 * Manages persistence of conversation records.
 */
@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    
    Optional<Conversation> findByConversationId(String conversationId);\n\n    Optional<Conversation> findByConversationIdAndUserId(String conversationId, Long userId);
    
    List<Conversation> findByTripId(Long tripId);\n\n    List<Conversation> findByTripIdAndUserId(Long tripId, Long userId);
    
    List<Conversation> findByUserId(Long userId);
    
    void deleteByConversationId(String conversationId);\n\n    void deleteByConversationIdAndUserId(String conversationId, Long userId);
}
