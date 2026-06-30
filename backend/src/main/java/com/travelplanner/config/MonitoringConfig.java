package com.travelplanner.config;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * Monitoring Configuration
 * <p>
 * Exposes custom Micrometer metrics for:
 * - API request counters (per endpoint)
 * - AI generation latency
 * - Cache hit/miss rates
 * - Active user sessions
 * - Job processing metrics
 * <p>
 * These metrics are automatically scraped by Prometheus via /actuator/prometheus.
 */
@Configuration
public class MonitoringConfig {

    @Bean
    public Counter aiGenerationCounter(MeterRegistry registry) {
        return Counter.builder("travel.ai.generations")
                .description("Total number of AI itinerary generations")
                .tag("type", "itinerary")
                .register(registry);
    }

    @Bean
    public Counter aiAdaptationCounter(MeterRegistry registry) {
        return Counter.builder("travel.ai.adaptations")
                .description("Total number of AI itinerary adaptations")
                .tag("type", "adaptation")
                .register(registry);
    }

    @Bean
    public Timer aiGenerationTimer(MeterRegistry registry) {
        return Timer.builder("travel.ai.generation.duration")
                .description("Time taken for AI itinerary generation")
                .tag("type", "itinerary")
                .publishPercentileHistogram()
                .publishPercentiles(0.5, 0.75, 0.9, 0.95, 0.99)
                .register(registry);
    }

    @Bean
    public Counter apiRequestCounter(MeterRegistry registry) {
        return Counter.builder("travel.api.requests")
                .description("Total API requests")
                .tag("endpoint", "all")
                .register(registry);
    }

    @Bean
    public Counter cacheHitCounter(MeterRegistry registry) {
        return Counter.builder("travel.cache.hits")
                .description("Total cache hits across all caches")
                .register(registry);
    }

    @Bean
    public Counter cacheMissCounter(MeterRegistry registry) {
        return Counter.builder("travel.cache.misses")
                .description("Total cache misses across all caches")
                .register(registry);
    }

    @Bean
    public AtomicInteger activeSessionsGauge(MeterRegistry registry) {
        AtomicInteger activeSessions = new AtomicInteger(0);
        registry.gauge("travel.sessions.active", activeSessions);
        return activeSessions;
    }

    @Bean
    public Counter jobCreatedCounter(MeterRegistry registry) {
        return Counter.builder("travel.jobs.created")
                .description("Total async jobs created")
                .register(registry);
    }

    @Bean
    public Counter jobCompletedCounter(MeterRegistry registry) {
        return Counter.builder("travel.jobs.completed")
                .description("Total async jobs completed successfully")
                .register(registry);
    }

    @Bean
    public Counter jobFailedCounter(MeterRegistry registry) {
        return Counter.builder("travel.jobs.failed")
                .description("Total async jobs that failed")
                .register(registry);
    }

    @Bean
    public Counter photoUploadCounter(MeterRegistry registry) {
        return Counter.builder("travel.photos.uploaded")
                .description("Total photos uploaded")
                .register(registry);
    }

    @Bean
    public Counter journalGenerationCounter(MeterRegistry registry) {
        return Counter.builder("travel.journals.generated")
                .description("Total AI journal generations")
                .register(registry);
    }
}
