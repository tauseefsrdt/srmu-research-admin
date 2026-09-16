package com.example.demo.service;

import com.example.demo.dto.AcademicSessionDto;
import com.example.demo.entity.AcademicSession;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.AcademicSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AcademicSessionService {

    @Autowired
    private AcademicSessionRepository academicSessionRepository;

    public List<AcademicSessionDto> getAllSessions() {
        return academicSessionRepository.findAllByOrderBySessionCodeDesc()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public AcademicSessionDto getSessionById(Long id) {
        AcademicSession session = academicSessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Academic Session not found with id: " + id));
        return toDto(session);
    }

    public AcademicSessionDto getCurrentSession() {
        AcademicSession session = academicSessionRepository.findByIsCurrentTrue()
                .orElseGet(() -> academicSessionRepository.findAll().stream().findFirst().orElse(null));
        return toDto(session);
    }

    @Transactional
    public AcademicSessionDto createSession(AcademicSessionDto dto) {
        if (Boolean.TRUE.equals(dto.getIsCurrent())) {
            unsetOtherCurrentSessions();
        }
        AcademicSession session = new AcademicSession();
        mapDtoToEntity(dto, session);
        AcademicSession saved = academicSessionRepository.save(session);
        return toDto(saved);
    }

    @Transactional
    public AcademicSessionDto updateSession(Long id, AcademicSessionDto dto) {
        AcademicSession session = academicSessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Academic Session not found with id: " + id));
        if (Boolean.TRUE.equals(dto.getIsCurrent())) {
            unsetOtherCurrentSessions();
        }
        mapDtoToEntity(dto, session);
        AcademicSession updated = academicSessionRepository.save(session);
        return toDto(updated);
    }

    @Transactional
    public void deleteSession(Long id) {
        if (!academicSessionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Academic Session not found with id: " + id);
        }
        academicSessionRepository.deleteById(id);
    }

    private void unsetOtherCurrentSessions() {
        List<AcademicSession> list = academicSessionRepository.findAll();
        for (AcademicSession s : list) {
            s.setIsCurrent(false);
            academicSessionRepository.save(s);
        }
    }

    public AcademicSessionDto toDto(AcademicSession entity) {
        if (entity == null) return null;
        AcademicSessionDto dto = new AcademicSessionDto();
        dto.setId(entity.getId());
        dto.setSessionCode(entity.getSessionCode());
        dto.setName(entity.getName());
        dto.setIsCurrent(entity.getIsCurrent());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        return dto;
    }

    private void mapDtoToEntity(AcademicSessionDto dto, AcademicSession entity) {
        entity.setSessionCode(dto.getSessionCode());
        entity.setName(dto.getName());
        entity.setIsCurrent(dto.getIsCurrent() != null ? dto.getIsCurrent() : false);
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
    }
}
