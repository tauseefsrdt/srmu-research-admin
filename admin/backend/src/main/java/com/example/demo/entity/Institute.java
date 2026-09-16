package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "institutes")
public class Institute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String code; // e.g. "IoT", "IBST", "IMCE"

    @Column(nullable = false, length = 255)
    private String title; // e.g. "Institute of Technology"

    @Column(nullable = false, unique = true, length = 150)
    private String slug; // e.g. "institute-of-technology"

    @Column(length = 100)
    private String departmentCountLabel; // e.g. "5 DEPARTMENTS"

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 255)
    private String image; // e.g. "/Images/c1.webp"

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "institute_programs", joinColumns = @JoinColumn(name = "institute_id"))
    @Column(name = "program_name")
    private List<String> programs = new ArrayList<>();

    private Integer displayOrder = 0;

    private Boolean active = true;

    public Institute() {}

    public Institute(String code, String title, String slug, String departmentCountLabel, String description, String image, List<String> programs, Integer displayOrder) {
        this.code = code;
        this.title = title;
        this.slug = slug;
        this.departmentCountLabel = departmentCountLabel;
        this.description = description;
        this.image = image;
        this.programs = programs != null ? programs : new ArrayList<>();
        this.displayOrder = displayOrder != null ? displayOrder : 0;
        this.active = true;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDepartmentCountLabel() {
        return departmentCountLabel;
    }

    public void setDepartmentCountLabel(String departmentCountLabel) {
        this.departmentCountLabel = departmentCountLabel;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public List<String> getPrograms() {
        return programs;
    }

    public void setPrograms(List<String> programs) {
        this.programs = programs;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
