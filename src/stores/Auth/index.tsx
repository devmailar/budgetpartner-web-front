import { type PayloadAction, type Slice, createSlice } from "@reduxjs/toolkit";

export const authStore: Slice = createSlice({
	name: "auth",
	initialState: "" as string,
	reducers: {
		setAuth: (_state, action: PayloadAction<string>) => {
			return action.payload;
		},
	},
});

export const { setAuth } = authStore.actions;
export default authStore.reducer;
