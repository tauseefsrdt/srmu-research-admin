package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.ResearchCategoryDto;
import com.example.demo.service.ResearchCategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/research-categories")
public class ResearchCategoryController {

    @Autowired
    private ResearchCategoryService researchCategoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResearchCategoryDto>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.ok(researchCategoryService.getAllCategories()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResearchCategoryDto>> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(researchCategoryService.getCategoryById(id)));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<ResearchCategoryDto>> getCategoryByCode(@PathVariable String code) {
        return ResponseEntity.ok(ApiResponse.ok(researchCategoryService.getCategoryByCode(code)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ResearchCategoryDto>> createCategory(@Valid @RequestBody ResearchCategoryDto dto) {
        ResearchCategoryDto created = researchCategoryService.createCategory(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Category created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResearchCategoryDto>> updateCategory(@PathVariable Long id, @Valid @RequestBody ResearchCategoryDto dto) {
        ResearchCategoryDto updated = researchCategoryService.updateCategory(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Category updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        researchCategoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.ok("Category deleted successfully", null));
    }
}
