import { patents as defaultPatents, researchPapers as defaultPapers, books as defaultBooks } from './data';
import { Stats, FeaturedRecords, Department, Patent, ResearchPaper, Book, SearchResults } from '../types';

const API_BASE = 'http://localhost:8080/api/v1';

// Dynamic cache
let livePatents: any[] = [...defaultPatents];
let livePapers: any[] = [...defaultPapers];
let liveBooks: any[] = [...defaultBooks];
let hasFetchedLive = false;

// Async fetch from Spring Boot REST API
export const syncWithBackend = async (): Promise<void> => {
  try {
    const [papersRes, patentsRes, booksRes] = await Promise.allSettled([
      fetch(`${API_BASE}/research-items/by-category/PUBLICATION`).then((r) => r.json()),
      fetch(`${API_BASE}/research-items/by-category/PATENT`).then((r) => r.json()),
      fetch(`${API_BASE}/research-items/by-category/BOOK`).then((r) => r.json()),
    ]);

    if (papersRes.status === 'fulfilled' && papersRes.value?.data?.length > 0) {
      livePapers = papersRes.value.data.map((item: any, idx: number) => ({
        srNo: item.srNo || idx + 1,
        _id: item.id,
        id: item.id,
        title: item.title,
        authorName: item.primaryAuthor,
        department: item.department || item.rawFacultyInstitute || '',
        journalName: item.venue,
        yearOfPublication: item.publicationYear || item.eventOrAwardDate || '',
        issnNumber: item.identifier,
        ugcRecognitionLink: item.externalLink,
        abstract: item.abstractText,
      }));
    }

    if (patentsRes.status === 'fulfilled' && patentsRes.value?.data?.length > 0) {
      livePatents = patentsRes.value.data.map((item: any, idx: number) => ({
        srNo: item.srNo || idx + 1,
        _id: item.id,
        id: item.id,
        patenterName: item.primaryAuthor,
        patentNumber: item.identifier,
        title: item.title,
        yearOfAward: item.eventOrAwardDate || item.publicationYear || '',
      }));
    }

    if (booksRes.status === 'fulfilled' && booksRes.value?.data?.length > 0) {
      liveBooks = booksRes.value.data.map((item: any, idx: number) => ({
        slNo: item.srNo || idx + 1,
        _id: item.id,
        id: item.id,
        teacherName: item.primaryAuthor,
        bookOrChapterTitle: item.title,
        paperTitle: item.title,
        publisherName: item.venue,
        yearOfPublication: item.publicationYear || item.eventOrAwardDate || '',
        isbnIssn: item.identifier,
        affiliatingInstitute: item.department || '',
      }));
    }

    hasFetchedLive = true;
  } catch (err) {
    console.warn('Backend API offline, using local data:', err);
  }
};

// Initial sync triggered in background
syncWithBackend();

// Helper to extract year from various date/year formats
const matchesYear = (itemYear: any, targetYear: string | number): boolean => {
  if (!targetYear || targetYear === 'All' || targetYear === '') return true;
  if (!itemYear) return false;
  return String(itemYear).includes(String(targetYear).trim());
};

// Compute overall statistics
export const getStats = (): Stats => {
  const paperAuthors = livePapers.map((p) => p.authorName).filter(Boolean);
  const patentInventors = livePatents.map((p) => p.patenterName).filter(Boolean);

  const researchers = new Set(
    [...paperAuthors, ...patentInventors]
      .filter(Boolean)
      .flatMap((names) => String(names).split(',').map((name) => name.trim()))
      .filter(Boolean)
  );

  return {
    totalIndexed: livePapers.length,
    totalPapers: livePatents.length,
    totalBooks: liveBooks.length,
    totalResearchers: researchers.size,
  };
};

// Get featured records (top 3 of each)
export const getFeatured = (): FeaturedRecords => {
  return {
    papers: livePatents.slice(0, 3).map((p: any) => ({
      ...p,
      id: p._id || p.srNo,
      authors: p.patenterName,
      year: p.yearOfAward,
      abstract: p.patentNumber,
    })),
    indexed: livePapers.slice(0, 3).map((p: any) => ({
      ...p,
      id: p._id || p.srNo,
      authors: p.authorName,
      departmentKey: p.department,
      journal: p.journalName,
      year: p.yearOfPublication,
      abstract: p.issnNumber,
      doi: p.ugcRecognitionLink,
    })),
    books: liveBooks.slice(0, 3).map((b: any) => ({
      ...b,
      id: b._id || b.slNo,
      title: b.paperTitle || b.bookOrChapterTitle || 'Untitled book or chapter',
      authors: b.teacherName,
      year: b.yearOfPublication,
      publisher: b.publisherName,
      abstract: b.bookOrChapterTitle,
      isbn: b.isbnIssn,
    })),
  };
};

// Compute distinct departments with counts from data
export const getDepartments = (): Department[] => {
  const deptCounts: Record<string, number> = {};
  livePapers.forEach((paper: any) => {
    const dept = (paper.department || '').trim();
    if (dept) {
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    }
  });

  return Object.entries(deptCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => ({
      key,
      name: key,
      count,
    }));
};

