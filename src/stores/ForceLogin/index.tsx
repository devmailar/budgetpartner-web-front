import { type PayloadAction, type Slice, createSlice } from "@reduxjs/toolkit";

export const forceLoginStore: Slice = createSlice({
	name: "forceLogin",
	initialState: "" as string,
	reducers: {
		setForceLogin: (_state, action: PayloadAction<string>) => {
			return action.payload;
		},
	},
});

export const { setForceLogin } = forceLoginStore.actions;
export default forceLoginStore.reducer;
