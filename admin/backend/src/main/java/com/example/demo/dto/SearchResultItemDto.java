package com.example.demo.dto;

import java.util.Map;

public class SearchResultItemDto {

    private String id;
    private String type; // PUBLICATION, PATENT, BOOK, THESIS_AWARDED, INSTITUTE, FACULTY_SUPERVISOR, PAGE
    private String categoryLabel;
    private String title;
    private String subtitle;
    private String identifier; // ISBN, ISSN, Patent No, Code
    private String venueOrDepartment;
    private String year;
    private String url;
    private String snippet;
    private Map<String, Object> metadata;

    public SearchResultItemDto() {}

    public SearchResultItemDto(String id, String type, String categoryLabel, String title, String subtitle, String identifier, String venueOrDepartment, String year, String url, String snippet, Map<String, Object> metadata) {
        this.id = id;
        this.type = type;
        this.categoryLabel = categoryLabel;
        this.title = title;
        this.subtitle = subtitle;
        this.identifier = identifier;
        this.venueOrDepartment = venueOrDepartment;
        this.year = year;
        this.url = url;
        this.snippet = snippet;
        this.metadata = metadata;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCategoryLabel() {
        return categoryLabel;
    }

    public void setCategoryLabel(String categoryLabel) {
        this.categoryLabel = categoryLabel;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getVenueOrDepartment() {
        return venueOrDepartment;
    }

    public void setVenueOrDepartment(String venueOrDepartment) {
        this.venueOrDepartment = venueOrDepartment;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getSnippet() {
        return snippet;
    }

    public void setSnippet(String snippet) {
        this.snippet = snippet;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }
}
