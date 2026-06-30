package com.travelplanner.service;

import com.travelplanner.dto.prompt.ItineraryPrompt;
import com.travelplanner.model.Itinerary;
import com.travelplanner.model.Trip;
import com.travelplanner.repository.ItineraryRepository;
import com.travelplanner.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ItineraryService {

    @Autowired
    private ItineraryRepository itineraryRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private PromptBuilderService promptBuilderService;

    @Cacheable(value = "itineraries", key = "#tripId", unless = "#result == null")
    public Itinerary generateItinerary(Long tripId, Long userId) {
        Trip trip = tripRepository.findById(tripId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Error: Trip not found or user not authorized."));

        // Build prompt using PromptBuilderService
        ItineraryPrompt prompt = ItineraryPrompt.builder()
                .destination(trip.getDestination())
                .startDate(convertToLocalDate(trip.getStartDate()))
                .endDate(convertToLocalDate(trip.getEndDate()))
                .numberOfTravelers(trip.getNumberOfTravelers())
                .travelStyle(trip.getTravelStyle())
                .interests(trip.getInterests())
                .budgetTier(trip.getBudgetTier())
                .budget(trip.getBudget())
                .accommodationStyle(trip.getAccommodationStyle())
                .dietaryNeeds(trip.getDietaryNeeds())
                .mustTryFoods(trip.getMustTryFoods())
                .build();

        // Validate prompt parameters
        prompt.validate();

        String formattedPrompt = promptBuilderService.buildItineraryPrompt(prompt);

        String aiResponse = geminiService.callGemini(formattedPrompt);
        String cleanJsonResponse = extractJson(aiResponse);

        Itinerary itinerary = trip.getItinerary();
        if (itinerary == null) {
            itinerary = new Itinerary();
            itinerary.setTrip(trip);
            trip.setItinerary(itinerary);
        }
        itinerary.setContent(cleanJsonResponse);

        Itinerary savedItinerary = itineraryRepository.save(itinerary);
        tripRepository.save(trip);
        return savedItinerary;
    }

    @CacheEvict(value = "itineraries", key = "#tripId")
    public Itinerary adaptItinerary(Long tripId, Long userId, String context) {
        Trip trip = tripRepository.findById(tripId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Error: Trip not found or user not authorized."));

        String originalItineraryContent = trip.getItinerary() != null ? trip.getItinerary().getContent() : "{}";

        String prompt = promptBuilderService.buildAdaptationPrompt(originalItineraryContent, context);

        String aiResponse = geminiService.callGemini(prompt);
        String cleanJsonResponse = extractJson(aiResponse);

        Itinerary itinerary = trip.getItinerary();
        itinerary.setContent(cleanJsonResponse);

        return itineraryRepository.save(itinerary);
    }

    private LocalDate convertToLocalDate(Date date) {
        if (date == null) {
            return null;
        }
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }

    private String extractJson(String aiResponse) {
        Pattern pattern = Pattern.compile("```json\\s*(\\{.*\\})\\s*```", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(aiResponse);

        if (matcher.find()) {
            return matcher.group(1).trim();
        }

        int firstBrace = aiResponse.indexOf('{');
        int lastBrace = aiResponse.lastIndexOf('}');

        if (firstBrace != -1 && lastBrace != -1 && lastBrace > firstBrace) {
            return aiResponse.substring(firstBrace, lastBrace + 1).trim();
        }

        throw new RuntimeException("No valid JSON found in the AI response.");
    }

    public GeminiService getGeminiService() {
        return this.geminiService;
    }
}