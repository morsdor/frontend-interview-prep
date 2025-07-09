import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Question } from '@/types';

interface QuestionsState {
  currentCategory: string;
  currentQuestion: Question | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: QuestionsState = {
  currentCategory: 'javascript',
  currentQuestion: null,
  status: 'idle',
  error: null,
};

export const fetchQuestion = createAsyncThunk(
  'questions/fetchQuestion',
  async ({ category, id }: { category: string; id: string }) => {
    // In a real app, this would be an API call
    const response = await import(`@/data/${category}.ts`);
    return response.questions.find((q: Question) => q.id === id) || null;
  }
);

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setCurrentCategory: (state, action: PayloadAction<string>) => {
      state.currentCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestion.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuestion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentQuestion = action.payload;
      })
      .addCase(fetchQuestion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch question';
      });
  },
});

export const { setCurrentCategory } = questionsSlice.actions;
export default questionsSlice.reducer;
