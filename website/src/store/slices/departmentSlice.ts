import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/apiClient';
import { ThesisAwarded } from '../../data/thesisAwardedData';
import { VacantSeatRow } from '../../data/vacantSeatData';

interface FetchDepartmentParams {
  sessionCode?: string;
  search?: string;
}

interface DepartmentState {
  theses: ThesisAwarded[];
  faculty: VacantSeatRow[];
  loading: boolean;
  error: string | null;
}

const initialState: DepartmentState = {
  theses: [],
  faculty: [],
  loading: false,
  error: null,
};

export const fetchDepartmentData = createAsyncThunk(
  'department/fetchDepartmentData',
  async (params: FetchDepartmentParams | string = {}, { rejectWithValue }) => {
    try {
      const options: FetchDepartmentParams =
        typeof params === 'string' ? { sessionCode: params } : params;

      const sessionCode = options.sessionCode || '2025-26';
      const search = options.search;

      const [thesesRes, facultyRes] = await Promise.allSettled([
        api.get('/research-items', {
          params: {
            categoryCode: 'THESIS_AWARDED',
            sessionCode,
            search: search || undefined,
            size: 500,
          },
        }),
        api.get('/faculty-seats', {
          params: {
            sessionCode,
            search: search || undefined,
            size: 500,
          },
        }),
      ]);

      let fetchedTheses: ThesisAwarded[] = [];
      let fetchedFaculty: VacantSeatRow[] = [];

      if (thesesRes.status === 'fulfilled') {
        const list = thesesRes.value?.data?.data?.content || thesesRes.value?.data?.data || [];
        if (Array.isArray(list)) {
          fetchedTheses = list.map((item: any) => ({
            id: item.id,
            srNo: item.srNo || item.id,
            rawFacultyInstitute: item.rawFacultyInstitute || item.institute?.title || '',
            institute: item.institute?.title || item.rawFacultyInstitute || '',
            department: item.department || '',
            scholarName: item.primaryAuthor || '',
            regNo: item.identifier || '',
            scholarWithReg: `${item.primaryAuthor || ''} (${item.identifier || ''})`,
            supervisors: item.coAuthors || '',
            title: item.title,
            rawTitle: item.title,
            defenseDate: item.eventOrAwardDate || '',
            academicSession: item.academicSession?.sessionCode || sessionCode,
          }));
        }
      }

      if (facultyRes.status === 'fulfilled') {
        const list = facultyRes.value?.data?.data?.content || facultyRes.value?.data?.data || [];
        if (Array.isArray(list)) {
          fetchedFaculty = list.map((f: any) => ({
            id: f.id,
            rowIndex: f.rowIndex || f.id,
            institute: f.institute?.title || f.instituteName || '',
            rawInstitute: f.instituteName || '',
            department: f.department || '',
            rawDepartment: f.rawDepartment || null,
            totalPhD: f.totalPhD,
            rawTotalPhD: f.totalPhD,
            supervisorName: f.supervisorName || '',
            rawSupervisorName: f.supervisorName || null,
            designation: f.designation || '',
            rawDesignation: f.designation || null,
            designationSeatLimit: f.designationSeatLimit || 0,
            allottedSeat: f.allottedSeat || 0,
            noOfVacant: f.noOfVacant || 0,
          }));
        }
      }

      return { theses: fetchedTheses, faculty: fetchedFaculty };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch department data');
    }
  }
);

const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartmentData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentData.fulfilled, (state, action) => {
        state.loading = false;
        state.theses = action.payload.theses || [];
        state.faculty = action.payload.faculty || [];
      })
      .addCase(fetchDepartmentData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default departmentSlice.reducer;
