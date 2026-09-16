import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileText, Search, RefreshCw, Loader2, X, Award } from 'lucide-react';
import { gsap } from 'gsap';
import PaperCard from '../components/patentsCard';
import Pagination from '../components/Pagination';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPatents } from '../store/slices/patentsSlice';
import { getDepartments } from '../data/researchService';
import { Patent, Department } from '../types';

function PapersPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { items: allPatents, loading } = useAppSelector((state) => state.patents);
  const [searchParams, setSearchParams] = useSearchParams();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // Filters — always read live from URL
  const search = searchParams.get('search') || '';
  const selectedDept = searchParams.get('department') || 'All';
  const selectedYear = searchParams.get('year') || '';

  // Helper to update URL params
  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== '') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next, { replace: true });
  };

  const resetFilters = () => setSearchParams({}, { replace: true });

  useEffect(() => {
    dispatch(fetchPatents('2025-26'));
  }, [dispatch]);

  useEffect(() => {
    try {
      setDepartments(getDepartments());
    } catch (err) {
      console.error('Error getting departments:', err);
    }
  }, []);

  const papers = useMemo(() => {
    return allPatents.filter((item: Patent) => {
      if (search && search.trim()) {
        const term = search.trim().toLowerCase();
        const match =
          (item.title && item.title.toLowerCase().includes(term)) ||
          (item.patenterName && item.patenterName.toLowerCase().includes(term)) ||
          (item.authors && item.authors.toLowerCase().includes(term)) ||
          (item.patentNumber && item.patentNumber.toLowerCase().includes(term)) ||
          (item.abstract && item.abstract.toLowerCase().includes(term));
        if (!match) return false;
      }
      if (selectedYear) {
        const itemYear = item.yearOfAward || item.year;
        if (!itemYear || !String(itemYear).includes(String(selectedYear).trim())) {
          return false;
        }
      }
      return true;
    });
  }, [allPatents, search, selectedYear]);

  const count = papers.length;

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

  const hasFilters = search || selectedDept !== 'All' || selectedYear;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedDept, selectedYear]);

  const totalPages = Math.ceil(papers.length / ITEMS_PER_PAGE);
  const currentPapers = papers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div ref={pageRef} className="archive-page home-width py-8 sm:py-12">
      
      {/* Header */}
      <div className="page-hero-copy mb-8">
        <div className="archive-hero-reveal eyebrow">
          <span className="eyebrow-dot" />
          <FileText className="w-4 h-4" />
          <span>Research Showcase</span>
        </div>
        <h1 className="archive-hero-reveal text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#1F2937] tracking-tight mt-2 mb-3">
          Granted and Published <em>Patents</em> 
        </h1>
        <p className="archive-hero-reveal text-base sm:text-lg text-[#6B7280] max-w-2xl">
          Browse and filter faculty research publications, patents, and scientific contributions.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="archive-filter-reveal filter-bar papers-filter-bar mb-6 p-4 rounded-2xl bg-white/80 border border-[#0A4A8F]/15 shadow-md backdrop-blur-md">
        
        {/* Search Field */}
        <div className="filter-search flex-1">
          <Search className="text-[#0A4A8F]" />
          <input
            type="text"
            value={search}
            onChange={(e) => updateParam('search', e.target.value)}
            placeholder="Filter by title, author, keyword, or journal..."
            className="archive-input"
          />
        </div>

        {/* Department Filter */}
        <div className="filter-select department-select">
          <select
            value={selectedDept}
            onChange={(e) => updateParam('department', e.target.value)}
            className="archive-input"
          >
            <option value="All">All Faculties </option>
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
            onChange={(e) => updateParam('year', e.target.value)}
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
            <span>Reset All</span>
          </button>
        )}

      </div>

      {/* Active Filter Badge */}
      {selectedDept !== 'All' && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-[#6B7280] font-mono">Filtered by:</span>
          <span className="active-filter-chip">
            {departments.find(d => d.key === selectedDept)?.name || selectedDept}
            <button onClick={() => updateParam('department', 'All')} aria-label="Clear filter">
              <X size={12} />
            </button>
          </span>
        </div>
      )}

      {/* Results Count Banner */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="results-count-badge">
          <strong>{count}</strong>
          patents
          {hasFilters && <span className="text-[#6B7280] ml-1 font-normal">(filtered)</span>}
        </div>
        {loading && <Loader2 className="loader-on-theme animate-spin w-4 h-4 text-[#0A4A8F]" />}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="empty-state min-h-[280px] flex flex-col items-center justify-center p-12 bg-white/60 rounded-2xl border border-[#0A4A8F]/10">
          <Loader2 className="loader-on-theme animate-spin w-8 h-8 text-[#0A4A8F] mb-3" />
          <p className="text-sm text-[#6B7280]">Loading research papers...</p>
        </div>
      ) : papers.length === 0 ? (
        <div className="empty-state min-h-[280px] flex flex-col items-center justify-center p-12 bg-white/60 rounded-2xl border border-[#0A4A8F]/10 text-center">
          <FileText className="w-10 h-10 text-[#9CA3AF] mb-3 stroke-[1.5]" />
          <p className="font-semibold text-[#1F2937]">No matching research papers found</p>
          <p className="text-xs text-[#6B7280] mt-1">The selected department or filter has no matching papers.</p>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="btn-ghost inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full border border-[#0A4A8F]/20 text-xs font-medium text-[#0A4A8F]"
            >
              <RefreshCw size={13} />
              <span>Clear All Filters</span>
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPapers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={papers.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </>
      )}

    </div>
  );
}

export default PapersPage;
