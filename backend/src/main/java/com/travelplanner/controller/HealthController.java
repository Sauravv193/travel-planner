package com.travelplanner.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Autowired(required = false)
    private DataSource dataSource;

    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "UP");
            response.put("timestamp", LocalDateTime.now().toString());
            response.put("service", "Travel Planner Backend");
            response.put("version", "1.0.0");
            response.put("profile", activeProfile);
            
            // Database health check
            Map<String, String> dbHealth = new HashMap<>();
            if (dataSource != null) {
                try (Connection connection = dataSource.getConnection()) {
                    if (connection.isValid(5)) {
                        dbHealth.put("status", "UP");
                        dbHealth.put("database", connection.getMetaData().getDatabaseProductName());
                    } else {
                        dbHealth.put("status", "DOWN");
                        dbHealth.put("error", "Connection validation failed");
                    }
                } catch (Exception dbEx) {
                    dbHealth.put("status", "DOWN");
                    dbHealth.put("error", dbEx.getMessage());
                }
            } else {
                dbHealth.put("status", "NOT_CONFIGURED");
                dbHealth.put("error", "DataSource not available");
            }
            response.put("database", dbHealth);
            
            // Environment info
            Map<String, String> envInfo = new HashMap<>();
            envInfo.put("DATABASE_URL_SET", System.getenv("DATABASE_URL") != null ? "YES" : "NO");
            envInfo.put("JWT_SECRET_SET", System.getenv("JWT_SECRET") != null ? "YES" : "NO");
            envInfo.put("GEMINI_API_KEY_SET", System.getenv("GEMINI_API_KEY") != null ? "YES" : "NO");
            envInfo.put("PORT", System.getenv("PORT"));
            envInfo.put("BUILD", "2026-07-01-fdca330");
            response.put("environment", envInfo);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "ERROR");
            errorResponse.put("error", e.getMessage());
            errorResponse.put("stackTrace", e.getStackTrace());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * One-time schema migration endpoint.
     * Adds missing columns to trips and itineraries tables that were added to
     * JPA entities after the initial database creation (audit fields, soft delete,
     * version, etc.).
     */
    @GetMapping("/migrate")
    public ResponseEntity<Map<String, Object>> migrate() {
        Map<String, Object> result = new HashMap<>();
        List<String> executed = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        if (dataSource == null) {
            result.put("status", "ERROR");
            result.put("message", "No DataSource available");
            return ResponseEntity.status(500).body(result);
        }

        try (Connection conn = dataSource.getConnection(); Statement stmt = conn.createStatement()) {

            // Columns to add to trips table
            String[][] tripColumns = {
                {"version", "BIGINT"},
                {"created_at", "TIMESTAMP(6)"},
                {"updated_at", "TIMESTAMP(6)"},
                {"created_by", "BIGINT"},
                {"updated_by", "BIGINT"},
                {"deleted", "BOOLEAN NOT NULL DEFAULT false"},
                {"deleted_at", "TIMESTAMP(6)"},
                {"number_of_travelers", "INTEGER"},
                {"accommodation_style", "VARCHAR(50)"},
                {"budget_tier", "VARCHAR(255)"},
                {"travel_style", "VARCHAR(50)"},
                {"dietary_needs", "VARCHAR(200)"},
                {"must_try_foods", "TEXT"}
            };

            // Columns to add to itineraries table
            String[][] itineraryColumns = {
                {"version", "BIGINT"},
                {"created_at", "TIMESTAMP(6)"},
                {"updated_at", "TIMESTAMP(6)"},
                {"created_by", "BIGINT"},
                {"updated_by", "BIGINT"},
                {"deleted", "BOOLEAN NOT NULL DEFAULT false"},
                {"deleted_at", "TIMESTAMP(6)"}
            };

            // Run migration for trips
            for (String[] col : tripColumns) {
                try {
                    stmt.execute("ALTER TABLE trips ADD COLUMN IF NOT EXISTS " + col[0] + " " + col[1]);
                    executed.add("trips." + col[0]);
                } catch (Exception e) {
                    errors.add("trips." + col[0] + ": " + e.getMessage());
                }
            }

            // Run migration for itineraries
            for (String[] col : itineraryColumns) {
                try {
                    stmt.execute("ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS " + col[0] + " " + col[1]);
                    executed.add("itineraries." + col[0]);
                } catch (Exception e) {
                    errors.add("itineraries." + col[0] + ": " + e.getMessage());
                }
            }

            // Also add the created_at default for existing rows if it was just added as nullable
            try {
                stmt.execute("UPDATE trips SET created_at = NOW() WHERE created_at IS NULL");
                executed.add("trips.created_at default filled");
            } catch (Exception e) {
                errors.add("trips.created_at fill: " + e.getMessage());
            }
            try {
                stmt.execute("UPDATE itineraries SET created_at = NOW() WHERE created_at IS NULL");
                executed.add("itineraries.created_at default filled");
            } catch (Exception e) {
                errors.add("itineraries.created_at fill: " + e.getMessage());
            }

            // Set NOT NULL on created_at columns after filling defaults
            try {
                stmt.execute("ALTER TABLE trips ALTER COLUMN created_at SET NOT NULL");
                executed.add("trips.created_at SET NOT NULL");
            } catch (Exception e) {
                errors.add("trips.created_at SET NOT NULL: " + e.getMessage());
            }
            try {
                stmt.execute("ALTER TABLE itineraries ALTER COLUMN created_at SET NOT NULL");
                executed.add("itineraries.created_at SET NOT NULL");
            } catch (Exception e) {
                errors.add("itineraries.created_at SET NOT NULL: " + e.getMessage());
            }

            result.put("status", errors.isEmpty() ? "OK" : "PARTIAL");
            result.put("executed", executed);
            result.put("errors", errors);
            result.put("message", errors.isEmpty()
                ? "Migration completed successfully. All missing columns added."
                : "Migration completed with " + errors.size() + " errors (columns may already exist).");
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            result.put("status", "ERROR");
            result.put("message", "Migration failed: " + e.getMessage());
            result.put("executed", executed);
            result.put("errors", errors);
            return ResponseEntity.status(500).body(result);
        }
    }

    // Simple diagnostic endpoint
    @GetMapping("/status")
    public ResponseEntity<Map<String, String>> status() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("service", "Travel Planner Backend");
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
}
