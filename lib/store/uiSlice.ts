import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  globalLoading: boolean;
  pageLoading: Record<string, boolean>;
}

const initialState: UiState = {
  globalLoading: false,
  pageLoading: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = action.payload;
    },
    setPageLoading(state, action: PayloadAction<{ page: string; loading: boolean }>) {
      state.pageLoading[action.payload.page] = action.payload.loading;
    },
  },
});

export const { setGlobalLoading, setPageLoading } = uiSlice.actions;
export default uiSlice.reducer;
