package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "faculty_seat_matrices")
public class FacultySeatMatrix {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer rowIndex;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "academic_session_id")
    private AcademicSession academicSession;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "institute_id")
    private Institute institute;

    @Column(length = 255)
    private String instituteName; // fallback / raw name

    @Column(nullable = false, length = 255)
    private String department;

    @Column(length = 255)
    private String rawDepartment;

    private Integer totalPhD;

    @Column(nullable = false, length = 255)
    private String supervisorName;

    @Column(length = 255)
    private String designation;

    private Integer designationSeatLimit = 0;

    private Integer allottedSeat = 0;

    private Integer noOfVacant = 0;

    private Boolean active = true;

    public FacultySeatMatrix() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRowIndex() {
        return rowIndex;
    }

    public void setRowIndex(Integer rowIndex) {
        this.rowIndex = rowIndex;
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

    public String getInstituteName() {
        return instituteName;
    }

    public void setInstituteName(String instituteName) {
        this.instituteName = instituteName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getRawDepartment() {
        return rawDepartment;
    }

    public void setRawDepartment(String rawDepartment) {
        this.rawDepartment = rawDepartment;
    }

    public Integer getTotalPhD() {
        return totalPhD;
    }

    public void setTotalPhD(Integer totalPhD) {
        this.totalPhD = totalPhD;
    }

    public String getSupervisorName() {
        return supervisorName;
    }

    public void setSupervisorName(String supervisorName) {
        this.supervisorName = supervisorName;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public Integer getDesignationSeatLimit() {
        return designationSeatLimit;
    }

    public void setDesignationSeatLimit(Integer designationSeatLimit) {
        this.designationSeatLimit = designationSeatLimit;
    }

    public Integer getAllottedSeat() {
        return allottedSeat;
    }

    public void setAllottedSeat(Integer allottedSeat) {
        this.allottedSeat = allottedSeat;
    }

    public Integer getNoOfVacant() {
        return noOfVacant;
    }

    public void setNoOfVacant(Integer noOfVacant) {
        this.noOfVacant = noOfVacant;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
