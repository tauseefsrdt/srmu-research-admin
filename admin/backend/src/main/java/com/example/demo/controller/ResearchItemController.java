package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.PageResponse;
import com.example.demo.dto.ResearchItemDto;
import com.example.demo.service.ResearchItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/research-items")
public class ResearchItemController {

    @Autowired
    private ResearchItemService researchItemService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ResearchItemDto>>> searchResearchItems(
            @RequestParam(required = false) String sessionCode,
            @RequestParam(required = false) String categoryCode,
            @RequestParam(required = false) Long instituteId,
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "srNo") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection
    ) {
        PageResponse<ResearchItemDto> result = researchItemService.searchResearchItems(
                sessionCode, categoryCode, instituteId, year, search, page, size, sortBy, sortDirection
        );
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/by-category/{categoryCode}")
    public ResponseEntity<ApiResponse<List<ResearchItemDto>>> getByCategory(
            @PathVariable String categoryCode,
            @RequestParam(required = false) String sessionCode
    ) {
        List<ResearchItemDto> list = researchItemService.getByCategoryAndSession(categoryCode, sessionCode);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResearchItemDto>> getResearchItemById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(researchItemService.getResearchItemById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ResearchItemDto>> createResearchItem(@Valid @RequestBody ResearchItemDto dto) {
        ResearchItemDto created = researchItemService.createResearchItem(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Research Item created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResearchItemDto>> updateResearchItem(@PathVariable Long id, @Valid @RequestBody ResearchItemDto dto) {
        ResearchItemDto updated = researchItemService.updateResearchItem(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Research Item updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteResearchItem(@PathVariable Long id) {
        researchItemService.deleteResearchItem(id);
        return ResponseEntity.ok(ApiResponse.ok("Research Item deleted successfully", null));
    }
}
