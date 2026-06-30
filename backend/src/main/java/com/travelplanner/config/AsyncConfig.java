package com.travelplanner.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * Async Configuration
 * 
 * Configures thread pool for asynchronous operations like AI itinerary generation.
 * 
 * Thread Pool Design:
 * - Core pool size: 5 threads (handles normal load)
 * - Max pool size: 20 threads (handles traffic spikes)
 * - Queue capacity: 100 (buffers requests when all threads busy)
 * - Thread name prefix: async-task- (for easy debugging)
 * 
 * Why these values:
 * - AI operations are I/O bound (waiting for Gemini API)
 * - Can handle more concurrent operations than CPU-bound tasks
 * - Queue prevents thread explosion during spikes
 * - Graceful rejection when queue full
 */
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(AsyncConfig.class);

    @Override
    @Bean(name = "taskExecutor")
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        
        // Core pool size: threads always alive
        executor.setCorePoolSize(5);
        
        // Max pool size: maximum threads that can be created
        executor.setMaxPoolSize(20);
        
        // Queue capacity: tasks waiting for thread
        executor.setQueueCapacity(100);
        
        // Thread name prefix for debugging
        executor.setThreadNamePrefix("async-task-");
        
        // Keep alive time for idle threads
        executor.setKeepAliveSeconds(60);
        
        // Reuse threads
        executor.setAllowCoreThreadTimeOut(true);
        
        // Wait for tasks to complete on shutdown
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(60);
        
        // Rejection policy: call run() in caller thread
        executor.setRejectedExecutionHandler(new java.util.concurrent.ThreadPoolExecutor.CallerRunsPolicy());
        
        executor.initialize();
        
        logger.info("Async task executor initialized with corePoolSize={}, maxPoolSize={}, queueCapacity={}",
            executor.getCorePoolSize(), executor.getMaxPoolSize(), executor.getQueueCapacity());
        
        return executor;
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (throwable, method, params) -> {
            logger.error("Async method {} threw exception: {}", method.getName(), throwable.getMessage(), throwable);
        };
    }
}
