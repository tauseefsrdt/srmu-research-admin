import { patents, researchPapers, books } from "./data";
import { VACANT_SEAT_DATA, VacantSeatRow } from "./vacantSeatData";
import { THESIS_AWARDED_DATA, ThesisAwarded } from "./thesisAwardedData";

export interface DepartmentInfo {
  id: string;
  slug: string;
  title: string;
  code: string;
  departmentCountLabel: string;
  image: string;
  description: string;
  programs: string[];
  facultySupervisors: VacantSeatRow[];
  totalPhDSeats: number;
  totalDesignationLimit: number;
  totalAllottedSeats: number;
  totalVacantSeats: number;
  researchPublications: any[];
  patents: any[];
  books: any[];
  thesesAwarded: ThesisAwarded[];
}

export const DEPARTMENTS_LIST = [
  {
    id: "institute-of-technology",
    slug: "institute-of-technology",
    title: "Institute of Technology",
    code: "IoT",
    departmentCountLabel: "5 DEPARTMENTS",
    image: "/Images/c1.webp",
    description:
      "The Institute of Technology is committed to provide focused learning in the fields of engineering with an aim of creating human resources with knowledge and skills to contribute successfully to a complex world.",
    programs: ["Civil Engineering", "Computer Science & Engineering (CSE)", "Electrical Engineering", "Electronics & Communication Engineering", "Mechanical Engineering"],
    vacantMatcher: (row: VacantSeatRow) =>
      row.institute === "Institute of Technology" ||
      ["Civil Engineering", "CSE", "Electrical Engineering", "Electronics & CommunicationEng", "Mechanical Engineering"].includes(row.department),
    thesisMatcher: (t: ThesisAwarded) =>
      t.rawFacultyInstitute.includes("Technology") ||
      t.rawFacultyInstitute.includes("Computer Science") ||
      t.rawFacultyInstitute.includes("Mechanical") ||
      t.rawFacultyInstitute.includes("Energy Studies"),
    paperCodes: ["DEEE", "DoEEE", "FoME", "DCSE", "FoCE", "FoCS", "FOCS", "CSIS", "DCSIS"],
    patentCodes: [
      "Alkesh Agrawal",
      "Vaibhava Srivastava",
      "Shubham Mishra",
      "Amit Kumar Srivastava",
      "Jullius Kumar",
      "Shilpi Shukla",
      "Rajeev Kumar",
      "Yusuf Perwej",
      "DCSE",
      "FoME",
      "DEEE",
    ],
    bookCodes: ["Engineering", "Technology", "CS", "CSE", "Mechanical", "Electrical", "Electronics", "IoT"],
  },
  {
    id: "institute-of-biosciences-and-technology",
    slug: "institute-of-biosciences-and-technology",
    title: "Institute of Biosciences and Technology",
    code: "IBST",
    departmentCountLabel: "3 DEPARTMENTS",
    image: "/Images/c2.jpg",
    description:
      "Biotechnology encompasses the applications of understanding of the biological systems to improve human life by addressing challenges and issues facing agricultural sciences, medical sciences, food sciences, etc.",
    programs: ["Bio Sciences & Bio Technology", "Bio Technology", "Biomedical Sciences"],
    vacantMatcher: (row: VacantSeatRow) =>
      row.institute === "IBST" || row.department.includes("Bio Sciences") || row.department.includes("Bio Technology") || row.department.includes("Biomedical"),
    thesisMatcher: (t: ThesisAwarded) => t.rawFacultyInstitute.includes("Biosciences") || t.rawFacultyInstitute.includes("Biotechnology"),
    paperCodes: ["IBST", "Bio", "Biotechnology", "Biomedical"],
    patentCodes: ["IBST", "Bio", "Biotechnology", "Biomedical", "Biomedical Imaging"],
    bookCodes: ["IBST", "Bio", "Biotechnology", "Biomedical"],
  },
  {
    id: "institute-of-management-commerce-and-economics",
    slug: "institute-of-management-commerce-and-economics",
    title: "Institute of Management, Commerce and Economics",
    code: "IMCE",
    departmentCountLabel: "3 DEPARTMENTS",
    image: "/Images/c3.webp",
    description:
      "The Institute of Management, Commerce and Economics (IMCE) was started in the year 2012. IMCE seeks to be a trailblazer in management education through strong academic-industry collaboration for international alliances.",
    programs: ["Commerce & Management", "Data Science & Predictive Analytics", "Healthcare Management"],
    vacantMatcher: (row: VacantSeatRow) =>
      row.institute === "IMCE" || row.department.includes("Commerce") || row.department.includes("Management") || row.department.includes("Data Science"),
    thesisMatcher: (t: ThesisAwarded) => t.rawFacultyInstitute.includes("Management") || t.rawFacultyInstitute.includes("Commerce") || t.rawFacultyInstitute.includes("Economics"),
    paperCodes: ["IMCE", "FoMSS", "Fomss", "fomss"],
    patentCodes: ["IMCE", "Kanupriya", "Vaibhav sharma", "Uma Rajey Shukla", "Khushboo Joshi", "Biometric Device", "Trading Analysis"],
    bookCodes: ["IMCE", "Management", "Commerce", "Economics", "FoMSS"],
  },
  {
    id: "institute-of-media-studies",
    slug: "institute-of-media-studies",
    title: "Institute of Media Studies",
    code: "IMS",
    departmentCountLabel: "2 DEPARTMENTS",
    image: "/Images/c4.jpg",
    description:
      "Journalism and Mass Communication study is an encouragement to think about the forces involved in giving it shape. Mass Media industry is one of the fastest growing industries with the mission of social conscience.",
    programs: ["Journalism and Mass Communication", "Media and Film Studies"],
    vacantMatcher: (row: VacantSeatRow) => row.institute === "Institute of Media Studies" || row.department.includes("Media Studies"),
    thesisMatcher: (t: ThesisAwarded) => t.rawFacultyInstitute.includes("Media"),
    paperCodes: ["IMS", "Media"],
    patentCodes: ["IMS", "Media", "Journalism"],
    bookCodes: ["IMS", "Media", "Journalism"],
  },
  {
    id: "institute-of-natural-sciences-and-humanities",
    slug: "institute-of-natural-sciences-and-humanities",
    title: "Institute of Natural Sciences and Humanities",
    code: "INSH",
    departmentCountLabel: "4 DEPARTMENTS",
    image: "/Images/c5.webp",
    description:
      "The Institute boasts of being the heart and soul of the University as its various disciplines of knowledge is essentially required with all the academic programs that run across the University.",
    programs: ["Chemical Sciences", "Humanities & Social Sciences", "Mathematical & Statistical Sciences", "Physical Sciences"],
    vacantMatcher: (row: VacantSeatRow) =>
      row.institute === "INSH" ||
      row.department.includes("Chemical") ||
      row.department.includes("Humanities") ||
      row.department.includes("Mathematical") ||
      row.department.includes("Physical"),
    thesisMatcher: (t: ThesisAwarded) =>
      t.rawFacultyInstitute.includes("Natural Sciences") ||
      t.rawFacultyInstitute.includes("Humanities") ||
      t.rawFacultyInstitute.includes("Mathematical") ||
      t.rawFacultyInstitute.includes("Chemical") ||
      t.rawFacultyInstitute.includes("Public Health") ||
      t.rawFacultyInstitute.includes("Sociology"),
    paperCodes: ["FoPS", "FOHSS", "FoHSS", "Sociology", "Public Health", "Political Science"],
    patentCodes: ["FoPS", "SACHIN SINGH", "INSH", "Physical Sciences", "Chemical"],
    bookCodes: ["FoPS", "FOHSS", "FoHSS", "INSH", "Humanities", "Sciences"],
  },
  {
    id: "institute-of-pharmaceutical-sciences",
    slug: "institute-of-pharmaceutical-sciences",
    title: "Institute of Pharmaceutical Sciences",
    code: "IOP",
    departmentCountLabel: "3 DEPARTMENTS",
    image: "/Images/c6.webp",
    description: "Due to its integration of chemistry and health sciences, pharmaceutical science is both a unique field and extremely important to human survival.",
    programs: ["Ph.D in Pharmaceutical Science", "Pharmaceutics & Pharmaceutical Chemistry", "Pharmacology"],
    vacantMatcher: (row: VacantSeatRow) => row.institute === "IOP" || row.department.includes("Pharmaceutical Science"),
    thesisMatcher: (t: ThesisAwarded) => t.rawFacultyInstitute.includes("Pharmaceutical"),
    paperCodes: ["IOP", "Pharmaceutical"],
    patentCodes: ["IOP", "Pharmacy", "Pharmaceutical"],
    bookCodes: ["IOP", "Pharmacy", "Pharmaceutical"],
  },
  {
    id: "institute-of-agricultural-sciences-and-technology",
    slug: "institute-of-agricultural-sciences-and-technology",
    title: "Institute of Agricultural Sciences and Technology",
    code: "IAST",
    departmentCountLabel: "3 DEPARTMENTS",
    image: "/Images/c7.webp",
    description:
      "The Indian Council of Agricultural Sciences has already recognized the B.Sc.(Hons.) Agriculture 4 Years as a professional Degree with consequential benefits to the Students.",
    programs: ["B.Sc.(Hons.) Agriculture", "Agricultural Sciences and Technology", "Agronomy and Horticulture"],
    vacantMatcher: (row: VacantSeatRow) => row.institute === "Institute of Agricultural Sciences and Technology" || row.department.includes("Agricultural"),
    thesisMatcher: (t: ThesisAwarded) => t.rawFacultyInstitute.includes("Agricultural"),
    paperCodes: ["IAST", "Agriculture", "Agricultural"],
    patentCodes: ["IAST", "Agriculture", "Agricultural"],
    bookCodes: ["IAST", "Agriculture", "Agricultural"],
  },
  {
    id: "institute-of-legal-studies",
    slug: "institute-of-legal-studies",
    title: "Institute of Legal Studies",
    code: "ILS",
    departmentCountLabel: "3 DEPARTMENTS",
    image: "/Images/c8.avif",
    description:
      "The Institute of Legal Studies is a convergence of academic, cultural and intellectual resources. It aims at achieving the highest levels of distinction in the innovation and transmission of knowledge and understanding.",
    programs: ["LL.B. & Integrated Law", "LL.M. & Ph.D in Law", "Legal Studies and Jurisprudence"],
    vacantMatcher: (row: VacantSeatRow) => row.institute === "Institute of Legal Studies" || row.department.includes("Legal Studies"),
    thesisMatcher: (t: ThesisAwarded) => t.rawFacultyInstitute.includes("Legal"),
    paperCodes: ["ILS", "Law", "Legal"],
    patentCodes: ["ILS", "Law", "Legal"],
    bookCodes: ["ILS", "Law", "Legal"],
  },
  {
    id: "institute-of-pharmacy",
    slug: "institute-of-pharmacy",
    title: "Institute of Pharmacy",
    code: "IOPH",
    departmentCountLabel: "3 DEPARTMENTS",
    image: "/Images/c9.webp",
    description:
      "Pharmacy is one of the unique professions and also very vital for the sustenance of human lives as it involves the combination of chemical science with health sciences.",
    programs: ["Bachelor of Pharmacy (B.Pharm)", "Master of Pharmacy (M.Pharm)", "Ph.D in Pharmaceutical Sciences"],
    vacantMatcher: (row: VacantSeatRow) => row.institute === "IOP" || row.department.includes("Pharmaceutical Science"),
    thesisMatcher: (t: ThesisAwarded) => t.rawFacultyInstitute.includes("Pharmaceutical"),
    paperCodes: ["IOP", "Pharmaceutical", "Pharmacy"],
    patentCodes: ["IOP", "Pharmacy", "Pharmaceutical"],
    bookCodes: ["IOP", "Pharmacy", "Pharmaceutical"],
  },
  {
    id: "institute-of-education-and-research",
    slug: "institute-of-education-and-research",
    title: "Institute of Education and Research",
    code: "IER",
    departmentCountLabel: "3 DEPARTMENTS",
    image: "/Images/c1.webp",
    description: "The Institute of Education and Research is dedicated to fostering progressive teaching methodologies, educational psychology, and innovative academic research.",
    programs: ["Education & Research", "Ph.D in Advance Educational Studies", "Teacher Education & Pedagogy"],
    vacantMatcher: (row: VacantSeatRow) => row.institute === "IER" || row.department.includes("Education") || row.department.includes("Educational"),
    thesisMatcher: (t: ThesisAwarded) => t.rawFacultyInstitute.includes("Education"),
    paperCodes: ["IER", "Education"],
    patentCodes: ["IER", "Education"],
    bookCodes: ["IER", "Education"],
  },
];

