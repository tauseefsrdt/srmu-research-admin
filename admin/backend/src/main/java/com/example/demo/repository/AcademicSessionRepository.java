package com.example.demo.repository;

import com.example.demo.entity.AcademicSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface AcademicSessionRepository extends JpaRepository<AcademicSession, Long> {
    Optional<AcademicSession> findBySessionCodeIgnoreCase(String sessionCode);
    Optional<AcademicSession> findByIsCurrentTrue();
    List<AcademicSession> findAllByOrderBySessionCodeDesc();
}
