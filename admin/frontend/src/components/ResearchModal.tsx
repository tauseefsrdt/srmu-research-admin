import React, { useState } from 'react';
import { ResearchItem, Institute, AcademicSession, ResearchCategory } from '../types';
import { X, Save, Sparkles } from 'lucide-react';

interface ResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<ResearchItem>) => Promise<void>;
  initialData?: ResearchItem | null;
  institutes: Institute[];
  sessions: AcademicSession[];
  categories: ResearchCategory[];
  defaultCategoryCode?: string;
  defaultSessionCode?: string;
}

export const ResearchModal: React.FC<ResearchModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  institutes,
  sessions,
  categories,
  defaultCategoryCode,
  defaultSessionCode,
}) => {
  if (!isOpen) return null;

  const activeCategory = categories.find((c) =>
    initialData ? c.id === initialData.categoryId : defaultCategoryCode ? c.code === defaultCategoryCode : true
  ) || categories[0];

  const activeSession = sessions.find((s) =>
    initialData ? s.id === initialData.academicSessionId : defaultSessionCode ? s.sessionCode === defaultSessionCode : s.isCurrent
  ) || sessions[0];

  const [formData, setFormData] = useState<Partial<ResearchItem>>({
    srNo: initialData?.srNo || 1,
    academicSessionId: initialData?.academicSessionId || activeSession?.id || 1,
    categoryId: initialData?.categoryId || activeCategory?.id || 1,
    instituteId: initialData?.instituteId || null,
    title: initialData?.title || '',
    primaryAuthor: initialData?.primaryAuthor || '',
    coAuthors: initialData?.coAuthors || '',
    department: initialData?.department || '',
    rawFacultyInstitute: initialData?.rawFacultyInstitute || '',
    identifier: initialData?.identifier || '',
    venue: initialData?.venue || '',
    eventOrAwardDate: initialData?.eventOrAwardDate || '',
    publicationYear: initialData?.publicationYear || '2025',
    externalLink: initialData?.externalLink || '',
    abstractText: initialData?.abstractText || '',
    status: initialData?.status || 'ACTIVE',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const currentCat = categories.find((c) => c.id === Number(formData.categoryId));
  const catCode = currentCat?.code || 'THESIS_AWARDED';

  const isThesis = catCode === 'THESIS_AWARDED';
  const isPatent = catCode === 'PATENT';
  const isBook = catCode === 'BOOK';
  const isPublication = catCode === 'PUBLICATION';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.academicSessionId) {
      setError('Academic session is required');
      return;
    }
    if (!formData.categoryId) {
      setError('Category is required');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save record');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-slate-50/80 border-b border-slate-200/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0A4A8F]" />
            <h3 className="text-lg font-bold font-serif text-slate-900">
              {initialData ? 'Edit Research Record' : 'Add New Research Record'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Primary Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-mono font-bold uppercase text-slate-600 block mb-1">
                Category *
              </label>
              <select
                value={formData.categoryId || ''}
                onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0A4A8F] cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold uppercase text-slate-600 block mb-1">
                Session *
              </label>
              <select
                value={formData.academicSessionId || ''}
                onChange={(e) => setFormData({ ...formData, academicSessionId: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0A4A8F] cursor-pointer"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.sessionCode} ({s.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold uppercase text-slate-600 block mb-1">
                Institute
              </label>
              <select
                value={formData.instituteId || ''}
                onChange={(e) => setFormData({ ...formData, instituteId: e.target.value ? Number(e.target.value) : null })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0A4A8F] cursor-pointer"
              >
                <option value="">-- University Wide / None --</option>
                {institutes.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.title} ({i.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-[11px] font-mono font-bold uppercase text-slate-600 block mb-1">
              {isThesis ? 'Thesis Title *' : isPatent ? 'Patent / Design Title *' : isBook ? 'Book / Chapter Title *' : 'Paper Title *'}
            </label>
            <textarea
              rows={3}
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter exact research title..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0A4A8F] font-sans"
              required
            />
          </div>

          {/* Dynamic Authors / Primary Scholar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono font-bold uppercase text-slate-600 block mb-1">
                {isThesis ? 'PhD Scholar Name' : isPatent ? 'Patenter / Inventor' : isBook ? 'Author / Teacher' : 'Author Name(s)'}
              </label>
              <input
                type="text"
                value={formData.primaryAuthor || ''}
                onChange={(e) => setFormData({ ...formData, primaryAuthor: e.target.value })}
                placeholder="e.g. Dr. Jane Doe"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0A4A8F]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold uppercase text-slate-600 block mb-1">
                {isThesis ? 'Research Supervisor(s)' : isPatent ? 'Co-applicants / Assignee' : 'Co-Authors'}
              </label>
              <input
                type="text"
                value={formData.coAuthors || ''}
                onChange={(e) => setFormData({ ...formData, coAuthors: e.target.value })}
                placeholder="e.g. Prof. (Dr.) Rohit P Shabran"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0A4A8F]"
              />
            </div>
          </div>

          {/* Department and Raw Faculty Institute */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono font-bold uppercase text-slate-600 block mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department || ''}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0A4A8F]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold uppercase text-slate-600 block mb-1">
                Faculty / Institute Raw Label
              </label>
              <input
                type="text"
                value={formData.rawFacultyInstitute || ''}
                onChange={(e) => setFormData({ ...formData, rawFacultyInstitute: e.target.value })}
                placeholder="e.g. Institute of Legal Studies"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0A4A8F]"
              />
            </div>
          </div>

          {/* Identifiers & Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-mono font-bold uppercase text-slate-600 block mb-1">
                {isThesis ? 'Registration No.' : isPatent ? 'Patent / Design No.' : isBook ? 'ISBN / ISSN' : 'ISSN / DOI'}
              </label>
              <input
                type="text"
                value={formData.identifier || ''}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                placeholder="e.g. 202110301000004"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0A4A8F] font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold uppercase text-slate-600 block mb-1">
                {isPublication ? 'Journal Name' : isBook ? 'Publisher Name' : isPatent ? 'Patent Office' : 'Venue / Forum'}
              </label>
              <input
                type="text"
                value={formData.venue || ''}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="e.g. IEEE Transactions / Springer"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0A4A8F]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold uppercase text-slate-600 block mb-1">
                {isThesis ? 'Open Defense Date' : 'Award / Publication Date'}
              </label>
              <input
                type="text"
                value={formData.eventOrAwardDate || ''}
                onChange={(e) => setFormData({ ...formData, eventOrAwardDate: e.target.value })}
                placeholder="e.g. 16.07.2025"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0A4A8F] font-mono"
              />
            </div>
          </div>

          {/* Links and Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-mono font-bold uppercase text-slate-600 block mb-1">
                External Link / DOI / UGC URL
              </label>
              <input
                type="text"
                value={formData.externalLink || ''}
                onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                placeholder="https://doi.org/..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0A4A8F] font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold uppercase text-slate-600 block mb-1">
                Status
              </label>
              <select
                value={formData.status || 'ACTIVE'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0A4A8F] cursor-pointer"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="DRAFT">DRAFT</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-[#0A4A8F] hover:bg-[#0C5CA8] text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-[#0A4A8F]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : initialData ? 'Update Record' : 'Create Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