// In-memory cache for dynamic data from API
let liveTheses: ThesisAwarded[] = [...THESIS_AWARDED_DATA];
let liveFaculty: VacantSeatRow[] = [...VACANT_SEAT_DATA];

export const setLiveThesesData = (data: ThesisAwarded[]) => {
  liveTheses = data;
};

export const setLiveFacultyData = (data: VacantSeatRow[]) => {
  liveFaculty = data;
};

export const getAllDepartmentsInfo = (): DepartmentInfo => {
  const allPrograms = Array.from(new Set(DEPARTMENTS_LIST.flatMap((d) => d.programs)));

  const countedDepts = new Set<string>();
  let totalPhDSeats = 0;
  liveFaculty.forEach((r) => {
    const key = `${r.institute}_${r.department}`;
    if (!countedDepts.has(key)) {
      countedDepts.add(key);
      if (r.totalPhD !== null) totalPhDSeats += r.totalPhD;
    }
  });

  const totalDesignationLimit = liveFaculty.reduce((acc, r) => acc + (r.designationSeatLimit || 0), 0);
  const totalAllottedSeats = liveFaculty.reduce((acc, r) => acc + (r.allottedSeat || 0), 0);
  const totalVacantSeats = liveFaculty.reduce((acc, r) => acc + (r.noOfVacant || 0), 0);

  return {
    id: "all",
    slug: "all",
    title: "All University Institutes & Departments",
    code: "ALL DEPARTMENTS",
    departmentCountLabel: "10 INSTITUTES • 29+ DEPARTMENTS",
    image: "/Images/c1.webp",
    description:
      "Comprehensive research repository uniting all academic institutes, departments, research faculties, supervisor seat matrices, publications, patents, and published books across Shri Ramswaroop Memorial University.",
    programs: allPrograms,
    facultySupervisors: liveFaculty,
    totalPhDSeats: totalPhDSeats > 0 ? totalPhDSeats : 324,
    totalDesignationLimit: totalDesignationLimit > 0 ? totalDesignationLimit : 558,
    totalAllottedSeats: totalAllottedSeats > 0 ? totalAllottedSeats : 324,
    totalVacantSeats: totalVacantSeats > 0 ? totalVacantSeats : 230,
    researchPublications: researchPapers,
    patents: patents,
    books: books,
    thesesAwarded: liveTheses,
  };
};

