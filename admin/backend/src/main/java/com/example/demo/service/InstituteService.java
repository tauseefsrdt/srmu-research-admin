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

        String oldImage = institute.getImage();
        String newImage = dto.getImage();

        // If image was changed, clean up previous custom uploaded image from /images and /website/public/Images
        if (oldImage != null && !oldImage.isBlank() && !oldImage.equalsIgnoreCase(newImage)) {
            deleteImageFile(oldImage);
        }

        mapDtoToEntity(dto, institute);
        Institute updated = instituteRepository.save(institute);
        return toDto(updated);
    }

    @Transactional
    public void deleteInstitute(Long id) {
        Institute institute = instituteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Institute not found with id: " + id));
        if (institute.getImage() != null) {
            deleteImageFile(institute.getImage());
        }
        instituteRepository.delete(institute);
    }

    private void deleteImageFile(String imagePath) {
        if (imagePath == null || imagePath.isBlank()) return;
        try {
            // Extract filename (e.g., from "/Images/img_64fdcb57.webp" or "http://localhost:8080/api/v1/files/img_64fdcb57.webp")
            String fileName = imagePath;
            if (fileName.contains("/")) {
                fileName = fileName.substring(fileName.lastIndexOf("/") + 1);
            }
            if (fileName.contains("?")) {
                fileName = fileName.substring(0, fileName.indexOf("?"));
            }

            // Only delete dynamically uploaded files starting with "img_" to preserve default preset assets like c1.webp
            if (!fileName.startsWith("img_")) {
                return;
            }

            java.nio.file.Path current = java.nio.file.Paths.get(System.getProperty("user.dir"));
            java.nio.file.Path backendDir = current.endsWith("backend") ? current : current.resolve("admin").resolve("backend");
            java.nio.file.Path root = current.endsWith("backend") ? current.getParent().getParent() : current;

            // 1. Delete from backend /images folder
            java.nio.file.Path backendImg = backendDir.resolve("images").resolve(fileName);
            java.nio.file.Files.deleteIfExists(backendImg);

            // 2. Delete from website/public/Images folder
            java.nio.file.Path webImg = root.resolve("website").resolve("public").resolve("Images").resolve(fileName);
            java.nio.file.Files.deleteIfExists(webImg);
        } catch (Exception e) {
            System.err.println("Could not delete old image file: " + e.getMessage());
        }
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
