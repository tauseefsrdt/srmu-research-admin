package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.FacultySeatMatrixDto;
import com.example.demo.dto.PageResponse;
import com.example.demo.service.FacultySeatService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/faculty-seats")
public class FacultySeatController {

    @Autowired
    private FacultySeatService facultySeatService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<FacultySeatMatrixDto>>> searchFacultySeats(
            @RequestParam(required = false) String sessionCode,
            @RequestParam(required = false) Long instituteId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        PageResponse<FacultySeatMatrixDto> result = facultySeatService.searchFacultySeats(
                sessionCode, instituteId, search, page, size
        );
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<FacultySeatMatrixDto>>> getAllBySession(
            @RequestParam(required = false) String sessionCode
    ) {
        return ResponseEntity.ok(ApiResponse.ok(facultySeatService.getAllBySession(sessionCode)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FacultySeatMatrixDto>> getFacultySeatById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(facultySeatService.getFacultySeatById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FacultySeatMatrixDto>> createFacultySeat(@Valid @RequestBody FacultySeatMatrixDto dto) {
        FacultySeatMatrixDto created = facultySeatService.createFacultySeat(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Faculty seat record created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FacultySeatMatrixDto>> updateFacultySeat(@PathVariable Long id, @Valid @RequestBody FacultySeatMatrixDto dto) {
        FacultySeatMatrixDto updated = facultySeatService.updateFacultySeat(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Faculty seat record updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFacultySeat(@PathVariable Long id) {
        facultySeatService.deleteFacultySeat(id);
        return ResponseEntity.ok(ApiResponse.ok("Faculty seat record deleted successfully", null));
    }
}
