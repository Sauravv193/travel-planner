package com.travelplanner.repository;

import com.travelplanner.model.JournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {
    // Custom query to find all journal entries for a specific trip
    List<JournalEntry> findByTripId(Long tripId);
}