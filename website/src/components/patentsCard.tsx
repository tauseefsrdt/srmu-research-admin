import React from 'react';
import { Calendar, User, Building, ExternalLink, Award } from 'lucide-react';
import { Patent } from '../types';

interface PaperCardProps {
  paper: Patent | any;
}

function PaperCard({ paper }: PaperCardProps) {
  if (!paper) return null;

  const isPatent = Boolean(paper.patenterName || paper.patentNumber || paper.yearOfAward);
  const authors = isPatent ? paper.patenterName : paper.authors;
  const year = isPatent ? paper.yearOfAward : paper.year;
  const details = isPatent ? paper.title : paper.abstract;

  return (
    <article className="group relative p-6 sm:p-7 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-[#0A4A8F]/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between h-full overflow-hidden">
      {/* Top Accent Strip on Hover */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0A4A8F] via-[#FFB703] to-[#0A4A8F] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Eyebrow & Badges */}
        <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0A4A8F] px-2.5 py-1 rounded-full bg-[#0A4A8F]/8 border border-[#0A4A8F]/15">
            ● {isPatent ? 'PATENT' : paper.departmentKey || 'RESEARCH'}
          </span>
          {paper.featured && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#FFB703] px-2.5 py-0.5 rounded-full bg-[#FFF8E7] border border-[#FFB703]/30">
              <Award size={11} /> FEATURED
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif text-[17px] sm:text-[18px] font-bold text-[#0F172A] leading-snug mb-3 group-hover:text-[#0A4A8F] transition-colors line-clamp-3">
          {isPatent ? details : paper.title}
        </h3>

        {/* Authors / Patenter */}
        <div className="flex items-start gap-2 text-xs text-slate-600 mb-2.5 font-mono">
          <User size={14} className="text-[#FFB703] mt-0.5 shrink-0" />
          <span className="line-clamp-2">
            <strong className="text-slate-700 font-semibold">{isPatent ? 'Inventor(s): ' : 'Author(s): '}</strong>
            {Array.isArray(authors) ? authors.join(', ') : authors || 'N/A'}
          </span>
        </div>

        {/* Patent Number Box */}
        {isPatent && paper.patentNumber && (
          <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/70 mb-4 flex items-center justify-between gap-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Patent No.
            </span>
            <span className="font-mono text-xs font-bold text-[#0A4A8F] px-2.5 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs">
              {paper.patentNumber}
            </span>
          </div>
        )}

        {!isPatent && paper.journal && (
          <div className="flex items-start gap-2 text-xs text-slate-500 italic mb-3.5">
            <Building size={14} className="text-[#0A4A8F] mt-0.5 shrink-0" />
            <span className="line-clamp-1">{paper.journal}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-600 px-3 py-1 rounded-full bg-slate-100/80 border border-slate-200/60">
          <Calendar size={13} className="text-[#FFB703]" />
          {year || 'Awarded'}
        </span>
        {paper.doi ? (
          <a
            href={paper.doi}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0A4A8F] hover:bg-[#0C5CA8] text-white font-mono text-xs font-medium transition-all shadow-sm hover:shadow hover:-translate-y-0.5"
          >
            <span>View</span>
            <ExternalLink size={12} />
          </a>
        ) : (
          <span className="font-mono text-xs text-slate-400">ID: {paper.id}</span>
        )}
      </div>
    </article>
  );
}

export default PaperCard;
