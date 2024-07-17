import { type PayloadAction, type Slice, createSlice } from "@reduxjs/toolkit";

export const forceLoginStore: Slice = createSlice({
	name: "forceLogin",
	initialState: false,
	reducers: {
		setForceLogin: (_state, action: PayloadAction<boolean>) => {
			return action.payload;
		},
	},
});

export const { setForceLogin } = forceLoginStore.actions;
export default forceLoginStore.reducer;
