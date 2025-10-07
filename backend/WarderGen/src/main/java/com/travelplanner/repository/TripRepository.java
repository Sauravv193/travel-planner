package com.travelplanner.repository;

import com.travelplanner.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    @Query("SELECT t FROM Trip t LEFT JOIN FETCH t.itinerary WHERE t.user.id = :userId")
    List<Trip> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT t FROM Trip t LEFT JOIN FETCH t.itinerary WHERE t.id = :tripId")
    Optional<Trip> findByIdWithItinerary(@Param("tripId") Long tripId);
}
