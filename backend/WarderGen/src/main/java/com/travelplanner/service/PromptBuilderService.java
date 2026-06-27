package com.travelplanner.service;

import com.travelplanner.dto.prompt.ItineraryPrompt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * Prompt Builder Service
 * 
 * Constructs structured prompts for AI itinerary generation.
 * Replaces string concatenation with modular, type-safe prompt building.
 * 
 * Benefits:
 * - Type-safe prompt construction
 * - Modular prompt components
 * - Easy to test and maintain
 * - Reusable prompt sections
 * - Consistent prompt structure
 */
@Service
public class PromptBuilderService {

    private static final Logger logger = LoggerFactory.getLogger(PromptBuilderService.class);

    /**
     * Build a complete itinerary generation prompt
     */
    public String buildItineraryPrompt(ItineraryPrompt prompt) {
        StringBuilder promptBuilder = new StringBuilder();

        // 1. System role and context
        promptBuilder.append(buildSystemContext(prompt));

        // 2. Travel preferences
        promptBuilder.append(buildTravelPreferences(prompt));

        // 3. Budget considerations
        promptBuilder.append(buildBudgetSection(prompt));

        // 4. Accommodation and food
        promptBuilder.append(buildAccommodationAndFood(prompt));

        // 5. Special requirements
        promptBuilder.append(buildSpecialRequirements(prompt));

        // 6. Output format and requirements
        promptBuilder.append(buildOutputRequirements());

        String finalPrompt = promptBuilder.toString();
        logger.debug("Built prompt with length: {}", finalPrompt.length());
        
        return finalPrompt;
    }

    /**
     * Build system context and role definition
     */
    private String buildSystemContext(ItineraryPrompt prompt) {
        return String.format(
            "You are a world-class travel expert and local guide with deep knowledge of %s. " +
            "Create an exceptional, highly detailed day-by-day travel itinerary from %s to %s for %s traveler(s). ",
            prompt.getDestination(),
            prompt.getStartDate(),
            prompt.getEndDate(),
            prompt.getNumberOfTravelers() != null ? prompt.getNumberOfTravelers() : 1
        );
    }

    /**
     * Build travel preferences section
     */
    private String buildTravelPreferences(ItineraryPrompt prompt) {
        StringBuilder section = new StringBuilder();

        if (StringUtils.hasText(prompt.getTravelStyle())) {
            section.append(String.format("Travel style: %s - tailor the pace and activities accordingly. ", 
                prompt.getTravelStyle()));
        }

        if (StringUtils.hasText(prompt.getInterests())) {
            section.append(String.format("Primary interests: %s - prioritize these throughout the itinerary and suggest related hidden gems. ", 
                prompt.getInterests()));
        }

        if (StringUtils.hasText(prompt.getTransportation())) {
            section.append(String.format("Transportation preference: %s - plan routes accordingly. ", 
                prompt.getTransportation()));
        }

        return section.toString();
    }

    /**
     * Build budget section
     */
    private String buildBudgetSection(ItineraryPrompt prompt) {
        if (!StringUtils.hasText(prompt.getBudgetTier()) && prompt.getBudget() == null) {
            return "";
        }

        StringBuilder section = new StringBuilder();

        if (StringUtils.hasText(prompt.getBudgetTier())) {
            section.append(String.format("Budget tier: %s - recommend appropriate accommodations, dining, and activities within this range. ", 
                prompt.getBudgetTier()));
        } else if (prompt.getBudget() != null) {
            section.append(String.format("Budget: $%.2f - provide value-for-money recommendations across all price ranges, highlighting best deals and free attractions. ", 
                prompt.getBudget()));
        }

        if (StringUtils.hasText(prompt.getLuxuryLevel())) {
            section.append(String.format("Luxury level: %s - adjust recommendations accordingly. ", 
                prompt.getLuxuryLevel()));
        }

        return section.toString();
    }

    /**
     * Build accommodation and food section
     */
    private String buildAccommodationAndFood(ItineraryPrompt prompt) {
        StringBuilder section = new StringBuilder();

        if (StringUtils.hasText(prompt.getAccommodationStyle())) {
            section.append(String.format("Accommodation preference: %s - suggest suitable lodging options. ", 
                prompt.getAccommodationStyle()));
        }

        if (StringUtils.hasText(prompt.getDietaryNeeds())) {
            section.append(String.format("Dietary requirements: %s - ensure all food recommendations accommodate these needs. ", 
                prompt.getDietaryNeeds()));
        }

        if (StringUtils.hasText(prompt.getMustTryFoods())) {
            section.append(String.format("Must-try local foods: %s - incorporate these authentic local dishes and suggest the best places to try them. ", 
                prompt.getMustTryFoods()));
        }

        return section.toString();
    }

    /**
     * Build special requirements section
     */
    private String buildSpecialRequirements(ItineraryPrompt prompt) {
        StringBuilder section = new StringBuilder();

        if (StringUtils.hasText(prompt.getWeather())) {
            section.append(String.format("Weather conditions: %s - plan indoor/outdoor activities accordingly. ", 
                prompt.getWeather()));
        }

        if (StringUtils.hasText(prompt.getAccessibility())) {
            section.append(String.format("Accessibility needs: %s - ensure all locations are accessible. ", 
                prompt.getAccessibility()));
        }

        if (prompt.getGroupSize() != null && prompt.getGroupSize() > 1) {
            section.append(String.format("Group size: %s - plan activities suitable for groups. ", 
                prompt.getGroupSize()));
        }

        return section.toString();
    }

    /**
     * Build output format and requirements
     */
    private String buildOutputRequirements() {
        return "REQUIREMENTS:\n" +
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
            "NO markdown, NO backticks, NO extra text - ONLY the JSON object.";
    }

    /**
     * Build adaptation prompt for modifying existing itinerary
     */
    public String buildAdaptationPrompt(String originalItineraryJson, String adaptationContext) {
        return String.format(
            "You are an expert local tour guide. A traveler's plan needs to be adapted. " +
            "Here is their original itinerary JSON: %s. " +
            "Now, please adapt this plan based on the following new context: '%s'. " +
            "Provide the full, updated itinerary. The response MUST be a clean JSON object with the same structure.",
            originalItineraryJson,
            adaptationContext
        );
    }

    /**
     * Build conversational prompt with conversation history
     * 
     * Includes previous conversation context to enable multi-turn refinements.
     */
    public String buildConversationalPrompt(ItineraryPrompt prompt, String conversationHistory, String userRequest) {
        StringBuilder promptBuilder = new StringBuilder();

        // Add conversation history if available
        if (conversationHistory != null && !conversationHistory.isEmpty()) {
            promptBuilder.append(conversationHistory).append("\n\n");
        }

        // Add current request
        promptBuilder.append("CURRENT REQUEST: ").append(userRequest).append("\n\n");

        // Add the standard prompt structure
        promptBuilder.append(buildSystemContext(prompt));
        promptBuilder.append(buildTravelPreferences(prompt));
        promptBuilder.append(buildBudgetSection(prompt));
        promptBuilder.append(buildAccommodationAndFood(prompt));
        promptBuilder.append(buildSpecialRequirements(prompt));
        promptBuilder.append(buildOutputRequirements());

        return promptBuilder.toString();
    }
}
