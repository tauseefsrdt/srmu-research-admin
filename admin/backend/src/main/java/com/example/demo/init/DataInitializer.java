package com.example.demo.init;

import com.example.demo.entity.AcademicSession;
import com.example.demo.entity.Institute;
import com.example.demo.entity.ResearchCategory;
import com.example.demo.entity.User;
import com.example.demo.repository.AcademicSessionRepository;
import com.example.demo.repository.InstituteRepository;
import com.example.demo.repository.ResearchCategoryRepository;
import com.example.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private AcademicSessionRepository academicSessionRepository;

    @Autowired
    private InstituteRepository instituteRepository;

    @Autowired
    private ResearchCategoryRepository researchCategoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking core configuration and admin credentials...");

        // Ensure Default Admin User exists with BCrypt hashed password
        if (userRepository.findByEmailIgnoreCase("admin@srmu.ac.in").isEmpty()) {
            User defaultAdmin = new User(
                    "admin@srmu.ac.in",
                    "Director Research",
                    passwordEncoder.encode("admin123456"),
                    "ROLE_ADMIN",
                    "Director (Research & Consultancy)");
            userRepository.save(defaultAdmin);
            log.info("Default administrator account verified: admin@srmu.ac.in");
        }

        // Ensure Active Academic Sessions exist
        if (academicSessionRepository.findBySessionCodeIgnoreCase("2025-26").isEmpty()) {
            academicSessionRepository.save(new AcademicSession("2025-26", "Academic Session 2025–26", true));
        }
        if (academicSessionRepository.findBySessionCodeIgnoreCase("2024-25").isEmpty()) {
            academicSessionRepository.save(new AcademicSession("2024-25", "Academic Session 2024–25", false));
        }
        if (academicSessionRepository.findBySessionCodeIgnoreCase("2026-27").isEmpty()) {
            academicSessionRepository.save(new AcademicSession("2026-27", "Academic Session 2026–27", false));
        }

        // Ensure Core Categories exist
        if (researchCategoryRepository.findByCodeIgnoreCase("THESIS_AWARDED").isEmpty()) {
            researchCategoryRepository.save(new ResearchCategory("THESIS_AWARDED", "Ph.D. Theses Awarded",
                    "List of PhD degrees awarded across university institutes", 1));
        }
        if (researchCategoryRepository.findByCodeIgnoreCase("PUBLICATION").isEmpty()) {
            researchCategoryRepository.save(new ResearchCategory("PUBLICATION", "Indexed Research Publications",
                    "High-impact papers indexed in WoS and SCOPUS", 2));
        }
        if (researchCategoryRepository.findByCodeIgnoreCase("PATENT").isEmpty()) {
            researchCategoryRepository.save(new ResearchCategory("PATENT", "Patents & Innovations",
                    "Intellectual property and patented designs", 3));
        }
        if (researchCategoryRepository.findByCodeIgnoreCase("BOOK").isEmpty()) {
            researchCategoryRepository.save(new ResearchCategory("BOOK", "Books & Book Chapters",
                    "Academic books and peer-reviewed chapters", 4));
        }

        log.info("Application initialization check complete. Research repository operating on MySQL database.");
    }
}
