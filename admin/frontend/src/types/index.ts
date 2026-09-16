export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  designation?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  id: number;
  email: string;
  name: string;
  role: string;
  designation?: string;
}

export interface Institute {
  id?: number;
  code: string;
  title: string;
  slug: string;
  departmentCountLabel?: string;
  description?: string;
  image?: string;
  programs?: string[];
  displayOrder?: number;
  active?: boolean;
}

export interface AcademicSession {
  id?: number;
  sessionCode: string;
  name: string;
  isCurrent?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface ResearchCategory {
  id?: number;
  code: string; // THESIS_AWARDED, PUBLICATION, PATENT, BOOK
  name: string;
  description?: string;
  displayOrder?: number;
}

export interface ResearchItem {
  id?: number;
  srNo?: number;
  academicSessionId: number;
  academicSessionCode?: string;
  instituteId?: number | null;
  instituteTitle?: string;
  instituteCode?: string;
  categoryId: number;
  categoryCode?: string;
  categoryName?: string;
  department?: string;
  rawFacultyInstitute?: string;
  title: string;
  primaryAuthor?: string;
  coAuthors?: string;
  identifier?: string;
  venue?: string;
  eventOrAwardDate?: string;
  publicationYear?: string;
  externalLink?: string;
  abstractText?: string;
  status?: string;
  featured?: boolean;
  citations?: number;
  extraDetails?: string;
}

export interface FacultySeatMatrix {
  id?: number;
  rowIndex?: number;
  academicSessionId?: number;
  academicSessionCode?: string;
  instituteId?: number | null;
  instituteTitle?: string;
  instituteName?: string;
  department: string;
  rawDepartment?: string;
  totalPhD?: number | null;
  supervisorName: string;
  designation?: string;
  designationSeatLimit?: number;
  allottedSeat?: number;
  noOfVacant?: number;
  active?: boolean;
}

export interface Stats {
  totalThesesAwarded: number;
  totalPublications: number;
  totalPatents: number;
  totalBooks: number;
  totalSupervisors: number;
  totalPhDSeats: number;
  totalAllottedSeats: number;
  totalVacantSeats: number;
  categoryCounts: Record<string, number>;
  instituteCounts?: Record<string, number>;
}
