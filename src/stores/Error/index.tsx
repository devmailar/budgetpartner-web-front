import { type PayloadAction, type Slice, createSlice } from "@reduxjs/toolkit";

export const errorStore: Slice = createSlice({
	name: "error",
	initialState: "" as string,
	reducers: {
		setError: (_state, action: PayloadAction<string>) => {
			return action.payload;
		},
	},
});

export const { setError } = errorStore.actions;
export default errorStore.reducer;
