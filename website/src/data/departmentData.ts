import { ThesisAwarded, VacantSeatRow } from "../types";

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
      (t.rawFacultyInstitute || "").includes("Technology") ||
      (t.rawFacultyInstitute || "").includes("Computer Science") ||
      (t.rawFacultyInstitute || "").includes("Mechanical") ||
      (t.rawFacultyInstitute || "").includes("Energy Studies"),
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
    title: "Institute of Bio-Sciences and Technology",
    code: "IBST",
    departmentCountLabel: "1 DEPARTMENT",
    image: "/Images/c2.webp",
    description:
      "The Institute of Bio-Sciences and Technology offers state-of-the-art academic curricula and cutting-edge research opportunities in biotechnology and biosciences.",
    programs: ["Bio-Sciences & Technology", "Biotechnology"],
    vacantMatcher: (row: VacantSeatRow) =>
      row.institute === "Institute of Bio-Sciences and Technology" ||
      row.department === "Bio-Technology" ||
      row.department === "Biotechnology",
    thesisMatcher: (t: ThesisAwarded) =>
      (t.rawFacultyInstitute || "").includes("Bio-Technology") ||
      (t.rawFacultyInstitute || "").includes("Biosciences") ||
      (t.rawFacultyInstitute || "").includes("IBST"),
    paperCodes: ["IBST", "Bio-Technology", "Biotechnology", "FoBT"],
    patentCodes: ["Dheeraj", "Prashant", "Nabeel", "IBST", "Biotechnology"],
    bookCodes: ["Bio", "Biotechnology", "Biosciences", "IBST"],
  },
  {
    id: "institute-of-management-commerce-and-economics",
    slug: "institute-of-management-commerce-and-economics",
    title: "Institute of Management, Commerce and Economics",
    code: "IMCE",
    departmentCountLabel: "3 DEPARTMENTS",
    image: "/Images/c3.webp",
    description:
      "Institute of Management, Commerce & Economics prepares future-ready corporate leaders and research scholars through comprehensive management studies.",
    programs: ["Management", "Commerce", "Economics"],
    vacantMatcher: (row: VacantSeatRow) =>
      row.institute === "Institute of Management, Commerce and Economics" ||
      ["Management", "Commerce", "Economics"].includes(row.department),
    thesisMatcher: (t: ThesisAwarded) =>
      (t.rawFacultyInstitute || "").includes("Management") ||
      (t.rawFacultyInstitute || "").includes("Commerce") ||
      (t.rawFacultyInstitute || "").includes("Economics") ||
      (t.rawFacultyInstitute || "").includes("IMCE"),
    paperCodes: ["IMCE", "FoM", "FoC", "FoE", "Management", "Commerce", "Economics"],
    patentCodes: ["IMCE", "Management", "Commerce"],
    bookCodes: ["Management", "Commerce", "Economics", "Business", "Marketing", "Finance", "IMCE"],
  },
  {
    id: "institute-of-legal-studies",
    slug: "institute-of-legal-studies",
    title: "Institute of Legal Studies",
    code: "ILS",
    departmentCountLabel: "1 DEPARTMENT",
    image: "/Images/c4.webp",
    description:
      "The Institute of Legal Studies is dedicated to excellence in legal research, professional ethics, jurisprudence, and legal advocacy.",
    programs: ["Law", "Legal Studies"],
    vacantMatcher: (row: VacantSeatRow) =>
      row.institute === "Institute of Legal Studies" || row.department === "Law",
    thesisMatcher: (t: ThesisAwarded) =>
      (t.rawFacultyInstitute || "").includes("Legal Studies") ||
      (t.rawFacultyInstitute || "").includes("Law") ||
      (t.rawFacultyInstitute || "").includes("ILS"),
    paperCodes: ["ILS", "FoL", "Law", "Legal"],
    patentCodes: ["ILS", "Law"],
    bookCodes: ["Law", "Legal", "Jurisprudence", "ILS"],
  },
  {
    id: "institute-of-media-studies",
    slug: "institute-of-media-studies",
    title: "Institute of Media Studies",
    code: "IMS",
    departmentCountLabel: "1 DEPARTMENT",
    image: "/Images/c5.webp",
    description:
      "Fostering creativity, critical analysis, and modern journalistic practices with high-impact media and communication research.",
    programs: ["Journalism & Mass Communication"],
    vacantMatcher: (row: VacantSeatRow) =>
      row.institute === "Institute of Media Studies" ||
      row.department === "Journalism & Mass Communication",
    thesisMatcher: (t: ThesisAwarded) =>
      (t.rawFacultyInstitute || "").includes("Media") ||
      (t.rawFacultyInstitute || "").includes("Journalism") ||
      (t.rawFacultyInstitute || "").includes("Mass Communication") ||
      (t.rawFacultyInstitute || "").includes("IMS"),
    paperCodes: ["IMS", "FoJMC", "Media", "Journalism"],
    patentCodes: ["IMS", "Media"],
    bookCodes: ["Media", "Journalism", "Communication", "IMS"],
  },
  {
    id: "institute-of-natural-sciences-and-humanities",
    slug: "institute-of-natural-sciences-and-humanities",
    title: "Institute of Natural Sciences and Humanities",
    code: "INSH",
    departmentCountLabel: "4 DEPARTMENTS",
    image: "/Images/c6.webp",
    description:
      "Offering foundational and advanced research programs across Physics, Chemistry, Mathematics, and Humanities.",
    programs: ["Physics", "Chemistry", "Mathematics", "Humanities & Social Sciences"],
    vacantMatcher: (row: VacantSeatRow) =>
      row.institute === "Institute of Natural Sciences and Humanities" ||
      ["Physics", "Chemistry", "Mathematics", "Humanities"].includes(row.department),
    thesisMatcher: (t: ThesisAwarded) =>
      (t.rawFacultyInstitute || "").includes("Natural Sciences") ||
      (t.rawFacultyInstitute || "").includes("Physics") ||
      (t.rawFacultyInstitute || "").includes("Chemistry") ||
      (t.rawFacultyInstitute || "").includes("Mathematics") ||
      (t.rawFacultyInstitute || "").includes("Humanities") ||
      (t.rawFacultyInstitute || "").includes("INSH"),
    paperCodes: ["INSH", "FoP", "FoC", "FoM", "FoH", "Physics", "Chemistry", "Mathematics", "Humanities"],
    patentCodes: ["Physics", "Chemistry", "Mathematics", "INSH"],
    bookCodes: ["Physics", "Chemistry", "Mathematics", "Humanities", "INSH"],
  },
  {
    id: "institute-of-pharmacy",
    slug: "institute-of-pharmacy",
    title: "Institute of Pharmacy",
    code: "IoP",
    departmentCountLabel: "1 DEPARTMENT",
    image: "/Images/c7.webp",
    description:
      "Institute of Pharmacy offers cutting-edge pharmaceutical sciences education, drug development, and healthcare research.",
    programs: ["Pharmacy", "Pharmaceutical Sciences"],
    vacantMatcher: (row: VacantSeatRow) =>
      row.institute === "Institute of Pharmacy" || row.department === "Pharmacy",
    thesisMatcher: (t: ThesisAwarded) =>
      (t.rawFacultyInstitute || "").includes("Pharmacy") ||
      (t.rawFacultyInstitute || "").includes("IoP") ||
      (t.rawFacultyInstitute || "").includes("FOP"),
    paperCodes: ["IoP", "FOP", "Pharmacy", "Pharmaceutical"],
    patentCodes: ["Pharmacy", "IoP"],
    bookCodes: ["Pharmacy", "Pharmaceutical", "IoP"],
  },
  {
    id: "institute-of-education-and-research",
    slug: "institute-of-education-and-research",
    title: "Institute of Education and Research",
    code: "IER",
    departmentCountLabel: "1 DEPARTMENT",
    image: "/Images/c8.webp",
    description:
      "Committed to pedagogy, educational policy research, teacher education, and pedagogical innovations.",
    programs: ["Education", "Educational Research"],
    vacantMatcher: (row: VacantSeatRow) =>
      row.institute === "Institute of Education and Research" || row.department === "Education",
    thesisMatcher: (t: ThesisAwarded) =>
      (t.rawFacultyInstitute || "").includes("Education") || (t.rawFacultyInstitute || "").includes("IER"),
    paperCodes: ["IER", "FoEd", "Education"],
    patentCodes: ["Education", "IER"],
    bookCodes: ["Education", "IER"],
  },
  {
    id: "institute-of-agricultural-sciences-and-technology",
    slug: "institute-of-agricultural-sciences-and-technology",
    title: "Institute of Agricultural Sciences and Technology",
    code: "IAST",
    departmentCountLabel: "1 DEPARTMENT",
    image: "/Images/c9.webp",
    description:
      "Advancing sustainable agriculture, crop improvement, agro-technology, and rural farm empowerment.",
    programs: ["Agriculture", "Agronomy", "Horticulture", "Soil Science"],
    vacantMatcher: (row: VacantSeatRow) =>
      row.institute === "Institute of Agricultural Sciences and Technology" ||
      row.department === "Agriculture" ||
      row.department === "Agricultural Sciences",
    thesisMatcher: (t: ThesisAwarded) =>
      (t.rawFacultyInstitute || "").includes("Agricultural") ||
      (t.rawFacultyInstitute || "").includes("Agriculture") ||
      (t.rawFacultyInstitute || "").includes("IAST"),
    paperCodes: ["IAST", "FoAg", "Agriculture", "Agronomy"],
    patentCodes: ["Agriculture", "IAST"],
    bookCodes: ["Agriculture", "Agronomy", "IAST"],
  },
  {
    id: "institute-of-polytechnic",
    slug: "institute-of-polytechnic",
    title: "Institute of Polytechnic",
    code: "IoPoly",
    departmentCountLabel: "1 DEPARTMENT",
    image: "/Images/c1.webp",
    description:
      "Providing foundational diploma-level technical education and applied engineering research skill development.",
    programs: ["Polytechnic Studies", "Applied Engineering"],
    vacantMatcher: (row: VacantSeatRow) =>
      row.institute === "Institute of Polytechnic" || row.department === "Polytechnic",
    thesisMatcher: (t: ThesisAwarded) =>
      (t.rawFacultyInstitute || "").includes("Polytechnic") || (t.rawFacultyInstitute || "").includes("IoPoly"),
    paperCodes: ["IoPoly", "Polytechnic"],
    patentCodes: ["Polytechnic", "IoPoly"],
    bookCodes: ["Polytechnic", "IoPoly"],
  },
];

