package com.travelplanner.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class CacheMetricsServiceTest {

    @Mock
    private CacheManager cacheManager;

    @Mock
    private Cache cache;

    private CacheMetricsService cacheMetricsService;

    @BeforeEach
    void setUp() {
        Set<String> cacheNames = new HashSet<>();
        cacheNames.add("itineraries");
        cacheNames.add("trips");
        cacheNames.add("destinations");

        when(cacheManager.getCacheNames()).thenReturn(cacheNames);
        when(cacheManager.getCache("itineraries")).thenReturn(cache);
        when(cacheManager.getCache("trips")).thenReturn(cache);
        when(cacheManager.getCache("destinations")).thenReturn(cache);

        cacheMetricsService = new CacheMetricsService(cacheManager);
    }

    @Test
    void recordHit_IncrementsHits() {
        cacheMetricsService.recordHit("itineraries");
        cacheMetricsService.recordHit("itineraries");
        cacheMetricsService.recordHit("itineraries");

        Map<String, CacheMetricsService.CacheMetrics> metrics = cacheMetricsService.getAllMetrics();
        assertEquals(3, metrics.get("itineraries").getHits());
    }

    @Test
    void recordMiss_IncrementsMisses() {
        cacheMetricsService.recordMiss("trips");
        cacheMetricsService.recordMiss("trips");

        Map<String, CacheMetricsService.CacheMetrics> metrics = cacheMetricsService.getAllMetrics();
        assertEquals(2, metrics.get("trips").getMisses());
    }

    @Test
    void getHitRatio_AllHits_ReturnsOne() {
        cacheMetricsService.recordHit("itineraries");
        cacheMetricsService.recordHit("itineraries");

        double ratio = cacheMetricsService.getHitRatio("itineraries");

        assertEquals(1.0, ratio, 0.001);
    }

    @Test
    void getHitRatio_AllMisses_ReturnsZero() {
        cacheMetricsService.recordMiss("itineraries");
        cacheMetricsService.recordMiss("itineraries");

        double ratio = cacheMetricsService.getHitRatio("itineraries");

        assertEquals(0.0, ratio, 0.001);
    }

    @Test
    void getHitRatio_Mixed_ReturnsCorrectRatio() {
        cacheMetricsService.recordHit("trips");
        cacheMetricsService.recordHit("trips");
        cacheMetricsService.recordHit("trips");
        cacheMetricsService.recordMiss("trips");

        double ratio = cacheMetricsService.getHitRatio("trips");

        assertEquals(0.75, ratio, 0.001);
    }

    @Test
    void getHitRatio_NoData_ReturnsZero() {
        double ratio = cacheMetricsService.getHitRatio("nonexistent");

        assertEquals(0.0, ratio, 0.001);
    }

    @Test
    void getAllMetrics_ReturnsAllCaches() {
        cacheMetricsService.recordHit("itineraries");
        cacheMetricsService.recordMiss("trips");

        Map<String, CacheMetricsService.CacheMetrics> metrics = cacheMetricsService.getAllMetrics();

        assertEquals(3, metrics.size());
        assertTrue(metrics.containsKey("itineraries"));
        assertTrue(metrics.containsKey("trips"));
        assertTrue(metrics.containsKey("destinations"));
    }

    @Test
    void getAllMetrics_HasCorrectFields() {
        cacheMetricsService.recordHit("itineraries");
        cacheMetricsService.recordMiss("itineraries");

        Map<String, CacheMetricsService.CacheMetrics> metrics = cacheMetricsService.getAllMetrics();
        CacheMetricsService.CacheMetrics itineraryMetrics = metrics.get("itineraries");

        assertNotNull(itineraryMetrics);
        assertEquals("itineraries", itineraryMetrics.getCacheName());
        assertEquals(1, itineraryMetrics.getHits());
        assertEquals(1, itineraryMetrics.getMisses());
        assertEquals(0.5, itineraryMetrics.getHitRatio(), 0.001);
    }

    @Test
    void recordHit_NewCacheName_CreatesCounter() {
        cacheMetricsService.recordHit("newCache");

        double ratio = cacheMetricsService.getHitRatio("newCache");
        assertEquals(0.0, ratio, 0.001);
    }

    @Test
    void resetMetrics_ClearsAllCounters() {
        cacheMetricsService.recordHit("itineraries");
        cacheMetricsService.recordHit("itineraries");
        cacheMetricsService.recordMiss("itineraries");

        cacheMetricsService.resetMetrics();

        Map<String, CacheMetricsService.CacheMetrics> metrics = cacheMetricsService.getAllMetrics();
        assertEquals(0, metrics.get("itineraries").getHits());
        assertEquals(0, metrics.get("itineraries").getMisses());
    }

    @Test
    void getHitRatio_AfterReset_ReturnsZero() {
        cacheMetricsService.recordHit("itineraries");
        cacheMetricsService.resetMetrics();

        double ratio = cacheMetricsService.getHitRatio("itineraries");

        assertEquals(0.0, ratio, 0.001);
    }

    @Test
    void cacheMetrics_ConstructorAndGetters() {
        CacheMetricsService.CacheMetrics metrics = 
            new CacheMetricsService.CacheMetrics("testCache", 10, 5, 0.666, 100);

        assertEquals("testCache", metrics.getCacheName());
        assertEquals(10, metrics.getHits());
        assertEquals(5, metrics.getMisses());
        assertEquals(0.666, metrics.getHitRatio(), 0.001);
        assertEquals(100, metrics.getSize());
    }
}
