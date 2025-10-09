package com.travelplanner.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelplanner.model.JournalEntry;
import com.travelplanner.model.Photo;
import com.travelplanner.model.Trip;
import com.travelplanner.repository.JournalEntryRepository;
import com.travelplanner.repository.PhotoRepository;
import com.travelplanner.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.Base64;

@Service
public class JournalService {

    @Autowired
    private JournalEntryRepository journalEntryRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private PhotoRepository photoRepository;

    @Autowired
    private GeminiService geminiService;

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

    @Transactional
    public JournalEntry generateJournalFromPhotos(Long tripId, Long userId) throws IOException {
        // Verify user owns the trip
        Trip trip = tripRepository.findById(tripId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Trip not found or user not authorized."));

        // Get photos for the trip
        List<Photo> photos = photoRepository.findByTripId(tripId);
        if (photos.isEmpty()) {
            throw new RuntimeException("Please upload at least one photo to generate a journal.");
        }

        // Format dates
        java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("MMMM d, yyyy");
        String startDate = formatter.format(trip.getStartDate());
        String endDate = formatter.format(trip.getEndDate());

        // Create prompt
        String prompt = String.format(
            "You are a travel blogger. A user went to %s from %s to %s. " +
            "Analyze these photos to identify locations and activities. " +
            "Write a creative journal for their trip within this date range. " +
            "The response MUST be a valid JSON object with a 'title', a 'summary', " +
            "and an 'entries' array. Each entry must have a 'date' and a 'content' field. " +
            "Do not wrap the JSON in markdown backticks.",
            trip.getDestination(), startDate, endDate
        );

        // Prepare request with photos
        Map<String, Object> requestBody = createGeminiRequestWithPhotos(prompt, photos);
        
        // Call Gemini API
        String response = geminiService.callGeminiWithImages(requestBody);
        
        // Parse response
        String journalJson = extractJsonFromGeminiResponse(response);
        
        // Validate JSON structure
        ObjectMapper mapper = new ObjectMapper();
        JsonNode journalNode = mapper.readTree(journalJson);
        
        if (!journalNode.has("title") || !journalNode.has("summary") || !journalNode.has("entries")) {
            throw new RuntimeException("Generated journal has invalid format. Please try again.");
        }

        // Save journal
        JournalEntry journal = journalEntryRepository.findByTripId(tripId)
                .stream()
                .findFirst()
                .orElse(new JournalEntry());

        journal.setTrip(trip);
        journal.setTitle(journalNode.get("title").asText());
        journal.setContent(journalJson);

        return journalEntryRepository.save(journal);
    }

    private Map<String, Object> createGeminiRequestWithPhotos(String prompt, List<Photo> photos) throws IOException {
        List<Map<String, Object>> parts = new ArrayList<>();
        
        // Add text prompt
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);
        parts.add(textPart);
        
        // Add image parts
        for (Photo photo : photos) {
            try {
                Path filePath = Paths.get(photo.getFilePath());
                byte[] imageBytes = Files.readAllBytes(filePath);
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                
                Map<String, Object> inlineData = new HashMap<>();
                inlineData.put("mimeType", photo.getMimeType());
                inlineData.put("data", base64Image);
                
                Map<String, Object> imagePart = new HashMap<>();
                imagePart.put("inlineData", inlineData);
                parts.add(imagePart);
            } catch (IOException e) {
                // Log the error but continue with other photos
                System.err.println("Failed to process photo: " + photo.getOriginalName());
            }
        }
        
        Map<String, Object> content = new HashMap<>();
        content.put("parts", parts);
        
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", Collections.singletonList(content));
        
        return requestBody;
    }

    private String extractJsonFromGeminiResponse(String response) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode responseNode = mapper.readTree(response);
        
        if (!responseNode.has("candidates") || responseNode.get("candidates").isEmpty()) {
            throw new RuntimeException("Invalid response from AI service. Please try again.");
        }
        
        JsonNode candidate = responseNode.get("candidates").get(0);
        if (!candidate.has("content") || !candidate.get("content").has("parts")) {
            throw new RuntimeException("Invalid response structure from AI service.");
        }
        
        String journalContentText = candidate.get("content").get("parts").get(0).get("text").asText();
        
        // Extract JSON from response text
        String cleanJsonText = journalContentText.trim();
        int startIndex = cleanJsonText.indexOf('{');
        int endIndex = cleanJsonText.lastIndexOf('}');
        
        if (startIndex != -1 && endIndex != -1 && endIndex > startIndex) {
            cleanJsonText = cleanJsonText.substring(startIndex, endIndex + 1);
        }
        
        return cleanJsonText;
    }
}