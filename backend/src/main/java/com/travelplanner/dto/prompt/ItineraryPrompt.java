package com.travelplanner.dto.prompt;

import org.springframework.util.StringUtils;

import java.time.LocalDate;

/**
 * Itinerary Prompt DTO
 * 
 * Encapsulates all parameters needed for AI itinerary generation.
 * Provides type-safe prompt construction instead of string concatenation.
 */
public class ItineraryPrompt {
    
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer numberOfTravelers;
    private String travelStyle;
    private String interests;
    private String budgetTier;
    private Double budget;
    private String accommodationStyle;
    private String dietaryNeeds;
    private String mustTryFoods;
    private String transportation;
    private String weather;
    private String accessibility;
    private Integer groupSize;
    private String luxuryLevel;

    // Builder pattern for fluent API
    public static Builder builder() {
        return new Builder();
    }

    // Getters and Setters
    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getNumberOfTravelers() {
        return numberOfTravelers;
    }

    public void setNumberOfTravelers(Integer numberOfTravelers) {
        this.numberOfTravelers = numberOfTravelers;
    }

    public String getTravelStyle() {
        return travelStyle;
    }

    public void setTravelStyle(String travelStyle) {
        this.travelStyle = travelStyle;
    }

    public String getInterests() {
        return interests;
    }

    public void setInterests(String interests) {
        this.interests = interests;
    }

    public String getBudgetTier() {
        return budgetTier;
    }

    public void setBudgetTier(String budgetTier) {
        this.budgetTier = budgetTier;
    }

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    public String getAccommodationStyle() {
        return accommodationStyle;
    }

    public void setAccommodationStyle(String accommodationStyle) {
        this.accommodationStyle = accommodationStyle;
    }

    public String getDietaryNeeds() {
        return dietaryNeeds;
    }

    public void setDietaryNeeds(String dietaryNeeds) {
        this.dietaryNeeds = dietaryNeeds;
    }

    public String getMustTryFoods() {
        return mustTryFoods;
    }

    public void setMustTryFoods(String mustTryFoods) {
        this.mustTryFoods = mustTryFoods;
    }

    public String getTransportation() {
        return transportation;
    }

    public void setTransportation(String transportation) {
        this.transportation = transportation;
    }

    public String getWeather() {
        return weather;
    }

    public void setWeather(String weather) {
        this.weather = weather;
    }

    public String getAccessibility() {
        return accessibility;
    }

    public void setAccessibility(String accessibility) {
        this.accessibility = accessibility;
    }

    public Integer getGroupSize() {
        return groupSize;
    }

    public void setGroupSize(Integer groupSize) {
        this.groupSize = groupSize;
    }

    public String getLuxuryLevel() {
        return luxuryLevel;
    }

    public void setLuxuryLevel(String luxuryLevel) {
        this.luxuryLevel = luxuryLevel;
    }

    /**
     * Validate required fields
     * @throws IllegalArgumentException if required fields are missing
     */
    public void validate() {
        if (!StringUtils.hasText(destination)) {
            throw new IllegalArgumentException("Destination is required");
        }
        if (startDate == null) {
            throw new IllegalArgumentException("Start date is required");
        }
        if (endDate == null) {
            throw new IllegalArgumentException("End date is required");
        }
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date must be after start date");
        }
        if (numberOfTravelers != null && numberOfTravelers < 1) {
            throw new IllegalArgumentException("Number of travelers must be at least 1");
        }
        if (budget != null && budget < 0) {
            throw new IllegalArgumentException("Budget cannot be negative");
        }
    }

    public static class Builder {
        private ItineraryPrompt prompt = new ItineraryPrompt();

        public Builder destination(String destination) {
            prompt.destination = destination;
            return this;
        }

        public Builder startDate(LocalDate startDate) {
            prompt.startDate = startDate;
            return this;
        }

        public Builder endDate(LocalDate endDate) {
            prompt.endDate = endDate;
            return this;
        }

        public Builder numberOfTravelers(Integer numberOfTravelers) {
            prompt.numberOfTravelers = numberOfTravelers;
            return this;
        }

        public Builder travelStyle(String travelStyle) {
            prompt.travelStyle = travelStyle;
            return this;
        }

        public Builder interests(String interests) {
            prompt.interests = interests;
            return this;
        }

        public Builder budgetTier(String budgetTier) {
            prompt.budgetTier = budgetTier;
            return this;
        }

        public Builder budget(Double budget) {
            prompt.budget = budget;
            return this;
        }

        public Builder accommodationStyle(String accommodationStyle) {
            prompt.accommodationStyle = accommodationStyle;
            return this;
        }

        public Builder dietaryNeeds(String dietaryNeeds) {
            prompt.dietaryNeeds = dietaryNeeds;
            return this;
        }

        public Builder mustTryFoods(String mustTryFoods) {
            prompt.mustTryFoods = mustTryFoods;
            return this;
        }

        public Builder transportation(String transportation) {
            prompt.transportation = transportation;
            return this;
        }

        public Builder weather(String weather) {
            prompt.weather = weather;
            return this;
        }

        public Builder accessibility(String accessibility) {
            prompt.accessibility = accessibility;
            return this;
        }

        public Builder groupSize(Integer groupSize) {
            prompt.groupSize = groupSize;
            return this;
        }

        public Builder luxuryLevel(String luxuryLevel) {
            prompt.luxuryLevel = luxuryLevel;
            return this;
        }

        public ItineraryPrompt build() {
            return prompt;
        }
    }
}
