package com.example.demo.service;

import com.example.demo.dto.SearchResponseDto;

public interface SearchService {
    SearchResponseDto search(String query, String type, String sessionCode, int page, int size);
}
