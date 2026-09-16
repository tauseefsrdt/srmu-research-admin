import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  GraduationCap,
  Users,
  FileText,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ChevronRight,
  Search,
  Filter,
  Award,
  LayoutGrid,
  Table as TableIcon,
  Sparkles,
} from "lucide-react";
import { gsap } from "gsap";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchDepartmentData } from "../store/slices/departmentSlice";
import { getDepartmentById, DEPARTMENTS_LIST, DepartmentInfo, setLiveThesesData, setLiveFacultyData } from "../data/departmentData";
import { ThesisAwarded } from "../data/thesisAwardedData";
import Pagination from "../components/Pagination";

export default function DepartmentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { theses: reduxTheses, faculty: reduxFaculty } = useAppSelector((state) => state.department);

  const pageRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"theses" | "faculty" | "publications" | "patents" | "books">("theses");
  const [thesisViewMode, setThesisViewMode] = useState<"cards" | "table">("cards");
  const [deptInfo, setDeptInfo] = useState<DepartmentInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThesisDept, setSelectedThesisDept] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const currentSlug = id || "all";

  // Dispatch Redux thunk on mount
  useEffect(() => {
    dispatch(fetchDepartmentData("2025-26"));
  }, [dispatch]);

  // Sync Redux state to department data model
  useEffect(() => {
    if (reduxTheses && reduxTheses.length > 0) {
      setLiveThesesData(reduxTheses);
    }
    if (reduxFaculty && reduxFaculty.length > 0) {
      setLiveFacultyData(reduxFaculty);
    }
    const data = getDepartmentById(currentSlug);
    setDeptInfo(data);
  }, [reduxTheses, reduxFaculty, currentSlug]);

  useEffect(() => {
    const data = getDepartmentById(currentSlug);
    setDeptInfo(data);
    setSearchQuery("");
    setSelectedThesisDept("All");
    setCurrentPage(1);
  }, [currentSlug]);

  // Entrance animation
  useEffect(() => {
    if (!pageRef.current || !deptInfo) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dept-hero-reveal",
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out", clearProps: "all" }
      );
      gsap.fromTo(
        ".dept-card-reveal",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out", delay: 0.1, clearProps: "all" }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [deptInfo]);

  // Reset page on tab change
  const handleTabChange = (tab: "theses" | "faculty" | "publications" | "patents" | "books") => {
    setActiveTab(tab);
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Filtered Theses Awarded
  const filteredTheses = useMemo(() => {
    if (!deptInfo) return [];
    return deptInfo.thesesAwarded.filter((t) => {
      if (selectedThesisDept !== "All" && t.department !== selectedThesisDept && t.rawFacultyInstitute !== selectedThesisDept) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q) || t.rawTitle.toLowerCase().includes(q);
        const matchScholar = t.scholarName.toLowerCase().includes(q) || t.regNo.toLowerCase().includes(q);
        const matchSup = t.supervisors.toLowerCase().includes(q);
        const matchDept = t.rawFacultyInstitute.toLowerCase().includes(q) || t.department.toLowerCase().includes(q);
        const matchDate = t.defenseDate.includes(q);
        return matchTitle || matchScholar || matchSup || matchDept || matchDate;
      }
      return true;
    });
  }, [deptInfo, searchQuery, selectedThesisDept]);

  // Unique departments for thesis filter dropdown
  const thesisDepartments = useMemo(() => {
    if (!deptInfo) return [];
    const set = new Set<string>();
    deptInfo.thesesAwarded.forEach((t) => {
      if (t.rawFacultyInstitute) set.add(t.rawFacultyInstitute);
    });
    return Array.from(set);
  }, [deptInfo]);

  // Filtered Faculty Supervisors
  const filteredFaculty = useMemo(() => {
    if (!deptInfo) return [];
    if (!searchQuery.trim()) return deptInfo.facultySupervisors;
    const q = searchQuery.toLowerCase();
    return deptInfo.facultySupervisors.filter(
      (r) =>
        r.supervisorName.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.institute.toLowerCase().includes(q) ||
        r.designation.toLowerCase().includes(q)
    );
  }, [deptInfo, searchQuery]);

  // Filtered Publications
  const filteredPublications = useMemo(() => {
    if (!deptInfo) return [];
    if (!searchQuery.trim()) return deptInfo.researchPublications;
    const q = searchQuery.toLowerCase();
    return deptInfo.researchPublications.filter(
      (p: any) =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.authorName && p.authorName.toLowerCase().includes(q)) ||
        (p.journalName && p.journalName.toLowerCase().includes(q)) ||
        (p.department && p.department.toLowerCase().includes(q))
    );
  }, [deptInfo, searchQuery]);

  // Filtered Patents
  const filteredPatents = useMemo(() => {
    if (!deptInfo) return [];
    if (!searchQuery.trim()) return deptInfo.patents;
    const q = searchQuery.toLowerCase();
    return deptInfo.patents.filter(
      (p: any) =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.patenterName && p.patenterName.toLowerCase().includes(q)) ||
        (p.patentNumber && p.patentNumber.toLowerCase().includes(q))
    );
  }, [deptInfo, searchQuery]);

  // Filtered Books
  const filteredBooks = useMemo(() => {
    if (!deptInfo) return [];
    if (!searchQuery.trim()) return deptInfo.books;
    const q = searchQuery.toLowerCase();
    return deptInfo.books.filter(
      (b: any) =>
        (b.paperTitle && b.paperTitle.toLowerCase().includes(q)) ||
        (b.bookOrChapterTitle && b.bookOrChapterTitle.toLowerCase().includes(q)) ||
        (b.teacherName && b.teacherName.toLowerCase().includes(q)) ||
        (b.publisherName && b.publisherName.toLowerCase().includes(q)) ||
        (b.affiliatingInstitute && b.affiliatingInstitute.toLowerCase().includes(q))
    );
  }, [deptInfo, searchQuery]);

  // Current active data list for pagination
  const activeListLength =
    activeTab === "theses"
      ? filteredTheses.length
      : activeTab === "faculty"
        ? filteredFaculty.length
        : activeTab === "publications"
          ? filteredPublications.length
          : activeTab === "patents"
            ? filteredPatents.length
            : filteredBooks.length;

  const totalPages = Math.ceil(activeListLength / itemsPerPage);
  const paginatedTheses = filteredTheses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedFaculty = filteredFaculty.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedPublications = filteredPublications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedPatents = filteredPatents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedBooks = filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (!deptInfo) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 py-20 text-center">
        <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h2 className="text-2xl font-serif font-bold text-slate-800 mb-2">Department Not Found</h2>
        <p className="text-slate-500 mb-6">The requested department could not be located in the research archive.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0A4A8F] text-white text-sm font-medium hover:bg-[#0C5CA8] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  const isAll = deptInfo.id === "all";

  return (
    <div ref={pageRef} className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* ── BREADCRUMBS & SELECTOR ───────────────────────── */}
      <div className="dept-hero-reveal flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#0A4A8F] hover:border-[#0A4A8F]/30 hover:shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link to="/" className="hover:text-[#0A4A8F] transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <span className="text-slate-600 font-medium">Departments</span>
            <ChevronRight size={12} />
            <span className="text-[#0A4A8F] font-bold">{deptInfo.code}</span>
          </div>
        </div>

        {/* Quick Institute Switcher */}
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-[#0A4A8F] hidden sm:block" />
          <select
            value={currentSlug}
            onChange={(e) => navigate(`/department/${e.target.value}`)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-xs focus:outline-none focus:border-[#0A4A8F]"
          >
            <option value="all">🌟 All Departments Combined (University-wide)</option>
            {DEPARTMENTS_LIST.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title} ({d.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── DEPARTMENT HERO BANNER ─────────────────────────── */}
      <div className="dept-hero-reveal p-6 sm:p-8 md:p-10 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#0A4A8F] via-[#FFB703] to-[#0A4A8F]" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Info Left */}
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0A4A8F] px-3 py-0.5 rounded-full bg-[#0A4A8F]/10 border border-[#0A4A8F]/20">
                {deptInfo.code} • {deptInfo.departmentCountLabel}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0F172A] leading-tight mb-4">
              {deptInfo.title}
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
              {deptInfo.description}
            </p>

            {/* Programs List */}
            {deptInfo.programs && deptInfo.programs.length > 0 && (
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Academic &amp; Research Programs ({deptInfo.programs.length})
                </span>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                  {deptInfo.programs.map((prog, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700"
                    >
                      {prog}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Image / Stats Right */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl overflow-hidden shadow-inner aspect-[16/11] bg-slate-100 border border-slate-200/80 mb-4">
              <img
                src={deptInfo.image?.startsWith('/') ? deptInfo.image : `/${deptInfo.image || 'Images/c1.webp'}`}
                alt={deptInfo.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/Images/c1.webp";
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI METRICS CARDS ──────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-8">
        {/* Theses Awarded */}
        <div className="dept-card-reveal p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white to-amber-50/40 backdrop-blur-xl border border-amber-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-900/80">
              Theses Awarded
            </span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
            {deptInfo.thesesAwarded.length}
          </div>
          <span className="text-[10px] sm:text-[11px] text-amber-700/80 mt-1 font-medium">Session 2025-26</span>
        </div>

        {/* Ph.D. Seats */}
        <div className="dept-card-reveal p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Ph.D.
            </span>
            <GraduationCap className="w-4 h-4 text-[#0A4A8F]" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#0A4A8F]">
            {deptInfo.totalPhDSeats}
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-400 mt-1">Ph.D. Matrix Seats</span>
        </div>

        {/* Faculty Supervisors */}
        <div className="dept-card-reveal p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Supervisors
            </span>
            <Users className="w-4 h-4 text-[#0A4A8F]" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
            {deptInfo.facultySupervisors.length}
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-400 mt-1">Active Faculty</span>
        </div>

        {/* Vacant Seats */}
        <div className="dept-card-reveal p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Vacant Seats
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {deptInfo.totalVacantSeats}
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-400 mt-1">Available Seats</span>
        </div>

        {/* Research Papers */}
        <div className="dept-card-reveal p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Publications
            </span>
            <FileText className="w-4 h-4 text-[#FFB703]" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#0A4A8F]">
            {deptInfo.researchPublications.length}
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-400 mt-1">Indexed Papers</span>
        </div>
      </div>

      {/* ── TABS NAVIGATION & SEARCH BAR ────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 border-b border-slate-200/90 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => handleTabChange("theses")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-2 ${activeTab === "theses"
                ? "bg-[#0A4A8F] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
          >
            <Award size={14} />
            <span>Theses Awarded ({deptInfo.thesesAwarded.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("faculty")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-2 ${activeTab === "faculty"
                ? "bg-[#0A4A8F] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
          >
            <Users size={14} />
            <span>Faculty &amp; Seats ({deptInfo.facultySupervisors.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("publications")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-2 ${activeTab === "publications"
                ? "bg-[#0A4A8F] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
          >
            <FileText size={14} />
            <span>Publications ({deptInfo.researchPublications.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("patents")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-2 ${activeTab === "patents"
                ? "bg-[#0A4A8F] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
          >
            <Lightbulb size={14} />
            <span>Patents ({deptInfo.patents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("books")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-2 ${activeTab === "books"
                ? "bg-[#0A4A8F] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
          >
            <BookOpen size={14} />
            <span>Books ({deptInfo.books.length})</span>
          </button>
        </div>

        {/* Search Field */}
        <div className="relative min-w-[240px] max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={`Search in ${activeTab}...`}
            className="w-full text-xs py-2 pl-9 pr-8 rounded-xl bg-white border border-slate-200 shadow-xs focus:outline-none focus:border-[#0A4A8F]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── TAB 0: THESES AWARDED (Exact from Thesis Awarded_List (Academic Session 2025-26).docx) ── */}
      {activeTab === "theses" && (
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-800">
                  Academic Session 2025-26
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F172A]">
                List of Ph.D. Degrees Awarded ({filteredTheses.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Source: Official university records from <em>Thesis Awarded_List (Academic Session 2025-26).docx</em>
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Department Filter (if multiple) */}
              {thesisDepartments.length > 1 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <Filter size={13} className="text-[#0A4A8F]" />
                  <select
                    value={selectedThesisDept}
                    onChange={(e) => {
                      setSelectedThesisDept(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="text-xs font-medium px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-xs focus:outline-none focus:border-[#0A4A8F] max-w-[220px]"
                  >
                    <option value="All">All Department Streams ({deptInfo.thesesAwarded.length})</option>
                    {thesisDepartments.map((deptName) => (
                      <option key={deptName} value={deptName}>
                        {deptName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* View Toggle */}
              <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setThesisViewMode("cards")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${thesisViewMode === "cards"
                      ? "bg-white text-[#0A4A8F] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  <LayoutGrid size={13} />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setThesisViewMode("table")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${thesisViewMode === "table"
                      ? "bg-white text-[#0A4A8F] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  <TableIcon size={13} />
                  <span>Table</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cards View */}
          {thesisViewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTheses.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-white/60 rounded-3xl border border-slate-200 text-slate-500">
                  <Award className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No awarded theses found matching your search.</p>
                  <p className="text-xs text-slate-400 mt-1">Try changing your search term or department filter.</p>
                </div>
              ) : (
                paginatedTheses.map((thesis) => (
                  <div
                    key={thesis.id}
                    className="p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#0A4A8F]/30 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0A4A8F] via-[#FFB703] to-[#0A4A8F] opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div>
                      {/* Top Header Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0A4A8F] px-2.5 py-0.5 rounded-full bg-[#0A4A8F]/8 border border-[#0A4A8F]/15">
                          Sr. #{thesis.srNo}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-amber-700 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80">
                          {thesis.academicSession}
                        </span>
                      </div>

                      {/* Thesis Title */}
                      <h3 className="font-serif text-base font-bold text-[#0F172A] leading-snug mb-3 group-hover:text-[#0A4A8F] transition-colors">
                        "{thesis.title}"
                      </h3>

                      {/* Department / Faculty info */}
                      <div className="mb-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                        <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold mb-0.5">
                          Faculty / Institute / Department
                        </span>
                        <span className="font-semibold text-slate-800 leading-relaxed block">
                          {thesis.rawFacultyInstitute}
                        </span>
                      </div>

                      {/* Scholar Info */}
                      <div className="mb-3 flex items-start gap-2 text-xs">
                        <GraduationCap size={15} className="text-[#0A4A8F] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                            Ph.D. Scholar
                          </span>
                          <span className="font-bold text-slate-900 block">
                            {thesis.scholarName}
                          </span>
                          {thesis.regNo && (
                            <span className="font-mono text-[11px] text-[#0A4A8F] font-semibold">
                              Reg. No: {thesis.regNo}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Supervisor Info */}
                      <div className="mb-2 flex items-start gap-2 text-xs">
                        <Users size={15} className="text-[#FFB703] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                            Research Supervisor(s)
                          </span>
                          <span className="font-medium text-slate-800 whitespace-pre-line leading-relaxed">
                            {thesis.supervisors}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Date & Status */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Calendar size={13} className="text-[#0A4A8F]" />
                        <span>Defense: <strong className="text-slate-900">{thesis.defenseDate}</strong></span>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        <CheckCircle2 size={10} />
                        <span>Awarded</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse min-w-[950px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200/90 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600">
                      <th className="py-3.5 px-4">Sr. No</th>
                      <th className="py-3.5 px-4">Name of Faculty / Institute / Department</th>
                      <th className="py-3.5 px-4">PhD Scholar &amp; Reg. No.</th>
                      <th className="py-3.5 px-4">Supervisor(s)</th>
                      <th className="py-3.5 px-4 min-w-[280px]">Title of the Thesis</th>
                      <th className="py-3.5 px-4 text-center">Open House Defense Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTheses.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-slate-500">
                          No thesis records found matching your search.
                        </td>
                      </tr>
                    ) : (
                      paginatedTheses.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-xs font-bold text-[#0A4A8F]">
                            {t.srNo}
                          </td>
                          <td className="py-3.5 px-4 text-xs font-semibold text-slate-800 whitespace-pre-line leading-relaxed">
                            {t.rawFacultyInstitute}
                          </td>
                          <td className="py-3.5 px-4 text-xs">
                            <div className="font-bold text-slate-900">{t.scholarName}</div>
                            {t.regNo && (
                              <div className="font-mono text-[11px] text-[#0A4A8F] font-semibold">
                                ({t.regNo})
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                            {t.supervisors}
                          </td>
                          <td className="py-3.5 px-4 text-xs font-medium text-slate-900 leading-relaxed font-serif">
                            "{t.title}"
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono text-xs font-bold text-slate-700 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80 inline-block">
                              {t.defenseDate}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-900 text-white font-mono font-bold text-xs uppercase tracking-wider border-t-2 border-[#FFB703]">
                      <td className="py-3.5 px-4">Σ</td>
                      <td className="py-3.5 px-4" colSpan={2}>
                        {deptInfo.title} Total Awarded
                      </td>
                      <td className="py-3.5 px-4" colSpan={2}>
                        {filteredTheses.length} Ph.D. Theses Awarded (Session 2025-26)
                      </td>
                      <td className="py-3.5 px-4 text-center text-[#FFB703]">
                        Official Records
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Theses Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredTheses.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      {/* ── TAB 1: FACULTY & PH.D. SEATS (Exact Vacant Seat Data) ── */}
      {activeTab === "faculty" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F172A]">
              Faculty Research Supervisors &amp; Ph.D. Vacancy Matrix
            </h2>
            <span className="font-mono text-xs text-slate-400">
              {filteredFaculty.length} {filteredFaculty.length === 1 ? "record" : "records"}
            </span>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/90 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600">
                    <th className="py-3.5 px-4">#</th>
                    {isAll && <th className="py-3.5 px-4">Institute</th>}
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-3 text-center">Total Ph.D.</th>
                    <th className="py-3.5 px-4">Supervisor Name</th>
                    <th className="py-3.5 px-4">Designation</th>
                    <th className="py-3.5 px-3 text-center">Seat Limit</th>
                    <th className="py-3.5 px-3 text-center">Allotted</th>
                    <th className="py-3.5 px-4 text-center">Vacant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFaculty.length === 0 ? (
                    <tr>
                      <td colSpan={isAll ? 9 : 8} className="py-10 text-center text-slate-500">
                        No supervisor records found matching your search.
                      </td>
                    </tr>
                  ) : (
                    paginatedFaculty.map((row, idx) => (
                      <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs text-slate-400">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </td>
                        {isAll && (
                          <td className="py-3 px-4 font-bold text-[#0A4A8F] text-xs">
                            {row.institute}
                          </td>
                        )}
                        <td className="py-3 px-4 font-medium text-slate-800 whitespace-pre-line text-xs">
                          {row.department}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-[#0A4A8F]">
                          {row.totalPhD !== null ? row.totalPhD : "—"}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {row.supervisorName}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/70 font-medium">
                            {row.designation}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                          {row.designationSeatLimit}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-[#0A4A8F]">
                          {row.allottedSeat}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${row.noOfVacant > 0
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
                <tfoot>
                  <tr className="bg-slate-900 text-white font-mono font-bold text-xs uppercase tracking-wider border-t-2 border-[#FFB703]">
                    <td className="py-3.5 px-4">Σ</td>
                    {isAll && <td className="py-3.5 px-4">University</td>}
                    <td className="py-3.5 px-4">{deptInfo.title} Total</td>
                    <td className="py-3.5 px-3 text-center text-[#FFB703]">
                      {deptInfo.totalPhDSeats}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {deptInfo.facultySupervisors.length} Faculty
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">—</td>
                    <td className="py-3.5 px-3 text-center">
                      {deptInfo.totalDesignationLimit}
                    </td>
                    <td className="py-3.5 px-3 text-center text-[#FFB703]">
                      {deptInfo.totalAllottedSeats}
                    </td>
                    <td className="py-3.5 px-4 text-center text-emerald-400">
                      {deptInfo.totalVacantSeats}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredFaculty.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: RESEARCH PUBLICATIONS ───────────────────── */}
      {activeTab === "publications" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F172A]">
              Indexed Research Publications ({filteredPublications.length})
            </h2>
            <span className="font-mono text-xs text-slate-400">
              {isAll ? "All University Publications" : `Department: ${deptInfo.code}`}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPublications.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white/60 rounded-3xl border border-slate-200 text-slate-500">
                <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No data available</p>
                <p className="text-xs text-slate-400 mt-1">No publications are available for this department.</p>
              </div>
            ) : paginatedPublications.map((paper: any, idx: number) => (
              <div
                key={paper.srNo || idx}
                className="p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0A4A8F] px-2.5 py-0.5 rounded-full bg-[#0A4A8F]/8 border border-[#0A4A8F]/15">
                      {paper.department || deptInfo.code}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 font-semibold">
                      SCOPUS / WOS
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-[#0F172A] leading-snug mb-2 line-clamp-3">
                    {paper.title || "Untitled publication"}
                  </h3>

                  <div className="text-xs text-slate-600 mb-2 flex items-center gap-1.5 font-mono">
                    <Users size={13} className="text-[#FFB703] shrink-0" />
                    <span className="line-clamp-1">{paper.authorName || "Faculty Author"}</span>
                  </div>

                  {paper.journalName && (
                    <div className="text-xs text-slate-500 italic mb-3 line-clamp-2">
                      {paper.journalName}
                    </div>
                  )}

                  {paper.issnNumber && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-mono text-slate-600 mb-3 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 uppercase">ISSN</span>
                      <span className="font-bold text-[#0A4A8F]">{paper.issnNumber}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-500">
                    <Calendar size={12} className="text-[#FFB703]" />
                    {paper.yearOfPublication || "Year N/A"}
                  </span>
                  {paper.ugcRecognitionLink && (
                    <a
                      href={paper.ugcRecognitionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono font-medium text-[#0A4A8F] hover:underline"
                    >
                      <span>Link</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredPublications.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      {/* ── TAB 3: PATENTS ─────────────────────────────────── */}
      {activeTab === "patents" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F172A]">
              Patents &amp; Intellectual Property ({filteredPatents.length})
            </h2>
            <span className="font-mono text-xs text-slate-400">
              {isAll ? "All University Patents" : `Department: ${deptInfo.code}`}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatents.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white/60 rounded-3xl border border-slate-200 text-slate-500">
                <Lightbulb className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No data available</p>
                <p className="text-xs text-slate-400 mt-1">No patents are available for this department.</p>
              </div>
            ) : paginatedPatents.map((pat: any, idx: number) => (
              <div
                key={pat.srNo || idx}
                className="p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#FFB703] px-2.5 py-0.5 rounded-full bg-[#FFB703]/10 border border-[#FFB703]/20">
                      PATENT
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 font-semibold">
                      {pat.yearOfAward || "Awarded"}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-[#0F172A] leading-snug mb-2 line-clamp-3">
                    {pat.title || "Patent Title"}
                  </h3>

                  <div className="text-xs text-slate-600 mb-2 flex items-center gap-1.5 font-mono">
                    <Users size={13} className="text-[#0A4A8F] shrink-0" />
                    <span className="line-clamp-2">{pat.patenterName}</span>
                  </div>

                  {pat.patentNumber && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-mono text-slate-700 whitespace-pre-line leading-relaxed mb-3">
                      {pat.patentNumber}
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>Patent Record #{pat.srNo || idx + 1}</span>
                  <span className="text-[#0A4A8F] font-bold">Granted / Published</span>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredPatents.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      {/* ── TAB 4: BOOKS & CHAPTERS ────────────────────────── */}
      {activeTab === "books" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F172A]">
              Books &amp; Chapters ({filteredBooks.length})
            </h2>
            <span className="font-mono text-xs text-slate-400">
              {isAll ? "All University Books" : `Department: ${deptInfo.code}`}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white/60 rounded-3xl border border-slate-200 text-slate-500">
                <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No data available</p>
                <p className="text-xs text-slate-400 mt-1">No books or chapters are available for this department.</p>
              </div>
            ) : paginatedBooks.map((b: any, idx: number) => (
              <div
                key={b.slNo || idx}
                className="p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0A4A8F] px-2.5 py-0.5 rounded-full bg-[#0A4A8F]/8 border border-[#0A4A8F]/15">
                      {b.affiliatingInstitute || deptInfo.code}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 font-semibold">
                      {b.yearOfPublication || "Published"}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-[#0F172A] leading-snug mb-2 line-clamp-3">
                    {b.paperTitle || b.bookOrChapterTitle || "Book Title"}
                  </h3>

                  <div className="text-xs text-slate-600 mb-2 flex items-center gap-1.5 font-mono">
                    <Users size={13} className="text-[#FFB703] shrink-0" />
                    <span className="line-clamp-1">{b.teacherName}</span>
                  </div>

                  {b.publisherName && (
                    <div className="text-xs text-slate-500 italic mb-2">
                      Publisher: {b.publisherName}
                    </div>
                  )}

                  {b.isbnIssn && (
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-mono text-slate-600 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 uppercase">ISBN/ISSN</span>
                      <span className="font-bold text-[#0A4A8F]">{b.isbnIssn}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>Entry #{b.slNo || idx + 1}</span>
                  <span className="text-slate-600 font-semibold">{b.scope || "Academic"}</span>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredBooks.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
}
