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

        // --- OPTIMIZED AI PROMPT FOR BETTER RESPONSES ---
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append(String.format(
                "You are a world-class travel expert and local guide with deep knowledge of %s. Create an exceptional, highly detailed day-by-day travel itinerary from %s to %s. ",
                trip.getDestination(),
                trip.getStartDate().toString(),
                trip.getEndDate().toString()
        ));

        // Enhanced budget consideration
        if (trip.getBudget() != null) {
            promptBuilder.append(String.format("Budget: $%.2f - provide value-for-money recommendations across all price ranges, highlighting best deals and free attractions. ", trip.getBudget()));
        }

        // Enhanced interests integration
        if (StringUtils.hasText(trip.getInterests())) {
            promptBuilder.append(String.format("Traveler's interests: %s - prioritize these throughout the itinerary and suggest related hidden gems. ", trip.getInterests()));
        }

        promptBuilder.append(
                "REQUIREMENTS:\n" +
                "• Include EXACT names, addresses, and timing for all locations\n" +
                "• Add local insider tips and cultural insights\n" +
                "• Suggest optimal routes and transportation between locations\n" +
                "• Include meal recommendations with specific restaurant names\n" +
                "• Add estimated costs and booking requirements where relevant\n" +
                "• Consider weather, opening hours, and seasonal factors\n" +
                "• Include emergency contacts and practical travel tips\n\n" +
                "OUTPUT FORMAT: Return ONLY a clean JSON object with this exact structure:\n" +
                "{\n" +
                "  \"title\": \"Engaging trip title\",\n" +
                "  \"description\": \"Compelling 2-3 sentence overview\",\n" +
                "  \"totalDays\": number,\n" +
                "  \"tips\": [\"practical tip 1\", \"practical tip 2\"],\n" +
                "  \"days\": [\n" +
                "    {\n" +
                "      \"day\": 1,\n" +
                "      \"title\": \"Descriptive day theme\",\n" +
                "      \"overview\": \"Brief day summary\",\n" +
                "      \"activities\": [\n" +
                "        {\n" +
                "          \"time\": \"9:00 AM\",\n" +
                "          \"title\": \"Activity name\",\n" +
                "          \"location\": \"Exact address\",\n" +
                "          \"description\": \"Detailed description with insider tips\",\n" +
                "          \"duration\": \"2 hours\",\n" +
                "          \"cost\": \"$20-30\",\n" +
                "          \"tips\": [\"specific tip\"]\n" +
                "        }\n" +
                "      ]\n" +
                "    }\n" +
                "  ]\n" +
                "}\n\n" +
                "NO markdown, NO backticks, NO extra text - ONLY the JSON object."
        );

        String prompt = promptBuilder.toString();
        // --- END OF PROMPT BUILDING ---

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