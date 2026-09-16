import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Search, RefreshCw, Loader2, X } from 'lucide-react';
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
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // Filters from URL
  const urlSearch = searchParams.get('search') || '';
  const [search, setSearch] = useState(urlSearch);
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '');

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  // Debounced API fetch directly from MySQL
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        fetchBooks({
          sessionCode: '2025-26',
          search: search.trim() || undefined,
          year: selectedYear || undefined,
        })
      );
    }, 200);

    return () => clearTimeout(timer);
  }, [dispatch, search, selectedYear]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    const next = new URLSearchParams(searchParams);
    if (val.trim()) {
      next.set('search', val.trim());
    } else {
      next.delete('search');
    }
    setSearchParams(next, { replace: true });
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedYear('');
    setSearchParams({}, { replace: true });
    dispatch(fetchBooks({ sessionCode: '2025-26' }));
  };

  const count = allBooks.length;
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return allBooks.slice(start, start + ITEMS_PER_PAGE);
  }, [allBooks, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedYear]);

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

  const hasFilters = search || selectedYear;

  return (
    <div ref={pageRef} className="archive-page home-width py-8 sm:py-12">
      {/* Header */}
      <div className="page-hero-copy mb-8">
        <div className="archive-hero-reveal eyebrow">
          <span className="eyebrow-dot emerald" />
          <BookOpen className="w-4 h-4" />
          <span>Academic Books &amp; Chapters</span>
        </div>
        <h1 className="archive-hero-reveal text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#1F2937] tracking-tight mt-2 mb-3">
          Books &amp; <em> <br />Chapters Published.</em>
        </h1>
        <p className="archive-hero-reveal text-base sm:text-lg text-[#6B7280] max-w-2xl">
          Peer-reviewed monographs, international edited volumes, and textbook chapters by university faculty (Live Database).
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
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search book title, chapter, author, publisher, ISBN..."
            className="archive-input"
          />
          {search && (
            <button
              onClick={() => handleSearchChange('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
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

      {/* Results Section */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[#0A4A8F]">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="font-mono text-sm font-semibold tracking-wider">LOADING BOOKS FROM DATABASE...</p>
        </div>
      ) : allBooks.length === 0 ? (
        <div className="py-16 text-center bg-white/40 border border-dashed border-slate-300 rounded-3xl p-8">
          <p className="text-lg font-bold text-slate-700">No books found matching your criteria</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting the search query or year filter.</p>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 rounded-full bg-[#0A4A8F] text-white text-xs font-mono font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-4 px-1">
            <span>Showing <strong>{paginatedBooks.length}</strong> of <strong>{count}</strong> records</span>
            <span>Session 2025–26</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedBooks.map((book) => (
              <BookCard key={book.id || book.slNo} book={book} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={count}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BooksPage;
