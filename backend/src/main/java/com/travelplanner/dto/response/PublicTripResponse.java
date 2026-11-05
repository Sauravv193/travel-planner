package com.travelplanner.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

public class PublicTripResponse {
    private String destination;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date startDate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date endDate;
    private Integer numberOfTravelers;
    private String travelStyle;
    private ItineraryResponse itinerary;

    public PublicTripResponse(String destination, Date startDate, Date endDate,
                              Integer numberOfTravelers, String travelStyle,
                              ItineraryResponse itinerary) {
        this.destination = destination;
        this.startDate = startDate;
        this.endDate = endDate;
        this.numberOfTravelers = numberOfTravelers;
        this.travelStyle = travelStyle;
        this.itinerary = itinerary;
    }
    public String getDestination() { return destination; }
    public Date getStartDate() { return startDate; }
    public Date getEndDate() { return endDate; }
    public Integer getNumberOfTravelers() { return numberOfTravelers; }
    public String getTravelStyle() { return travelStyle; }
    public ItineraryResponse getItinerary() { return itinerary; }
}
