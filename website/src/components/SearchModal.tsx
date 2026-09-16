import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  FileText,
  Bookmark,
  BookOpen,
  GraduationCap,
  Building2,
  Users,
  Compass,
  Loader2,
  ArrowRight,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  searchGlobal,
  setQuery,
  setSelectedType,
  clearSearch,
  SearchResultItem,
} from '../store/slices/searchSlice';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_TABS = [
  { key: 'ALL', label: 'All Results', icon: Compass },
  { key: 'PUBLICATION', label: 'Publications', icon: Bookmark },
  { key: 'PATENT', label: 'Patents', icon: FileText },
  { key: 'BOOK', label: 'Books', icon: BookOpen },
  { key: 'THESIS_AWARDED', label: 'Theses', icon: GraduationCap },
  { key: 'INSTITUTE', label: 'Institutes', icon: Building2 },
  { key: 'FACULTY_SUPERVISOR', label: 'Supervisors', icon: Users },
  { key: 'PAGE', label: 'Pages', icon: Compass },
];

function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    query,
    selectedType,
    items,
    typeCounts,
    totalResults,
    loading,
    error,
    hasSearched,
  } = useAppSelector((state) => state.search);

  const [localQuery, setLocalQuery] = useState(query);

  // Debounced Search Thunk Dispatch
  useEffect(() => {
    const trimmed = localQuery.trim();
    dispatch(setQuery(localQuery));

    if (!trimmed) {
      dispatch(clearSearch());
      return;
    }

    const timer = setTimeout(() => {
      dispatch(
        searchGlobal({
          q: trimmed,
          type: selectedType,
          page: 0,
          size: 50,
        })
      );
    }, 220);

    return () => clearTimeout(timer);
  }, [localQuery, selectedType, dispatch]);

  // Handle Tab Click
  const handleTabChange = (typeKey: string) => {
    dispatch(setSelectedType(typeKey));
    if (localQuery.trim()) {
      dispatch(
        searchGlobal({
          q: localQuery.trim(),
          type: typeKey,
          page: 0,
          size: 50,
        })
      );
    }
  };

  // Keyboard shortcut listener for ESC key
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

  // Quick search handler
  const handleQuickSearch = (term: string) => {
    setLocalQuery(term);
  };

  const handleItemClick = (url: string) => {
    onClose();
    navigate(url);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'PUBLICATION':
        return <Bookmark className="w-4 h-4 text-[#0A4A8F]" />;
      case 'PATENT':
        return <FileText className="w-4 h-4 text-[#D97706]" />;
      case 'BOOK':
        return <BookOpen className="w-4 h-4 text-[#059669]" />;
      case 'THESIS_AWARDED':
        return <GraduationCap className="w-4 h-4 text-[#7C3AED]" />;
      case 'INSTITUTE':
        return <Building2 className="w-4 h-4 text-[#0284C7]" />;
      case 'FACULTY_SUPERVISOR':
        return <Users className="w-4 h-4 text-[#2563EB]" />;
      case 'PAGE':
      default:
        return <Compass className="w-4 h-4 text-[#4B5563]" />;
    }
  };

  const getItemBadgeStyle = (type: string) => {
    switch (type) {
      case 'PUBLICATION':
        return 'bg-blue-50 text-[#0A4A8F] border-blue-200/60';
      case 'PATENT':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'BOOK':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'THESIS_AWARDED':
        return 'bg-purple-50 text-purple-700 border-purple-200/60';
      case 'INSTITUTE':
        return 'bg-sky-50 text-sky-700 border-sky-200/60';
      case 'FACULTY_SUPERVISOR':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
      case 'PAGE':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="search-overlay fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:pt-16 bg-[#0C2F44]/65 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="search-modal w-full max-w-3xl bg-white rounded-3xl border border-[#0A4A8F]/20 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="search-modal-bar flex items-center gap-3 p-4 sm:p-5 bg-[#EEF3FA]/80 border-b border-[#0A4A8F]/10">
          <Search className="search-modal-icon text-[#0A4A8F] w-5 h-5 shrink-0" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search publications, patents, authors, books, institutes, supervisors..."
            className="search-modal-input flex-1 bg-transparent border-none outline-none font-sans text-base sm:text-lg text-[#1F2937] placeholder-[#9CA3AF]"
            autoFocus
          />
          {localQuery && (
            <button
              onClick={() => {
                setLocalQuery('');
                dispatch(clearSearch());
              }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {loading && <Loader2 className="search-modal-loader w-5 h-5 text-[#0A4A8F] animate-spin shrink-0" />}
          <button
            onClick={onClose}
            className="search-modal-close p-1.5 rounded-full hover:bg-white text-[#6B7280] hover:text-[#1F2937] transition-colors cursor-pointer shrink-0"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs Filter Bar */}
        {localQuery.trim().length > 0 && (
          <div className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 bg-slate-50 border-b border-slate-200/80 overflow-x-auto scrollbar-none">
            {CATEGORY_TABS.map((tab) => {
              const count = tab.key === 'ALL' ? totalResults : typeCounts[tab.key] || 0;
              const isSelected = selectedType === tab.key;
              const TabIcon = tab.icon;

              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0A4A8F] text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {count > 0 && (
                    <span
                      className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Results Container */}
        <div className="search-modal-results flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {!localQuery.trim() ? (
            <div className="text-center py-12 text-[#6B7280]">
              <Search className="w-12 h-12 mx-auto mb-3 text-[#0A4A8F]/40 stroke-[1.5]" />
              <p className="text-base font-semibold text-[#1F2937]">Live Database Search</p>
              <p className="text-xs text-[#6B7280] mt-1 max-w-md mx-auto">
                Search across 195+ publications, 40 patents, 68 books, PhD supervisors, vacant seat matrix, and university departments.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                <span className="text-xs font-medium text-slate-500">Popular queries:</span>
                {['Antenna', 'Machine Learning', 'Patents', 'Computer Science', 'Vacant Seats', 'Biotechnology'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleQuickSearch(term)}
                    className="text-xs font-mono px-3 py-1 rounded-full bg-[#EEF3FA] text-[#0A4A8F] hover:bg-[#0A4A8F] hover:text-white transition-colors cursor-pointer border border-[#0A4A8F]/10"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-sm font-semibold text-rose-600">{error}</p>
              <button
                onClick={() =>
                  dispatch(
                    searchGlobal({
                      q: localQuery.trim(),
                      type: selectedType,
                      page: 0,
                      size: 50,
                    })
                  )
                }
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-medium text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry search</span>
              </button>
            </div>
          ) : items.length === 0 && !loading ? (
            <div className="text-center py-12 text-[#6B7280]">
              <p className="text-base font-semibold text-[#1F2937]">No matches found for "{localQuery}"</p>
              <p className="text-xs text-[#6B7280] mt-1">
                Try using broader keywords, author names, institute abbreviations, or category titles.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono px-1 pb-1">
                <span>
                  Found <strong className="text-slate-800">{totalResults}</strong> result{totalResults !== 1 ? 's' : ''} in MySQL database
                </span>
                {selectedType !== 'ALL' && (
                  <span className="text-[#0A4A8F] font-semibold">Filtered by: {selectedType}</span>
                )}
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.url)}
                  className="group block p-3.5 sm:p-4 rounded-2xl bg-[#F8FAFC] hover:bg-[#EEF3FA]/90 border border-slate-200/90 hover:border-[#0A4A8F]/30 transition-all cursor-pointer shadow-sm hover:shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Top Header / Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getItemBadgeStyle(
                            item.type
                          )}`}
                        >
                          {getItemIcon(item.type)}
                          <span>{item.categoryLabel}</span>
                        </span>

                        {item.identifier && (
                          <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 truncate max-w-[200px]">
                            {item.identifier}
                          </span>
                        )}

                        {item.year && (
                          <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {item.year}
                          </span>
                        )}
                      </div>

                      {/* Main Title */}
                      <h4 className="text-sm sm:text-[15px] font-semibold text-[#1F2937] group-hover:text-[#0A4A8F] leading-snug line-clamp-2 transition-colors">
                        {item.title}
                      </h4>

                      {/* Subtitle / Authors / Venue */}
                      {item.subtitle && (
                        <p className="text-xs text-slate-600 line-clamp-1 mt-1 font-mono">
                          {item.subtitle}
                        </p>
                      )}

                      {/* Snippet / Abstract */}
                      {item.snippet && (
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed font-sans">
                          {item.snippet}
                        </p>
                      )}
                    </div>

                    {/* Arrow / Action indicator */}
                    <div className="shrink-0 pt-1 text-slate-400 group-hover:text-[#0A4A8F] group-hover:translate-x-1 transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="search-modal-footer flex items-center justify-between p-3 sm:p-4 bg-[#EEF3FA]/80 border-t border-[#0A4A8F]/10 font-mono text-xs text-[#6B7280]">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#0A4A8F]/20 text-[#0A4A8F]">ESC</kbd>
              <span>close</span>
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline">MySQL Database Connected</span>
          </div>
          <span className="font-semibold text-[#0A4A8F]">SRMU Research Database</span>
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
