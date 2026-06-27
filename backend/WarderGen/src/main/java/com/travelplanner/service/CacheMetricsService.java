package com.travelplanner.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Cache Metrics Service
 * 
 * Tracks cache performance metrics including:
 * - Cache hits and misses per cache
 * - Hit ratio calculation
 * - Periodic logging of metrics
 * 
 * This helps monitor the effectiveness of caching and identify
 * opportunities for optimization.
 */
@Service
public class CacheMetricsService {

    private static final Logger logger = LoggerFactory.getLogger(CacheMetricsService.class);
    
    private final CacheManager cacheManager;
    
    // Track hits and misses per cache name
    private final Map<String, AtomicLong> cacheHits = new ConcurrentHashMap<>();
    private final Map<String, AtomicLong> cacheMisses = new ConcurrentHashMap<>();

    public CacheMetricsService(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
        // Initialize counters for known caches
        initializeCacheCounters();
    }

    private void initializeCacheCounters() {
        cacheManager.getCacheNames().forEach(cacheName -> {
            cacheHits.put(cacheName, new AtomicLong(0));
            cacheMisses.put(cacheName, new AtomicLong(0));
        });
    }

    /**
     * Record a cache hit
     */
    public void recordHit(String cacheName) {
        cacheHits.computeIfAbsent(cacheName, k -> new AtomicLong(0)).incrementAndGet();
    }

    /**
     * Record a cache miss
     */
    public void recordMiss(String cacheName) {
        cacheMisses.computeIfAbsent(cacheName, k -> new AtomicLong(0)).incrementAndGet();
    }

    /**
     * Get hit ratio for a specific cache
     */
    public double getHitRatio(String cacheName) {
        AtomicLong hits = cacheHits.get(cacheName);
        AtomicLong misses = cacheMisses.get(cacheName);
        
        if (hits == null || misses == null) {
            return 0.0;
        }
        
        long total = hits.get() + misses.get();
        return total == 0 ? 0.0 : (double) hits.get() / total;
    }

    /**
     * Get all cache metrics
     */
    public Map<String, CacheMetrics> getAllMetrics() {
        Map<String, CacheMetrics> metrics = new HashMap<>();
        
        cacheManager.getCacheNames().forEach(cacheName -> {
            Cache cache = cacheManager.getCache(cacheName);
            CacheMetrics metric = new CacheMetrics(
                cacheName,
                cacheHits.getOrDefault(cacheName, new AtomicLong(0)).get(),
                cacheMisses.getOrDefault(cacheName, new AtomicLong(0)).get(),
                getHitRatio(cacheName),
                cache != null ? getCacheSize(cache) : 0
            );
            metrics.put(cacheName, metric);
        });
        
        return metrics;
    }

    /**
     * Get approximate cache size (number of entries)
     */
    private long getCacheSize(Cache cache) {
        // Note: Redis doesn't provide direct size access through Spring Cache abstraction
        // This would require native Redis commands or custom implementation
        // For now, we return 0 as a placeholder
        return 0;
    }

    /**
     * Log cache metrics every 5 minutes
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    public void logMetrics() {
        logger.info("=== Cache Metrics ===");
        getAllMetrics().forEach((cacheName, metrics) -> {
            logger.info("Cache: {} | Hits: {} | Misses: {} | Hit Ratio: {:.2f}% | Size: {}",
                cacheName,
                metrics.getHits(),
                metrics.getMisses(),
                metrics.getHitRatio() * 100,
                metrics.getSize()
            );
        });
        logger.info("===================");
    }

    /**
     * Reset all metrics (useful for testing)
     */
    public void resetMetrics() {
        cacheHits.values().forEach(counter -> counter.set(0));
        cacheMisses.values().forEach(counter -> counter.set(0));
        logger.info("Cache metrics reset");
    }

    /**
     * Cache metrics data class
     */
    public static class CacheMetrics {
        private final String cacheName;
        private final long hits;
        private final long misses;
        private final double hitRatio;
        private final long size;

        public CacheMetrics(String cacheName, long hits, long misses, double hitRatio, long size) {
            this.cacheName = cacheName;
            this.hits = hits;
            this.misses = misses;
            this.hitRatio = hitRatio;
            this.size = size;
        }

        public String getCacheName() {
            return cacheName;
        }

        public long getHits() {
            return hits;
        }

        public long getMisses() {
            return misses;
        }

        public double getHitRatio() {
            return hitRatio;
        }

        public long getSize() {
            return size;
        }
    }
}
