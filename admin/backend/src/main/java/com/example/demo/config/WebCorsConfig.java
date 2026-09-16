package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebCorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:5173",
                        "http://localhost:5174",
                        "http://localhost:3000",
                        "http://127.0.0.1:5173",
                        "http://127.0.0.1:5174",
                        "http://127.0.0.1:3000"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry registry) {
        java.nio.file.Path rootImages = java.nio.file.Paths.get(System.getProperty("user.dir"));
        if (rootImages.endsWith("backend")) {
            rootImages = rootImages.getParent().getParent();
        } else if (rootImages.endsWith("admin")) {
            rootImages = rootImages.getParent();
        }
        rootImages = rootImages.resolve("images");
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + rootImages.toAbsolutePath().toString().replace("\\", "/") + "/");
    }
}
