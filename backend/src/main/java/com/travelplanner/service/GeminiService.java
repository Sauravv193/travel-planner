package com.travelplanner.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private static final String GEMINI_BASE_URL =
            "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=";

    /**
     * Call Gemini API with a text prompt using proper JSON serialization.
     */
    public String callGemini(String prompt) {
        if (geminiApiKey == null || geminiApiKey.isEmpty() || "YOUR_API_KEY".equals(geminiApiKey)) {
            logger.error("Gemini API key is not configured.");
            throw new RuntimeException("AI service is not configured.");
        }

        // Build proper JSON structure using Maps/Lists for ObjectMapper serialization
        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(Map.of("text", prompt)))
            )
        );

        return executeGeminiRequest(requestBody, "Gemini API call failed");
    }

    /**
     * Call Gemini API with a pre-built request body map (e.g. for images).
     */
    public String callGeminiWithImages(Map<String, Object> requestBody) {
        if (geminiApiKey == null || geminiApiKey.isEmpty() || "YOUR_API_KEY".equals(geminiApiKey)) {
            logger.error("Gemini API key is not configured.");
            throw new RuntimeException("AI service is not configured.");
        }

        return executeGeminiRequest(requestBody, "Gemini API journal call failed");
    }

    /**
     * Execute a POST request to the Gemini API and return the response body.
     */
    private String executeGeminiRequest(Map<String, Object> requestBody, String errorPrefix) {
        String apiUrl = GEMINI_BASE_URL + geminiApiKey;

        String requestBodyJson;
        try {
            requestBodyJson = objectMapper.writeValueAsString(requestBody);
        } catch (Exception e) {
            logger.error("Failed to serialize request body", e);
            throw new RuntimeException("Failed to serialize request body: " + e.getMessage(), e);
        }

        try {
            URI uri = new URI(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) uri.toURL().openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);
            conn.setConnectTimeout(30000);
            conn.setReadTimeout(60000);

            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = requestBodyJson.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int status = conn.getResponseCode();
            logger.info("Gemini API responded with status: {}", status);

            // Read response body
            StringBuilder response = new StringBuilder();
            String line;
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(
                            status >= 400 ? conn.getErrorStream() : conn.getInputStream(),
                            StandardCharsets.UTF_8))) {
                while ((line = br.readLine()) != null) {
                    response.append(line);
                }
            }

            if (status >= 400) {
                String errorBody = response.toString();
                logger.error("Gemini API error {}: {}", status, errorBody);
                throw new RuntimeException("Gemini API error (" + status + "): " + errorBody);
            }

            return response.toString();

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error calling Gemini API", e);
            throw new RuntimeException(errorPrefix + ": " + e.getClass().getSimpleName() + " - " + e.getMessage(), e);
        }
    }

    /**
     * List available Gemini models (GET request).
     */
    public String listModels() {
        String apiUrl = "https://generativelanguage.googleapis.com/v1/models?key=" + geminiApiKey;
        try {
            URI uri = new URI(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) uri.toURL().openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(10000);

            StringBuilder response = new StringBuilder();
            String line;
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
                while ((line = br.readLine()) != null) {
                    response.append(line);
                }
            }
            return response.toString();
        } catch (Exception e) {
            logger.error("Error listing Gemini models", e);
            return "{\"error\": \"Failed to retrieve models.\"}";
        }
    }
}
