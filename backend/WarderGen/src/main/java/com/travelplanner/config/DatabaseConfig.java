package com.travelplanner.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
@Profile("production")
public class DatabaseConfig {

    @Bean
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");
        
        if (databaseUrl == null || databaseUrl.trim().isEmpty()) {
            throw new RuntimeException("DATABASE_URL environment variable is required in production but was not found or empty");
        }
        
        if (databaseUrl.startsWith("postgresql://")) {
            try {
                URI dbUri = new URI(databaseUrl);
                
                if (dbUri.getUserInfo() == null) {
                    throw new RuntimeException("DATABASE_URL does not contain user credentials");
                }
                
                String[] userInfo = dbUri.getUserInfo().split(":");
                if (userInfo.length != 2) {
                    throw new RuntimeException("DATABASE_URL credentials format is invalid. Expected format: postgresql://username:password@host:port/database");
                }
                
                String username = userInfo[0];
                String password = userInfo[1];
                
                // Handle default PostgreSQL port if not specified
                int port = dbUri.getPort();
                if (port == -1) {
                    port = 5432; // Default PostgreSQL port
                }
                
                String dbUrl = "jdbc:postgresql://" + dbUri.getHost() + ':' + port + dbUri.getPath();
                
                // Add SSL mode if not already present in the URL
                if (!databaseUrl.contains("sslmode=")) {
                    dbUrl += "?sslmode=require";
                } else {
                    // Preserve existing query parameters
                    String query = dbUri.getQuery();
                    if (query != null && !query.isEmpty()) {
                        dbUrl += "?" + query;
                    }
                }
                
                return DataSourceBuilder
                    .create()
                    .url(dbUrl)
                    .username(username)
                    .password(password)
                    .driverClassName("org.postgresql.Driver")
                    .build();
            } catch (URISyntaxException e) {
                throw new RuntimeException("Invalid DATABASE_URL format: " + e.getMessage(), e);
            } catch (Exception e) {
                throw new RuntimeException("Failed to configure database connection: " + e.getMessage(), e);
            }
        }
        
        // If URL doesn't start with postgresql://, it might be a JDBC URL already
        if (databaseUrl.startsWith("jdbc:postgresql://")) {
            return DataSourceBuilder
                .create()
                .url(databaseUrl)
                .driverClassName("org.postgresql.Driver")
                .build();
        }
        
        throw new RuntimeException("DATABASE_URL format not supported. Expected 'postgresql://' or 'jdbc:postgresql://' but got: " + databaseUrl.substring(0, Math.min(50, databaseUrl.length())));
    }
}