// Runtime dynamic cache updated from Redux
let liveFacultyData: VacantSeatRow[] = [];
let liveThesesData: ThesisAwarded[] = [];

export const setLiveFacultyData = (data: VacantSeatRow[]) => {
  if (Array.isArray(data)) {
    liveFacultyData = data;
  }
};

export const setLiveThesesData = (data: ThesisAwarded[]) => {
  if (Array.isArray(data)) {
    liveThesesData = data;
  }
};

export const getDepartmentById = (slugOrId: string): DepartmentInfo | null => {
  const cleanId = (slugOrId || "").trim().toLowerCase();

  const config =
    DEPARTMENTS_LIST.find((d) => d.slug.toLowerCase() === cleanId || d.id.toLowerCase() === cleanId) ||
    DEPARTMENTS_LIST[0];

  const liveFaculty = liveFacultyData;
  const liveTheses = liveThesesData;

  // Filter faculty supervisors
  const facultySupervisors = liveFaculty.filter(config.vacantMatcher);

  // Compute metrics
  const countedDepts = new Set<string>();
  let totalPhDSeats = 0;
  facultySupervisors.forEach((r) => {
    const key = `${r.institute}_${r.department}`;
    if (!countedDepts.has(key)) {
      countedDepts.add(key);
      if (r.totalPhD !== null && r.totalPhD !== undefined) totalPhDSeats += r.totalPhD;
    }
  });

  const totalDesignationLimit = facultySupervisors.reduce((acc, r) => acc + (r.designationSeatLimit || 0), 0);
  const totalAllottedSeats = facultySupervisors.reduce((acc, r) => acc + (r.allottedSeat || 0), 0);
  const totalVacantSeats = facultySupervisors.reduce((acc, r) => acc + (r.noOfVacant || 0), 0);

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
    researchPublications: [],
    patents: [],
    books: [],
    thesesAwarded: matchedTheses,
  };
};
