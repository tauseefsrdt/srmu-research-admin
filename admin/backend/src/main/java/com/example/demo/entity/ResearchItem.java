package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "research_items")
public class ResearchItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer srNo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "academic_session_id", nullable = false)
    private AcademicSession academicSession;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "institute_id")
    private Institute institute;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private ResearchCategory category;

    @Column(length = 255)
    private String department; // e.g. "Department of Civil Engineering"

    @Column(columnDefinition = "TEXT")
    private String rawFacultyInstitute; // Raw string from documents if available

    @Column(nullable = false, columnDefinition = "TEXT")
    private String title;

    @Column(columnDefinition = "TEXT")
    private String primaryAuthor; // Scholar name, Teacher name, Patenter name, First Author

    @Column(columnDefinition = "TEXT")
    private String coAuthors; // Supervisors, Co-inventors, Co-authors

    @Column(columnDefinition = "TEXT")
    private String identifier; // Reg. No., Patent No., ISSN, ISBN

    @Column(columnDefinition = "TEXT")
    private String venue; // Journal Name, Publisher Name, Patent Office / Jurisdiction

    @Column(columnDefinition = "TEXT")
    private String eventOrAwardDate; // "16.07.2025" or "2025-04-04" or Journal award string

    @Column(columnDefinition = "TEXT")
    private String publicationYear; // "2025", "2026", or detailed period string

    @Column(columnDefinition = "TEXT")
    private String externalLink; // UGC link, DOI, Patent link

    @Column(columnDefinition = "TEXT")
    private String abstractText;

    @Column(length = 50)
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, DRAFT, ARCHIVED

    private Boolean featured = false;

    private Integer citations = 0;

    @Column(columnDefinition = "TEXT")
    private String extraDetails;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public ResearchItem() {}

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

    public AcademicSession getAcademicSession() {
        return academicSession;
    }

    public void setAcademicSession(AcademicSession academicSession) {
        this.academicSession = academicSession;
    }

    public Institute getInstitute() {
        return institute;
    }

    public void setInstitute(Institute institute) {
        this.institute = institute;
    }

    public ResearchCategory getCategory() {
        return category;
    }

    public void setCategory(ResearchCategory category) {
        this.category = category;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
