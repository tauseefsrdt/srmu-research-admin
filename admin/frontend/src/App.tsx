import React, { useState, useEffect } from 'react';
import { Sidebar, AdminTab } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { ResearchManager } from './components/ResearchManager';
import { FacultySeatManager } from './components/FacultySeatManager';
import { MasterDataManager } from './components/MasterDataManager';
import { AuthView } from './components/AuthView';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { checkCurrentUser } from './store/thunks/authThunks';
import { fetchInstitutes } from './store/thunks/instituteThunks';
import { fetchSessions, fetchCategories } from './store/thunks/masterThunks';
import { fetchAdminStats } from './store/thunks/researchThunks';
import { logout } from './store/slices/authSlice';
import { setActiveSessionCode } from './store/slices/masterSlice';
import {
  selectCurrentUser,
  selectAuthChecked,
  selectInstitutes,
  selectInstitutesLoading,
  selectSessions,
  selectCategories,
  selectActiveSessionCode,
  selectMasterLoading,
  selectResearchStats,
  selectResearchStatsLoading,
} from './store/selectors';
import { RefreshCw, ShieldCheck, LogOut, Menu } from 'lucide-react';

export function App() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const authChecked = useAppSelector(selectAuthChecked);
  const institutes = useAppSelector(selectInstitutes);
  const institutesLoading = useAppSelector(selectInstitutesLoading);
  const sessions = useAppSelector(selectSessions);
  const categories = useAppSelector(selectCategories);
  const selectedSession = useAppSelector(selectActiveSessionCode);
  const masterLoading = useAppSelector(selectMasterLoading);
  const stats = useAppSelector(selectResearchStats);
  const statsLoading = useAppSelector(selectResearchStatsLoading);

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const loading = institutesLoading || masterLoading || statsLoading;

  useEffect(() => {
    dispatch(checkCurrentUser());
  }, [dispatch]);

  const fetchMasterData = () => {
    if (!currentUser) return;
    dispatch(fetchInstitutes());
    dispatch(fetchSessions());
    dispatch(fetchCategories());
    dispatch(fetchAdminStats(selectedSession === 'ALL' ? undefined : selectedSession));
  };

  useEffect(() => {
    if (currentUser) {
      fetchMasterData();
    }
  }, [currentUser, selectedSession]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSessionChange = (sessionCode: string) => {
    dispatch(setActiveSessionCode(sessionCode));
  };

  if (!authChecked) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <AuthView />;
  }

  return (
    <div className="flex h-screen bg-[#F5F7FA] text-[#1F2937] overflow-hidden font-sans relative">
      {/* Ambient background particles & glow */}
      <div className="admin-ambient-bg">
        <div className="admin-grid-overlay" />
        <div className="admin-orb-primary" />
        <div className="admin-orb-gold" />
      </div>

      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedSession={selectedSession}
        setSelectedSession={handleSessionChange}
        sessions={sessions}
        currentUser={currentUser}
        onLogout={handleLogout}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Top Navbar */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-[#0A4A8F]/15 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#0A4A8F] transition-colors cursor-pointer border border-slate-200"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="text-[#0A4A8F] font-bold hidden sm:inline">SRMU Research Console</span>
              <span className="hidden sm:inline">/</span>
              <span className="text-slate-800 font-semibold uppercase tracking-wider">{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Refresh */}
            <button
              onClick={fetchMasterData}
              title="Refresh Dashboard Data"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#0A4A8F] transition-colors cursor-pointer border border-slate-200"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#0A4A8F]' : ''}`} />
            </button>

            {/* Admin Profile Pill */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0A4A8F] to-[#0C5CA8] border border-[#0A4A8F]/30 flex items-center justify-center font-bold text-xs text-white shadow-xs">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  {currentUser.name || 'Administrator'}
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0A4A8F]" />
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {currentUser.email || 'admin@srmu.ac.in'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              stats={stats}
              institutes={institutes}
              selectedSession={selectedSession}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'research' && (
            <ResearchManager
              institutes={institutes}
              sessions={sessions}
              categories={categories}
              activeSessionCode={selectedSession}
            />
          )}

          {activeTab === 'publications' && (
            <ResearchManager
              institutes={institutes}
              sessions={sessions}
              categories={categories}
              activeSessionCode={selectedSession}
              categoryFilterOverride="PUBLICATION"
            />
          )}

          {activeTab === 'patents' && (
            <ResearchManager
              institutes={institutes}
              sessions={sessions}
              categories={categories}
              activeSessionCode={selectedSession}
              categoryFilterOverride="PATENT"
            />
          )}

          {activeTab === 'books' && (
            <ResearchManager
              institutes={institutes}
              sessions={sessions}
              categories={categories}
              activeSessionCode={selectedSession}
              categoryFilterOverride="BOOK"
            />
          )}

          {activeTab === 'theses' && (
            <ResearchManager
              institutes={institutes}
              sessions={sessions}
              categories={categories}
              activeSessionCode={selectedSession}
              categoryFilterOverride="THESIS_AWARDED"
            />
          )}

          {activeTab === 'faculty' && (
            <FacultySeatManager
              institutes={institutes}
              sessions={sessions}
              activeSessionCode={selectedSession}
            />
          )}

          {activeTab === 'institutes' && (
            <MasterDataManager
              type="institutes"
              institutes={institutes}
              sessions={sessions}
              categories={categories}
              onRefresh={fetchMasterData}
            />
          )}

          {activeTab === 'sessions' && (
            <MasterDataManager
              type="sessions"
              institutes={institutes}
              sessions={sessions}
              categories={categories}
              onRefresh={fetchMasterData}
            />
          )}

          {activeTab === 'categories' && (
            <MasterDataManager
              type="categories"
              institutes={institutes}
              sessions={sessions}
              categories={categories}
              onRefresh={fetchMasterData}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
