package com.example.demo.dto;

import java.util.Map;

public class StatsDto {
    private long totalThesesAwarded;
    private long totalPublications;
    private long totalPatents;
    private long totalBooks;
    private long totalSupervisors;
    private int totalPhDSeats;
    private int totalAllottedSeats;
    private int totalVacantSeats;
    private Map<String, Long> categoryCounts;
    private Map<String, Long> instituteCounts;

    public StatsDto() {}

    public long getTotalThesesAwarded() {
        return totalThesesAwarded;
    }

    public void setTotalThesesAwarded(long totalThesesAwarded) {
        this.totalThesesAwarded = totalThesesAwarded;
    }

    public long getTotalPublications() {
        return totalPublications;
    }

    public void setTotalPublications(long totalPublications) {
        this.totalPublications = totalPublications;
    }

    public long getTotalPatents() {
        return totalPatents;
    }

    public void setTotalPatents(long totalPatents) {
        this.totalPatents = totalPatents;
    }

    public long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public long getTotalSupervisors() {
        return totalSupervisors;
    }

    public void setTotalSupervisors(long totalSupervisors) {
        this.totalSupervisors = totalSupervisors;
    }

    public int getTotalPhDSeats() {
        return totalPhDSeats;
    }

    public void setTotalPhDSeats(int totalPhDSeats) {
        this.totalPhDSeats = totalPhDSeats;
    }

    public int getTotalAllottedSeats() {
        return totalAllottedSeats;
    }

    public void setTotalAllottedSeats(int totalAllottedSeats) {
        this.totalAllottedSeats = totalAllottedSeats;
    }

    public int getTotalVacantSeats() {
        return totalVacantSeats;
    }

    public void setTotalVacantSeats(int totalVacantSeats) {
        this.totalVacantSeats = totalVacantSeats;
    }

    public Map<String, Long> getCategoryCounts() {
        return categoryCounts;
    }

    public void setCategoryCounts(Map<String, Long> categoryCounts) {
        this.categoryCounts = categoryCounts;
    }

    public Map<String, Long> getInstituteCounts() {
        return instituteCounts;
    }

    public void setInstituteCounts(Map<String, Long> instituteCounts) {
        this.instituteCounts = instituteCounts;
    }
}
