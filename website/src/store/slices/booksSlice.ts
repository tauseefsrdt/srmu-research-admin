import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/apiClient';
import { Book } from '../../types';
import { books as fallbackBooks } from '../../data/data';

interface BooksState {
  items: Book[];
  loading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  items: (fallbackBooks as any[]).map((b, idx) => ({
    ...b,
    id: b._id || b.slNo || idx + 1,
    title: b.paperTitle || b.bookOrChapterTitle || 'Untitled book or chapter',
    authors: b.teacherName,
    year: b.yearOfPublication,
    publisher: b.publisherName,
    abstract: b.bookOrChapterTitle,
    isbn: b.isbnIssn,
  })),
  loading: false,
  error: null,
};

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (sessionCode: string = '2025-26', { rejectWithValue }) => {
    try {
      const res = await api.get('/research-items/by-category/BOOK', {
        params: { sessionCode },
      });
      if (res.data?.data && res.data.data.length > 0) {
        return res.data.data.map((item: any, idx: number) => ({
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
      return rejectWithValue(err.message || 'Failed to fetch books');
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
        if (action.payload && action.payload.length > 0) {
          state.items = action.payload;
        }
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default booksSlice.reducer;
