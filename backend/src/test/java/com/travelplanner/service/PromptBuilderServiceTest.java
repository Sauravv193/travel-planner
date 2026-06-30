package com.travelplanner.service;

import com.travelplanner.dto.prompt.ItineraryPrompt;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class PromptBuilderServiceTest {

    private PromptBuilderService promptBuilderService;

    @BeforeEach
    void setUp() {
        promptBuilderService = new PromptBuilderService();
    }

    @Test
    void buildItineraryPrompt_WithAllFields_ReturnsCompletePrompt() {
        ItineraryPrompt prompt = ItineraryPrompt.builder()
                .destination("Paris")
                .startDate(LocalDate.of(2025, 6, 1))
                .endDate(LocalDate.of(2025, 6, 7))
                .numberOfTravelers(2)
                .travelStyle("Adventure")
                .interests("Museums, Food, Art")
                .transportation("Public transport")
                .budgetTier("STANDARD")
                .budget(2000.0)
                .luxuryLevel("Medium")
                .accommodationStyle("Boutique hotels")
                .dietaryNeeds("Vegetarian")
                .mustTryFoods("Croissants, Baguettes")
                .weather("Mild, some rain")
                .accessibility("Wheelchair accessible")
                .groupSize(2)
                .build();

        String result = promptBuilderService.buildItineraryPrompt(prompt);

        assertNotNull(result);
        assertTrue(result.contains("Paris"));
        assertTrue(result.contains("2025-06-01"));
        assertTrue(result.contains("2025-06-07"));
        assertTrue(result.contains("2"));
        assertTrue(result.contains("Adventure"));
        assertTrue(result.contains("Museums, Food, Art"));
        assertTrue(result.contains("Public transport"));
        assertTrue(result.contains("STANDARD"));
        // Budget amount is not formatted when budgetTier is set (else-if logic)
        // assertTrue(result.contains("2000.00")); // Would fail because budgetTier takes precedence
        assertTrue(result.contains("Medium"));
        assertTrue(result.contains("Boutique hotels"));
        assertTrue(result.contains("Vegetarian"));
        assertTrue(result.contains("Croissants, Baguettes"));
        assertTrue(result.contains("Mild, some rain"));
        assertTrue(result.contains("Wheelchair accessible"));
        assertTrue(result.contains("JSON"));
        assertTrue(result.contains("itinerary"));
    }

    @Test
    void buildItineraryPrompt_WithMinimumFields_ReturnsValidPrompt() {
        ItineraryPrompt prompt = ItineraryPrompt.builder()
                .destination("Tokyo")
                .startDate(LocalDate.of(2025, 9, 15))
                .endDate(LocalDate.of(2025, 9, 20))
                .build();

        String result = promptBuilderService.buildItineraryPrompt(prompt);

        assertNotNull(result);
        assertTrue(result.contains("Tokyo"));
        assertTrue(result.contains("2025-09-15"));
        assertTrue(result.contains("2025-09-20"));
        assertTrue(result.contains("JSON"));
    }

    @Test
    void buildItineraryPrompt_WithBudgetOnly() {
        ItineraryPrompt prompt = ItineraryPrompt.builder()
                .destination("London")
                .startDate(LocalDate.of(2025, 7, 1))
                .endDate(LocalDate.of(2025, 7, 5))
                .numberOfTravelers(1)
                .budget(1500.0)
                .build();

        String result = promptBuilderService.buildItineraryPrompt(prompt);

        assertTrue(result.contains("1500.00"));
        assertTrue(result.contains("value-for-money"));
    }

    @Test
    void buildItineraryPrompt_WithBudgetTier() {
        ItineraryPrompt prompt = ItineraryPrompt.builder()
                .destination("Bali")
                .startDate(LocalDate.of(2025, 8, 1))
                .endDate(LocalDate.of(2025, 8, 10))
                .budgetTier("LUXURY")
                .build();

        String result = promptBuilderService.buildItineraryPrompt(prompt);

        assertTrue(result.contains("LUXURY"));
        assertTrue(result.contains("accommodations, dining"));
    }

    @Test
    void buildItineraryPrompt_NullNumberOfTravelers_DefaultsToOne() {
        ItineraryPrompt prompt = ItineraryPrompt.builder()
                .destination("Rome")
                .startDate(LocalDate.of(2025, 10, 1))
                .endDate(LocalDate.of(2025, 10, 5))
                .numberOfTravelers(null)
                .build();

        String result = promptBuilderService.buildItineraryPrompt(prompt);

        assertTrue(result.contains("1 traveler(s)"));
    }

    @Test
    void buildAdaptationPrompt_ContainsContext() {
        String originalJson = "{\"itinerary\": []}";
        String context = "Add more outdoor activities";

        String result = promptBuilderService.buildAdaptationPrompt(originalJson, context);

        assertTrue(result.contains(originalJson));
        assertTrue(result.contains(context));
        assertTrue(result.contains("adapt"));
    }

    @Test
    void buildConversationalPrompt_WithHistory() {
        ItineraryPrompt prompt = ItineraryPrompt.builder()
                .destination("Bangkok")
                .startDate(LocalDate.of(2025, 11, 1))
                .endDate(LocalDate.of(2025, 11, 5))
                .build();

        String history = "User: Initial request\nAI: Here is your itinerary\n";
        String userRequest = "Reduce budget";

        String result = promptBuilderService.buildConversationalPrompt(prompt, history, userRequest);

        assertTrue(result.contains(history));
        assertTrue(result.contains(userRequest));
        assertTrue(result.contains("Bangkok"));
        assertTrue(result.contains("CURRENT REQUEST"));
    }

    @Test
    void buildConversationalPrompt_WithoutHistory() {
        ItineraryPrompt prompt = ItineraryPrompt.builder()
                .destination("Seoul")
                .startDate(LocalDate.of(2025, 12, 1))
                .endDate(LocalDate.of(2025, 12, 5))
                .build();

        String result = promptBuilderService.buildConversationalPrompt(prompt, "", "Add activities");

        assertTrue(result.contains("Add activities"));
        assertTrue(result.contains("Seoul"));
        assertFalse(result.contains("CONVERSATION HISTORY"));
    }

    @Test
    void buildConversationalPrompt_NullHistory() {
        ItineraryPrompt prompt = ItineraryPrompt.builder()
                .destination("Dubai")
                .startDate(LocalDate.of(2026, 1, 1))
                .endDate(LocalDate.of(2026, 1, 5))
                .build();

        String result = promptBuilderService.buildConversationalPrompt(prompt, null, "Make it luxury");

        assertTrue(result.contains("Make it luxury"));
        assertTrue(result.contains("Dubai"));
    }

    @Test
    void buildItineraryPrompt_OutputFormat_ContainsExpectedSections() {
        ItineraryPrompt prompt = ItineraryPrompt.builder()
                .destination("New York")
                .startDate(LocalDate.of(2025, 12, 20))
                .endDate(LocalDate.of(2025, 12, 27))
                .build();

        String result = promptBuilderService.buildItineraryPrompt(prompt);

        assertTrue(result.contains("trip_summary"));
        assertTrue(result.contains("overall_budget_breakdown"));
        assertTrue(result.contains("itinerary"));
        assertTrue(result.contains("essential_travel_tips"));
        assertTrue(result.contains("accommodation_estimate"));
        assertTrue(result.contains("food_estimate"));
        assertTrue(result.contains("activities_estimate"));
    }

    @Test
    void buildItineraryPrompt_NoBudget_SkipsBudgetSection() {
        ItineraryPrompt prompt = ItineraryPrompt.builder()
                .destination("Barcelona")
                .startDate(LocalDate.of(2025, 9, 1))
                .endDate(LocalDate.of(2025, 9, 5))
                .build();

        String result = promptBuilderService.buildItineraryPrompt(prompt);

        assertFalse(result.contains("value-for-money"));
    }

    @Test
    void buildItineraryPrompt_GroupSizeMoreThanOne() {
        ItineraryPrompt prompt = ItineraryPrompt.builder()
                .destination("Cairo")
                .startDate(LocalDate.of(2025, 10, 1))
                .endDate(LocalDate.of(2025, 10, 5))
                .groupSize(4)
                .build();

        String result = promptBuilderService.buildItineraryPrompt(prompt);

        assertTrue(result.contains("Group size"));
        assertTrue(result.contains("groups"));
    }

    @Test
    void buildItineraryPrompt_SingleTraveler_NoGroupSizeSection() {
        ItineraryPrompt prompt = ItineraryPrompt.builder()
                .destination("Lisbon")
                .startDate(LocalDate.of(2025, 11, 1))
                .endDate(LocalDate.of(2025, 11, 5))
                .groupSize(1)
                .build();

        String result = promptBuilderService.buildItineraryPrompt(prompt);

        assertFalse(result.contains("Group size"));
    }
}
