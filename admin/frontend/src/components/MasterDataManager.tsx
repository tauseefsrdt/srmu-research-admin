import React, { useState } from 'react';
import { Institute, AcademicSession, ResearchCategory } from '../types';
import { useAppDispatch } from '../store/hooks';
import {
  createInstitute,
  updateInstitute,
  deleteInstitute,
} from '../store/thunks/instituteThunks';
import {
  createSession,
  updateSession,
  deleteSession,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../store/thunks/masterThunks';
import { Plus, Edit2, Trash2, CheckCircle2, Save, X, Building2, Calendar, Layers } from 'lucide-react';

interface MasterDataProps {
  type: 'institutes' | 'sessions' | 'categories';
  institutes: Institute[];
  sessions: AcademicSession[];
  categories: ResearchCategory[];
  onRefresh: () => void;
}

export const MasterDataManager: React.FC<MasterDataProps> = ({
  type,
  institutes,
  sessions,
  categories,
  onRefresh,
}) => {
  const dispatch = useAppDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [instForm, setInstForm] = useState<Partial<Institute>>({
    code: '',
    title: '',
    slug: '',
    departmentCountLabel: '3 DEPARTMENTS',
    description: '',
    image: '/Images/c1.webp',
    programs: [],
  });

  const [sessionForm, setSessionForm] = useState<Partial<AcademicSession>>({
    sessionCode: '',
    name: '',
    isCurrent: false,
  });

  const [catForm, setCatForm] = useState<Partial<ResearchCategory>>({
    code: '',
    name: '',
    description: '',
    displayOrder: 1,
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    if (type === 'institutes') {
      setInstForm({
        code: '',
        title: '',
        slug: '',
        departmentCountLabel: '3 DEPARTMENTS',
        description: '',
        image: '/Images/c1.webp',
        programs: [],
      });
    } else if (type === 'sessions') {
      setSessionForm({
        sessionCode: '',
        name: '',
        isCurrent: false,
      });
    } else {
      setCatForm({
        code: '',
        name: '',
        description: '',
        displayOrder: categories.length + 1,
      });
    }
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    if (type === 'institutes') {
      setInstForm(item);
    } else if (type === 'sessions') {
      setSessionForm(item);
    } else {
      setCatForm(item);
    }
    setModalOpen(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this master record?')) {
      if (type === 'institutes') await dispatch(deleteInstitute(id));
      else if (type === 'sessions') await dispatch(deleteSession(id));
      else await dispatch(deleteCategory(id));
      onRefresh();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (type === 'institutes') {
        if (editingItem?.id) await dispatch(updateInstitute({ id: editingItem.id, data: instForm }));
        else await dispatch(createInstitute(instForm));
      } else if (type === 'sessions') {
        if (editingItem?.id) await dispatch(updateSession({ id: editingItem.id, data: sessionForm }));
        else await dispatch(createSession(sessionForm));
      } else {
        if (editingItem?.id) await dispatch(updateCategory({ id: editingItem.id, data: catForm }));
        else await dispatch(createCategory(catForm));
      }
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert('Error saving: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#0F172A] tracking-tight flex items-center gap-2">
            {type === 'institutes' && <Building2 className="w-6 h-6 text-[#0A4A8F]" />}
            {type === 'sessions' && <Calendar className="w-6 h-6 text-[#FFB703]" />}
            {type === 'categories' && <Layers className="w-6 h-6 text-[#0A4A8F]" />}
            {type === 'institutes' ? 'University Institutes' : type === 'sessions' ? 'Academic Sessions' : 'Research Categories'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {type === 'institutes'
              ? 'Manage academic institutes, department counts, and program lists.'
              : type === 'sessions'
              ? 'Add academic years (e.g. 2026–27) and mark current active session.'
              : 'Manage research categories for paper/patent classification.'}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-[#0A4A8F] hover:bg-[#0C5CA8] text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-[#0A4A8F]/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New {type === 'institutes' ? 'Institute' : type === 'sessions' ? 'Session' : 'Category'}</span>
        </button>
      </div>

      {/* Grid or Table Display */}
      {type === 'institutes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {institutes.map((inst) => (
            <div
              key={inst.id}
              className="p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#0A4A8F]/10 text-[#0A4A8F] border border-[#0A4A8F]/20">
                    {inst.code}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono font-medium">
                    {inst.departmentCountLabel}
                  </span>
                </div>
                <h3 className="font-bold font-serif text-base text-slate-900 mb-2">{inst.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                  {inst.description}
                </p>
                {inst.programs && inst.programs.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {inst.programs.map((p, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">Slug: {inst.slug}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(inst)}
                    className="p-1.5 rounded-lg bg-[#0A4A8F]/10 text-[#0A4A8F] hover:bg-[#0A4A8F]/20 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(inst.id)}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {type === 'sessions' && (
        <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/90 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3.5 px-4">Session Code</th>
                <th className="py-3.5 px-4">Display Name</th>
                <th className="py-3.5 px-4 text-center">Current Active</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0A4A8F]">{s.sessionCode}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{s.name}</td>
                  <td className="py-3.5 px-4 text-center">
                    {s.isCurrent ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>CURRENT</span>
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 rounded-lg bg-[#0A4A8F]/10 text-[#0A4A8F] hover:bg-[#0A4A8F]/20 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {type === 'categories' && (
        <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/90 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Category Name</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4 text-center">Display Order</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0A4A8F]">{c.code}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                  <td className="py-3.5 px-4 text-slate-500">{c.description || '—'}</td>
                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700">{c.displayOrder}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 rounded-lg bg-[#0A4A8F]/10 text-[#0A4A8F] hover:bg-[#0A4A8F]/20 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">
                {editingItem ? 'Edit Master Record' : 'Add New Master Record'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              {type === 'institutes' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">
                        Code (e.g. IoT) *
                      </label>
                      <input
                        type="text"
                        value={instForm.code || ''}
                        onChange={(e) => setInstForm({ ...instForm, code: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">
                        Slug (e.g. institute-of-technology) *
                      </label>
                      <input
                        type="text"
                        value={instForm.slug || ''}
                        onChange={(e) => setInstForm({ ...instForm, slug: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={instForm.title || ''}
                      onChange={(e) => setInstForm({ ...instForm, title: e.target.value })}
                      placeholder="e.g. Institute of Technology"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">
                      Department Count Label
                    </label>
                    <input
                      type="text"
                      value={instForm.departmentCountLabel || ''}
                      onChange={(e) => setInstForm({ ...instForm, departmentCountLabel: e.target.value })}
                      placeholder="e.g. 5 DEPARTMENTS"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={instForm.description || ''}
                      onChange={(e) => setInstForm({ ...instForm, description: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">
                      Programs (comma separated)
                    </label>
                    <input
                      type="text"
                      value={instForm.programs?.join(', ') || ''}
                      onChange={(e) =>
                        setInstForm({
                          ...instForm,
                          programs: e.target.value.split(',').map((p) => p.trim()).filter(Boolean),
                        })
                      }
                      placeholder="e.g. Civil Engineering, Computer Science"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </>
              )}

              {type === 'sessions' && (
                <>
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">
                      Session Code (e.g. 2026-27) *
                    </label>
                    <input
                      type="text"
                      value={sessionForm.sessionCode || ''}
                      onChange={(e) => setSessionForm({ ...sessionForm, sessionCode: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">
                      Session Name *
                    </label>
                    <input
                      type="text"
                      value={sessionForm.name || ''}
                      onChange={(e) => setSessionForm({ ...sessionForm, name: e.target.value })}
                      placeholder="e.g. Academic Session 2026–27"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="isCurrent"
                      checked={sessionForm.isCurrent || false}
                      onChange={(e) => setSessionForm({ ...sessionForm, isCurrent: e.target.checked })}
                      className="rounded bg-slate-800 border-slate-700 text-brand-600 focus:ring-0"
                    />
                    <label htmlFor="isCurrent" className="text-slate-300 font-semibold cursor-pointer">
                      Mark as Current Active Session
                    </label>
                  </div>
                </>
              )}

              {type === 'categories' && (
                <>
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">
                      Category Code (e.g. BOOK) *
                    </label>
                    <input
                      type="text"
                      value={catForm.code || ''}
                      onChange={(e) => setCatForm({ ...catForm, code: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      value={catForm.name || ''}
                      onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                      placeholder="e.g. Books & Book Chapters"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={catForm.description || ''}
                      onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
