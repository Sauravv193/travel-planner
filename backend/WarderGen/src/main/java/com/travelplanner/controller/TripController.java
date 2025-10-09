package com.travelplanner.controller;

import com.travelplanner.model.Trip;
import com.travelplanner.security.services.UserDetailsImpl;
import com.travelplanner.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@Validated
public class TripController {

    @Autowired
    private TripService tripService;

    @PostMapping
    public ResponseEntity<Trip> createTrip(@RequestBody Trip trip, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Trip createdTrip = tripService.createTrip(trip, userDetails.getId());
        return ResponseEntity.ok(createdTrip);
    }

    @GetMapping
    public ResponseEntity<List<Trip>> getUserTrips(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Trip> trips = tripService.getTripsForUser(userDetails.getId());
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable(value = "id") Long tripId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return tripService.getTripById(tripId, userDetails.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trip> updateTrip(@PathVariable(value = "id") Long tripId,
                                           @RequestBody Trip tripDetails, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            Trip updatedTrip = tripService.updateTrip(tripId, tripDetails, userDetails.getId());
            return ResponseEntity.ok(updatedTrip);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).build(); // Forbidden if user doesn't own trip
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable(value = "id") Long tripId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            tripService.deleteTrip(tripId, userDetails.getId());
            return ResponseEntity.noContent().build(); // 204 No Content is standard for successful delete
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).build();
        }
    }

}