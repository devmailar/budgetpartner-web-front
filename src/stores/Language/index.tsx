import { type PayloadAction, type Slice, createSlice } from "@reduxjs/toolkit";

export const languageStore: Slice = createSlice({
	name: "language",
	initialState: "" as string,
	reducers: {
		setLanguage: (state, action: PayloadAction<string>) => {
			return action.payload;
		},
	},
});

export const { setLanguage } = languageStore.actions;
export default languageStore.reducer;
