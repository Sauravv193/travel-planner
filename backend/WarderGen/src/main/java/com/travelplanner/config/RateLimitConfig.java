package com.travelplanner.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitConfig {
    
    @Value("${rate.limit.standard.capacity:100}")
    private int standardCapacity;
    
    @Value("${rate.limit.standard.refill-duration:1}")
    private int standardRefillDuration;
    
    @Value("${rate.limit.strict.capacity:20}")
    private int strictCapacity;
    
    @Value("${rate.limit.strict.refill-duration:1}")
    private int strictRefillDuration;

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    public Bucket resolveBucket(String key) {
        return cache.computeIfAbsent(key, k -> createNewBucket());
    }

    private Bucket createNewBucket() {
        // Standard rate limit: 100 requests per minute
        Bandwidth limit = Bandwidth.simple(standardCapacity, Duration.ofMinutes(standardRefillDuration));
        
        return Bucket4j.builder()
                .addLimit(limit)
                .build();
    }

    public Bucket resolveStrictBucket(String key) {
        // Strict rate limit for expensive operations: 20 requests per minute
        Bandwidth limit = Bandwidth.simple(strictCapacity, Duration.ofMinutes(strictRefillDuration));
        
        return cache.computeIfAbsent("strict:" + key, k -> 
                Bucket4j.builder()
                        .addLimit(limit)
                        .build());
    }

    public void evictBucket(String key) {
        cache.remove(key);
        cache.remove("strict:" + key);
    }
}
