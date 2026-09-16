import React, { useEffect, useRef, useState } from 'react';
import { Bookmark, Calendar, User, Building, ExternalLink, Loader2, Award } from 'lucide-react';
import { ResearchPaper } from '../types';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import Pagination from './Pagination';

interface PublicationCardProps {
  paper: ResearchPaper;
}

function PublicationCard({ paper }: PublicationCardProps) {
  const isISSN = paper.abstract && paper.abstract.trim().length <= 25 && !paper.abstract.includes(' ');

  return (
    <article className="group relative p-6 sm:p-7 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-[#0A4A8F]/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between h-full overflow-hidden">
      {/* Top Accent Strip on Hover */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0A4A8F] via-[#FFB703] to-[#0A4A8F] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Eyebrow / Department and Badges */}
        <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0A4A8F] px-2.5 py-1 rounded-full bg-[#0A4A8F]/8 border border-[#0A4A8F]/15">
            ● {paper.departmentKey || 'RESEARCH'}
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
            SCOPUS / WOS
          </span>
        </div>

        {/* Paper Title */}
        <h3 className="font-serif text-[17px] sm:text-[18px] font-bold text-[#0F172A] leading-snug mb-3 group-hover:text-[#0A4A8F] transition-colors line-clamp-3">
          {paper.title || 'Untitled research publication'}
        </h3>

        {/* Authors */}
        <div className="flex items-start gap-2 text-xs text-slate-600 mb-2 font-mono">
          <User size={14} className="text-[#FFB703] mt-0.5 shrink-0" />
          <span className="line-clamp-2">
            {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors || 'Author not available'}
          </span>
        </div>

        {/* Journal */}
        {paper.journal && (
          <div className="flex items-start gap-2 text-xs text-slate-500 italic mb-3.5">
            <Building size={14} className="text-[#0A4A8F] mt-0.5 shrink-0" />
            <span className="line-clamp-1">{paper.journal}</span>
          </div>
        )}

        {/* ISSN / Identifier or Abstract Box */}
        {paper.abstract && (
          <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/70 mb-4 flex items-center justify-between gap-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {isISSN ? 'ISSN / Ref' : 'Abstract'}
            </span>
            <span className="font-mono text-xs font-bold text-[#0A4A8F] px-2.5 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs">
              {paper.abstract}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-600 px-3 py-1 rounded-full bg-slate-100/80 border border-slate-200/60">
          <Calendar size={13} className="text-[#FFB703]" />
          {paper.year || 'Year N/A'}
        </span>
        {paper.doi ? (
          <Link
            to={`${paper.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0A4A8F] hover:bg-[#0C5CA8] text-white font-mono text-xs font-medium transition-all shadow-sm hover:shadow hover:-translate-y-0.5"
          >
            <span>View</span>
            <ExternalLink size={12} />
          </Link>
        ) : (
          <span className="font-mono text-xs text-slate-400">ID: {paper.id}</span>
        )}
      </div>
    </article>
  );
}

interface ResearchCardProps {
  papers: ResearchPaper[];
  count: number;
  loading: boolean;
}

function ResearchCard({ papers, count, loading }: ResearchCardProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // Reset page when papers change
  useEffect(() => {
    setCurrentPage(1);
  }, [papers.length]);

  const totalPages = Math.ceil(papers.length / ITEMS_PER_PAGE);
  const currentPapers = papers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (loading || !gridRef.current || currentPapers.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.research-card-item', {
        y: 25,
        opacity: 0,
        duration: 0.45,
        stagger: 0.04,
        ease: 'power2.out',
      });
    }, gridRef);

    return () => ctx.revert();
  }, [loading, currentPage]);

  return (
    <>
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="results-count-badge">
          <strong>{count}</strong>
          indexed publications
        </div>
        {loading && <Loader2 className="loader-on-theme animate-spin w-4 h-4 text-[#0A4A8F]" />}
      </div>

      {loading ? (
        <div className="empty-state min-h-[280px] flex flex-col items-center justify-center p-12 bg-white/60 rounded-2xl border border-[#0A4A8F]/10">
          <Loader2 className="loader-on-theme animate-spin w-8 h-8 text-[#0A4A8F] mb-3" />
          <p className="text-sm text-[#6B7280]">Loading indexed journals...</p>
        </div>
      ) : papers.length === 0 ? (
        <div className="empty-state min-h-[280px] flex flex-col items-center justify-center p-12 bg-white/60 rounded-2xl border border-[#0A4A8F]/10 text-center">
          <Bookmark className="w-10 h-10 text-[#9CA3AF] mb-3 stroke-[1.5]" />
          <p className="font-semibold text-[#1F2937]">No matching indexed journals found</p>
          <p className="text-xs text-[#6B7280] mt-1">Try refining your search terms or faculty filter</p>
        </div>
      ) : (
        <>
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 research-card-grid">
            {currentPapers.map((paper) => (
              <div key={paper.id} className="research-card-item">
                <PublicationCard paper={paper} />
              </div>
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
    </>
  );
}

export default ResearchCard;
