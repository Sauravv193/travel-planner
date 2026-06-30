package com.travelplanner.repository;

import com.travelplanner.model.Trip;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long>, JpaSpecificationExecutor<Trip> {
    @Query("SELECT t FROM Trip t LEFT JOIN FETCH t.itinerary WHERE t.user.id = :userId AND t.deleted = false")
    List<Trip> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT t FROM Trip t LEFT JOIN FETCH t.itinerary WHERE t.id = :tripId AND t.deleted = false")
    Optional<Trip> findByIdWithItinerary(@Param("tripId") Long tripId);
    
    @Query("SELECT t FROM Trip t WHERE t.user.id = :userId AND t.deleted = false")
    Page<Trip> findByUserId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT t FROM Trip t WHERE t.destination LIKE %:destination% AND t.deleted = false")
    List<Trip> findByDestinationContainingIgnoreCase(@Param("destination") String destination);
    
    @Query("SELECT t FROM Trip t WHERE t.deleted = false ORDER BY t.createdAt DESC")
    List<Trip> findAllActiveByOrderByCreatedAtDesc();
    
    @Query("SELECT t FROM Trip t WHERE t.deleted = false")
    List<Trip> findAllActive();
}
