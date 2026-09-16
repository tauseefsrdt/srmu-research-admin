import React from 'react';
import {
  GraduationCap,
  FileText,
  Lightbulb,
  BookOpen,
  Users,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Stats, Institute } from '../types';

interface DashboardOverviewProps {
  stats: Stats | null;
  institutes: Institute[];
  selectedSession: string;
  onNavigateToTab: (tab: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  institutes,
  selectedSession,
  onNavigateToTab,
}) => {
  if (!stats) {
    return (
      <div className="p-8 text-center text-slate-500">
        <div className="w-8 h-8 border-2 border-[#0A4A8F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading research dashboard metrics...</p>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Ph.D. Theses Awarded',
      value: stats.totalThesesAwarded,
      sub: `Session ${selectedSession === 'ALL' ? 'All Years' : selectedSession}`,
      icon: Award,
      bgGradient: 'from-[#FFF8E7] to-[#FFF3D6]',
      border: 'border-amber-200',
      iconColor: 'text-amber-600',
      tab: 'theses',
    },
    {
      title: 'Indexed Publications',
      value: stats.totalPublications,
      sub: 'WoS & SCOPUS Papers',
      icon: FileText,
      bgGradient: 'from-blue-50/60 to-white',
      border: 'border-blue-200/80',
      iconColor: 'text-[#0A4A8F]',
      tab: 'research',
    },
    {
      title: 'Patents & Designs',
      value: stats.totalPatents,
      sub: 'Intellectual Property',
      icon: Lightbulb,
      bgGradient: 'from-amber-50/40 to-white',
      border: 'border-amber-200/80',
      iconColor: 'text-[#FFB703]',
      tab: 'research',
    },
    {
      title: 'Books & Chapters',
      value: stats.totalBooks,
      sub: 'Published Works',
      icon: BookOpen,
      bgGradient: 'from-blue-50/40 to-white',
      border: 'border-blue-200/80',
      iconColor: 'text-[#0A4A8F]',
      tab: 'research',
    },
    {
      title: 'Faculty Supervisors',
      value: stats.totalSupervisors,
      sub: 'Active Ph.D. Guides',
      icon: Users,
      bgGradient: 'from-slate-50 to-white',
      border: 'border-slate-200',
      iconColor: 'text-[#0A4A8F]',
      tab: 'faculty',
    },
    {
      title: 'Vacant Ph.D. Seats',
      value: stats.totalVacantSeats,
      sub: `Out of ${stats.totalPhDSeats} total seats`,
      icon: CheckCircle2,
      bgGradient: 'from-emerald-50/60 to-white',
      border: 'border-emerald-200/80',
      iconColor: 'text-emerald-600',
      tab: 'faculty',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 p-6 sm:p-8 md:p-10 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#0A4A8F] via-[#FFB703] to-[#0A4A8F]" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A4A8F]/10 border border-[#0A4A8F]/20 text-[#0A4A8F] text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FFB703]" />
            <span>Academic Session {selectedSession === 'ALL' ? '2025–26 & Beyond' : selectedSession}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-[#0F172A] tracking-tight mb-3">
            Research &amp; Consultancy <span className="text-[#0A4A8F]">Data Hub</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Manage university-wide Ph.D. theses awarded, indexed Scopus/WoS publications, patents, book chapters, and faculty vacant seat matrices dynamically.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateToTab(kpi.tab)}
              className={`p-6 rounded-3xl bg-gradient-to-br ${kpi.bgGradient} backdrop-blur-xl border ${kpi.border} shadow-md hover:shadow-xl hover:border-[#0A4A8F]/40 transition-all duration-300 cursor-pointer group flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-600">{kpi.title}</span>
                <div className={`p-2.5 rounded-2xl bg-white shadow-xs border border-slate-100 ${kpi.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#0A4A8F] tracking-tight group-hover:text-[#0C5CA8] transition-colors">
                  {kpi.value.toLocaleString()}
                </div>
                <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
                  <span>{kpi.sub}</span>
                  <ArrowRight size={13} className="text-[#0A4A8F] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* University Institutes Overview */}
      <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#0F172A] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#0A4A8F]" />
              Academic Institutes &amp; Centers ({institutes.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Configured academic institutes across the university</p>
          </div>
          <button
            onClick={() => onNavigateToTab('institutes')}
            className="text-xs font-bold text-[#0A4A8F] hover:text-[#0C5CA8] inline-flex items-center gap-1 cursor-pointer px-4 py-2 rounded-full bg-[#0A4A8F]/10 border border-[#0A4A8F]/20 hover:bg-[#0A4A8F]/15 transition-all"
          >
            <span>Manage Institutes</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {institutes.map((inst) => (
            <div
              key={inst.id}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 hover:border-[#0A4A8F]/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0A4A8F]/10 text-[#0A4A8F] border border-[#0A4A8F]/20">
                  {inst.code}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">{inst.departmentCountLabel}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#0A4A8F] transition-colors" title={inst.title}>
                {inst.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {inst.programs?.length || 0} academic programs
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
