package com.example.demo.repository;

import com.example.demo.entity.FacultySeatMatrix;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacultySeatMatrixRepository extends JpaRepository<FacultySeatMatrix, Long> {

    List<FacultySeatMatrix> findByAcademicSessionSessionCode(String sessionCode);

    List<FacultySeatMatrix> findByInstituteId(Long instituteId);

    @Query("SELECT f FROM FacultySeatMatrix f WHERE " +
           "(:sessionCode IS NULL OR f.academicSession.sessionCode = :sessionCode) AND " +
           "(:instituteId IS NULL OR (f.institute IS NOT NULL AND f.institute.id = :instituteId)) AND " +
           "(:search IS NULL OR LOWER(f.supervisorName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(f.department) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(f.instituteName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(f.designation) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<FacultySeatMatrix> searchFacultySeats(
            @Param("sessionCode") String sessionCode,
            @Param("instituteId") Long instituteId,
            @Param("search") String search,
            Pageable pageable
    );
}