export const getDepartmentById = (idOrSlug: string): DepartmentInfo | null => {
  if (!idOrSlug) return getAllDepartmentsInfo();
  const clean = idOrSlug.toLowerCase().trim();
  if (clean === "all" || clean === "all-departments" || clean === "departments") {
    return getAllDepartmentsInfo();
  }

  const config = DEPARTMENTS_LIST.find((d) => d.id === clean || d.slug === clean || d.code.toLowerCase() === clean);
  if (!config) return null;

  // Filter exact faculty supervisors from live Vacant Seat data
  const facultySupervisors = liveFaculty.filter(config.vacantMatcher);

  // Compute metrics
  const countedDepts = new Set<string>();
  let totalPhDSeats = 0;
  facultySupervisors.forEach((r) => {
    const key = `${r.institute}_${r.department}`;
    if (!countedDepts.has(key)) {
      countedDepts.add(key);
      if (r.totalPhD !== null) totalPhDSeats += r.totalPhD;
    }
  });

  const totalDesignationLimit = facultySupervisors.reduce((acc, r) => acc + (r.designationSeatLimit || 0), 0);
  const totalAllottedSeats = facultySupervisors.reduce((acc, r) => acc + (r.allottedSeat || 0), 0);
  const totalVacantSeats = facultySupervisors.reduce((acc, r) => acc + (r.noOfVacant || 0), 0);

  // Filter research papers
  const researchPublications = researchPapers.filter((p: any) => {
    const dept = (p.department || "").toLowerCase();
    return config.paperCodes.some((code) => dept.includes(code.toLowerCase()));
  });

  // Filter patents
  const matchedPatents = patents.filter((pat: any) => {
    const inv = (pat.patenterName || "").toLowerCase();
    const tit = (pat.title || "").toLowerCase();
    const num = (pat.patentNumber || "").toLowerCase();
    return config.patentCodes.some((code) => {
      const c = code.toLowerCase();
      return inv.includes(c) || tit.includes(c) || num.includes(c);
    });
  });

  // Filter books
  const matchedBooks = books.filter((b: any) => {
    const aff = (b.affiliatingInstitute || "").toLowerCase();
    const tch = (b.teacherName || "").toLowerCase();
    const tit = (b.bookOrChapterTitle || b.paperTitle || "").toLowerCase();
    return config.bookCodes.some((code) => {
      const c = code.toLowerCase();
      return aff.includes(c) || tch.includes(c) || tit.includes(c);
    });
  });

  // Filter theses awarded
  const matchedTheses = liveTheses.filter(config.thesisMatcher);

  return {
    id: config.id,
    slug: config.slug,
    title: config.title,
    code: config.code,
    departmentCountLabel: config.departmentCountLabel,
    image: config.image,
    description: config.description,
    programs: config.programs,
    facultySupervisors,
    totalPhDSeats,
    totalDesignationLimit,
    totalAllottedSeats,
    totalVacantSeats,
    researchPublications,
    patents: matchedPatents,
    books: matchedBooks,
    thesesAwarded: matchedTheses,
  };
};
