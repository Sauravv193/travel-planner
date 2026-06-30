package com.travelplanner.mapper;

import com.travelplanner.dto.request.TripRequest;
import com.travelplanner.dto.response.ItineraryResponse;
import com.travelplanner.dto.response.TripResponse;
import com.travelplanner.model.Trip;

public class TripMapper {
    
    public static Trip toEntity(TripRequest tripRequest) {
        Trip trip = new Trip();
        trip.setDestination(tripRequest.getDestination());
        trip.setStartDate(tripRequest.getStartDate());
        trip.setEndDate(tripRequest.getEndDate());
        trip.setBudget(tripRequest.getBudget());
        trip.setInterests(tripRequest.getInterests());
        trip.setNumberOfTravelers(tripRequest.getNumberOfTravelers());
        trip.setAccommodationStyle(tripRequest.getAccommodationStyle());
        trip.setBudgetTier(tripRequest.getBudgetTier());
        trip.setTravelStyle(tripRequest.getTravelStyle());
        trip.setDietaryNeeds(tripRequest.getDietaryNeeds());
        trip.setMustTryFoods(tripRequest.getMustTryFoods());
        return trip;
    }
    
    public static TripResponse toResponse(Trip trip) {
        TripResponse response = new TripResponse();
        response.setId(trip.getId());
        response.setDestination(trip.getDestination());
        response.setStartDate(trip.getStartDate());
        response.setEndDate(trip.getEndDate());
        response.setBudget(trip.getBudget());
        response.setInterests(trip.getInterests());
        response.setNumberOfTravelers(trip.getNumberOfTravelers());
        response.setAccommodationStyle(trip.getAccommodationStyle());
        response.setBudgetTier(trip.getBudgetTier());
        response.setTravelStyle(trip.getTravelStyle());
        response.setDietaryNeeds(trip.getDietaryNeeds());
        response.setMustTryFoods(trip.getMustTryFoods());
        if (trip.getUser() != null) {
            response.setUserId(trip.getUser().getId());
            response.setUsername(trip.getUser().getUsername());
        }
        // Map itinerary if present
        if (trip.getItinerary() != null) {
            response.setItinerary(new ItineraryResponse(
                trip.getItinerary().getId(),
                trip.getItinerary().getContent()
            ));
        }
        return response;
    }
    
    public static void updateEntityFromRequest(TripRequest tripRequest, Trip trip) {
        trip.setDestination(tripRequest.getDestination());
        trip.setStartDate(tripRequest.getStartDate());
        trip.setEndDate(tripRequest.getEndDate());
        trip.setBudget(tripRequest.getBudget());
        trip.setInterests(tripRequest.getInterests());
        trip.setNumberOfTravelers(tripRequest.getNumberOfTravelers());
        trip.setAccommodationStyle(tripRequest.getAccommodationStyle());
        trip.setBudgetTier(tripRequest.getBudgetTier());
        trip.setTravelStyle(tripRequest.getTravelStyle());
        trip.setDietaryNeeds(tripRequest.getDietaryNeeds());
        trip.setMustTryFoods(tripRequest.getMustTryFoods());
    }
}