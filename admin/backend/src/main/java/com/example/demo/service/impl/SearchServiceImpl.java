package com.example.demo.service.impl;

import com.example.demo.dto.SearchResultItemDto;
import com.example.demo.dto.SearchResponseDto;
import com.example.demo.entity.FacultySeatMatrix;
import com.example.demo.entity.Institute;
import com.example.demo.entity.ResearchItem;
import com.example.demo.repository.FacultySeatMatrixRepository;
import com.example.demo.repository.InstituteRepository;
import com.example.demo.repository.ResearchItemRepository;
import com.example.demo.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SearchServiceImpl implements SearchService {

    @Autowired
    private ResearchItemRepository researchItemRepository;

    @Autowired
    private InstituteRepository instituteRepository;

    @Autowired
    private FacultySeatMatrixRepository facultySeatMatrixRepository;

    // Static site pages registry for global site search
    private static final List<SitePageMeta> SITE_PAGES = List.of(
            new SitePageMeta("About SRMU Research & Consultancy", "Overview, leadership, vision, mission, and research governance at SRMU", "/about", List.of("about", "vision", "mission", "director", "dean", "governance", "research cell", "consultancy")),
            new SitePageMeta("Ph.D. Seat Matrix & Vacant Seats", "Current supervisor availability, vacant seats, and research guides across all institutes", "/department", List.of("seats", "vacant", "phd", "supervisor", "admission", "matrix", "departments", "seat")),
            new SitePageMeta("Indexed Research Publications", "High-impact papers indexed in Scopus and Web of Science (WoS)", "/research", List.of("research", "publications", "scopus", "web of science", "wos", "journals", "papers", "indexed")),
            new SitePageMeta("Patents & Innovations", "Intellectual property, published, and granted patents by faculty and scholars", "/patents", List.of("patents", "innovations", "ipr", "intellectual property", "inventions", "patented")),
            new SitePageMeta("Books & Book Chapters", "Peer-reviewed textbooks, monographs, and academic book chapters", "/books", List.of("books", "chapters", "publisher", "isbn", "monographs", "authored"))
    );

    @Override
    public SearchResponseDto search(String query, String type, String sessionCode, int page, int size) {
        String cleanQuery = (query != null) ? query.trim() : "";
        String cleanType = (type != null && !type.isBlank()) ? type.trim().toUpperCase() : "ALL";

        List<SearchResultItemDto> allMatches = new ArrayList<>();
        Map<String, Long> typeCounts = new LinkedHashMap<>();

        typeCounts.put("PUBLICATION", 0L);
        typeCounts.put("PATENT", 0L);
        typeCounts.put("BOOK", 0L);
        typeCounts.put("THESIS_AWARDED", 0L);
        typeCounts.put("INSTITUTE", 0L);
        typeCounts.put("FACULTY_SUPERVISOR", 0L);
        typeCounts.put("PAGE", 0L);

        if (cleanQuery.isEmpty()) {
            return new SearchResponseDto(cleanQuery, 0L, typeCounts, Collections.emptyList(), page, size, 0);
        }

        // 1. Search Research Items (Publications, Patents, Books, Theses)
        // Fetch matching items up to a generous buffer for ranking and counting
        Page<ResearchItem> researchItemPage = researchItemRepository.searchResearch(
                sessionCode,
                null,
                null,
                null,
                cleanQuery,
                PageRequest.of(0, 500)
        );

        for (ResearchItem item : researchItemPage.getContent()) {
            String categoryCode = item.getCategory() != null ? item.getCategory().getCode() : "PUBLICATION";
            typeCounts.put(categoryCode, typeCounts.getOrDefault(categoryCode, 0L) + 1);

            if (cleanType.equals("ALL") || cleanType.equalsIgnoreCase(categoryCode)) {
                allMatches.add(mapResearchItemToDto(item));
            }
        }

        // 2. Search Institutes
        List<Institute> matchingInstitutes = instituteRepository.searchInstitutes(cleanQuery);
        typeCounts.put("INSTITUTE", (long) matchingInstitutes.size());
        if (cleanType.equals("ALL") || cleanType.equalsIgnoreCase("INSTITUTE")) {
            for (Institute inst : matchingInstitutes) {
                allMatches.add(mapInstituteToDto(inst));
            }
        }

        // 3. Search Faculty Seat Allocations / Supervisors
        Page<FacultySeatMatrix> facultyPage = facultySeatMatrixRepository.searchFacultySeats(
                sessionCode,
                null,
                cleanQuery,
                PageRequest.of(0, 100)
        );
        typeCounts.put("FACULTY_SUPERVISOR", facultyPage.getTotalElements());
        if (cleanType.equals("ALL") || cleanType.equalsIgnoreCase("FACULTY_SUPERVISOR")) {
            for (FacultySeatMatrix f : facultyPage.getContent()) {
                allMatches.add(mapFacultyToDto(f));
            }
        }

        // 4. Match Site Pages
        List<SitePageMeta> matchingPages = matchSitePages(cleanQuery);
        typeCounts.put("PAGE", (long) matchingPages.size());
        if (cleanType.equals("ALL") || cleanType.equalsIgnoreCase("PAGE")) {
            for (SitePageMeta p : matchingPages) {
                allMatches.add(mapPageToDto(p));
            }
        }

        // Calculate total results
        long totalResults = allMatches.size();

        // Apply in-memory pagination
        int fromIndex = Math.min(page * size, allMatches.size());
        int toIndex = Math.min(fromIndex + size, allMatches.size());
        List<SearchResultItemDto> paginatedList = allMatches.subList(fromIndex, toIndex);

        int totalPages = (int) Math.ceil((double) totalResults / (double) (size > 0 ? size : 20));

        return new SearchResponseDto(
                cleanQuery,
                totalResults,
                typeCounts,
                paginatedList,
                page,
                size,
                totalPages
        );
    }

    private SearchResultItemDto mapResearchItemToDto(ResearchItem item) {
        String catCode = item.getCategory() != null ? item.getCategory().getCode() : "PUBLICATION";
        String label;
        String url;

        switch (catCode) {
            case "PATENT":
                label = "Patent & Innovation";
                url = "/patents";
                break;
            case "BOOK":
                label = "Book / Chapter";
                url = "/books";
                break;
            case "THESIS_AWARDED":
                label = "Ph.D. Thesis";
                url = "/research";
                break;
            case "PUBLICATION":
            default:
                label = "Research Publication";
                url = "/research";
                break;
        }

        String subtitle = item.getPrimaryAuthor();
        if (item.getVenue() != null && !item.getVenue().isBlank()) {
            subtitle = (subtitle != null ? subtitle + " • " : "") + item.getVenue();
        }

        Map<String, Object> meta = new HashMap<>();
        if (item.getDepartment() != null) meta.put("department", item.getDepartment());
        if (item.getInstitute() != null) meta.put("instituteCode", item.getInstitute().getCode());
        if (item.getAcademicSession() != null) meta.put("sessionCode", item.getAcademicSession().getSessionCode());
        if (item.getExternalLink() != null) meta.put("externalLink", item.getExternalLink());

        return new SearchResultItemDto(
                "research_" + item.getId(),
                catCode,
                label,
                item.getTitle(),
                subtitle,
                item.getIdentifier(),
                item.getVenue(),
                item.getPublicationYear(),
                url,
                item.getAbstractText(),
                meta
        );
    }

    private SearchResultItemDto mapInstituteToDto(Institute inst) {
        Map<String, Object> meta = new HashMap<>();
        meta.put("code", inst.getCode());
        meta.put("departmentCount", inst.getDepartmentCountLabel());
        meta.put("image", inst.getImage());

        return new SearchResultItemDto(
                "institute_" + inst.getId(),
                "INSTITUTE",
                "Institute / Department",
                inst.getTitle() + " (" + inst.getCode() + ")",
                inst.getDepartmentCountLabel() != null ? inst.getDepartmentCountLabel() : "Academic Institute",
                inst.getCode(),
                inst.getTitle(),
                null,
                "/department/" + inst.getId(),
                inst.getDescription(),
                meta
        );
    }

    private SearchResultItemDto mapFacultyToDto(FacultySeatMatrix f) {
        Map<String, Object> meta = new HashMap<>();
        meta.put("designation", f.getDesignation());
        meta.put("department", f.getDepartment());
        meta.put("allottedSeats", f.getAllottedSeat());
        meta.put("vacantSeats", f.getNoOfVacant());

        String subtitle = (f.getDesignation() != null ? f.getDesignation() + ", " : "") + f.getDepartment();

        return new SearchResultItemDto(
                "faculty_" + f.getId(),
                "FACULTY_SUPERVISOR",
                "Faculty Supervisor",
                f.getSupervisorName(),
                subtitle,
                "Vacant: " + f.getNoOfVacant() + " / Allotted: " + f.getAllottedSeat(),
                f.getInstituteName() != null ? f.getInstituteName() : f.getDepartment(),
                null,
                "/department",
                "Research supervisor in " + f.getDepartment() + " with " + f.getNoOfVacant() + " vacant seats.",
                meta
        );
    }

    private SearchResultItemDto mapPageToDto(SitePageMeta page) {
        return new SearchResultItemDto(
                "page_" + page.url.replace("/", ""),
                "PAGE",
                "Website Section",
                page.title,
                page.description,
                null,
                "SRMU Portal",
                null,
                page.url,
                page.description,
                Collections.emptyMap()
        );
    }

    private List<SitePageMeta> matchSitePages(String query) {
        String lowerQ = query.toLowerCase();
        return SITE_PAGES.stream()
                .filter(p -> p.title.toLowerCase().contains(lowerQ)
                        || p.description.toLowerCase().contains(lowerQ)
                        || p.keywords.stream().anyMatch(k -> k.contains(lowerQ) || lowerQ.contains(k)))
                .collect(Collectors.toList());
    }

    private static class SitePageMeta {
        String title;
        String description;
        String url;
        List<String> keywords;

        SitePageMeta(String title, String description, String url, List<String> keywords) {
            this.title = title;
            this.description = description;
            this.url = url;
            this.keywords = keywords;
        }
    }
}
