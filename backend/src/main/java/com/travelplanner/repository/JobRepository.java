package com.travelplanner.repository;

import com.travelplanner.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    Optional<Job> findByJobId(String jobId);
    Optional<Job> findByJobIdAndUserId(String jobId, Long userId);
    void deleteByJobId(String jobId);
}
