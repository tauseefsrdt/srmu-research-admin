package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class InstituteDto {
    private Long id;

    @NotBlank(message = "Institute code is required")
    private String code;

    @NotBlank(message = "Institute title is required")
    private String title;

    @NotBlank(message = "Slug is required")
    private String slug;

    private String departmentCountLabel;
    private String description;
    private String image;
    private List<String> programs;
    private Integer displayOrder;
    private Boolean active;

    public InstituteDto() {}

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
