package com.example.demo.service;

import com.example.demo.dto.FacultySeatMatrixDto;
import com.example.demo.dto.PageResponse;
import com.example.demo.entity.AcademicSession;
import com.example.demo.entity.FacultySeatMatrix;
import com.example.demo.entity.Institute;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.AcademicSessionRepository;
import com.example.demo.repository.FacultySeatMatrixRepository;
import com.example.demo.repository.InstituteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacultySeatService {

    @Autowired
    private FacultySeatMatrixRepository facultySeatMatrixRepository;

    @Autowired
    private AcademicSessionRepository academicSessionRepository;

    @Autowired
    private InstituteRepository instituteRepository;

    public PageResponse<FacultySeatMatrixDto> searchFacultySeats(
            String sessionCode,
            Long instituteId,
            String search,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "rowIndex", "id"));
        String cleanSearch = (search != null && !search.isBlank()) ? search.trim() : null;
        String cleanSession = (sessionCode != null && !sessionCode.isBlank() && !"ALL".equalsIgnoreCase(sessionCode)) ? sessionCode.trim() : null;

        Page<FacultySeatMatrix> resultPage = facultySeatMatrixRepository.searchFacultySeats(
                cleanSession,
                instituteId,
                cleanSearch,
                pageable
        );

        List<FacultySeatMatrixDto> dtoList = resultPage.getContent().stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return new PageResponse<>(
                dtoList,
                resultPage.getNumber(),
                resultPage.getSize(),
                resultPage.getTotalElements(),
                resultPage.getTotalPages(),
                resultPage.isLast()
        );
    }

    public List<FacultySeatMatrixDto> getAllBySession(String sessionCode) {
        List<FacultySeatMatrix> list;
        if (sessionCode != null && !sessionCode.isBlank() && !"ALL".equalsIgnoreCase(sessionCode)) {
            list = facultySeatMatrixRepository.findByAcademicSessionSessionCode(sessionCode);
        } else {
            list = facultySeatMatrixRepository.findAll();
        }
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    public FacultySeatMatrixDto getFacultySeatById(Long id) {
        FacultySeatMatrix seat = facultySeatMatrixRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty seat record not found with id: " + id));
        return toDto(seat);
    }

    @Transactional
    public FacultySeatMatrixDto createFacultySeat(FacultySeatMatrixDto dto) {
        FacultySeatMatrix entity = new FacultySeatMatrix();
        mapDtoToEntity(dto, entity);
        FacultySeatMatrix saved = facultySeatMatrixRepository.save(entity);
        return toDto(saved);
    }

    @Transactional
    public FacultySeatMatrixDto updateFacultySeat(Long id, FacultySeatMatrixDto dto) {
        FacultySeatMatrix entity = facultySeatMatrixRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty seat record not found with id: " + id));
        mapDtoToEntity(dto, entity);
        FacultySeatMatrix updated = facultySeatMatrixRepository.save(entity);
        return toDto(updated);
    }

    @Transactional
    public void deleteFacultySeat(Long id) {
        if (!facultySeatMatrixRepository.existsById(id)) {
            throw new ResourceNotFoundException("Faculty seat record not found with id: " + id);
        }
        facultySeatMatrixRepository.deleteById(id);
    }

    public FacultySeatMatrixDto toDto(FacultySeatMatrix entity) {
        if (entity == null) return null;
        FacultySeatMatrixDto dto = new FacultySeatMatrixDto();
        dto.setId(entity.getId());
        dto.setRowIndex(entity.getRowIndex());

        if (entity.getAcademicSession() != null) {
            dto.setAcademicSessionId(entity.getAcademicSession().getId());
            dto.setAcademicSessionCode(entity.getAcademicSession().getSessionCode());
        }

        if (entity.getInstitute() != null) {
            dto.setInstituteId(entity.getInstitute().getId());
            dto.setInstituteTitle(entity.getInstitute().getTitle());
        }

        dto.setInstituteName(entity.getInstituteName());
        dto.setDepartment(entity.getDepartment());
        dto.setRawDepartment(entity.getRawDepartment());
        dto.setTotalPhD(entity.getTotalPhD());
        dto.setSupervisorName(entity.getSupervisorName());
        dto.setDesignation(entity.getDesignation());
        dto.setDesignationSeatLimit(entity.getDesignationSeatLimit());
        dto.setAllottedSeat(entity.getAllottedSeat());
        dto.setNoOfVacant(entity.getNoOfVacant());
        dto.setActive(entity.getActive());
        return dto;
    }

    private void mapDtoToEntity(FacultySeatMatrixDto dto, FacultySeatMatrix entity) {
        entity.setRowIndex(dto.getRowIndex());

        if (dto.getAcademicSessionId() != null) {
            AcademicSession session = academicSessionRepository.findById(dto.getAcademicSessionId())
                    .orElse(null);
            entity.setAcademicSession(session);
        }

        if (dto.getInstituteId() != null) {
            Institute inst = instituteRepository.findById(dto.getInstituteId())
                    .orElse(null);
            entity.setInstitute(inst);
            if (inst != null && (dto.getInstituteName() == null || dto.getInstituteName().isBlank())) {
                entity.setInstituteName(inst.getTitle());
            }
        } else if (dto.getInstituteName() != null) {
            entity.setInstituteName(dto.getInstituteName());
        }

        entity.setDepartment(dto.getDepartment());
        entity.setRawDepartment(dto.getRawDepartment());
        entity.setTotalPhD(dto.getTotalPhD());
        entity.setSupervisorName(dto.getSupervisorName());
        entity.setDesignation(dto.getDesignation());
        entity.setDesignationSeatLimit(dto.getDesignationSeatLimit() != null ? dto.getDesignationSeatLimit() : 0);
        entity.setAllottedSeat(dto.getAllottedSeat() != null ? dto.getAllottedSeat() : 0);
        entity.setNoOfVacant(dto.getNoOfVacant() != null ? dto.getNoOfVacant() : 0);
        entity.setActive(dto.getActive() != null ? dto.getActive() : true);
    }
}
