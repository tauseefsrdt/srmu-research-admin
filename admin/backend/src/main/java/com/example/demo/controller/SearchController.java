package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.SearchResponseDto;
import com.example.demo.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/v1/search", "/api/search"})
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping
    public ResponseEntity<ApiResponse<SearchResponseDto>> search(
            @RequestParam(name = "q", defaultValue = "") String query,
            @RequestParam(name = "type", required = false) String type,
            @RequestParam(name = "sessionCode", required = false) String sessionCode,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size
    ) {
        SearchResponseDto response = searchService.search(query, type, sessionCode, page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
