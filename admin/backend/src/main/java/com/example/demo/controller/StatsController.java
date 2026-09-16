package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.StatsDto;
import com.example.demo.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/stats")
public class StatsController {

    @Autowired
    private StatsService statsService;

    @GetMapping
    public ResponseEntity<ApiResponse<StatsDto>> getStats(
            @RequestParam(required = false) String sessionCode
    ) {
        StatsDto stats = statsService.getStats(sessionCode);
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
