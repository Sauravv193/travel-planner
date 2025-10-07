package com.travelplanner.controller;

import com.travelplanner.model.JournalEntry;
import com.travelplanner.security.services.UserDetailsImpl;
import com.travelplanner.service.JournalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/journal")
public class JournalController {

    @Autowired
    private JournalService journalService;

    // POST/PUT: Creates a new journal or updates an existing one for a trip
    @PostMapping("/{tripId}")
    public ResponseEntity<JournalEntry> saveJournal(@PathVariable Long tripId, @RequestBody JournalEntry journalData, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            JournalEntry savedJournal = journalService.saveJournal(tripId, journalData, userDetails.getId());
            return ResponseEntity.ok(savedJournal);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    // GET: Fetches the journal for a specific trip
    @GetMapping("/{tripId}")
    public ResponseEntity<JournalEntry> getJournalForTrip(@PathVariable Long tripId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return journalService.getJournalForTrip(tripId, userDetails.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE: Deletes the journal for a specific trip
    @DeleteMapping("/{tripId}")
    public ResponseEntity<Void> deleteJournal(@PathVariable Long tripId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            journalService.deleteJournal(tripId, userDetails.getId());
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}