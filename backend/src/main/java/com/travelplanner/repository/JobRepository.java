package com.travelplanner.repository;

import com.travelplanner.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Job Repository
 * 
 * Manages persistence of async job tracking records.
 */
@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    
    Optional<Job> findByJobId(String jobId);
    
    void deleteByJobId(String jobId);
}
