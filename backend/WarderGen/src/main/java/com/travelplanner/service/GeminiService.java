package com.travelplanner.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    // --- FINAL UPDATE: Using the correct model name from your list ---
    private static final String GEMINI_GENERATE_URL =
            "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=";

    // URL to list available models (can be removed later)
    private static final String GEMINI_LIST_MODELS_URL =
            "https://generativelanguage.googleapis.com/v1/models?key=";


    public String callGemini(String prompt) {
        if (geminiApiKey == null || geminiApiKey.isEmpty() || "YOUR_API_KEY".equals(geminiApiKey)) {
            logger.error("Gemini API key is not configured. Please set 'gemini.api.key' in your application.properties.");
            throw new RuntimeException("AI service is not configured.");
        }

        RestTemplate restTemplate = new RestTemplate();
        String apiUrl = GEMINI_GENERATE_URL + geminiApiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", Collections.singletonList(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", Collections.singletonList(content));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            return restTemplate.postForObject(apiUrl, entity, String.class);
        } catch (HttpClientErrorException e) {
            logger.error("Error from Gemini API: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to call AI service due to a client error.", e);
        } catch (Exception e) {
            logger.error("An unexpected error occurred while calling the Gemini API", e);
            throw new RuntimeException("An unexpected error occurred with the AI service.", e);
        }
    }

    public String callGeminiWithImages(Map<String, Object> requestBody) {
        if (geminiApiKey == null || geminiApiKey.isEmpty() || "YOUR_API_KEY".equals(geminiApiKey)) {
            logger.error("Gemini API key is not configured. Please set 'gemini.api.key' in your application.properties.");
            throw new RuntimeException("AI service is not configured.");
        }

        RestTemplate restTemplate = new RestTemplate();
        // Use gemini-1.5-flash for better image processing
        String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("User-Agent", "Travel-Planner/1.0");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            return restTemplate.postForObject(apiUrl, entity, String.class);
        } catch (HttpClientErrorException e) {
            logger.error("Error from Gemini API: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to generate journal: " + e.getStatusCode() + " - " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            logger.error("An unexpected error occurred while calling the Gemini API for journal generation", e);
            throw new RuntimeException("An unexpected error occurred with the AI service.", e);
        }
    }

    /**
     * This method calls the Gemini API to get a list of all available models.
     */
    public String listModels() {
        RestTemplate restTemplate = new RestTemplate();
        String apiUrl = GEMINI_LIST_MODELS_URL + geminiApiKey;
        try {
            return restTemplate.getForObject(apiUrl, String.class);
        } catch (Exception e) {
            logger.error("An unexpected error occurred while listing the Gemini models", e);
            return "{\"error\": \"Failed to retrieve models.\"}";
        }
    }
}