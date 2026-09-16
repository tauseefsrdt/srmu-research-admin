import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileText, Search, RefreshCw, Loader2, X } from 'lucide-react';
import { gsap } from 'gsap';
import PaperCard from '../components/patentsCard';
import Pagination from '../components/Pagination';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPatents } from '../store/slices/patentsSlice';
import { Patent, Department } from '../types';

function PapersPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { items: allPatents, loading } = useAppSelector((state) => state.patents);
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // Filters from URL
  const urlSearch = searchParams.get('search') || '';
  const [search, setSearch] = useState(urlSearch);
  const selectedDept = searchParams.get('department') || 'All';
  const selectedYear = searchParams.get('year') || '';

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  // Debounced API fetch directly from MySQL
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        fetchPatents({
          sessionCode: '2025-26',
          search: search.trim() || undefined,
          year: selectedYear || undefined,
        })
      );
    }, 200);

    return () => clearTimeout(timer);
  }, [dispatch, search, selectedYear]);

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

  const handleSearchChange = (val: string) => {
    setSearch(val);
    updateParam('search', val);
  };

  const resetFilters = () => {
    setSearch('');
    setSearchParams({}, { replace: true });
    dispatch(fetchPatents({ sessionCode: '2025-26' }));
  };

  const departments = useMemo(() => {
    const map = new Map<string, number>();
    allPatents.forEach((p: any) => {
      const dept = (p.departmentKey || p.department || '').trim();
      if (dept) {
        map.set(dept, (map.get(dept) || 0) + 1);
      }
    });
    const list: Department[] = Array.from(map.entries()).map(([name, count]) => ({
      key: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      count,
    }));
    return list;
  }, [allPatents]);

  const papers = useMemo(() => {
    return allPatents.filter((item: Patent) => {
      if (selectedDept && selectedDept !== 'All') {
        const itemDept = ((item as any).departmentKey || (item as any).department || '').trim();
        if (itemDept !== selectedDept.trim()) {
          return false;
        }
      }
      return true;
    });
  }, [allPatents, selectedDept]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedDept, selectedYear]);

  const totalPages = Math.ceil(papers.length / ITEMS_PER_PAGE);
  const paginatedPapers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return papers.slice(start, start + ITEMS_PER_PAGE);
  }, [papers, currentPage]);

  const hasFilters = Boolean(search || (selectedDept && selectedDept !== 'All') || selectedYear);

  // GSAP entrance animation
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

  return (
    <div ref={pageRef} className="archive-page home-width py-8 sm:py-12">
      {/* Page Header */}
      <div className="page-hero-copy mb-8">
        <div className="archive-hero-reveal eyebrow">
          <span className="eyebrow-dot amber" />
          <FileText className="w-4 h-4" />
          <span>Intellectual Property &amp; Innovations</span>
        </div>
        <h1 className="archive-hero-reveal text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#1F2937] tracking-tight mt-2 mb-3">
          Patents &amp; <em> <br />Innovations Repository.</em>
        </h1>
        <p className="archive-hero-reveal text-base sm:text-lg text-[#6B7280] max-w-2xl">
          Patents published and granted by the Office of the Controller General of Patents, Designs &amp; Trade Marks.
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
            placeholder="Search patents by title, inventor, application no..."
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
        {departments.length > 0 && (
          <div className="filter-select department-select">
            <select
              value={selectedDept}
              onChange={(e) => updateParam('department', e.target.value)}
              className="archive-input"
            >
              <option value="All">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.key} value={dept.name}>
                  {dept.name} ({dept.count})
                </option>
              ))}
            </select>
          </div>
        )}

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
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[#0A4A8F]">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="font-mono text-sm font-semibold tracking-wider">LOADING PATENTS FROM DATABASE...</p>
        </div>
      ) : papers.length === 0 ? (
        <div className="py-16 text-center bg-white/40 border border-dashed border-slate-300 rounded-3xl p-8">
          <p className="text-lg font-bold text-slate-700">No patents match your search criteria</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting the search terms or resetting the active filters.</p>
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
            <span>Showing <strong>{paginatedPapers.length}</strong> of <strong>{papers.length}</strong> patents</span>
            <span>Session 2025–26</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPapers.map((paper: any) => (
              <PaperCard key={paper.id || paper.srNo} paper={paper} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={papers.length}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PapersPage;
