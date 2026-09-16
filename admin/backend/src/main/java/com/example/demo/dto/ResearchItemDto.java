package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ResearchItemDto {
    private Long id;
    private Integer srNo;

    @NotNull(message = "Academic session ID is required")
    private Long academicSessionId;
    private String academicSessionCode;

    private Long instituteId;
    private String instituteTitle;
    private String instituteCode;

    @NotNull(message = "Category ID is required")
    private Long categoryId;
    private String categoryCode;
    private String categoryName;

    private String department;
    private String rawFacultyInstitute;

    @NotBlank(message = "Title is required")
    private String title;

    private String primaryAuthor;
    private String coAuthors;
    private String identifier;
    private String venue;
    private String eventOrAwardDate;
    private String publicationYear;
    private String externalLink;
    private String abstractText;
    private String status;
    private Boolean featured;
    private Integer citations;
    private String extraDetails;

    public ResearchItemDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSrNo() {
        return srNo;
    }

    public void setSrNo(Integer srNo) {
        this.srNo = srNo;
    }

    public Long getAcademicSessionId() {
        return academicSessionId;
    }

    public void setAcademicSessionId(Long academicSessionId) {
        this.academicSessionId = academicSessionId;
    }

    public String getAcademicSessionCode() {
        return academicSessionCode;
    }

    public void setAcademicSessionCode(String academicSessionCode) {
        this.academicSessionCode = academicSessionCode;
    }

    public Long getInstituteId() {
        return instituteId;
    }

    public void setInstituteId(Long instituteId) {
        this.instituteId = instituteId;
    }

    public String getInstituteTitle() {
        return instituteTitle;
    }

    public void setInstituteTitle(String instituteTitle) {
        this.instituteTitle = instituteTitle;
    }

    public String getInstituteCode() {
        return instituteCode;
    }

    public void setInstituteCode(String instituteCode) {
        this.instituteCode = instituteCode;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryCode() {
        return categoryCode;
    }

    public void setCategoryCode(String categoryCode) {
        this.categoryCode = categoryCode;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getRawFacultyInstitute() {
        return rawFacultyInstitute;
    }

    public void setRawFacultyInstitute(String rawFacultyInstitute) {
        this.rawFacultyInstitute = rawFacultyInstitute;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPrimaryAuthor() {
        return primaryAuthor;
    }

    public void setPrimaryAuthor(String primaryAuthor) {
        this.primaryAuthor = primaryAuthor;
    }

    public String getCoAuthors() {
        return coAuthors;
    }

    public void setCoAuthors(String coAuthors) {
        this.coAuthors = coAuthors;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getEventOrAwardDate() {
        return eventOrAwardDate;
    }

    public void setEventOrAwardDate(String eventOrAwardDate) {
        this.eventOrAwardDate = eventOrAwardDate;
    }

    public String getPublicationYear() {
        return publicationYear;
    }

    public void setPublicationYear(String publicationYear) {
        this.publicationYear = publicationYear;
    }

    public String getExternalLink() {
        return externalLink;
    }

    public void setExternalLink(String externalLink) {
        this.externalLink = externalLink;
    }

    public String getAbstractText() {
        return abstractText;
    }

    public void setAbstractText(String abstractText) {
        this.abstractText = abstractText;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getFeatured() {
        return featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }

    public Integer getCitations() {
        return citations;
    }

    public void setCitations(Integer citations) {
        this.citations = citations;
    }

    public String getExtraDetails() {
        return extraDetails;
    }

    public void setExtraDetails(String extraDetails) {
        this.extraDetails = extraDetails;
    }
}
