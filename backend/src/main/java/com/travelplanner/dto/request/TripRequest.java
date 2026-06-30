package com.travelplanner.dto.request;

import jakarta.validation.constraints.*;
import java.util.Date;

public class TripRequest {
    
    @NotBlank(message = "Destination is required")
    @Size(min = 2, max = 100, message = "Destination must be between 2 and 100 characters")
    private String destination;
    
    @NotNull(message = "Start date is required")
    private Date startDate;
    
    @NotNull(message = "End date is required")
    private Date endDate;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Budget must be greater than 0")
    private Double budget;
    
    @Size(max = 500, message = "Interests must not exceed 500 characters")
    private String interests;
    
    @Min(value = 1, message = "Number of travelers must be at least 1")
    @Max(value = 50, message = "Number of travelers must not exceed 50")
    private Integer numberOfTravelers;
    
    @Size(max = 50, message = "Accommodation style must not exceed 50 characters")
    private String accommodationStyle;
    
    @Pattern(regexp = "BUDGET|STANDARD|LUXURY", message = "Budget tier must be BUDGET, STANDARD, or LUXURY")
    private String budgetTier;
    
    @Size(max = 50, message = "Travel style must not exceed 50 characters")
    private String travelStyle;
    
    @Size(max = 200, message = "Dietary needs must not exceed 200 characters")
    private String dietaryNeeds;
    
    @Size(max = 1000, message = "Must try foods must not exceed 1000 characters")
    private String mustTryFoods;

    // Getters and Setters
    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    public String getInterests() {
        return interests;
    }

    public void setInterests(String interests) {
        this.interests = interests;
    }

    public Integer getNumberOfTravelers() {
        return numberOfTravelers;
    }

    public void setNumberOfTravelers(Integer numberOfTravelers) {
        this.numberOfTravelers = numberOfTravelers;
    }

    public String getAccommodationStyle() {
        return accommodationStyle;
    }

    public void setAccommodationStyle(String accommodationStyle) {
        this.accommodationStyle = accommodationStyle;
    }

    public String getBudgetTier() {
        return budgetTier;
    }

    public void setBudgetTier(String budgetTier) {
        this.budgetTier = budgetTier;
    }

    public String getTravelStyle() {
        return travelStyle;
    }

    public void setTravelStyle(String travelStyle) {
        this.travelStyle = travelStyle;
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
}