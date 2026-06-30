package com.travelplanner.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class PageRequest {
    
    @NotNull(message = "Page number is required")
    @Min(value = 0, message = "Page number must be 0 or greater")
    private Integer page = 0;
    
    @NotNull(message = "Page size is required")
    @Min(value = 1, message = "Page size must be at least 1")
    @Max(value = 100, message = "Page size must not exceed 100")
    private Integer size = 10;
    
    private String sort = "id";
    private String direction = "asc";

    public PageRequest() {
    }

    public PageRequest(Integer page, Integer size, String sort, String direction) {
        this.page = page;
        this.size = size;
        this.sort = sort;
        this.direction = direction;
    }

    // Getters and Setters
    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }
}