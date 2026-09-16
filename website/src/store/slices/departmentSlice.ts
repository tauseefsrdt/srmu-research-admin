import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/apiClient';
import { ThesisAwarded, THESIS_AWARDED_DATA } from '../../data/thesisAwardedData';
import { VacantSeatRow, VACANT_SEAT_DATA } from '../../data/vacantSeatData';
import { DEPARTMENTS_LIST, DepartmentInfo } from '../../data/departmentData';

interface DepartmentState {
  theses: ThesisAwarded[];
  faculty: VacantSeatRow[];
  loading: boolean;
  error: string | null;
}

const initialState: DepartmentState = {
  theses: THESIS_AWARDED_DATA,
  faculty: VACANT_SEAT_DATA,
  loading: false,
  error: null,
};

export const fetchDepartmentData = createAsyncThunk(
  'department/fetchDepartmentData',
  async (sessionCode: string = '2025-26', { rejectWithValue }) => {
    try {
      const [thesesRes, facultyRes] = await Promise.allSettled([
        api.get('/research-items/by-category/THESIS_AWARDED', { params: { sessionCode } }),
        api.get('/faculty-seats/all', { params: { sessionCode } }),
      ]);

      let fetchedTheses: ThesisAwarded[] = [];
      let fetchedFaculty: VacantSeatRow[] = [];

      if (thesesRes.status === 'fulfilled' && thesesRes.value?.data?.data?.length > 0) {
        fetchedTheses = thesesRes.value.data.data.map((item: any) => ({
          id: item.id,
          srNo: item.srNo || item.id,
          rawFacultyInstitute: item.rawFacultyInstitute || item.instituteTitle || '',
          institute: item.instituteTitle || '',
          department: item.department || '',
          scholarName: item.primaryAuthor || '',
          regNo: item.identifier || '',
          scholarWithReg: `${item.primaryAuthor || ''} (${item.identifier || ''})`,
          supervisors: item.coAuthors || '',
          title: item.title,
          rawTitle: item.title,
          defenseDate: item.eventOrAwardDate || '',
          academicSession: item.academicSessionCode || '2025-26',
        }));
      }

      if (facultyRes.status === 'fulfilled' && facultyRes.value?.data?.data?.length > 0) {
        fetchedFaculty = facultyRes.value.data.data.map((f: any) => ({
          id: f.id,
          rowIndex: f.rowIndex || f.id,
          institute: f.instituteTitle || f.instituteName || '',
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

      return { theses: fetchedTheses, faculty: fetchedFaculty };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch department data');
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
        if (action.payload.theses && action.payload.theses.length > 0) {
          state.theses = action.payload.theses;
        }
        if (action.payload.faculty && action.payload.faculty.length > 0) {
          state.faculty = action.payload.faculty;
        }
      })
      .addCase(fetchDepartmentData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default departmentSlice.reducer;
