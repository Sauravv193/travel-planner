package com.travelplanner.specification;

import com.travelplanner.model.Trip;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.Date;

public class TripSpecification {

    public static Specification<Trip> withDestination(String destination) {
        return (root, query, cb) -> {
            if (destination == null || destination.isEmpty()) {
                return cb.conjunction();
            }
            return cb.like(cb.lower(root.get("destination")), "%" + destination.toLowerCase() + "%");
        };
    }

    public static Specification<Trip> withMinBudget(Double minBudget) {
        return (root, query, cb) -> {
            if (minBudget == null) {
                return cb.conjunction();
            }
            return cb.greaterThanOrEqualTo(root.get("budget"), BigDecimal.valueOf(minBudget));
        };
    }

    public static Specification<Trip> withMaxBudget(Double maxBudget) {
        return (root, query, cb) -> {
            if (maxBudget == null) {
                return cb.conjunction();
            }
            return cb.lessThanOrEqualTo(root.get("budget"), BigDecimal.valueOf(maxBudget));
        };
    }

    public static Specification<Trip> withStartDateAfter(Date startDate) {
        return (root, query, cb) -> {
            if (startDate == null) {
                return cb.conjunction();
            }
            return cb.greaterThanOrEqualTo(root.get("startDate"), startDate);
        };
    }

    public static Specification<Trip> withEndDateBefore(Date endDate) {
        return (root, query, cb) -> {
            if (endDate == null) {
                return cb.conjunction();
            }
            return cb.lessThanOrEqualTo(root.get("endDate"), endDate);
        };
    }

    public static Specification<Trip> withUserId(Long userId) {
        return (root, query, cb) -> {
            if (userId == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("user").get("id"), userId);
        };
    }

    public static Specification<Trip> withBudgetTier(String budgetTier) {
        return (root, query, cb) -> {
            if (budgetTier == null || budgetTier.isEmpty()) {
                return cb.conjunction();
            }
            return cb.equal(root.get("budgetTier"), budgetTier);
        };
    }

    public static Specification<Trip> withTravelStyle(String travelStyle) {
        return (root, query, cb) -> {
            if (travelStyle == null || travelStyle.isEmpty()) {
                return cb.conjunction();
            }
            return cb.like(cb.lower(root.get("travelStyle")), "%" + travelStyle.toLowerCase() + "%");
        };
    }
}