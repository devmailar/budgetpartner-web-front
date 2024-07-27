import { type PayloadAction, type Slice, createSlice } from "@reduxjs/toolkit";

export const loaderStore: Slice = createSlice({
	name: "loader",
	initialState: true,
	reducers: {
		setLoader: (_state, action: PayloadAction<boolean>) => {
			return action.payload;
		},
	},
});

export const { setLoader } = loaderStore.actions;
export default loaderStore.reducer;
