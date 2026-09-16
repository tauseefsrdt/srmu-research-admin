import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Building2,
  Calendar,
  Layers,
  Users,
  ExternalLink,
  ChevronRight,
  LogOut
} from 'lucide-react';

export type AdminTab = 'dashboard' | 'research' | 'theses' | 'faculty' | 'institutes' | 'sessions' | 'categories';

interface SidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  selectedSession: string;
  setSelectedSession: (session: string) => void;
  sessions: { sessionCode: string; name: string }[];
  currentUser: { name?: string; email?: string; designation?: string } | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedSession,
  setSelectedSession,
  sessions,
  currentUser,
  onLogout,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'research', label: 'Research Data (CRUD)', icon: Layers },
    { id: 'theses', label: 'Theses Awarded 25-26', icon: GraduationCap },
    { id: 'faculty', label: 'Faculty & Seat Matrix', icon: Users },
    { id: 'institutes', label: 'Institutes Master', icon: Building2 },
    { id: 'sessions', label: 'Academic Sessions', icon: Calendar },
    { id: 'categories', label: 'Categories Master', icon: Layers },
  ];

  return (
    <aside className="w-64 bg-white/95 backdrop-blur-xl border-r border-[#0A4A8F]/15 flex flex-col justify-between shrink-0 select-none shadow-lg z-20">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0A4A8F] to-[#0C5CA8] flex items-center justify-center text-white shadow-md shadow-[#0A4A8F]/20">
            <GraduationCap className="w-6 h-6 text-[#FFB703]" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-[#0F172A] tracking-tight flex items-center gap-1.5 font-serif">
              SRMU Research
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#0A4A8F]/10 text-[#0A4A8F] border border-[#0A4A8F]/20">
                ADMIN
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-mono">Dynamic Data Hub</p>
          </div>
        </div>

        {/* Global Academic Session Selector */}
        <div className="p-4 mx-3 my-4 rounded-2xl bg-gradient-to-br from-[#FFF8E7] to-[#FFF3D6] border border-[#FFB703]/30 shadow-xs">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900/80 block mb-1.5">
            Active Academic Session
          </label>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              aria-label="Active Academic Session"
              className="w-full bg-white border border-amber-300/80 rounded-xl text-xs font-semibold text-slate-800 py-1.5 px-2.5 focus:outline-none focus:border-[#0A4A8F] cursor-pointer shadow-xs"
            >
              <option value="ALL">All Sessions Combined</option>
              {sessions.map((s) => (
                <option key={s.sessionCode} value={s.sessionCode}>
                  {s.sessionCode} ({s.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0A4A8F] text-white font-semibold shadow-md shadow-[#0A4A8F]/20'
                    : 'text-slate-600 hover:text-[#0A4A8F] hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFB703]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer link to Public Portal & Logout */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-all border border-slate-200 group shadow-xs"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Public Research Portal
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0A4A8F] transition-colors" />
        </a>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-all cursor-pointer shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
