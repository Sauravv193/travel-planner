package com.travelplanner.controller.v1;

import com.travelplanner.dto.response.ConversationResponse;
import com.travelplanner.model.Conversation;
import com.travelplanner.model.ConversationMessage;
import com.travelplanner.security.services.UserDetailsImpl;
import com.travelplanner.service.ConversationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/conversations")
public class ConversationController {

    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createConversation(
            @RequestBody Map<String, Long> request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Long tripId = request.get("tripId");
        Conversation conversation = conversationService.createConversation(tripId, userDetails.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("conversationId", conversation.getConversationId());
        response.put("tripId", conversation.getTripId());
        response.put("userId", conversation.getUserId());
        response.put("createdAt", conversation.getCreatedAt());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{conversationId}")
    public ResponseEntity<ConversationResponse> getConversation(
            @PathVariable String conversationId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Conversation conversation = conversationService.getConversation(conversationId, userDetails.getId());
        return ResponseEntity.ok(toResponse(conversation));
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<ConversationResponse>> getConversationsForTrip(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<ConversationResponse> response = conversationService
                .getConversationsForTrip(tripId, userDetails.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{conversationId}/message")
    public ResponseEntity<Map<String, Object>> sendMessage(
            @PathVariable String conversationId,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        ConversationMessage message = conversationService.addUserMessage(
                conversationId, userDetails.getId(), request.get("content"));

        Map<String, Object> response = new HashMap<>();
        response.put("messageId", message.getId());
        response.put("type", message.getType().toString());
        response.put("content", message.getContent());
        response.put("sequenceNumber", message.getSequenceNumber());
        response.put("createdAt", message.getCreatedAt());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{conversationId}")
    public ResponseEntity<Void> deleteConversation(
            @PathVariable String conversationId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        conversationService.deleteConversation(conversationId, userDetails.getId());
        return ResponseEntity.noContent().build();
    }

    private ConversationResponse toResponse(Conversation conversation) {
        return new ConversationResponse(
                conversation.getConversationId(),
                conversation.getTripId(),
                conversation.getUserId(),
                conversation.getCreatedAt(),
                conversation.getUpdatedAt(),
                conversation.getMessages().stream().map(this::mapMessageToResponse).collect(Collectors.toList()));
    }

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
