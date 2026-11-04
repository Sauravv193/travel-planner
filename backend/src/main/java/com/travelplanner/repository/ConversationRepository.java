package com.travelplanner.repository;

import com.travelplanner.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Optional<Conversation> findByConversationId(String conversationId);
    Optional<Conversation> findByConversationIdAndUserId(String conversationId, Long userId);
    List<Conversation> findByTripId(Long tripId);
    List<Conversation> findByTripIdAndUserId(Long tripId, Long userId);
    List<Conversation> findByUserId(Long userId);
    void deleteByConversationId(String conversationId);
    void deleteByConversationIdAndUserId(String conversationId, Long userId);
}
