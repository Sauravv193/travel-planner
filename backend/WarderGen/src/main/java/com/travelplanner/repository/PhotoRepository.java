package com.travelplanner.repository;

import com.travelplanner.model.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
    List<Photo> findByTripId(Long tripId);
    List<Photo> findByTripIdOrderByUploadTimeDesc(Long tripId);
    void deleteByTripId(Long tripId);
}
