package com.travelplanner.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

public class TripResponse {
    
    private Long id;
    private String destination;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date startDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date endDate;
    
    private Double budget;
    private String interests;
    private Integer numberOfTravelers;
    private String accommodationStyle;
    private String budgetTier;
    private String travelStyle;
    private String dietaryNeeds;
    private String mustTryFoods;
    private Long userId;
    private String username;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}