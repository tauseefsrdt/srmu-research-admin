import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/apiClient';
import { Book } from '../../types';

interface FetchBooksParams {
  sessionCode?: string;
  search?: string;
  year?: string;
  page?: number;
  size?: number;
}

interface BooksState {
  items: Book[];
  totalElements: number;
  loading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  items: [],
  totalElements: 0,
  loading: false,
  error: null,
};

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (params: FetchBooksParams | string = {}, { rejectWithValue }) => {
    try {
      const options: FetchBooksParams =
        typeof params === 'string' ? { sessionCode: params } : params;

      const hasAdvancedParams = options.search || options.year || (options.page !== undefined);

      let res;
      if (hasAdvancedParams) {
        res = await api.get('/research-items', {
          params: {
            categoryCode: 'BOOK',
            sessionCode: options.sessionCode || '2025-26',
            search: options.search || undefined,
            year: options.year || undefined,
            page: options.page ?? 0,
            size: options.size ?? 500,
          },
        });
      } else {
        res = await api.get('/research-items/by-category/BOOK', {
          params: { sessionCode: options.sessionCode || '2025-26' },
        });
      }

      const rawList = res.data?.data?.content || res.data?.data || [];

      if (Array.isArray(rawList)) {
        return rawList.map((item: any, idx: number) => ({
          slNo: item.srNo || idx + 1,
          _id: item.id,
          id: item.id,
          teacherName: item.primaryAuthor,
          authors: item.primaryAuthor,
          bookOrChapterTitle: item.title,
          paperTitle: item.title,
          title: item.title,
          publisherName: item.venue,
          publisher: item.venue,
          yearOfPublication: item.publicationYear || item.eventOrAwardDate || '',
          year: item.publicationYear || item.eventOrAwardDate || '',
          isbnIssn: item.identifier,
          isbn: item.identifier,
          affiliatingInstitute: item.department || '',
          abstract: item.title,
        }));
      }
      return [];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch books');
    }
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.loading = false;
        state.items = action.payload || [];
        state.totalElements = action.payload ? action.payload.length : 0;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default booksSlice.reducer;
