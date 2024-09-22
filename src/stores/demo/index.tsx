import { type PayloadAction, type Slice, createSlice } from "@reduxjs/toolkit";

export const demoStore: Slice = createSlice({
	name: "demo",
	initialState: false,
	reducers: {
		setDemo: (_state: unknown, action: PayloadAction<boolean>) => {
			localStorage.setItem("demo", action.payload.toString());

			return action.payload;
		},
	},
});

export const { setDemo } = demoStore.actions;
export default demoStore.reducer;
