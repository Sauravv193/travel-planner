package com.travelplanner.service;

import com.travelplanner.model.Itinerary;
import com.travelplanner.model.Trip;
import com.travelplanner.repository.ItineraryRepository;
import com.travelplanner.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

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

    public Itinerary generateItinerary(Long tripId, Long userId) {
        Trip trip = tripRepository.findById(tripId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Error: Trip not found or user not authorized."));

        StringBuilder promptBuilder = new StringBuilder();
        
        // Main context
        promptBuilder.append(String.format(
                "You are a world-class travel expert and local guide with deep knowledge of %s. Create an exceptional, highly detailed day-by-day travel itinerary from %s to %s for %s traveler(s). ",
                trip.getDestination(),
                trip.getStartDate().toString(),
                trip.getEndDate().toString(),
                trip.getNumberOfTravelers() != null ? trip.getNumberOfTravelers() : 1
        ));
        
        // Travel style and preferences
        if (StringUtils.hasText(trip.getTravelStyle())) {
            promptBuilder.append(String.format("Travel style: %s - tailor the pace and activities accordingly. ", trip.getTravelStyle()));
        }
        
        // Enhanced interests integration
        if (StringUtils.hasText(trip.getInterests())) {
            promptBuilder.append(String.format("Primary interests: %s - prioritize these throughout the itinerary and suggest related hidden gems. ", trip.getInterests()));
        }
        
        // Budget considerations
        if (StringUtils.hasText(trip.getBudgetTier())) {
            promptBuilder.append(String.format("Budget tier: %s - recommend appropriate accommodations, dining, and activities within this range. ", trip.getBudgetTier()));
        } else if (trip.getBudget() != null) {
            promptBuilder.append(String.format("Budget: $%.2f - provide value-for-money recommendations across all price ranges, highlighting best deals and free attractions. ", trip.getBudget()));
        }
        
        // Accommodation preferences
        if (StringUtils.hasText(trip.getAccommodationStyle())) {
            promptBuilder.append(String.format("Accommodation preference: %s - suggest suitable lodging options. ", trip.getAccommodationStyle()));
        }
        
        // Dietary needs and food preferences
        if (StringUtils.hasText(trip.getDietaryNeeds())) {
            promptBuilder.append(String.format("Dietary requirements: %s - ensure all food recommendations accommodate these needs. ", trip.getDietaryNeeds()));
        }
        
        if (StringUtils.hasText(trip.getMustTryFoods())) {
            promptBuilder.append(String.format("Must-try local foods: %s - incorporate these authentic local dishes and suggest the best places to try them. ", trip.getMustTryFoods()));
        }

        promptBuilder.append(
                "REQUIREMENTS:\n" +
                "• Include EXACT names, addresses, and timing for all locations\n" +
                "• Add local insider tips and cultural insights\n" +
                "• Suggest optimal routes and transportation between locations\n" +
                "• Include meal recommendations with specific restaurant names\n" +
                "• Add estimated costs and booking requirements where relevant\n" +
                "• Consider weather, opening hours, and seasonal factors\n" +
                "• Include comprehensive budget breakdown and travel tips\n\n" +
                "OUTPUT FORMAT: Return ONLY a clean JSON object with this exact structure:\n" +
                "{\n" +
                "  \"trip_summary\": \"Detailed 3-4 sentence description of the entire trip with highlights\",\n" +
                "  \"overall_budget_breakdown\": {\n" +
                "    \"accommodation_estimate\": \"₹XX,XXX for X nights (description)\",\n" +
                "    \"food_estimate\": \"₹XX,XXX for X travelers (description)\",\n" +
                "    \"activities_estimate\": \"₹XX,XXX covering all activities (description)\"\n" +
                "  },\n" +
                "  \"itinerary\": [\n" +
                "    {\n" +
                "      \"day\": 1,\n" +
                "      \"date\": \"2025-XX-XX\",\n" +
                "      \"theme\": \"Descriptive day theme\",\n" +
                "      \"daily_overview\": \"Detailed overview of what this day covers\",\n" +
                "      \"activities\": [\n" +
                "        {\n" +
                "          \"time_of_day\": \"Morning (9:00-12:00)\",\n" +
                "          \"travel_details\": \"From hotel, take taxi (20 min, approx. ₹200-300)\",\n" +
                "          \"description\": \"Comprehensive activity description with cultural context and insider information\",\n" +
                "          \"location_address\": \"Complete address with postal code and landmarks\",\n" +
                "          \"estimated_cost\": \"₹XXX per person for specific items\",\n" +
                "          \"booking_info\": \"How to book, advance requirements, contact details\",\n" +
                "          \"alternative_option\": \"Alternative activity or venue if main one is unavailable\"\n" +
                "        }\n" +
                "      ],\n" +
                "      \"food_suggestions\": {\n" +
                "        \"lunch\": {\n" +
                "          \"recommendation\": \"Restaurant name, location\",\n" +
                "          \"notes\": \"Description with specialties, dietary options, ratings\"\n" +
                "        },\n" +
                "        \"dinner\": {\n" +
                "          \"recommendation\": \"Restaurant name, location\",\n" +
                "          \"notes\": \"Description with specialties, dietary options, ratings\"\n" +
                "        }\n" +
                "      },\n" +
                "      \"practical_tips\": {\n" +
                "        \"transport_tip\": \"Best transportation options for this day\",\n" +
                "        \"cultural_etiquette\": \"Important cultural considerations and etiquette tips\"\n" +
                "      }\n" +
                "    }\n" +
                "  ],\n" +
                "  \"essential_travel_tips\": [\n" +
                "    \"Pack comfortable walking shoes and weather-appropriate clothing\",\n" +
                "    \"Keep copies of important documents and have emergency contacts handy\",\n" +
                "    \"Learn basic local phrases and carry local currency\",\n" +
                "    \"Respect local customs and dress codes at religious sites\",\n" +
                "    \"Stay hydrated and try local cuisine from recommended places only\"\n" +
                "  ]\n" +
                "}\n\n" +
                "NO markdown, NO backticks, NO extra text - ONLY the JSON object."
        );

        String prompt = promptBuilder.toString();

        String aiResponse = geminiService.callGemini(prompt);
        String cleanJsonResponse = extractJson(aiResponse);

        Itinerary itinerary = trip.getItinerary();
        if (itinerary == null) {
            itinerary = new Itinerary();
            itinerary.setTrip(trip);
            trip.setItinerary(itinerary); // Fix bidirectional relationship
        }
        itinerary.setContent(cleanJsonResponse);

        Itinerary savedItinerary = itineraryRepository.save(itinerary);
        // Also save the trip to ensure the relationship is persisted
        tripRepository.save(trip);
        return savedItinerary;
    }

    public Itinerary adaptItinerary(Long tripId, Long userId, String context) {
        Trip trip = tripRepository.findById(tripId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Error: Trip not found or user not authorized."));

        String originalItineraryContent = trip.getItinerary() != null ? trip.getItinerary().getContent() : "{}";

        String prompt = String.format(
                "You are an expert local tour guide. A traveler's plan needs to be adapted. " +
                        "Here is their original itinerary JSON: %s. " +
                        "Now, please adapt this plan based on the following new context: '%s'. " +
                        "Provide the full, updated itinerary. The response MUST be a clean JSON object with the same structure.",
                originalItineraryContent,
                context
        );

        String aiResponse = geminiService.callGemini(prompt);
        String cleanJsonResponse = extractJson(aiResponse);

        Itinerary itinerary = trip.getItinerary();
        itinerary.setContent(cleanJsonResponse);

        return itineraryRepository.save(itinerary);
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