package com.example.demo.controller;

import com.example.demo.dto.AcademicSessionDto;
import com.example.demo.dto.ApiResponse;
import com.example.demo.service.AcademicSessionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/academic-sessions")
public class AcademicSessionController {

    @Autowired
    private AcademicSessionService academicSessionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AcademicSessionDto>>> getAllSessions() {
        return ResponseEntity.ok(ApiResponse.ok(academicSessionService.getAllSessions()));
    }

    @GetMapping("/current")
    public ResponseEntity<ApiResponse<AcademicSessionDto>> getCurrentSession() {
        return ResponseEntity.ok(ApiResponse.ok(academicSessionService.getCurrentSession()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AcademicSessionDto>> getSessionById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(academicSessionService.getSessionById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AcademicSessionDto>> createSession(@Valid @RequestBody AcademicSessionDto dto) {
        AcademicSessionDto created = academicSessionService.createSession(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Session created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AcademicSessionDto>> updateSession(@PathVariable Long id, @Valid @RequestBody AcademicSessionDto dto) {
        AcademicSessionDto updated = academicSessionService.updateSession(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Session updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSession(@PathVariable Long id) {
        academicSessionService.deleteSession(id);
        return ResponseEntity.ok(ApiResponse.ok("Session deleted successfully", null));
    }
}
