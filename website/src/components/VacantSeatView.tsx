import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  RefreshCw,
  LayoutGrid,
  Table as TableIcon,
  Building2,
  GraduationCap,
  Users,
  CheckCircle2,
  AlertCircle,
  Layers,
} from "lucide-react";
import { gsap } from "gsap";
import {
  VACANT_SEAT_DATA,
  VACANT_SEAT_TOTAL,
  VACANT_SEAT_TITLE,
  VACANT_SEAT_HEADERS,
  getUniqueInstitutes,
  getUniqueDepartments,
  getUniqueDesignations,
} from "../data/vacantSeatData";

interface VacantSeatViewProps {
  sectionTitle: string;
  sectionSubtitle?: string;
  badgeText?: string;
  badgeIcon?: React.ReactNode;
}

export default function VacantSeatView({
  sectionTitle,
  sectionSubtitle,
  badgeText = "Single Source of Truth: Vacant Seat.xlsx",
  badgeIcon,
}: VacantSeatViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInstitute, setSelectedInstitute] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedDesignation, setSelectedDesignation] = useState("All");
  const [vacancyFilter, setVacancyFilter] = useState<"all" | "available" | "full" | "negative">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const institutes = useMemo(() => getUniqueInstitutes(), []);
  const departments = useMemo(() => getUniqueDepartments(), []);
  const designations = useMemo(() => getUniqueDesignations(), []);

  // Filtered records
  const filteredData = useMemo(() => {
    return VACANT_SEAT_DATA.filter((row) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSupervisor = row.supervisorName.toLowerCase().includes(q);
        const matchInstitute = row.institute.toLowerCase().includes(q);
        const matchDept = row.department.toLowerCase().includes(q);
        const matchDesig = row.designation.toLowerCase().includes(q);
        if (!matchSupervisor && !matchInstitute && !matchDept && !matchDesig) {
          return false;
        }
      }

      // Institute filter
      if (selectedInstitute !== "All" && row.institute !== selectedInstitute) {
        return false;
      }

      // Department filter
      if (selectedDepartment !== "All" && row.department !== selectedDepartment) {
        return false;
      }

      // Designation filter
      if (selectedDesignation !== "All" && row.designation !== selectedDesignation) {
        return false;
      }

      // Vacancy status filter
      if (vacancyFilter === "available" && row.noOfVacant <= 0) return false;
      if (vacancyFilter === "full" && row.noOfVacant !== 0) return false;
      if (vacancyFilter === "negative" && row.noOfVacant >= 0) return false;

      return true;
    });
  }, [searchQuery, selectedInstitute, selectedDepartment, selectedDesignation, vacancyFilter]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedInstitute, selectedDepartment, selectedDesignation, vacancyFilter]);

  // Entrance animation
  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".vs-animate-hero",
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out", clearProps: "all" }
      );
      gsap.fromTo(
        ".vs-animate-kpi",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out", delay: 0.1, clearProps: "all" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedInstitute("All");
    setSelectedDepartment("All");
    setSelectedDesignation("All");
    setVacancyFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedInstitute !== "All" ||
    selectedDepartment !== "All" ||
    selectedDesignation !== "All" ||
    vacancyFilter !== "all";

  // Filtered totals
  const currentTotalPhD = useMemo(() => {
    const countedDepts = new Set<string>();
    let sum = 0;
    filteredData.forEach((r) => {
      const key = `${r.institute}_${r.department}`;
      if (!countedDepts.has(key)) {
        countedDepts.add(key);
        if (r.totalPhD !== null) sum += r.totalPhD;
      }
    });
    return hasActiveFilters ? sum : VACANT_SEAT_TOTAL.totalPhD;
  }, [filteredData, hasActiveFilters]);

  const currentSeatLimit = useMemo(() => {
    return filteredData.reduce((acc, r) => acc + (r.designationSeatLimit || 0), 0);
  }, [filteredData]);

  const currentAllotted = useMemo(() => {
    return filteredData.reduce((acc, r) => acc + (r.allottedSeat || 0), 0);
  }, [filteredData]);

  const currentVacant = useMemo(() => {
    return filteredData.reduce((acc, r) => acc + (r.noOfVacant || 0), 0);
  }, [filteredData]);

  return (
    <div ref={containerRef} className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* ── HEADER & EYEBROW ───────────────────────────────── */}
      <div className="mb-8">
        <div className="vs-animate-hero inline-flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFB703]" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0A4A8F] flex items-center gap-1.5">
            {badgeIcon}
            {badgeText}
          </span>
        </div>

        <h1 className="vs-animate-hero font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0F172A] leading-tight mb-3">
          {sectionTitle}
        </h1>

        <div className="vs-animate-hero flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-slate-600 text-sm sm:text-base">
          <p className="max-w-2xl leading-relaxed">
            {sectionSubtitle ||
              `Official records and Ph.D. seat matrix mapped directly from Vacant Seat.xlsx across university institutes, departments, and research supervisors.`}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#0A4A8F]/10 text-[#0A4A8F] font-semibold border border-[#0A4A8F]/20">
              Excel Source: {VACANT_SEAT_TITLE}
            </span>
          </div>
        </div>
      </div>

      {/* ── KPI METRICS CARDS ──────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-8">
        {/* Total PhD */}
        <div className="vs-animate-kpi p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total No. of Ph.D.
            </span>
            <GraduationCap className="w-4 h-4 text-[#0A4A8F]" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#0A4A8F]">
            {currentTotalPhD}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">Official Registrations</span>
        </div>

        {/* Seat Limit */}
        <div className="vs-animate-kpi p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Seat Limit
            </span>
            <Layers className="w-4 h-4 text-[#FFB703]" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
            {currentSeatLimit}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">Designation-wise Limit</span>
        </div>

        {/* Allotted Seats */}
        <div className="vs-animate-kpi p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Allotted Seat
            </span>
            <Users className="w-4 h-4 text-[#0A4A8F]" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#0A4A8F]">
            {currentAllotted}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">Active Scholars Allotted</span>
        </div>

        {/* No. of Vacant */}
        <div className="vs-animate-kpi p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
              No. of Vacant
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {currentVacant}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">Available Ph.D. Seats</span>
        </div>

        {/* Total Supervisors */}
        <div className="vs-animate-kpi col-span-2 lg:col-span-1 p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Supervisors
            </span>
            <Building2 className="w-4 h-4 text-[#0A4A8F]" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#0A4A8F]">
            {filteredData.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">Faculty Supervisors</span>
        </div>
      </div>

      {/* ── FILTER & TOOLBAR ───────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-md mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search supervisor, designation, department..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/90 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A4A8F]/20 focus:border-[#0A4A8F] transition-all"
            />
          </div>

          {/* Institute Select */}
          <div className="md:col-span-3">
            <select
              value={selectedInstitute}
              onChange={(e) => setSelectedInstitute(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/90 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A4A8F]/20 focus:border-[#0A4A8F] transition-all"
            >
              <option value="All">All Institutes ({institutes.length})</option>
              {institutes.map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
            </select>
          </div>

          {/* Designation Select */}
          <div className="md:col-span-2">
            <select
              value={selectedDesignation}
              onChange={(e) => setSelectedDesignation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/90 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A4A8F]/20 focus:border-[#0A4A8F] transition-all"
            >
              <option value="All">All Designations</option>
              {designations.map((desig) => (
                <option key={desig} value={desig}>
                  {desig}
                </option>
              ))}
            </select>
          </div>

          {/* Vacancy Filter */}
          <div className="md:col-span-2">
            <select
              value={vacancyFilter}
              onChange={(e) => setVacancyFilter(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/90 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A4A8F]/20 focus:border-[#0A4A8F] transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="available">Vacant Seats &gt; 0</option>
              <option value="full">No Vacant (0)</option>
              <option value="negative">Over-allotted (&lt; 0)</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="md:col-span-1 flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              title="Table View"
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-[#0A4A8F] text-white border-[#0A4A8F] shadow-xs"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              title="Cards View"
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                viewMode === "cards"
                  ? "bg-[#0A4A8F] text-white border-[#0A4A8F] shadow-xs"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Filter Chips & Reset */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2 flex-wrap text-slate-600">
              <span className="font-mono text-slate-400">Filters:</span>
              {searchQuery && (
                <span className="px-2.5 py-1 rounded-md bg-[#0A4A8F]/10 text-[#0A4A8F] font-mono">
                  "{searchQuery}"
                </span>
              )}
              {selectedInstitute !== "All" && (
                <span className="px-2.5 py-1 rounded-md bg-[#0A4A8F]/10 text-[#0A4A8F] font-mono">
                  {selectedInstitute}
                </span>
              )}
              {selectedDesignation !== "All" && (
                <span className="px-2.5 py-1 rounded-md bg-[#0A4A8F]/10 text-[#0A4A8F] font-mono">
                  {selectedDesignation}
                </span>
              )}
              {vacancyFilter !== "all" && (
                <span className="px-2.5 py-1 rounded-md bg-[#0A4A8F]/10 text-[#0A4A8F] font-mono">
                  Status: {vacancyFilter}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-slate-600 hover:text-[#0A4A8F] hover:bg-slate-100 transition-colors font-medium cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>
          </div>
        )}
      </div>

      {/* ── RESULTS HEADER ─────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold">
          Showing {paginatedData.length} of {filteredData.length} records
          {hasActiveFilters && " (Filtered)"}
        </span>
        <span className="font-mono text-xs text-slate-400">
          Page {currentPage} of {totalPages || 1}
        </span>
      </div>

      {/* ── TABLE VIEW ─────────────────────────────────────── */}
      {viewMode === "table" ? (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100/90 border-b border-slate-200/90 text-[12px] font-mono font-bold uppercase tracking-wider text-slate-700">
                  <th className="py-4 px-4 sm:px-5">#</th>
                  <th className="py-4 px-4">{VACANT_SEAT_HEADERS[0]}</th>
                  <th className="py-4 px-4">{VACANT_SEAT_HEADERS[1]}</th>
                  <th className="py-4 px-3 text-center">{VACANT_SEAT_HEADERS[2]}</th>
                  <th className="py-4 px-4">{VACANT_SEAT_HEADERS[3]}</th>
                  <th className="py-4 px-4">{VACANT_SEAT_HEADERS[4]}</th>
                  <th className="py-4 px-3 text-center">{VACANT_SEAT_HEADERS[5]}</th>
                  <th className="py-4 px-3 text-center">{VACANT_SEAT_HEADERS[6]}</th>
                  <th className="py-4 px-4 text-center">{VACANT_SEAT_HEADERS[7]}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500">
                      <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700">No matching records found</p>
                      <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search terms</p>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/80 transition-colors duration-150 group"
                    >
                      {/* Row Index */}
                      <td className="py-3.5 px-4 sm:px-5 font-mono text-xs text-slate-400">
                        {row.id}
                      </td>

                      {/* Institute */}
                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[#0A4A8F] shrink-0 opacity-70" />
                          <span className="font-semibold">{row.institute || "—"}</span>
                        </div>
                      </td>

                      {/* Department (Preserve exact multiline text) */}
                      <td className="py-3.5 px-4 text-slate-700 whitespace-pre-line font-medium text-xs leading-relaxed">
                        {row.department || "—"}
                      </td>

                      {/* Total No. of PhD */}
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-[#0A4A8F]">
                        {row.totalPhD !== null ? (
                          <span className="px-2 py-0.5 rounded-md bg-[#0A4A8F]/8 border border-[#0A4A8F]/15">
                            {row.totalPhD}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Supervisor Name */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900 group-hover:text-[#0A4A8F] transition-colors">
                        {row.supervisorName}
                      </td>

                      {/* Designation */}
                      <td className="py-3.5 px-4 text-slate-600 text-xs">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 font-medium">
                          {row.designation}
                        </span>
                      </td>

                      {/* Seat Limit */}
                      <td className="py-3.5 px-3 text-center font-mono text-slate-800 font-bold">
                        {row.designationSeatLimit}
                      </td>

                      {/* Allotted Seat */}
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-[#0A4A8F]">
                        {row.allottedSeat}
                      </td>

                      {/* No. of Vacant */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center font-mono text-xs font-extrabold px-3 py-1 rounded-full border ${
                            row.noOfVacant > 0
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : row.noOfVacant === 0
                              ? "bg-slate-100 text-slate-600 border-slate-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {row.noOfVacant}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

              {/* Exact Totals Footer Row */}
              <tfoot>
                <tr className="bg-slate-900 text-white font-mono font-bold text-xs uppercase tracking-wider border-t-2 border-[#FFB703]">
                  <td className="py-4 px-4 sm:px-5">Σ</td>
                  <td className="py-4 px-4">{VACANT_SEAT_TOTAL.institute}</td>
                  <td className="py-4 px-4 text-slate-400 font-normal">All Departments</td>
                  <td className="py-4 px-3 text-center text-[#FFB703] text-sm">
                    {hasActiveFilters ? currentTotalPhD : VACANT_SEAT_TOTAL.totalPhD}
                  </td>
                  <td className="py-4 px-4 text-slate-300">
                    {filteredData.length} Supervisors
                  </td>
                  <td className="py-4 px-4 text-slate-400 font-normal">—</td>
                  <td className="py-4 px-3 text-center text-sm">
                    {hasActiveFilters ? currentSeatLimit : VACANT_SEAT_TOTAL.designationSeatLimit}
                  </td>
                  <td className="py-4 px-3 text-center text-sm text-[#FFB703]">
                    {hasActiveFilters ? currentAllotted : VACANT_SEAT_TOTAL.allottedSeat}
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-emerald-400">
                    {hasActiveFilters ? currentVacant : VACANT_SEAT_TOTAL.noOfVacant}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        /* ── CARD VIEW ──────────────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedData.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white/80 rounded-3xl border border-slate-200">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No matching records found</p>
            </div>
          ) : (
            paginatedData.map((row) => (
              <div
                key={row.id}
                className="group relative p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-[#0A4A8F]/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
              >
                {/* Accent top line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0A4A8F] via-[#FFB703] to-[#0A4A8F] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Eyebrow / Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0A4A8F] px-2.5 py-0.5 rounded-full bg-[#0A4A8F]/8 border border-[#0A4A8F]/15">
                      {row.institute}
                    </span>
                    <span
                      className={`font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        row.noOfVacant > 0
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : row.noOfVacant === 0
                          ? "bg-slate-100 text-slate-600 border-slate-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      {row.noOfVacant > 0
                        ? `${row.noOfVacant} Vacant`
                        : row.noOfVacant === 0
                        ? "Full (0)"
                        : `${row.noOfVacant} Balance`}
                    </span>
                  </div>

                  {/* Supervisor Name */}
                  <h3 className="font-serif text-lg font-bold text-[#0F172A] leading-snug group-hover:text-[#0A4A8F] transition-colors mb-1.5">
                    {row.supervisorName}
                  </h3>

                  {/* Designation */}
                  <div className="text-xs text-slate-500 font-medium mb-3">
                    {row.designation}
                  </div>

                  {/* Department */}
                  <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/70 mb-4">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block mb-1">
                      Department
                    </span>
                    <p className="text-xs text-slate-800 font-semibold whitespace-pre-line leading-relaxed">
                      {row.department}
                    </p>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Limit</span>
                    <span className="font-mono text-sm font-bold text-slate-800">
                      {row.designationSeatLimit}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Allotted</span>
                    <span className="font-mono text-sm font-bold text-[#0A4A8F]">
                      {row.allottedSeat}
                    </span>
                  </div>
                  <div
                    className={`p-2 rounded-xl border ${
                      row.noOfVacant > 0
                        ? "bg-emerald-50/60 border-emerald-100"
                        : "bg-slate-50 border-slate-100"
                    }`}
                  >
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Vacant</span>
                    <span
                      className={`font-mono text-sm font-extrabold ${
                        row.noOfVacant > 0
                          ? "text-emerald-700"
                          : row.noOfVacant === 0
                          ? "text-slate-700"
                          : "text-rose-700"
                      }`}
                    >
                      {row.noOfVacant}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── PAGINATION ─────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-slate-200/80">
          <span className="text-xs text-slate-500 font-mono">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} records
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Only show nearby pages
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                      currentPage === page
                        ? "bg-[#0A4A8F] text-white shadow-xs"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-1 text-slate-400 text-xs">
                    …
                  </span>
                );
              }
              return null;
            })}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
