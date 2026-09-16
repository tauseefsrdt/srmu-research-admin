package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "research_categories")
public class ResearchCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String code; // e.g. "THESIS_AWARDED", "PUBLICATION", "PATENT", "BOOK"

    @Column(nullable = false, length = 150)
    private String name; // e.g. "Ph.D. Theses Awarded"

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer displayOrder = 0;

    public ResearchCategory() {}

    public ResearchCategory(String code, String name, String description, Integer displayOrder) {
        this.code = code;
        this.name = name;
        this.description = description;
        this.displayOrder = displayOrder != null ? displayOrder : 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
