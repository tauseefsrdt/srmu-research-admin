import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BookOpen, Search, RefreshCw, Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import BookCard from '../components/BookCard';
import Pagination from '../components/Pagination';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBooks } from '../store/slices/booksSlice';
import { Book } from '../types';

function BooksPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { items: allBooks, loading } = useAppSelector((state) => state.books);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // Filters
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    dispatch(fetchBooks('2025-26'));
  }, [dispatch]);

  const books = useMemo(() => {
    return allBooks.filter((item: Book) => {
      if (search && search.trim()) {
        const term = search.trim().toLowerCase();
        const match =
          (item.title && item.title.toLowerCase().includes(term)) ||
          (item.paperTitle && item.paperTitle.toLowerCase().includes(term)) ||
          (item.bookOrChapterTitle && item.bookOrChapterTitle.toLowerCase().includes(term)) ||
          (item.authors && (Array.isArray(item.authors) ? item.authors.join(' ') : item.authors).toLowerCase().includes(term)) ||
          (item.teacherName && item.teacherName.toLowerCase().includes(term)) ||
          (item.publisher && item.publisher.toLowerCase().includes(term)) ||
          (item.publisherName && item.publisherName.toLowerCase().includes(term)) ||
          (item.isbn && item.isbn.toLowerCase().includes(term)) ||
          (item.isbnIssn && item.isbnIssn.toLowerCase().includes(term)) ||
          (item.affiliatingInstitute && item.affiliatingInstitute.toLowerCase().includes(term));
        if (!match) return false;
      }
      if (selectedYear) {
        const itemYear = item.yearOfPublication || item.year;
        if (!itemYear || !String(itemYear).includes(String(selectedYear).trim())) {
          return false;
        }
      }
      return true;
    });
  }, [allBooks, search, selectedYear]);

  const count = books.length;

  // Page entrance animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.archive-hero-reveal',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', clearProps: 'all' }
      );
      gsap.fromTo(
        '.archive-filter-reveal',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 0.15, ease: 'power2.out', clearProps: 'all' }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const resetFilters = () => {
    setSearch('');
    setSelectedYear('');
  };

  const hasFilters = Boolean(search || selectedYear);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedYear]);

  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
  const currentBooks = books.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div ref={pageRef} className="archive-page home-width py-8 sm:py-12">
      
      {/* Header */}
      <div className="page-hero-copy mb-8">
        <div className="archive-hero-reveal eyebrow">
          <span className="eyebrow-dot" />
          <BookOpen className="w-4 h-4" />
          <span>Academic Books &amp; Chapters</span>
        </div>
        <h1 className="archive-hero-reveal text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#1F2937] tracking-tight mt-2 mb-3">
          Books &amp; <em>chapters.</em>
        </h1>
        <p className="archive-hero-reveal text-base sm:text-lg text-[#6B7280] max-w-2xl">
          Published books, edited volumes, and authored book chapters by university faculty.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="archive-filter-reveal filter-bar mb-6 p-4 rounded-2xl bg-white/80 border border-[#0A4A8F]/15 shadow-md backdrop-blur-md">
        
        {/* Search Field */}
        <div className="filter-search flex-1">
          <Search className="text-[#0A4A8F]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search book title, author, publisher, ISBN..."
            className="archive-input"
          />
        </div>

        {/* Year Filter */}
        <div className="filter-select">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="archive-input"
          >
            <option value="">All Years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>

        {/* Reset */}
        {hasFilters && (
          <button
            onClick={resetFilters}
            className="btn-ghost reset-button"
            title="Reset filters"
          >
            <RefreshCw className="w-4 h-4" style={{ color: 'var(--color-deep-teal)' }} />
            <span>Reset</span>
          </button>
        )}

      </div>

      {/* Count */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="results-count-badge">
          <strong>{count}</strong>
          books and chapters
        </div>
        {loading && <Loader2 className="loader-on-theme animate-spin w-4 h-4 text-[#0A4A8F]" />}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="empty-state min-h-[240px] flex flex-col items-center justify-center p-12 bg-white/60 rounded-2xl border border-[#0A4A8F]/10">
          <Loader2 className="loader-on-theme animate-spin w-8 h-8 text-[#0A4A8F] mb-3" />
          <p className="text-sm text-[#6B7280]">Loading books...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state min-h-[240px] flex flex-col items-center justify-center p-12 bg-white/60 rounded-2xl border border-[#0A4A8F]/10 text-center">
          <BookOpen className="w-10 h-10 text-[#9CA3AF] mb-3 stroke-[1.5]" />
          <p className="font-semibold text-[#1F2937]">No matching books found</p>
          <p className="text-xs text-[#6B7280] mt-1">Try searching for other keywords or resetting filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={books.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </>
      )}

    </div>
  );
}

export default BooksPage;
