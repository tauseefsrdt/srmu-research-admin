package com.example.demo.service;

import com.example.demo.dto.PageResponse;
import com.example.demo.dto.ResearchItemDto;
import com.example.demo.entity.AcademicSession;
import com.example.demo.entity.Institute;
import com.example.demo.entity.ResearchCategory;
import com.example.demo.entity.ResearchItem;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.AcademicSessionRepository;
import com.example.demo.repository.InstituteRepository;
import com.example.demo.repository.ResearchCategoryRepository;
import com.example.demo.repository.ResearchItemRepository;
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
public class ResearchItemService {

    @Autowired
    private ResearchItemRepository researchItemRepository;

    @Autowired
    private AcademicSessionRepository academicSessionRepository;

    @Autowired
    private InstituteRepository instituteRepository;

    @Autowired
    private ResearchCategoryRepository researchCategoryRepository;

    public PageResponse<ResearchItemDto> searchResearchItems(
            String sessionCode,
            String categoryCode,
            Long instituteId,
            String year,
            String search,
            int page,
            int size,
            String sortBy,
            String sortDirection
    ) {
        Sort sort = Sort.by(
                "DESC".equalsIgnoreCase(sortDirection) ? Sort.Direction.DESC : Sort.Direction.ASC,
                sortBy != null && !sortBy.isBlank() ? sortBy : "id"
        );
        Pageable pageable = PageRequest.of(page, size, sort);

        String cleanSearch = (search != null && !search.isBlank()) ? search.trim() : null;
        String cleanSession = (sessionCode != null && !sessionCode.isBlank() && !"ALL".equalsIgnoreCase(sessionCode)) ? sessionCode.trim() : null;
        String cleanCategory = (categoryCode != null && !categoryCode.isBlank() && !"ALL".equalsIgnoreCase(categoryCode)) ? categoryCode.trim() : null;
        String cleanYear = (year != null && !year.isBlank() && !"ALL".equalsIgnoreCase(year)) ? year.trim() : null;

        Page<ResearchItem> resultPage = researchItemRepository.searchResearch(
                cleanSession,
                cleanCategory,
                instituteId,
                cleanYear,
                cleanSearch,
                pageable
        );

        List<ResearchItemDto> dtoList = resultPage.getContent().stream()
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

    public List<ResearchItemDto> getByCategoryAndSession(String categoryCode, String sessionCode) {
        List<ResearchItem> list;
        if (sessionCode != null && !sessionCode.isBlank() && !"ALL".equalsIgnoreCase(sessionCode)) {
            list = researchItemRepository.findByCategoryCodeIgnoreCaseAndAcademicSessionSessionCode(categoryCode, sessionCode);
        } else {
            list = researchItemRepository.findByCategoryCodeIgnoreCase(categoryCode);
        }
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    public ResearchItemDto getResearchItemById(Long id) {
        ResearchItem item = researchItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Research Item not found with id: " + id));
        return toDto(item);
    }

    @Transactional
    public ResearchItemDto createResearchItem(ResearchItemDto dto) {
        ResearchItem item = new ResearchItem();
        mapDtoToEntity(dto, item);
        ResearchItem saved = researchItemRepository.save(item);
        return toDto(saved);
    }

    @Transactional
    public ResearchItemDto updateResearchItem(Long id, ResearchItemDto dto) {
        ResearchItem item = researchItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Research Item not found with id: " + id));
        mapDtoToEntity(dto, item);
        ResearchItem updated = researchItemRepository.save(item);
        return toDto(updated);
    }

    @Transactional
    public void deleteResearchItem(Long id) {
        if (!researchItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Research Item not found with id: " + id);
        }
        researchItemRepository.deleteById(id);
    }

    public ResearchItemDto toDto(ResearchItem entity) {
        if (entity == null) return null;
        ResearchItemDto dto = new ResearchItemDto();
        dto.setId(entity.getId());
        dto.setSrNo(entity.getSrNo());

        if (entity.getAcademicSession() != null) {
            dto.setAcademicSessionId(entity.getAcademicSession().getId());
            dto.setAcademicSessionCode(entity.getAcademicSession().getSessionCode());
        }

        if (entity.getInstitute() != null) {
            dto.setInstituteId(entity.getInstitute().getId());
            dto.setInstituteTitle(entity.getInstitute().getTitle());
            dto.setInstituteCode(entity.getInstitute().getCode());
        }

        if (entity.getCategory() != null) {
            dto.setCategoryId(entity.getCategory().getId());
            dto.setCategoryCode(entity.getCategory().getCode());
            dto.setCategoryName(entity.getCategory().getName());
        }

        dto.setDepartment(entity.getDepartment());
        dto.setRawFacultyInstitute(entity.getRawFacultyInstitute());
        dto.setTitle(entity.getTitle());
        dto.setPrimaryAuthor(entity.getPrimaryAuthor());
        dto.setCoAuthors(entity.getCoAuthors());
        dto.setIdentifier(entity.getIdentifier());
        dto.setVenue(entity.getVenue());
        dto.setEventOrAwardDate(entity.getEventOrAwardDate());
        dto.setPublicationYear(entity.getPublicationYear());
        dto.setExternalLink(entity.getExternalLink());
        dto.setAbstractText(entity.getAbstractText());
        dto.setStatus(entity.getStatus());
        dto.setFeatured(entity.getFeatured());
        dto.setCitations(entity.getCitations());
        dto.setExtraDetails(entity.getExtraDetails());
        return dto;
    }

    private void mapDtoToEntity(ResearchItemDto dto, ResearchItem entity) {
        entity.setSrNo(dto.getSrNo());

        if (dto.getAcademicSessionId() != null) {
            AcademicSession session = academicSessionRepository.findById(dto.getAcademicSessionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Academic Session not found with id: " + dto.getAcademicSessionId()));
            entity.setAcademicSession(session);
        }

        if (dto.getInstituteId() != null) {
            Institute inst = instituteRepository.findById(dto.getInstituteId())
                    .orElse(null);
            entity.setInstitute(inst);
        } else {
            entity.setInstitute(null);
        }

        if (dto.getCategoryId() != null) {
            ResearchCategory cat = researchCategoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Research Category not found with id: " + dto.getCategoryId()));
            entity.setCategory(cat);
        }

        entity.setDepartment(dto.getDepartment());
        entity.setRawFacultyInstitute(dto.getRawFacultyInstitute());
        entity.setTitle(dto.getTitle());
        entity.setPrimaryAuthor(dto.getPrimaryAuthor());
        entity.setCoAuthors(dto.getCoAuthors());
        entity.setIdentifier(dto.getIdentifier());
        entity.setVenue(dto.getVenue());
        entity.setEventOrAwardDate(dto.getEventOrAwardDate());
        entity.setPublicationYear(dto.getPublicationYear());
        entity.setExternalLink(dto.getExternalLink());
        entity.setAbstractText(dto.getAbstractText());
        entity.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");
        entity.setFeatured(dto.getFeatured() != null ? dto.getFeatured() : false);
        entity.setCitations(dto.getCitations() != null ? dto.getCitations() : 0);
        entity.setExtraDetails(dto.getExtraDetails());
    }
}
