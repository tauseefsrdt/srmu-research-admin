export interface Patent {
  srNo?: number;
  _id?: string | number;
  id?: string | number;
  patenterName?: string;
  patentNumber?: string;
  title?: string;
  yearOfAward?: string;
  authors?: string;
  year?: string;
  abstract?: string;
  featured?: boolean;
  citations?: number;
  doi?: string;
  departmentKey?: string;
}

export interface ResearchPaper {
  srNo?: number;
  _id?: string | number;
  id?: string | number;
  title?: string;
  authorName?: string;
  department?: string;
  journalName?: string;
  yearOfPublication?: string | number;
  issnNumber?: string;
  ugcRecognitionLink?: string;
  authors?: string | string[];
  departmentKey?: string;
  journal?: string;
  year?: string | number;
  abstract?: string;
  doi?: string;
  featured?: boolean;
  citations?: number;
}

export interface Book {
  slNo?: number;
  _id?: string | number;
  id?: string | number;
  teacherName?: string;
  bookOrChapterTitle?: string;
  paperTitle?: string | null;
  conferenceProceedingTitle?: string | null;
  conferenceName?: string | null;
  scope?: string;
  yearOfPublication?: string | number;
  isbnIssn?: string;
  affiliatingInstitute?: string;
  publisherName?: string | null;
  title?: string;
  authors?: string | string[];
  year?: string | number;
  publisher?: string | null;
  abstract?: string;
  isbn?: string;
}

export interface Department {
  key: string;
  name: string;
  count: number;
}

export interface Stats {
  totalIndexed: number;
  totalPapers: number;
  totalBooks: number;
  totalResearchers: number;
}

export interface FeaturedRecords {
  papers: Patent[];
  indexed: ResearchPaper[];
  books: Book[];
}

export interface SearchResults {
  papers: Patent[];
  indexed: ResearchPaper[];
  books: Book[];
  total: number;
}
