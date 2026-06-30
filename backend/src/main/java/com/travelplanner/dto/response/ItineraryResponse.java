package com.travelplanner.dto.response;

/**
 * DTO for exposing itinerary data within trip responses.
 * The content field contains the raw AI-generated JSON itinerary string.
 */
public class ItineraryResponse {

    private Long id;
    private String content;

    public ItineraryResponse() {
    }

    public ItineraryResponse(Long id, String content) {
        this.id = id;
        this.content = content;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
