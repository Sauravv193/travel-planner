package com.travelplanner.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cache.CacheManager;
import org.springframework.data.redis.cache.CacheStatistics;
import org.springframework.data.redis.cache.RedisCache;

import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CacheMetricsServiceTest {

    @Mock
    private CacheManager cacheManager;

    @Mock
    private RedisCache redisCache;

    @Mock
    private CacheStatistics statistics;

    private CacheMetricsService service;

    @BeforeEach
    void setUp() {
        when(cacheManager.getCacheNames()).thenReturn(Set.of("trips"));
        when(cacheManager.getCache("trips")).thenReturn(redisCache);
        when(redisCache.getStatistics()).thenReturn(statistics);
        service = new CacheMetricsService(cacheManager);
    }

    @Test
    void reportsActualRedisHitAndMissCounts() {
        when(statistics.getHits()).thenReturn(8L);
        when(statistics.getMisses()).thenReturn(2L);

        Map<String, CacheMetricsService.CacheMetrics> metrics = service.getAllMetrics();

        assertEquals(8L, metrics.get("trips").getHits());
        assertEquals(2L, metrics.get("trips").getMisses());
        assertEquals(0.8, metrics.get("trips").getHitRatio(), 0.001);
    }

    @Test
    void reportsUnknownSizeInsteadOfInventingAnEntryCount() {
        CacheMetricsService.CacheMetrics metrics = service.getAllMetrics().get("trips");

        assertEquals(-1L, metrics.getSize());
    }

    @Test
    void resetsRedisStatistics() {
        service.resetMetrics();

        verify(redisCache).clearStatistics();
    }

    @Test
    void returnsZeroRatioWhenThereAreNoCacheRequests() {
        when(statistics.getHits()).thenReturn(0L);
        when(statistics.getMisses()).thenReturn(0L);

        assertEquals(0.0, service.getAllMetrics().get("trips").getHitRatio(), 0.001);
    }
}
