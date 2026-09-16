package com.example.demo.repository;

import com.example.demo.entity.ResearchItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResearchItemRepository extends JpaRepository<ResearchItem, Long>, JpaSpecificationExecutor<ResearchItem> {

    List<ResearchItem> findByCategoryCodeIgnoreCase(String categoryCode);

    List<ResearchItem> findByCategoryCodeIgnoreCaseAndAcademicSessionSessionCode(String categoryCode, String sessionCode);

    Page<ResearchItem> findByCategoryCodeIgnoreCase(String categoryCode, Pageable pageable);

    @Query("SELECT r FROM ResearchItem r WHERE " +
           "(:sessionCode IS NULL OR r.academicSession.sessionCode = :sessionCode) AND " +
           "(:categoryCode IS NULL OR LOWER(r.category.code) = LOWER(:categoryCode)) AND " +
           "(:instituteId IS NULL OR (r.institute IS NOT NULL AND r.institute.id = :instituteId)) AND " +
           "(:year IS NULL OR r.publicationYear LIKE CONCAT('%', :year, '%')) AND " +
           "(:search IS NULL OR LOWER(r.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(r.primaryAuthor) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(r.coAuthors) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(r.venue) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(r.department) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(r.identifier) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<ResearchItem> searchResearch(
            @Param("sessionCode") String sessionCode,
            @Param("categoryCode") String categoryCode,
            @Param("instituteId") Long instituteId,
            @Param("year") String year,
            @Param("search") String search,
            Pageable pageable
    );

    long countByCategoryCodeIgnoreCase(String categoryCode);

    long countByCategoryCodeIgnoreCaseAndAcademicSessionSessionCode(String categoryCode, String sessionCode);
}
