package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.InstituteDto;
import com.example.demo.service.InstituteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/institutes")
public class InstituteController {

    @Autowired
    private InstituteService instituteService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<InstituteDto>>> getAllInstitutes() {
        return ResponseEntity.ok(ApiResponse.ok(instituteService.getAllInstitutes()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InstituteDto>> getInstituteById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(instituteService.getInstituteById(id)));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<InstituteDto>> getInstituteBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(instituteService.getInstituteBySlug(slug)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InstituteDto>> createInstitute(@Valid @RequestBody InstituteDto dto) {
        InstituteDto created = instituteService.createInstitute(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Institute created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InstituteDto>> updateInstitute(@PathVariable Long id, @Valid @RequestBody InstituteDto dto) {
        InstituteDto updated = instituteService.updateInstitute(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Institute updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteInstitute(@PathVariable Long id) {
        instituteService.deleteInstitute(id);
        return ResponseEntity.ok(ApiResponse.ok("Institute deleted successfully", null));
    }
}
