package com.example.demo.dto;

import java.util.List;
import java.util.Map;

public class SearchResponseDto {

    private String query;
    private long totalResults;
    private Map<String, Long> typeCounts;
    private List<SearchResultItemDto> items;
    private int page;
    private int size;
    private int totalPages;

    public SearchResponseDto() {}

    public SearchResponseDto(String query, long totalResults, Map<String, Long> typeCounts, List<SearchResultItemDto> items, int page, int size, int totalPages) {
        this.query = query;
        this.totalResults = totalResults;
        this.typeCounts = typeCounts;
        this.items = items;
        this.page = page;
        this.size = size;
        this.totalPages = totalPages;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public long getTotalResults() {
        return totalResults;
    }

    public void setTotalResults(long totalResults) {
        this.totalResults = totalResults;
    }

    public Map<String, Long> getTypeCounts() {
        return typeCounts;
    }

    public void setTypeCounts(Map<String, Long> typeCounts) {
        this.typeCounts = typeCounts;
    }

    public List<SearchResultItemDto> getItems() {
        return items;
    }

    public void setItems(List<SearchResultItemDto> items) {
        this.items = items;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }
}
