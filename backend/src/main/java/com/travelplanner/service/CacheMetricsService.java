package com.travelplanner.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.data.redis.cache.RedisCache;
import org.springframework.data.redis.cache.CacheStatistics;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Reports cache statistics captured by Spring Data Redis.
 *
 * Statistics are local to this application instance and are not a
 * cluster-wide view. Redis does not expose cache entry counts through
 * Spring's Cache abstraction, so size is reported as -1 (unknown).
 */
@Service
public class CacheMetricsService {

    private static final Logger logger = LoggerFactory.getLogger(CacheMetricsService.class);

    private final CacheManager cacheManager;

    public CacheMetricsService(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    public Map<String, CacheMetrics> getAllMetrics() {
        Map<String, CacheMetrics> metrics = new HashMap<>();

        cacheManager.getCacheNames().forEach(cacheName -> {
            Cache cache = cacheManager.getCache(cacheName);
            long hits = 0;
            long misses = 0;

            if (cache instanceof RedisCache) {
                CacheStatistics statistics = ((RedisCache) cache).getStatistics();
                hits = statistics.getHits();
                misses = statistics.getMisses();
            }

            long total = hits + misses;
            double hitRatio = total == 0 ? 0.0 : (double) hits / total;
            metrics.put(cacheName, new CacheMetrics(cacheName, hits, misses, hitRatio, -1));
        });

        return metrics;
    }

    @Scheduled(fixedRate = 300000)
    public void logMetrics() {
        logger.info("=== Cache Metrics (instance-local) ===");
        getAllMetrics().forEach((cacheName, metrics) -> {
            logger.info("Cache: {} | Hits: {} | Misses: {} | Hit Ratio: {} | Size: unknown",
                    cacheName,
                    metrics.getHits(),
                    metrics.getMisses(),
                    String.format("%.2f%%", metrics.getHitRatio() * 100));
        });
        logger.info("======================================");
    }

    public void resetMetrics() {
        cacheManager.getCacheNames().forEach(cacheName -> {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache instanceof RedisCache) {
                ((RedisCache) cache).clearStatistics();
            }
        });
        logger.info("Redis cache statistics reset");
    }

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

        public String getCacheName() { return cacheName; }
        public long getHits() { return hits; }
        public long getMisses() { return misses; }
        public double getHitRatio() { return hitRatio; }

        /**
         * Returns -1 when entry count is unavailable through Spring Cache.
         */
        public long getSize() { return size; }
    }
}
