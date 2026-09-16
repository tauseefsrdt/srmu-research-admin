import { RootState } from '../index';

// Auth Selectors
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectAuthChecked = (state: RootState) => state.auth.authChecked;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

// Institute Selectors
export const selectInstitutes = (state: RootState) => state.institutes.items;
export const selectInstitutesLoading = (state: RootState) => state.institutes.loading;
export const selectInstitutesError = (state: RootState) => state.institutes.error;

// Master Data Selectors
export const selectSessions = (state: RootState) => state.master.sessions;
export const selectCategories = (state: RootState) => state.master.categories;
export const selectActiveSessionCode = (state: RootState) => state.master.activeSessionCode;
export const selectMasterLoading = (state: RootState) => state.master.loading;
export const selectMasterError = (state: RootState) => state.master.error;

// Research Selectors
export const selectResearchItems = (state: RootState) => state.research.items;
export const selectResearchTotalElements = (state: RootState) => state.research.totalElements;
export const selectResearchTotalPages = (state: RootState) => state.research.totalPages;
export const selectResearchPage = (state: RootState) => state.research.page;
export const selectResearchLoading = (state: RootState) => state.research.loading;
export const selectResearchStats = (state: RootState) => state.research.stats;
export const selectResearchStatsLoading = (state: RootState) => state.research.statsLoading;
export const selectResearchError = (state: RootState) => state.research.error;
export const selectResearchActionSuccess = (state: RootState) => state.research.actionSuccess;

// Faculty Selectors
export const selectFacultyItems = (state: RootState) => state.faculty.items;
export const selectFacultyTotalElements = (state: RootState) => state.faculty.totalElements;
export const selectFacultyTotalPages = (state: RootState) => state.faculty.totalPages;
export const selectFacultyPage = (state: RootState) => state.faculty.page;
export const selectFacultyLoading = (state: RootState) => state.faculty.loading;
export const selectFacultyError = (state: RootState) => state.faculty.error;
export const selectFacultyActionSuccess = (state: RootState) => state.faculty.actionSuccess;
