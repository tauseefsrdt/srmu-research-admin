import React, { useState, useEffect } from 'react';
import { ResearchItem, Institute, AcademicSession, ResearchCategory } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchResearchPage,
  createResearchItem,
  updateResearchItem,
  deleteResearchItem,
} from '../store/thunks/researchThunks';
import {
  selectResearchItems,
  selectResearchTotalElements,
  selectResearchTotalPages,
  selectResearchPage,
  selectResearchLoading,
  selectResearchError,
  selectResearchActionSuccess,
} from '../store/selectors';
import { setResearchPage, clearResearchStatus } from '../store/slices/researchSlice';
import {
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  Building2,
  Award
} from 'lucide-react';
import { ResearchModal } from './ResearchModal';

interface ResearchManagerProps {
  institutes: Institute[];
  sessions: AcademicSession[];
  categories: ResearchCategory[];
  activeSessionCode: string;
  categoryFilterOverride?: string;
}

export const ResearchManager: React.FC<ResearchManagerProps> = ({
  institutes,
  sessions,
  categories,
  activeSessionCode,
  categoryFilterOverride,
}) => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectResearchItems);
  const totalElements = useAppSelector(selectResearchTotalElements);
  const totalPages = useAppSelector(selectResearchTotalPages);
  const page = useAppSelector(selectResearchPage);
  const loading = useAppSelector(selectResearchLoading);
  const error = useAppSelector(selectResearchError);
  const actionSuccess = useAppSelector(selectResearchActionSuccess);

  const [pageSize] = useState(15);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFilterOverride || 'ALL');
  const [selectedInstitute, setSelectedInstitute] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ResearchItem | null>(null);

  // Delete confirm state
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (categoryFilterOverride) {
      setSelectedCategory(categoryFilterOverride);
    }
  }, [categoryFilterOverride]);

  const loadData = () => {
    dispatch(
      fetchResearchPage({
        sessionCode: activeSessionCode === 'ALL' ? undefined : activeSessionCode,
        categoryCode: selectedCategory === 'ALL' ? undefined : selectedCategory,
        instituteId: selectedInstitute === 'ALL' ? undefined : Number(selectedInstitute),
        year: selectedYear === 'ALL' ? undefined : selectedYear,
        search: search.trim() || undefined,
        page,
        size: pageSize,
      })
    );
  };

  useEffect(() => {
    loadData();
  }, [dispatch, page, activeSessionCode, selectedCategory, selectedInstitute, selectedYear]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setResearchPage(0));
      loadData();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSave = async (data: Partial<ResearchItem>) => {
    if (editingItem?.id) {
      await dispatch(updateResearchItem({ id: editingItem.id, data }));
    } else {
      await dispatch(createResearchItem(data));
    }
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this research record?')) {
      await dispatch(deleteResearchItem(id));
      loadData();
    }
  };

  const getCategoryBadge = (code?: string) => {
    switch (code) {
      case 'THESIS_AWARDED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'PUBLICATION':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'PATENT':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'BOOK':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#0A4A8F]" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0A4A8F]">
              {activeSessionCode === 'ALL' ? 'All Academic Sessions' : `Session ${activeSessionCode}`}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#0F172A] tracking-tight">
            Research Repository Data ({totalElements})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage Ph.D. Theses, Indexed Publications, Patents, and Books.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#0A4A8F] hover:bg-[#0C5CA8] text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-[#0A4A8F]/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Research Record</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-md flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, scholar/author, supervisor, journal, reg no, patent no..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0A4A8F]"
          />
        </div>

        {/* Category Filter */}
        {!categoryFilterOverride && (
          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                dispatch(setResearchPage(0));
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0A4A8F] cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Institute Filter */}
        <div className="w-full md:w-48">
          <select
            value={selectedInstitute}
            onChange={(e) => {
              setSelectedInstitute(e.target.value);
              dispatch(setResearchPage(0));
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0A4A8F] cursor-pointer"
          >
            <option value="ALL">All Institutes</option>
            {institutes.map((i) => (
              <option key={i.id} value={i.id}>
                {i.code} ({i.title})
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div className="w-full md:w-32">
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              dispatch(setResearchPage(0));
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0A4A8F] cursor-pointer"
          >
            <option value="ALL">All Years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/90 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3.5 px-4 w-12">#</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Institute / Dept</th>
                <th className="py-3.5 px-4 min-w-[260px]">Title</th>
                <th className="py-3.5 px-4">Author / Scholar</th>
                <th className="py-3.5 px-4">Supervisor / Co-Authors</th>
                <th className="py-3.5 px-4">Identifier / Date</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-[#0A4A8F] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading data records...</span>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    No research records found matching current criteria.
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0A4A8F]">
                      {item.srNo || page * pageSize + idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${getCategoryBadge(
                          item.categoryCode
                        )}`}
                      >
                        {item.categoryCode || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.instituteCode || 'SRMU'}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{item.department || item.rawFacultyInstitute || '—'}</div>
                    </td>
                    <td className="py-3.5 px-4 min-w-[260px]">
                      <div className="font-semibold font-serif text-slate-900 leading-snug line-clamp-2" title={item.title}>
                        "{item.title}"
                      </div>
                      {item.venue && (
                        <div className="text-[11px] text-slate-500 italic mt-0.5 line-clamp-1">
                          {item.venue}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{item.primaryAuthor || '—'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="line-clamp-2">{item.coAuthors || '—'}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      <div>{item.identifier || '—'}</div>
                      <div className="text-slate-400">{item.eventOrAwardDate || item.publicationYear || ''}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                          item.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {item.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.externalLink && (
                          <a
                            href={item.externalLink}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-[#0A4A8F] hover:bg-slate-200 transition-colors"
                            title="Open external URL"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#0A4A8F]/10 text-[#0A4A8F] hover:bg-[#0A4A8F]/20 transition-colors cursor-pointer"
                          title="Edit Record"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => item.id && handleDelete(item.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-slate-500 font-mono">
            Showing <strong className="text-slate-900">{items.length}</strong> of{' '}
            <strong className="text-slate-900">{totalElements}</strong> records (Page {page + 1} of{' '}
            {totalPages || 1})
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(setResearchPage(Math.max(0, page - 1)))}
              disabled={page === 0 || loading}
              className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#0A4A8F] disabled:opacity-40 transition-all cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => dispatch(setResearchPage(Math.min(totalPages - 1, page + 1)))}
              disabled={page >= totalPages - 1 || loading}
              className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#0A4A8F] disabled:opacity-40 transition-all cursor-pointer shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <ResearchModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        initialData={editingItem}
        institutes={institutes}
        sessions={sessions}
        categories={categories}
        defaultCategoryCode={categoryFilterOverride}
        defaultSessionCode={activeSessionCode}
      />
    </div>
  );
};
