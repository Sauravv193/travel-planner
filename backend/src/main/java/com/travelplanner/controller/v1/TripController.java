package com.travelplanner.controller.v1;

import com.travelplanner.dto.request.TripRequest;
import com.travelplanner.dto.response.PageResponse;
import com.travelplanner.dto.response.TripResponse;
import com.travelplanner.mapper.TripMapper;
import com.travelplanner.model.Trip;
import com.travelplanner.security.services.UserDetailsImpl;
import com.travelplanner.service.TripService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/trips")
@Validated
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PostMapping
    public ResponseEntity<TripResponse> createTrip(@Valid @RequestBody TripRequest tripRequest, 
                                                   @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Trip trip = TripMapper.toEntity(tripRequest);
        Trip createdTrip = tripService.createTrip(trip, userDetails.getId());
        return ResponseEntity.ok(TripMapper.toResponse(createdTrip));
    }

    @GetMapping
    public ResponseEntity<List<TripResponse>> getUserTrips(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Trip> trips = tripService.getTripsForUser(userDetails.getId());
        List<TripResponse> tripResponses = trips.stream()
                .map(TripMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(tripResponses);
    }

    @GetMapping("/paginated")
    public ResponseEntity<PageResponse<TripResponse>> getUserTripsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "asc") String direction,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        Page<Trip> tripsPage = tripService.getTripsForUserPaginated(
            userDetails.getId(), page, size, sort, direction);
        
        List<TripResponse> tripResponses = tripsPage.getContent().stream()
                .map(TripMapper::toResponse)
                .collect(Collectors.toList());
        
        PageResponse<TripResponse> response = new PageResponse<>(
            tripResponses,
            tripsPage.getNumber(),
            tripsPage.getSize(),
            tripsPage.getTotalElements()
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TripResponse> getTripById(@PathVariable(value = "id") Long tripId, 
                                                    @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return tripService.getTripById(tripId, userDetails.getId())
                .map(TripMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TripResponse> updateTrip(@PathVariable(value = "id") Long tripId,
                                                   @Valid @RequestBody TripRequest tripRequest, 
                                                   @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Trip tripDetails = TripMapper.toEntity(tripRequest);
        Trip updatedTrip = tripService.updateTrip(tripId, tripDetails, userDetails.getId());
        return ResponseEntity.ok(TripMapper.toResponse(updatedTrip));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable(value = "id") Long tripId, 
                                          @AuthenticationPrincipal UserDetailsImpl userDetails) {
        tripService.deleteTrip(tripId, userDetails.getId());
        return ResponseEntity.noContent().build();
    }

}
