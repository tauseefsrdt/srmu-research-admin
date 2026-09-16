package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class FacultySeatMatrixDto {
    private Long id;
    private Integer rowIndex;

    private Long academicSessionId;
    private String academicSessionCode;

    private Long instituteId;
    private String instituteTitle;
    private String instituteName;

    @NotBlank(message = "Department is required")
    private String department;
    private String rawDepartment;

    private Integer totalPhD;

    @NotBlank(message = "Supervisor name is required")
    private String supervisorName;

    private String designation;
    private Integer designationSeatLimit;
    private Integer allottedSeat;
    private Integer noOfVacant;
    private Boolean active;

    public FacultySeatMatrixDto() {}

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
