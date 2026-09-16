import React, { useState, useEffect } from 'react';
import { FacultySeatMatrix, Institute, AcademicSession } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchFacultyPage,
  createFacultySeat,
  updateFacultySeat,
  deleteFacultySeat,
} from '../store/thunks/facultyThunks';
import {
  selectFacultyItems,
  selectFacultyTotalElements,
  selectFacultyTotalPages,
  selectFacultyPage,
  selectFacultyLoading,
  selectFacultyError,
  selectFacultyActionSuccess,
} from '../store/selectors';
import { setFacultyPage, clearFacultyStatus } from '../store/slices/facultySlice';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle2,
  Save,
  X
} from 'lucide-react';

interface FacultySeatManagerProps {
  institutes: Institute[];
  sessions: AcademicSession[];
  activeSessionCode: string;
}

export const FacultySeatManager: React.FC<FacultySeatManagerProps> = ({
  institutes,
  sessions,
  activeSessionCode,
}) => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectFacultyItems);
  const totalElements = useAppSelector(selectFacultyTotalElements);
  const totalPages = useAppSelector(selectFacultyTotalPages);
  const page = useAppSelector(selectFacultyPage);
  const loading = useAppSelector(selectFacultyLoading);
  const error = useAppSelector(selectFacultyError);
  const actionSuccess = useAppSelector(selectFacultyActionSuccess);

  const [pageSize] = useState(15);

  const [search, setSearch] = useState('');
  const [selectedInstitute, setSelectedInstitute] = useState<string>('ALL');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FacultySeatMatrix | null>(null);

  const [formData, setFormData] = useState<Partial<FacultySeatMatrix>>({
    supervisorName: '',
    department: '',
    designation: 'Professor',
    totalPhD: null,
    designationSeatLimit: 8,
    allottedSeat: 0,
    noOfVacant: 8,
  });

  const loadData = () => {
    dispatch(
      fetchFacultyPage({
        sessionCode: activeSessionCode === 'ALL' ? undefined : activeSessionCode,
        instituteId: selectedInstitute === 'ALL' ? undefined : Number(selectedInstitute),
        search: search.trim() || undefined,
        page,
        size: pageSize,
      })
    );
  };

  useEffect(() => {
    loadData();
  }, [dispatch, page, activeSessionCode, selectedInstitute]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFacultyPage(0));
      loadData();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      academicSessionId: sessions[0]?.id || 1,
      supervisorName: '',
      department: '',
      designation: 'Professor',
      designationSeatLimit: 8,
      allottedSeat: 0,
      noOfVacant: 8,
      totalPhD: null,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: FacultySeatMatrix) => {
    setEditingItem(item);
    setFormData({
      ...item,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supervisorName || !formData.department) {
      alert('Supervisor name and Department are required.');
      return;
    }

    try {
      if (editingItem?.id) {
        await dispatch(updateFacultySeat({ id: editingItem.id, data: formData }));
      } else {
        await dispatch(createFacultySeat(formData));
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      alert('Failed to save: ' + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this faculty seat matrix entry?')) {
      await dispatch(deleteFacultySeat(id));
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#0A4A8F]" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0A4A8F]">
              Vacant Seat Matrix
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#0F172A] tracking-tight">
            Faculty Research Supervisors &amp; Ph.D. Seats ({totalElements})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage supervisor designation limits, allotted scholar seats, and vacancy numbers.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[#0A4A8F] hover:bg-[#0C5CA8] text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-[#0A4A8F]/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Supervisor</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-md flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search supervisor name, department, designation..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0A4A8F]"
          />
        </div>

        <div className="w-full sm:w-60">
          <select
            value={selectedInstitute}
            onChange={(e) => {
              setSelectedInstitute(e.target.value);
              dispatch(setFacultyPage(0));
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
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/90 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3.5 px-4 w-12">#</th>
                <th className="py-3.5 px-4">Institute</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4 text-center">Total Ph.D.</th>
                <th className="py-3.5 px-4">Supervisor Name</th>
                <th className="py-3.5 px-4">Designation</th>
                <th className="py-3.5 px-4 text-center">Limit</th>
                <th className="py-3.5 px-4 text-center">Allotted</th>
                <th className="py-3.5 px-4 text-center">Vacant</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-[#0A4A8F] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading supervisors...</span>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    No supervisor records found matching criteria.
                  </td>
                </tr>
              ) : (
                items.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0A4A8F]">
                      {page * pageSize + idx + 1}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {row.instituteTitle || row.instituteName || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {row.department}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-[#0A4A8F]">
                      {row.totalPhD !== null ? row.totalPhD : '—'}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {row.supervisorName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                        {row.designation || '—'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-700">
                      {row.designationSeatLimit}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-[#0A4A8F]">
                      {row.allottedSeat}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          (row.noOfVacant || 0) > 0
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : (row.noOfVacant || 0) === 0
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {row.noOfVacant}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(row)}
                          className="p-1.5 rounded-lg bg-[#0A4A8F]/10 text-[#0A4A8F] hover:bg-[#0A4A8F]/20 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => row.id && handleDelete(row.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                          title="Delete"
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

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            Showing <strong className="text-slate-900">{items.length}</strong> of{' '}
            <strong className="text-slate-900">{totalElements}</strong> supervisors
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(setFacultyPage(Math.max(0, page - 1)))}
              disabled={page === 0 || loading}
              className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#0A4A8F] disabled:opacity-40 transition-all cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => dispatch(setFacultyPage(Math.min(totalPages - 1, page + 1)))}
              disabled={page >= totalPages - 1 || loading}
              className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#0A4A8F] disabled:opacity-40 transition-all cursor-pointer shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">
                {editingItem ? 'Edit Faculty Supervisor' : 'Add New Faculty Supervisor'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Institute
                </label>
                <select
                  value={formData.instituteId || ''}
                  onChange={(e) => setFormData({ ...formData, instituteId: e.target.value ? Number(e.target.value) : null })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="">-- Select Institute --</option>
                  {institutes.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Department *
                </label>
                <input
                  type="text"
                  value={formData.department || ''}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Faculty of Civil Engineering"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Supervisor Name *
                </label>
                <input
                  type="text"
                  value={formData.supervisorName || ''}
                  onChange={(e) => setFormData({ ...formData, supervisorName: e.target.value })}
                  placeholder="e.g. Dr. Alkesh Agrawal"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={formData.designation || ''}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Professor / Associate Prof."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    Total PhD in Dept
                  </label>
                  <input
                    type="number"
                    value={formData.totalPhD ?? ''}
                    onChange={(e) => setFormData({ ...formData, totalPhD: e.target.value ? Number(e.target.value) : null })}
                    placeholder="e.g. 5"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    Seat Limit
                  </label>
                  <input
                    type="number"
                    value={formData.designationSeatLimit ?? 0}
                    onChange={(e) => {
                      const limit = Number(e.target.value);
                      const allotted = formData.allottedSeat || 0;
                      setFormData({
                        ...formData,
                        designationSeatLimit: limit,
                        noOfVacant: limit - allotted,
                      });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    Allotted
                  </label>
                  <input
                    type="number"
                    value={formData.allottedSeat ?? 0}
                    onChange={(e) => {
                      const allotted = Number(e.target.value);
                      const limit = formData.designationSeatLimit || 0;
                      setFormData({
                        ...formData,
                        allottedSeat: allotted,
                        noOfVacant: limit - allotted,
                      });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    Vacant
                  </label>
                  <input
                    type="number"
                    value={formData.noOfVacant ?? 0}
                    onChange={(e) => setFormData({ ...formData, noOfVacant: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

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
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Supervisor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
