import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Bookmark, Search, RefreshCw, Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import ResearchCard from '../components/ResearchCard';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPublications } from '../store/slices/publicationsSlice';
import { ResearchPaper } from '../types';

function IndexedPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { items: allPapers, departments, loading } = useAppSelector((state) => state.publications);

  // Local UI Filters
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    dispatch(fetchPublications('2025-26'));
  }, [dispatch]);

  // Compute filtered papers in memory cleanly
  const filteredPapers = useMemo(() => {
    return allPapers.filter((item: ResearchPaper) => {
      // Search match
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

      // Department match
      if (selectedDept && selectedDept !== 'All') {
        if ((item.department || '').trim() !== selectedDept.trim()) {
          return false;
        }
      }

      // Year match
      if (selectedYear) {
        const itemYear = item.yearOfPublication || item.year;
        if (!itemYear || !String(itemYear).includes(String(selectedYear).trim())) {
          return false;
        }
      }

      return true;
    });
  }, [allPapers, search, selectedDept, selectedYear]);

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
    setSelectedDept('All');
    setSelectedYear('');
  };

  const hasFilters = search || selectedDept !== 'All' || selectedYear;

  return (
    <div ref={pageRef} className="archive-page home-width py-8 sm:py-12">
      {/* Header */}
      <div className="page-hero-copy mb-8">
        <div className="archive-hero-reveal eyebrow">
          <span className="eyebrow-dot rose" />
          <Bookmark className="w-4 h-4" />
          <span>Scopus / Web of Science</span>
        </div>
        <h1 className="archive-hero-reveal text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#1F2937] tracking-tight mt-2 mb-3">
          Indexed <em> <br />Journal Publications.</em>
        </h1>
        <p className="archive-hero-reveal text-base sm:text-lg text-[#6B7280] max-w-2xl">
          High-impact papers indexed in WoS and SCOPUS
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="archive-filter-reveal filter-bar indexed-filter-bar mb-6 p-4 rounded-2xl bg-white/80 border border-[#0A4A8F]/15 shadow-md backdrop-blur-md">
        {/* Search Field */}
        <div className="filter-search flex-1">
          <Search className="text-[#0A4A8F]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search indexed paper title, author, journal..."
            className="archive-input"
          />
        </div>

        {/* Department Filter */}
        <div className="filter-select department-select">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="archive-input"
          >
            <option value="All">All Faculties</option>
            {departments.map((dept) => (
              <option key={dept.key} value={dept.key}>
                {dept.name} ({dept.count})
              </option>
            ))}
          </select>
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

      <ResearchCard papers={filteredPapers} count={filteredPapers.length} loading={loading} />
    </div>
  );
}

export default IndexedPage;