// Get and filter patents
export const getPatents = ({
  search = '',
  department = 'All',
  year = '',
}: { search?: string; department?: string; year?: string | number } = {}): { patents: Patent[]; count: number } => {
  const filtered = livePatents.filter((item: any) => {
    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      const match =
        (item.title && item.title.toLowerCase().includes(term)) ||
        (item.patenterName && item.patenterName.toLowerCase().includes(term)) ||
        (item.patentNumber && item.patentNumber.toLowerCase().includes(term)) ||
        (item.yearOfAward && String(item.yearOfAward).toLowerCase().includes(term));
      if (!match) return false;
    }

    if (department && department !== 'All') {
      const deptTerm = department.toLowerCase();
      const matchDept =
        (item.patenterName && item.patenterName.toLowerCase().includes(deptTerm)) ||
        (item.title && item.title.toLowerCase().includes(deptTerm)) ||
        (item.patentNumber && item.patentNumber.toLowerCase().includes(deptTerm));
      if (!matchDept) return false;
    }

    if (year && !matchesYear(item.yearOfAward, year)) {
      return false;
    }

    return true;
  });

  const formatted: Patent[] = filtered.map((patent: any) => ({
    ...patent,
    id: patent._id || patent.srNo,
    authors: patent.patenterName,
    year: patent.yearOfAward,
    abstract: patent.patentNumber,
  }));

  return {
    patents: formatted,
    count: formatted.length,
  };
};

// Get and filter research papers
export const getResearchPapers = ({
  search = '',
  department = 'All',
  year = '',
}: { search?: string; department?: string; year?: string | number } = {}): { papers: ResearchPaper[]; count: number } => {
  const filtered = livePapers.filter((item: any) => {
    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      const match =
        (item.title && item.title.toLowerCase().includes(term)) ||
        (item.authorName && item.authorName.toLowerCase().includes(term)) ||
        (item.journalName && item.journalName.toLowerCase().includes(term)) ||
        (item.department && item.department.toLowerCase().includes(term)) ||
        (item.issnNumber && String(item.issnNumber).toLowerCase().includes(term)) ||
        (item.ugcRecognitionLink && item.ugcRecognitionLink.toLowerCase().includes(term));
      if (!match) return false;
    }

    if (department && department !== 'All') {
      if ((item.department || '').trim() !== department.trim()) {
        return false;
      }
    }

    if (year && !matchesYear(item.yearOfPublication, year)) {
      return false;
    }

    return true;
  });

  const formatted: ResearchPaper[] = filtered.map((paper: any) => ({
    ...paper,
    id: paper._id || paper.srNo,
    authors: paper.authorName,
    departmentKey: paper.department,
    journal: paper.journalName,
    year: paper.yearOfPublication,
    abstract: paper.issnNumber,
    doi: paper.ugcRecognitionLink,
  }));

  return {
    papers: formatted,
    count: formatted.length,
  };
};

// Get and filter books
export const getBooks = ({ search = '', year = '' }: { search?: string; year?: string | number } = {}): { books: Book[]; count: number } => {
  const filtered = liveBooks.filter((item: any) => {
    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      const match =
        (item.paperTitle && item.paperTitle.toLowerCase().includes(term)) ||
        (item.bookOrChapterTitle && item.bookOrChapterTitle.toLowerCase().includes(term)) ||
        (item.teacherName && item.teacherName.toLowerCase().includes(term)) ||
        (item.publisherName && item.publisherName.toLowerCase().includes(term)) ||
        (item.isbnIssn && String(item.isbnIssn).toLowerCase().includes(term));
      if (!match) return false;
    }

    if (year && !matchesYear(item.yearOfPublication, year)) {
      return false;
    }

    return true;
  });

  const formatted: Book[] = filtered.map((book: any) => ({
    ...book,
    id: book._id || book.slNo,
    title: book.paperTitle || book.bookOrChapterTitle || 'Untitled book or chapter',
    authors: book.teacherName,
    year: book.yearOfPublication,
    publisher: book.publisherName,
    abstract: book.bookOrChapterTitle,
    isbn: book.isbnIssn,
  }));

  return {
    books: formatted,
    count: formatted.length,
  };
};

// Universal search across all research categories
export const searchResearch = (query: string): SearchResults => {
  if (!query || !query.trim()) {
    return { papers: [], indexed: [], books: [], total: 0 };
  }

  const { patents: matchedPatents } = getPatents({ search: query });
  const { papers: matchedResearch } = getResearchPapers({ search: query });
  const { books: matchedBooks } = getBooks({ search: query });

  const total = matchedPatents.length + matchedResearch.length + matchedBooks.length;

  return {
    papers: matchedPatents.slice(0, 10),
    indexed: matchedResearch.slice(0, 10),
    books: matchedBooks.slice(0, 10),
    total,
  };
};
