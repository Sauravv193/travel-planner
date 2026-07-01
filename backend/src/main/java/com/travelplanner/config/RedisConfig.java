package com.travelplanner.config;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

/**
 * Redis Cache Configuration
 * 
 * This configuration sets up Redis as the caching provider with:
 * - JSON serialization for complex objects
 * - Custom TTL (Time To Live) for different cache types
 * - Key prefixing to avoid conflicts
 * - Connection pooling for performance
 * 
 * Cache Types:
 * - itineraries: 2 hours TTL (AI-generated, expensive to compute)
 * - trips: 1 hour TTL (user data, moderate change frequency)
 * - destinations: 24 hours TTL (reference data, rarely changes)
 * - popular: 30 minutes TTL (aggregated data, needs freshness)
 */
@Configuration
@EnableCaching
@Profile("!local")
public class RedisConfig {

    private static final String CACHE_PREFIX = "travel-planner::";
    
    // TTL values in milliseconds
    private static final long ITINERARY_TTL = Duration.ofHours(2).toMillis();
    private static final long TRIP_TTL = Duration.ofHours(1).toMillis();
    private static final long DESTINATION_TTL = Duration.ofHours(24).toMillis();
    private static final long POPULAR_TTL = Duration.ofMinutes(30).toMillis();

    @Bean
    public RedisCacheConfiguration cacheConfiguration() {
        ObjectMapper objectMapper = redisObjectMapper();
        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofHours(1)) // Default TTL
                .disableCachingNullValues() // Don't cache nulls to save memory
                .prefixCacheNameWith(CACHE_PREFIX)
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer(objectMapper)));
    }

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory, 
                                      RedisCacheConfiguration defaultConfig) {
        // Configure specific TTL for different cache types
        RedisCacheConfiguration itineraryConfig = defaultConfig
                .entryTtl(Duration.ofMillis(ITINERARY_TTL))
                .prefixCacheNameWith(CACHE_PREFIX + "itineraries::");
        
        RedisCacheConfiguration tripConfig = defaultConfig
                .entryTtl(Duration.ofMillis(TRIP_TTL))
                .prefixCacheNameWith(CACHE_PREFIX + "trips::");
        
        RedisCacheConfiguration destinationConfig = defaultConfig
                .entryTtl(Duration.ofMillis(DESTINATION_TTL))
                .prefixCacheNameWith(CACHE_PREFIX + "destinations::");
        
        RedisCacheConfiguration popularConfig = defaultConfig
                .entryTtl(Duration.ofMillis(POPULAR_TTL))
                .prefixCacheNameWith(CACHE_PREFIX + "popular::");

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withCacheConfiguration("itineraries", itineraryConfig)
                .withCacheConfiguration("trips", tripConfig)
                .withCacheConfiguration("destinations", destinationConfig)
                .withCacheConfiguration("popular", popularConfig)
                .transactionAware() // Ensures cache operations participate in transactions
                .build();
    }

    /**
     * Creates an ObjectMapper for Redis JSON serialization.
     * <p>
     * NOT a @Bean — this mapper is used exclusively for Redis caching and must not
     * leak into global Jackson configuration. If registered as a &#064;Bean, its
     * activateDefaultTyping(NON_FINAL) pollutes HTTP request/response handling,
     * forcing every JSON object to include a &#064;class type identifier, which
     * breaks deserialization of plain DTOs like LoginRequest.
     */
    private ObjectMapper redisObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        
        // Configure for polymorphic type handling (Redis cache needs type info)
        mapper.activateDefaultTyping(
                LaissezFaireSubTypeValidator.instance,
                ObjectMapper.DefaultTyping.NON_FINAL,
                JsonTypeInfo.As.PROPERTY
        );
        
        // Make all fields visible for serialization
        mapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        
        return mapper;
    }
}
