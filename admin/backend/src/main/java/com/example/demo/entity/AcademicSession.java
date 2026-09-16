package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "academic_sessions")
public class AcademicSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String sessionCode; // e.g. "2025-26", "2026-27"

    @Column(nullable = false, length = 100)
    private String name; // e.g. "Academic Session 2025–26"

    @Column(nullable = false)
    private Boolean isCurrent = false;

    private LocalDate startDate;

    private LocalDate endDate;

    public AcademicSession() {}

    public AcademicSession(String sessionCode, String name, Boolean isCurrent) {
        this.sessionCode = sessionCode;
        this.name = name;
        this.isCurrent = isCurrent != null ? isCurrent : false;
    }

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
