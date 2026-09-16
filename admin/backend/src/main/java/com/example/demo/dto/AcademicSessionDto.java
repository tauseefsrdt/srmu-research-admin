package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class AcademicSessionDto {
    private Long id;

    @NotBlank(message = "Session code is required")
    private String sessionCode;

    @NotBlank(message = "Session name is required")
    private String name;

    private Boolean isCurrent;
    private LocalDate startDate;
    private LocalDate endDate;

    public AcademicSessionDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSessionCode() {
        return sessionCode;
    }

    public void setSessionCode(String sessionCode) {
        this.sessionCode = sessionCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getIsCurrent() {
        return isCurrent;
    }

    public void setIsCurrent(Boolean isCurrent) {
        this.isCurrent = isCurrent;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}
