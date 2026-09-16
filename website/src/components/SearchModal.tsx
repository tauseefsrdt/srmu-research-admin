import React, { useState, useEffect } from 'react';
import { Search, X, FileText, Bookmark, BookOpen, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { searchResearch } from '../data/researchService';
import { SearchResults } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({ papers: [], indexed: [], books: [], total: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ papers: [], indexed: [], books: [], total: 0 });
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      try {
        const data = searchResearch(query);
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  // Escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="search-overlay fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:pt-20 bg-[#0C2F44]/60 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="search-modal w-full max-w-2xl bg-white rounded-3xl border border-[#0A4A8F]/20 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search Header Input */}
        <div className="search-modal-bar flex items-center gap-3 p-4 sm:p-5 bg-[#EEF3FA]/70 border-b border-[#0A4A8F]/10">
          <Search className="search-modal-icon text-[#0A4A8F] w-5 h-5 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search papers, patents, authors, journals, ISBN..."
            className="search-modal-input flex-1 bg-transparent border-none outline-none font-sans text-base sm:text-lg text-[#1F2937] placeholder-[#9CA3AF]"
            autoFocus
          />
          {loading && <Loader2 className="search-modal-loader w-5 h-5 text-[#0A4A8F] animate-spin" />}
          <button
            onClick={onClose}
            className="search-modal-close p-1.5 rounded-full hover:bg-white/80 text-[#6B7280] hover:text-[#1F2937] transition-colors cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="search-modal-results flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {!query.trim() ? (
            <div className="text-center py-10 text-[#6B7280]">
              <Search className="w-12 h-12 mx-auto mb-3 text-[#0A4A8F]/40 stroke-[1.5]" />
              <p className="text-base font-medium text-[#1F2937]">Type keywords above to search through all research data</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                <span className="text-xs text-[#6B7280]">Quick search:</span>
                {['AI', 'Microstrip Antenna', 'Biometric', 'Patents'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#EEF3FA] text-[#0A4A8F] hover:bg-[#0A4A8F] hover:text-white transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.total === 0 && !loading ? (
            <div className="text-center py-12 text-[#6B7280]">
              <p className="text-base font-semibold text-[#1F2937]">No research publications found</p>
              <p className="text-xs text-[#6B7280] mt-1">Try adjusting your search terms</p>
            </div>
          ) : (
            <>
              {/* Research Papers Section */}
              {results.papers?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A4A8F] mb-3 font-mono">
                    <FileText className="w-4 h-4" />
                    <span>Research Papers ({results.papers.length})</span>
                  </div>
                  <div className="space-y-2">
                    {results.papers.map((paper) => (
                      <Link
                        key={paper.id}
                        to="/patents"
                        onClick={onClose}
                        className="block p-3.5 rounded-2xl bg-[#F8FAFC] hover:bg-[#EEF3FA] border border-[#0A4A8F]/10 hover:border-[#0A4A8F]/30 transition-all group"
                      >
                        <h4 className="text-sm font-semibold text-[#1F2937] group-hover:text-[#0A4A8F] line-clamp-1 transition-colors">{paper.title}</h4>
                        <p className="text-xs text-[#6B7280] line-clamp-1 mt-1 font-mono">Authors: {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Indexed Journals Section */}
              {results.indexed?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0C5CA8] mb-3 font-mono">
                    <Bookmark className="w-4 h-4 text-[#FFB703]" />
                    <span>Indexed Publications ({results.indexed.length})</span>
                  </div>
                  <div className="space-y-2">
                    {results.indexed.map((item) => (
                      <Link
                        key={item.id}
                        to="/research"
                        onClick={onClose}
                        className="block p-3.5 rounded-2xl bg-[#F8FAFC] hover:bg-[#EEF3FA] border border-[#0A4A8F]/10 hover:border-[#0A4A8F]/30 transition-all group"
                      >
                        <h4 className="text-sm font-semibold text-[#1F2937] group-hover:text-[#0A4A8F] line-clamp-1 transition-colors">{item.title}</h4>
                        <p className="text-xs text-[#6B7280] line-clamp-1 mt-1 font-mono">{item.journal} ({item.year})</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Books Section */}
              {results.books?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A4A8F] mb-3 font-mono">
                    <BookOpen className="w-4 h-4 text-[#0A4A8F]" />
                    <span>Books &amp; Chapters ({results.books.length})</span>
                  </div>
                  <div className="space-y-2">
                    {results.books.map((book) => (
                      <Link
                        key={book.id}
                        to="/books"
                        onClick={onClose}
                        className="block p-3.5 rounded-2xl bg-[#F8FAFC] hover:bg-[#EEF3FA] border border-[#0A4A8F]/10 hover:border-[#0A4A8F]/30 transition-all group"
                      >
                        <h4 className="text-sm font-semibold text-[#1F2937] group-hover:text-[#0A4A8F] line-clamp-1 transition-colors">{book.title}</h4>
                        <p className="text-xs text-[#6B7280] line-clamp-1 mt-1 font-mono">Publisher: {book.publisher || 'N/A'}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="search-modal-footer flex items-center justify-between p-3.5 sm:p-4 bg-[#EEF3FA]/70 border-t border-[#0A4A8F]/10 font-mono text-xs text-[#6B7280]">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#0A4A8F]/20 text-[#0A4A8F]">ESC</kbd>
            <span>to close</span>
          </span>
          <span className="font-semibold text-[#0A4A8F]">SRMU Research Database</span>
        </div>

      </div>
    </div>
  );
}

export default SearchModal;
