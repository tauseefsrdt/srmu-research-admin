package com.example.demo.init;

import com.example.demo.entity.AcademicSession;
import com.example.demo.entity.FacultySeatMatrix;
import com.example.demo.entity.Institute;
import com.example.demo.entity.ResearchCategory;
import com.example.demo.entity.ResearchItem;
import com.example.demo.repository.AcademicSessionRepository;
import com.example.demo.repository.FacultySeatMatrixRepository;
import com.example.demo.repository.InstituteRepository;
import com.example.demo.repository.ResearchCategoryRepository;
import com.example.demo.repository.ResearchItemRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.*;

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
    private ResearchItemRepository researchItemRepository;

    @Autowired
    private FacultySeatMatrixRepository facultySeatMatrixRepository;

    @Autowired
    private com.example.demo.repository.UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void run(String... args) throws Exception {
        log.info("Initializing research and academic session seed data...");

        // 0. Initialize Default Admin Account if not present
        if (userRepository.findByEmailIgnoreCase("admin@srmu.ac.in").isEmpty()) {
            com.example.demo.entity.User defaultAdmin = new com.example.demo.entity.User(
                    "admin@srmu.ac.in",
                    "Director Research",
                    passwordEncoder.encode("admin123"),
                    "ROLE_ADMIN",
                    "Director (Research & Consultancy)"
            );
            userRepository.save(defaultAdmin);
            log.info("Created default administrator account: admin@srmu.ac.in / admin123");
        }

        // 1. Initialize Academic Sessions
        AcademicSession session2025_26 = academicSessionRepository.findBySessionCodeIgnoreCase("2025-26")
                .orElseGet(() -> academicSessionRepository.save(new AcademicSession("2025-26", "Academic Session 2025–26", true)));

        if (academicSessionRepository.findBySessionCodeIgnoreCase("2024-25").isEmpty()) {
            academicSessionRepository.save(new AcademicSession("2024-25", "Academic Session 2024–25", false));
        }
        if (academicSessionRepository.findBySessionCodeIgnoreCase("2026-27").isEmpty()) {
            academicSessionRepository.save(new AcademicSession("2026-27", "Academic Session 2026–27", false));
        }

        // 2. Initialize Research Categories
        ResearchCategory catTheses = researchCategoryRepository.findByCodeIgnoreCase("THESIS_AWARDED")
                .orElseGet(() -> researchCategoryRepository.save(new ResearchCategory("THESIS_AWARDED", "Ph.D. Theses Awarded", "List of PhD degrees awarded across university institutes", 1)));

        ResearchCategory catPubs = researchCategoryRepository.findByCodeIgnoreCase("PUBLICATION")
                .orElseGet(() -> researchCategoryRepository.save(new ResearchCategory("PUBLICATION", "Indexed Research Publications", "High-impact papers indexed in WoS and SCOPUS", 2)));

        ResearchCategory catPatents = researchCategoryRepository.findByCodeIgnoreCase("PATENT")
                .orElseGet(() -> researchCategoryRepository.save(new ResearchCategory("PATENT", "Patents & Innovations", "Intellectual property and patented designs", 3)));

        ResearchCategory catBooks = researchCategoryRepository.findByCodeIgnoreCase("BOOK")
                .orElseGet(() -> researchCategoryRepository.save(new ResearchCategory("BOOK", "Books & Book Chapters", "Academic books and peer-reviewed chapters", 4)));

        // 3. Initialize Institutes
        Map<String, Institute> instituteMap = new HashMap<>();
        seedInstitutes(instituteMap);

        // 4. Seed 2025-26 Theses Awarded if not present
        if (researchItemRepository.countByCategoryCodeIgnoreCaseAndAcademicSessionSessionCode("THESIS_AWARDED", "2025-26") == 0) {
            seedTheses(session2025_26, catTheses, instituteMap);
        }

        // 5. Seed Patents if not present
        if (researchItemRepository.countByCategoryCodeIgnoreCase("PATENT") == 0) {
            seedPatents(session2025_26, catPatents, instituteMap);
        }

        // 6. Seed Publications if not present
        if (researchItemRepository.countByCategoryCodeIgnoreCase("PUBLICATION") == 0) {
            seedPublications(session2025_26, catPubs, instituteMap);
        }

        // 7. Seed Books if not present
        if (researchItemRepository.countByCategoryCodeIgnoreCase("BOOK") == 0) {
            seedBooks(session2025_26, catBooks, instituteMap);
        }

        // 8. Seed Vacant Seat Matrix if not present
        if (facultySeatMatrixRepository.count() == 0) {
            seedVacantSeats(session2025_26, instituteMap);
        }

        log.info("Seed data initialization complete!");
    }

    private void seedInstitutes(Map<String, Institute> map) {
        List<InstituteDefinition> defs = Arrays.asList(
                new InstituteDefinition("IoT", "Institute of Technology", "institute-of-technology", "5 DEPARTMENTS",
                        "The Institute of Technology is committed to provide focused learning in the fields of engineering with an aim of creating human resources with knowledge and skills to contribute successfully to a complex world.",
                        "/Images/c1.webp", Arrays.asList("Civil Engineering", "Computer Science & Engineering (CSE)", "Electrical Engineering", "Electronics & Communication Engineering", "Mechanical Engineering"), 1),

                new InstituteDefinition("IBST", "Institute of Biosciences and Technology", "institute-of-biosciences-and-technology", "3 DEPARTMENTS",
                        "Biotechnology encompasses the applications of understanding of the biological systems to improve human life by addressing challenges and issues facing agricultural sciences, medical sciences, food sciences, etc.",
                        "/Images/c2.jpg", Arrays.asList("Bio Sciences & Bio Technology", "Bio Technology", "Biomedical Sciences"), 2),

                new InstituteDefinition("IMCE", "Institute of Management, Commerce and Economics", "institute-of-management-commerce-and-economics", "3 DEPARTMENTS",
                        "The Institute of Management, Commerce and Economics (IMCE) was started in the year 2012. IMCE seeks to be a trailblazer in management education through strong academic-industry collaboration for international alliances.",
                        "/Images/c3.webp", Arrays.asList("Commerce & Management", "Data Science & Predictive Analytics", "Healthcare Management"), 3),

                new InstituteDefinition("IMS", "Institute of Media Studies", "institute-of-media-studies", "2 DEPARTMENTS",
                        "Journalism and Mass Communication study is an encouragement to think about the forces involved in giving it shape. Mass Media industry is one of the fastest growing industries with the mission of social conscience.",
                        "/Images/c4.jpg", Arrays.asList("Journalism and Mass Communication", "Media and Film Studies"), 4),

                new InstituteDefinition("INSH", "Institute of Natural Sciences and Humanities", "institute-of-natural-sciences-and-humanities", "4 DEPARTMENTS",
                        "The Institute boasts of being the heart and soul of the University as its various disciplines of knowledge is essentially required with all the academic programs that run across the University.",
                        "/Images/c5.webp", Arrays.asList("Chemical Sciences", "Humanities & Social Sciences", "Mathematical & Statistical Sciences", "Physical Sciences"), 5),

                new InstituteDefinition("IOP", "Institute of Pharmaceutical Sciences", "institute-of-pharmaceutical-sciences", "3 DEPARTMENTS",
                        "Due to its integration of chemistry and health sciences, pharmaceutical science is both a unique field and extremely important to human survival.",
                        "/Images/c6.webp", Arrays.asList("Ph.D in Pharmaceutical Science", "Pharmaceutics & Pharmaceutical Chemistry", "Pharmacology"), 6),

                new InstituteDefinition("IAST", "Institute of Agricultural Sciences and Technology", "institute-of-agricultural-sciences-and-technology", "3 DEPARTMENTS",
                        "The Indian Council of Agricultural Sciences has already recognized the B.Sc.(Hons.) Agriculture 4 Years as a professional Degree with consequential benefits to the Students.",
                        "/Images/c7.webp", Arrays.asList("B.Sc.(Hons.) Agriculture", "Agricultural Sciences and Technology", "Agronomy and Horticulture"), 7),

                new InstituteDefinition("ILS", "Institute of Legal Studies", "institute-of-legal-studies", "3 DEPARTMENTS",
                        "The Institute of Legal Studies is a convergence of academic, cultural and intellectual resources. It aims at achieving the highest levels of distinction in the innovation and transmission of knowledge and understanding.",
                        "/Images/c8.avif", Arrays.asList("LL.B. & Integrated Law", "LL.M. & Ph.D in Law", "Legal Studies and Jurisprudence"), 8),

                new InstituteDefinition("IOPH", "Institute of Pharmacy", "institute-of-pharmacy", "3 DEPARTMENTS",
                        "Pharmacy is one of the unique professions and also very vital for the sustenance of human lives as it involves the combination of chemical science with health sciences.",
                        "/Images/c9.webp", Arrays.asList("Bachelor of Pharmacy (B.Pharm)", "Master of Pharmacy (M.Pharm)", "Ph.D in Pharmaceutical Sciences"), 9),

                new InstituteDefinition("IER", "Institute of Education and Research", "institute-of-education-and-research", "3 DEPARTMENTS",
                        "The Institute of Education and Research is dedicated to fostering progressive teaching methodologies, educational psychology, and innovative academic research.",
                        "/Images/c1.webp", Arrays.asList("Education & Research", "Ph.D in Advance Educational Studies", "Teacher Education & Pedagogy"), 10)
        );

        for (InstituteDefinition def : defs) {
            Institute inst = instituteRepository.findBySlugIgnoreCase(def.slug)
                    .orElseGet(() -> instituteRepository.save(new Institute(
                            def.code, def.title, def.slug, def.departmentCountLabel, def.description, def.image, def.programs, def.displayOrder
                    )));
            map.put(def.code, inst);
            map.put(def.slug, inst);
            map.put(def.title.toLowerCase(), inst);
        }
    }

    private Institute matchInstitute(String instituteText, Map<String, Institute> map) {
        if (instituteText == null) return null;
        String lower = instituteText.toLowerCase();
        if (lower.contains("technology") || lower.contains("cse") || lower.contains("iot")) return map.get("IoT");
        if (lower.contains("biosciences") || lower.contains("biotechnology") || lower.contains("ibst")) return map.get("IBST");
        if (lower.contains("management") || lower.contains("commerce") || lower.contains("economics") || lower.contains("imce")) return map.get("IMCE");
        if (lower.contains("media") || lower.contains("ims")) return map.get("IMS");
        if (lower.contains("natural sciences") || lower.contains("humanities") || lower.contains("insh")) return map.get("INSH");
        if (lower.contains("pharmaceutical") || lower.contains("pharmacy") || lower.contains("iop")) return map.get("IOP");
        if (lower.contains("agricultural") || lower.contains("agriculture") || lower.contains("iast")) return map.get("IAST");
        if (lower.contains("legal") || lower.contains("law") || lower.contains("ils")) return map.get("ILS");
        if (lower.contains("education") || lower.contains("ier")) return map.get("IER");
        return null;
    }

    private void seedTheses(AcademicSession session, ResearchCategory category, Map<String, Institute> instituteMap) {
        try {
            ClassPathResource res = new ClassPathResource("theses_seed.json");
            if (!res.exists()) return;
            try (InputStream is = res.getInputStream()) {
                JsonNode array = objectMapper.readTree(is);
                for (JsonNode node : array) {
                    ResearchItem item = new ResearchItem();
                    item.setAcademicSession(session);
                    item.setCategory(category);
                    item.setSrNo(node.has("srNo") ? node.get("srNo").asInt() : null);
                    item.setTitle(node.has("title") ? node.get("title").asText() : "");
                    item.setPrimaryAuthor(node.has("scholarName") ? node.get("scholarName").asText() : "");
                    item.setCoAuthors(node.has("supervisors") ? node.get("supervisors").asText() : "");
                    item.setIdentifier(node.has("regNo") ? node.get("regNo").asText() : "");
                    item.setDepartment(node.has("department") ? node.get("department").asText() : "");
                    item.setRawFacultyInstitute(node.has("rawFacultyInstitute") ? node.get("rawFacultyInstitute").asText() : "");
                    item.setEventOrAwardDate(node.has("defenseDate") ? node.get("defenseDate").asText() : "");
                    item.setPublicationYear("2025-26");
                    item.setStatus("ACTIVE");

                    String instName = node.has("institute") ? node.get("institute").asText() : item.getRawFacultyInstitute();
                    item.setInstitute(matchInstitute(instName, instituteMap));

                    researchItemRepository.save(item);
                }
                log.info("Seeded {} PhD Theses records", array.size());
            }
        } catch (Exception e) {
            log.error("Error seeding theses: {}", e.getMessage());
        }
    }

    private void seedPatents(AcademicSession session, ResearchCategory category, Map<String, Institute> instituteMap) {
        try {
            ClassPathResource res = new ClassPathResource("patents_seed.json");
            if (!res.exists()) return;
            try (InputStream is = res.getInputStream()) {
                JsonNode array = objectMapper.readTree(is);
                for (JsonNode node : array) {
                    ResearchItem item = new ResearchItem();
                    item.setAcademicSession(session);
                    item.setCategory(category);
                    item.setSrNo(node.has("srNo") ? node.get("srNo").asInt() : null);
                    item.setTitle(node.has("title") ? node.get("title").asText() : "");
                    item.setPrimaryAuthor(node.has("patenterName") ? node.get("patenterName").asText() : "");
                    item.setIdentifier(node.has("patentNumber") ? node.get("patentNumber").asText() : "");
                    item.setEventOrAwardDate(node.has("yearOfAward") ? node.get("yearOfAward").asText() : "");
                    item.setPublicationYear(node.has("yearOfAward") ? node.get("yearOfAward").asText() : "2025");
                    item.setStatus("ACTIVE");

                    String patenter = item.getPrimaryAuthor();
                    item.setInstitute(matchInstitute(patenter, instituteMap));

                    researchItemRepository.save(item);
                }
                log.info("Seeded {} Patents records", array.size());
            }
        } catch (Exception e) {
            log.error("Error seeding patents: {}", e.getMessage());
        }
    }

    private void seedPublications(AcademicSession session, ResearchCategory category, Map<String, Institute> instituteMap) {
        try {
            ClassPathResource res = new ClassPathResource("papers_seed.json");
            if (!res.exists()) return;
            try (InputStream is = res.getInputStream()) {
                JsonNode array = objectMapper.readTree(is);
                for (JsonNode node : array) {
                    ResearchItem item = new ResearchItem();
                    item.setAcademicSession(session);
                    item.setCategory(category);
                    item.setSrNo(node.has("srNo") ? node.get("srNo").asInt() : null);
                    item.setTitle(node.has("title") ? node.get("title").asText() : "");
                    item.setPrimaryAuthor(node.has("authorName") ? node.get("authorName").asText() : "");
                    item.setDepartment(node.has("department") ? node.get("department").asText() : "");
                    item.setVenue(node.has("journalName") ? node.get("journalName").asText() : "");
                    item.setIdentifier(node.has("issnNumber") ? node.get("issnNumber").asText() : "");
                    item.setExternalLink(node.has("ugcRecognitionLink") ? node.get("ugcRecognitionLink").asText() : "");
                    item.setPublicationYear(node.has("yearOfPublication") ? node.get("yearOfPublication").asText() : "2025");
                    item.setStatus("ACTIVE");

                    item.setInstitute(matchInstitute(item.getDepartment(), instituteMap));

                    researchItemRepository.save(item);
                }
                log.info("Seeded {} Publications records", array.size());
            }
        } catch (Exception e) {
            log.error("Error seeding publications: {}", e.getMessage());
        }
    }

    private void seedBooks(AcademicSession session, ResearchCategory category, Map<String, Institute> instituteMap) {
        try {
            ClassPathResource res = new ClassPathResource("books_seed.json");
            if (!res.exists()) return;
            try (InputStream is = res.getInputStream()) {
                JsonNode array = objectMapper.readTree(is);
                for (JsonNode node : array) {
                    ResearchItem item = new ResearchItem();
                    item.setAcademicSession(session);
                    item.setCategory(category);
                    item.setSrNo(node.has("slNo") ? node.get("slNo").asInt() : null);
                    String bookTitle = node.has("paperTitle") && !node.get("paperTitle").isNull() ? node.get("paperTitle").asText()
                            : node.has("bookOrChapterTitle") ? node.get("bookOrChapterTitle").asText() : "Untitled";
                    item.setTitle(bookTitle);
                    item.setPrimaryAuthor(node.has("teacherName") ? node.get("teacherName").asText() : "");
                    item.setVenue(node.has("publisherName") && !node.get("publisherName").isNull() ? node.get("publisherName").asText() : "");
                    item.setDepartment(node.has("affiliatingInstitute") ? node.get("affiliatingInstitute").asText() : "");
                    item.setIdentifier(node.has("isbnIssn") ? node.get("isbnIssn").asText() : "");
                    item.setPublicationYear(node.has("yearOfPublication") ? node.get("yearOfPublication").asText() : "2025");
                    item.setStatus("ACTIVE");

                    item.setInstitute(matchInstitute(item.getDepartment(), instituteMap));

                    researchItemRepository.save(item);
                }
                log.info("Seeded {} Books records", array.size());
            }
        } catch (Exception e) {
            log.error("Error seeding books: {}", e.getMessage());
        }
    }

    private void seedVacantSeats(AcademicSession session, Map<String, Institute> instituteMap) {
        try {
            ClassPathResource res = new ClassPathResource("vacant_seats_seed.json");
            if (!res.exists()) return;
            try (InputStream is = res.getInputStream()) {
                JsonNode array = objectMapper.readTree(is);
                for (JsonNode node : array) {
                    FacultySeatMatrix seat = new FacultySeatMatrix();
                    seat.setAcademicSession(session);
                    seat.setRowIndex(node.has("rowIndex") ? node.get("rowIndex").asInt() : null);
                    seat.setInstituteName(node.has("institute") ? node.get("institute").asText() : "");
                    seat.setDepartment(node.has("department") ? node.get("department").asText() : "");
                    seat.setRawDepartment(node.has("rawDepartment") && !node.get("rawDepartment").isNull() ? node.get("rawDepartment").asText() : null);
                    seat.setTotalPhD(node.has("totalPhD") && !node.get("totalPhD").isNull() ? node.get("totalPhD").asInt() : null);
                    seat.setSupervisorName(node.has("supervisorName") ? node.get("supervisorName").asText() : "");
                    seat.setDesignation(node.has("designation") ? node.get("designation").asText() : "");
                    seat.setDesignationSeatLimit(node.has("designationSeatLimit") ? node.get("designationSeatLimit").asInt() : 0);
                    seat.setAllottedSeat(node.has("allottedSeat") ? node.get("allottedSeat").asInt() : 0);
                    seat.setNoOfVacant(node.has("noOfVacant") ? node.get("noOfVacant").asInt() : 0);
                    seat.setActive(true);

                    seat.setInstitute(matchInstitute(seat.getInstituteName(), instituteMap));

                    facultySeatMatrixRepository.save(seat);
                }
                log.info("Seeded {} Faculty Vacant Seat records", array.size());
            }
        } catch (Exception e) {
            log.error("Error seeding vacant seats: {}", e.getMessage());
        }
    }

    private static class InstituteDefinition {
        String code;
        String title;
        String slug;
        String departmentCountLabel;
        String description;
        String image;
        List<String> programs;
        Integer displayOrder;

        InstituteDefinition(String code, String title, String slug, String departmentCountLabel, String description, String image, List<String> programs, Integer displayOrder) {
            this.code = code;
            this.title = title;
            this.slug = slug;
            this.departmentCountLabel = departmentCountLabel;
            this.description = description;
            this.image = image;
            this.programs = programs;
            this.displayOrder = displayOrder;
        }
    }
}
