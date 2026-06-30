package com.travelplanner.controller.v1;

import com.travelplanner.service.CacheMetricsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Cache Controller
 * 
 * Provides endpoints for monitoring cache performance and health.
 * These endpoints are useful for:
 * - Monitoring cache hit ratios
 * - Identifying cache configuration issues
 * - Performance optimization
 * - Debugging cache behavior
 * 
 * Access to these endpoints should be restricted to administrators.
 */
@RestController
@RequestMapping("/api/v1/cache")
public class CacheController {

    @Autowired
    private CacheMetricsService cacheMetricsService;

    /**
     * Get all cache metrics
     * 
     * Returns hit/miss counts and hit ratios for all caches.
     * Useful for monitoring cache effectiveness.
     */
    @GetMapping("/metrics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, CacheMetricsService.CacheMetrics>> getCacheMetrics() {
        return ResponseEntity.ok(cacheMetricsService.getAllMetrics());
    }

    /**
     * Get metrics for a specific cache
     */
    @GetMapping("/metrics/{cacheName}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CacheMetricsService.CacheMetrics> getCacheMetrics(@PathVariable String cacheName) {
        Map<String, CacheMetricsService.CacheMetrics> allMetrics = cacheMetricsService.getAllMetrics();
        CacheMetricsService.CacheMetrics metrics = allMetrics.get(cacheName);
        
        if (metrics == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(metrics);
    }

    /**
     * Reset cache metrics
     * 
     * Useful for testing or after cache configuration changes.
     * This does not clear the cache itself, only the metrics counters.
     */
    @PostMapping("/metrics/reset")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> resetMetrics() {
        cacheMetricsService.resetMetrics();
        return ResponseEntity.ok("Cache metrics reset successfully");
    }
}
