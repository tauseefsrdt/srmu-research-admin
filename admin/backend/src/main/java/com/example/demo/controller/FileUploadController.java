package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/files")
public class FileUploadController {

    private Path getImagesDir() {
        Path current = Paths.get(System.getProperty("user.dir"));
        // Ensure path resolves to admin/backend/images
        Path backendDir = current;
        if (!backendDir.endsWith("backend")) {
            backendDir = backendDir.resolve("admin").resolve("backend");
        }
        Path imagesDir = backendDir.resolve("images");
        try {
            Files.createDirectories(imagesDir);
        } catch (IOException ignored) {}
        return imagesDir;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("File is empty"));
        }

        try {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String newFilename = "img_" + UUID.randomUUID().toString().substring(0, 8) + extension;
            Path imagesDir = getImagesDir();
            Path targetPath = imagesDir.resolve(newFilename);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Also copy to website public directory for local website immediate rendering
            try {
                Path current = Paths.get(System.getProperty("user.dir"));
                Path root = current.endsWith("backend") ? current.getParent().getParent() : current;
                Path websiteImagesDir = root.resolve("website").resolve("public").resolve("Images");
                Files.createDirectories(websiteImagesDir);
                Files.copy(targetPath, websiteImagesDir.resolve(newFilename), StandardCopyOption.REPLACE_EXISTING);
            } catch (Exception ignored) {}

            String fileUrl = "http://localhost:8080/api/v1/files/" + newFilename;
            String relativeUrl = "/Images/" + newFilename;

            Map<String, String> response = new HashMap<>();
            response.put("fileName", newFilename);
            response.put("fileUrl", fileUrl);
            response.put("relativeUrl", relativeUrl);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok("File uploaded successfully", response));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to store file: " + e.getMessage()));
        }
    }

    @GetMapping("/{fileName:.+}")
    public ResponseEntity<byte[]> getFile(@PathVariable String fileName) {
        try {
            Path filePath = getImagesDir().resolve(fileName);
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            byte[] imageBytes = Files.readAllBytes(filePath);
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
