package com.example.demo.repository;

import com.example.demo.entity.Institute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InstituteRepository extends JpaRepository<Institute, Long> {
    Optional<Institute> findByCodeIgnoreCase(String code);
    Optional<Institute> findBySlugIgnoreCase(String slug);
    List<Institute> findAllByOrderByDisplayOrderAsc();
    List<Institute> findByActiveTrueOrderByDisplayOrderAsc();
}
