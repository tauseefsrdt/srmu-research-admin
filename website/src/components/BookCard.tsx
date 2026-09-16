import React from 'react';
import { BookOpen, User, Building, BookmarkCheck } from 'lucide-react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
}

function BookCard({ book }: BookCardProps) {
  if (!book) return null;

  return (
    <article className="group relative p-6 sm:p-7 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-[#0A4A8F]/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between h-full overflow-hidden">
      {/* Top Accent Strip on Hover */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0A4A8F] via-[#FFB703] to-[#0A4A8F] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Top Tag */}
        <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0A4A8F] px-2.5 py-1 rounded-full bg-[#0A4A8F]/8 border border-[#0A4A8F]/15 inline-flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#0A4A8F]" />
            <span>BOOK / CHAPTER</span>
          </span>
          <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFF8E7] text-[#0C2F44] border border-[#FFB703]/30">
            {book.year}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-[17px] sm:text-[18px] font-bold text-[#0F172A] leading-snug mb-3 group-hover:text-[#0A4A8F] transition-colors line-clamp-3">
          {book.title}
        </h3>

        {/* Author */}
        <div className="flex items-start gap-2 text-xs text-slate-600 mb-2 font-mono">
          <User size={14} className="text-[#FFB703] mt-0.5 shrink-0" />
          <div className="line-clamp-2">
            <span className="text-slate-700 font-semibold">Author(s): </span>
            {Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}
          </div>
        </div>

        {/* Publisher */}
        {book.publisher && (
          <div className="flex items-start gap-2 text-xs text-slate-500 mb-3.5">
            <Building size={14} className="text-[#0A4A8F] mt-0.5 shrink-0" />
            <span className="line-clamp-1">
              Publisher: <strong className="font-semibold text-slate-700">{book.publisher}</strong>
            </span>
          </div>
        )}

        {/* ISBN Chip */}
        {book.isbn && (
          <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/70 mb-4 flex items-center justify-between gap-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
              ISBN / ISSN
            </span>
            <span className="font-mono text-xs font-bold text-[#0A4A8F] px-2.5 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs">
              {book.isbn}
            </span>
          </div>
        )}
      </div>

      {/* Footer Details */}
      <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#0A4A8F] bg-[#EEF3FA] px-3 py-1 rounded-full border border-[#0A4A8F]/15">
          <BookmarkCheck size={13} />
          <span>Published</span>
        </span>

        {book.isbnIssn ? (
          <span className="font-mono text-xs text-slate-500">Ref: {book.isbnIssn}</span>
        ) : (
          <span className="font-mono text-xs text-slate-400">SRMU Research</span>
        )}
      </div>
    </article>
  );
}

export default BookCard;
