package com.travelplanner.service;

import com.travelplanner.model.JournalEntry;
import com.travelplanner.model.Trip;
import com.travelplanner.repository.JournalEntryRepository;
import com.travelplanner.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class JournalService {

    @Autowired
    private JournalEntryRepository journalEntryRepository;

    @Autowired
    private TripRepository tripRepository;

    @Transactional
    public JournalEntry saveJournal(Long tripId, JournalEntry journalData, Long userId) {
        Trip trip = tripRepository.findById(tripId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Trip not found or user not authorized."));

        // Find existing journal for the trip, or create a new one.
        JournalEntry journal = journalEntryRepository.findByTripId(tripId)
                .stream()
                .findFirst()
                .orElse(new JournalEntry());

        journal.setTrip(trip);
        journal.setTitle(journalData.getTitle());
        journal.setContent(journalData.getContent()); // The full AI-generated JSON string

        return journalEntryRepository.save(journal);
    }

    @Transactional(readOnly = true)
    public Optional<JournalEntry> getJournalForTrip(Long tripId, Long userId) {
        return tripRepository.findById(tripId)
                .filter(t -> t.getUser().getId().equals(userId))
                .flatMap(trip -> journalEntryRepository.findByTripId(tripId).stream().findFirst());
    }

    @Transactional
    public void deleteJournal(Long tripId, Long userId) {
        Trip trip = tripRepository.findById(tripId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Trip not found or user not authorized."));

        // Find and delete the associated journal entry
        journalEntryRepository.findByTripId(trip.getId()).forEach(journalEntryRepository::delete);
    }
}