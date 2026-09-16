import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bookmark, Search, RefreshCw, Loader2, X } from 'lucide-react';
import { gsap } from 'gsap';
import ResearchCard from '../components/ResearchCard';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPublications } from '../store/slices/publicationsSlice';
import { ResearchPaper } from '../types';

function IndexedPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { items: allPapers, departments, loading } = useAppSelector((state) => state.publications);
  const [searchParams, setSearchParams] = useSearchParams();

  // URL search query synchronization
  const urlSearch = searchParams.get('search') || '';
  const [search, setSearch] = useState(urlSearch);
  const [selectedDept, setSelectedDept] = useState(searchParams.get('department') || 'All');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '');

  // Keep local search synced if URL changes
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  // Debounced API fetch directly from MySQL backend
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        fetchPublications({
          sessionCode: '2025-26',
          search: search.trim() || undefined,
          year: selectedYear || undefined,
        })
      );
    }, 200);

    return () => clearTimeout(timer);
  }, [dispatch, search, selectedYear]);

  // In-memory department refinement for instant UX
  const filteredPapers = useMemo(() => {
    return allPapers.filter((item: ResearchPaper) => {
      if (selectedDept && selectedDept !== 'All') {
        const itemDept = (item.department || '').trim();
        if (itemDept !== selectedDept.trim()) {
          return false;
        }
      }
      return true;
    });
  }, [allPapers, selectedDept]);

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
    setSelectedDept('All');
    setSelectedYear('');
    setSearchParams({}, { replace: true });
    dispatch(fetchPublications({ sessionCode: '2025-26' }));
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
          High-impact papers indexed in WoS and SCOPUS (Live MySQL Data)
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
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search indexed paper title, author, journal..."
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
