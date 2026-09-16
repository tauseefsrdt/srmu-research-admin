package com.example.demo.repository;

import com.example.demo.entity.Institute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InstituteRepository extends JpaRepository<Institute, Long> {
    Optional<Institute> findByCodeIgnoreCase(String code);
    Optional<Institute> findBySlugIgnoreCase(String slug);
    List<Institute> findAllByOrderByDisplayOrderAsc();
    List<Institute> findByActiveTrueOrderByDisplayOrderAsc();

    @Query("SELECT i FROM Institute i WHERE i.active = true AND (" +
           "LOWER(i.title) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(i.code) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(i.description) LIKE LOWER(CONCAT('%', :q, '%')))")
    List<Institute> searchInstitutes(@Param("q") String q);
}
