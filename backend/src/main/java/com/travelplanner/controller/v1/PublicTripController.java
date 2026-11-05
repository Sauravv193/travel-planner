package com.travelplanner.controller.v1;

import com.travelplanner.dto.response.ItineraryResponse;
import com.travelplanner.dto.response.PublicTripResponse;
import com.travelplanner.model.Trip;
import com.travelplanner.service.TripService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/public/trips")
public class PublicTripController {
    private final TripService tripService;

    public PublicTripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping("/{shareToken}")
    public ResponseEntity<PublicTripResponse> getSharedTrip(@PathVariable String shareToken) {
        return tripService.getSharedTrip(shareToken)
                .map(this::toPublicResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private PublicTripResponse toPublicResponse(Trip trip) {
        ItineraryResponse itinerary = trip.getItinerary() == null ? null
                : new ItineraryResponse(trip.getItinerary().getId(), trip.getItinerary().getContent());
        return new PublicTripResponse(
                trip.getDestination(), trip.getStartDate(), trip.getEndDate(),
                trip.getNumberOfTravelers(), trip.getTravelStyle(), itinerary);
    }
}
