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

    private Path getRootImagesDir() {
        Path current = Paths.get(System.getProperty("user.dir"));
        // If running inside admin/backend, parent of admin is new-crud root
        Path root = current;
        if (root.endsWith("backend")) {
            root = root.getParent().getParent();
        } else if (root.endsWith("admin")) {
            root = root.getParent();
        }
        Path imagesDir = root.resolve("images");
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
            Path rootImagesDir = getRootImagesDir();
            Path targetPath = rootImagesDir.resolve(newFilename);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Also copy to website public directory for local vite dev server immediate access
            try {
                Path websiteImagesDir = rootImagesDir.getParent().resolve("website").resolve("public").resolve("Images");
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
            Path filePath = getRootImagesDir().resolve(fileName);
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
