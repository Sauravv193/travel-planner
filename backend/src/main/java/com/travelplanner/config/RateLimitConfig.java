package com.travelplanner.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.concurrent.atomic.AtomicReferenceArray;

@Component
public class RateLimitConfig {

    /*
     * Fixed-size buckets prevent attacker-controlled client identities from
     * growing an unbounded in-memory map. Hash collisions share a bucket,
     * which can cause conservative throttling but cannot create extra buckets.
     */
    private static final int BUCKET_COUNT = 4096;

    @Value("${rate.limit.standard.capacity:100}")
    private int standardCapacity;

    @Value("${rate.limit.standard.refill-duration:1}")
    private int standardRefillDuration;

    @Value("${rate.limit.strict.capacity:20}")
    private int strictCapacity;

    @Value("${rate.limit.strict.refill-duration:1}")
    private int strictRefillDuration;

    private final AtomicReferenceArray<Bucket> standardBuckets =
            new AtomicReferenceArray<>(BUCKET_COUNT);
    private final AtomicReferenceArray<Bucket> strictBuckets =
            new AtomicReferenceArray<>(BUCKET_COUNT);

    public Bucket resolveBucket(String key) {
        return resolve(standardBuckets, key, false);
    }

    public Bucket resolveStrictBucket(String key) {
        return resolve(strictBuckets, key, true);
    }

    private Bucket resolve(AtomicReferenceArray<Bucket> buckets, String key, boolean strict) {
        if (key == null || key.isBlank()) {
            key = "unknown";
        }

        int index = Math.floorMod(key.hashCode(), BUCKET_COUNT);
        Bucket existing = buckets.get(index);
        if (existing != null) {
            return existing;
        }

        Bucket created = createNewBucket(strict);
        if (buckets.compareAndSet(index, null, created)) {
            return created;
        }
        return buckets.get(index);
    }

    private Bucket createNewBucket(boolean strict) {
        int capacity = strict ? strictCapacity : standardCapacity;
        int refillDuration = strict ? strictRefillDuration : standardRefillDuration;
        Bandwidth limit = Bandwidth.simple(capacity, Duration.ofMinutes(refillDuration));
        return Bucket4j.builder().addLimit(limit).build();
    }

    /**
     * Fixed slots are intentionally not evicted: eviction would let clients
     * reset their limits by forcing their bucket out of the cache.
     */
    public void evictBucket(String key) {
        // No-op: bucket slots are fixed for the lifetime of this instance.
    }
}
