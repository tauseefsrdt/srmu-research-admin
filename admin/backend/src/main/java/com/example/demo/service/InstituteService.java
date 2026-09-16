package com.example.demo.service;

import com.example.demo.dto.InstituteDto;
import com.example.demo.entity.Institute;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.InstituteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InstituteService {

    @Autowired
    private InstituteRepository instituteRepository;

    public List<InstituteDto> getAllInstitutes() {
        return instituteRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public InstituteDto getInstituteById(Long id) {
        Institute inst = instituteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Institute not found with id: " + id));
        return toDto(inst);
    }

    public InstituteDto getInstituteBySlug(String slug) {
        Institute inst = instituteRepository.findBySlugIgnoreCase(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Institute not found with slug: " + slug));
        return toDto(inst);
    }

    @Transactional
    public InstituteDto createInstitute(InstituteDto dto) {
        Institute institute = new Institute();
        mapDtoToEntity(dto, institute);
        Institute saved = instituteRepository.save(institute);
        return toDto(saved);
    }

    @Transactional
    public InstituteDto updateInstitute(Long id, InstituteDto dto) {
        Institute institute = instituteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Institute not found with id: " + id));
        mapDtoToEntity(dto, institute);
        Institute updated = instituteRepository.save(institute);
        return toDto(updated);
    }

    @Transactional
    public void deleteInstitute(Long id) {
        if (!instituteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Institute not found with id: " + id);
        }
        instituteRepository.deleteById(id);
    }

    public InstituteDto toDto(Institute entity) {
        if (entity == null) return null;
        InstituteDto dto = new InstituteDto();
        dto.setId(entity.getId());
        dto.setCode(entity.getCode());
        dto.setTitle(entity.getTitle());
        dto.setSlug(entity.getSlug());
        dto.setDepartmentCountLabel(entity.getDepartmentCountLabel());
        dto.setDescription(entity.getDescription());
        dto.setImage(entity.getImage());
        dto.setPrograms(entity.getPrograms());
        dto.setDisplayOrder(entity.getDisplayOrder());
        dto.setActive(entity.getActive());
        return dto;
    }

    private void mapDtoToEntity(InstituteDto dto, Institute entity) {
        entity.setCode(dto.getCode());
        entity.setTitle(dto.getTitle());
        entity.setSlug(dto.getSlug());
        entity.setDepartmentCountLabel(dto.getDepartmentCountLabel());
        entity.setDescription(dto.getDescription());
        entity.setImage(dto.getImage());
        if (dto.getPrograms() != null) {
            entity.setPrograms(dto.getPrograms());
        }
        entity.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0);
        entity.setActive(dto.getActive() != null ? dto.getActive() : true);
    }
}
