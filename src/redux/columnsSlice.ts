import { createSlice, type PayloadAction} from '@reduxjs/toolkit';

export interface Column {
  id: string;
  title: string;
}

export interface ColumnsState {
  columns: Column[];
}

const initialState: ColumnsState = {
  columns: [
    { id: 'col-1', title: 'To Do' },
    { id: 'col-2', title: 'In Progress' },
    { id: 'col-3', title: 'Done' },
  ],
};

const columnsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    addColumn: (state, action: PayloadAction<string>) => {
      const id = `col-${state.columns.length + 1}`;
      state.columns.push({ id, title: action.payload });
    },
  },
});

export const { addColumn } = columnsSlice.actions;
export default columnsSlice.reducer;
