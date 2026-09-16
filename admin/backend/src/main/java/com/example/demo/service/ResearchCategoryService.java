package com.example.demo.service;

import com.example.demo.dto.ResearchCategoryDto;
import com.example.demo.entity.ResearchCategory;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ResearchCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResearchCategoryService {

    @Autowired
    private ResearchCategoryRepository researchCategoryRepository;

    public List<ResearchCategoryDto> getAllCategories() {
        return researchCategoryRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ResearchCategoryDto getCategoryById(Long id) {
        ResearchCategory cat = researchCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return toDto(cat);
    }

    public ResearchCategoryDto getCategoryByCode(String code) {
        ResearchCategory cat = researchCategoryRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with code: " + code));
        return toDto(cat);
    }

    @Transactional
    public ResearchCategoryDto createCategory(ResearchCategoryDto dto) {
        ResearchCategory cat = new ResearchCategory();
        mapDtoToEntity(dto, cat);
        ResearchCategory saved = researchCategoryRepository.save(cat);
        return toDto(saved);
    }

    @Transactional
    public ResearchCategoryDto updateCategory(Long id, ResearchCategoryDto dto) {
        ResearchCategory cat = researchCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        mapDtoToEntity(dto, cat);
        ResearchCategory updated = researchCategoryRepository.save(cat);
        return toDto(updated);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!researchCategoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        researchCategoryRepository.deleteById(id);
    }

    public ResearchCategoryDto toDto(ResearchCategory entity) {
        if (entity == null) return null;
        ResearchCategoryDto dto = new ResearchCategoryDto();
        dto.setId(entity.getId());
        dto.setCode(entity.getCode());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setDisplayOrder(entity.getDisplayOrder());
        return dto;
    }

    private void mapDtoToEntity(ResearchCategoryDto dto, ResearchCategory entity) {
        entity.setCode(dto.getCode());
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0);
    }
}
