package com.travelplanner.config;

import io.github.bucket4j.Bucket;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.concurrent.atomic.AtomicReferenceArray;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotSame;
import static org.junit.jupiter.api.Assertions.assertSame;

class RateLimitConfigTest {

    @Test
    void usesFixedSizeBucketStorage() throws Exception {
        RateLimitConfig config = new RateLimitConfig();

        Field standardField = RateLimitConfig.class.getDeclaredField("standardBuckets");
        standardField.setAccessible(true);
        AtomicReferenceArray<?> standard = (AtomicReferenceArray<?>) standardField.get(config);

        Field strictField = RateLimitConfig.class.getDeclaredField("strictBuckets");
        strictField.setAccessible(true);
        AtomicReferenceArray<?> strict = (AtomicReferenceArray<?>) strictField.get(config);

        assertEquals(4096, standard.length());
        assertEquals(4096, strict.length());
    }

    @Test
    void reusesClientBucketAndSeparatesStrictLimits() {
        RateLimitConfig config = new RateLimitConfig();

        Bucket standard = config.resolveBucket("192.0.2.10");
        Bucket strict = config.resolveStrictBucket("192.0.2.10");

        assertSame(standard, config.resolveBucket("192.0.2.10"));
        assertSame(strict, config.resolveStrictBucket("192.0.2.10"));
        assertNotSame(standard, strict);
    }
}
