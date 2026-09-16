package com.example.demo.repository;

import com.example.demo.entity.ResearchCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResearchCategoryRepository extends JpaRepository<ResearchCategory, Long> {
    Optional<ResearchCategory> findByCodeIgnoreCase(String code);
    List<ResearchCategory> findAllByOrderByDisplayOrderAsc();
}
