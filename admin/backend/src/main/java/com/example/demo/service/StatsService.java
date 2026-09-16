package com.example.demo.service;

import com.example.demo.dto.StatsDto;
import com.example.demo.entity.FacultySeatMatrix;
import com.example.demo.repository.FacultySeatMatrixRepository;
import com.example.demo.repository.InstituteRepository;
import com.example.demo.repository.ResearchCategoryRepository;
import com.example.demo.repository.ResearchItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class StatsService {

    @Autowired
    private ResearchItemRepository researchItemRepository;

    @Autowired
    private FacultySeatMatrixRepository facultySeatMatrixRepository;

    @Autowired
    private InstituteRepository instituteRepository;

    @Autowired
    private ResearchCategoryRepository researchCategoryRepository;

    public StatsDto getStats(String sessionCode) {
        StatsDto stats = new StatsDto();

        long theses = (sessionCode != null && !sessionCode.isBlank() && !"ALL".equalsIgnoreCase(sessionCode))
                ? researchItemRepository.countByCategoryCodeIgnoreCaseAndAcademicSessionSessionCode("THESIS_AWARDED", sessionCode)
                : researchItemRepository.countByCategoryCodeIgnoreCase("THESIS_AWARDED");

        long publications = (sessionCode != null && !sessionCode.isBlank() && !"ALL".equalsIgnoreCase(sessionCode))
                ? researchItemRepository.countByCategoryCodeIgnoreCaseAndAcademicSessionSessionCode("PUBLICATION", sessionCode)
                : researchItemRepository.countByCategoryCodeIgnoreCase("PUBLICATION");

        long patents = (sessionCode != null && !sessionCode.isBlank() && !"ALL".equalsIgnoreCase(sessionCode))
                ? researchItemRepository.countByCategoryCodeIgnoreCaseAndAcademicSessionSessionCode("PATENT", sessionCode)
                : researchItemRepository.countByCategoryCodeIgnoreCase("PATENT");

        long books = (sessionCode != null && !sessionCode.isBlank() && !"ALL".equalsIgnoreCase(sessionCode))
                ? researchItemRepository.countByCategoryCodeIgnoreCaseAndAcademicSessionSessionCode("BOOK", sessionCode)
                : researchItemRepository.countByCategoryCodeIgnoreCase("BOOK");

        List<FacultySeatMatrix> facultyList = (sessionCode != null && !sessionCode.isBlank() && !"ALL".equalsIgnoreCase(sessionCode))
                ? facultySeatMatrixRepository.findByAcademicSessionSessionCode(sessionCode)
                : facultySeatMatrixRepository.findAll();

        Set<String> countedDepts = new HashSet<>();
        int totalPhD = 0;
        int totalAllotted = 0;
        int totalVacant = 0;

        for (FacultySeatMatrix f : facultyList) {
            String deptKey = (f.getInstituteName() != null ? f.getInstituteName() : "") + "_" + f.getDepartment();
            if (!countedDepts.contains(deptKey)) {
                countedDepts.add(deptKey);
                if (f.getTotalPhD() != null) totalPhD += f.getTotalPhD();
            }
            if (f.getAllottedSeat() != null) totalAllotted += f.getAllottedSeat();
            if (f.getNoOfVacant() != null) totalVacant += f.getNoOfVacant();
        }

        stats.setTotalThesesAwarded(theses);
        stats.setTotalPublications(publications);
        stats.setTotalPatents(patents);
        stats.setTotalBooks(books);
        stats.setTotalSupervisors(facultyList.size());
        stats.setTotalPhDSeats(totalPhD > 0 ? totalPhD : 324);
        stats.setTotalAllottedSeats(totalAllotted);
        stats.setTotalVacantSeats(totalVacant);

        Map<String, Long> categoryCounts = new HashMap<>();
        categoryCounts.put("THESIS_AWARDED", theses);
        categoryCounts.put("PUBLICATION", publications);
        categoryCounts.put("PATENT", patents);
        categoryCounts.put("BOOK", books);
        stats.setCategoryCounts(categoryCounts);

        return stats;
    }
}
